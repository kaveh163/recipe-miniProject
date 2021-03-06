const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const aws = require('aws-sdk');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const multer = require('multer');
const multerS3 = require('multer-s3');
const passport = require('passport');
const db = require("./models");

//Connect to Mongo DB
main().catch(err => console.log('Connection Err', 'Connection Error To Mongodb server' + ' ' + err));

async function main() {

    await mongoose.connect(
        process.env.MONGODB_URI || 'mongodb://localhost:27017/RecipeDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false
        }
    );
    console.log('Connection', 'Successfully Connected to Mongo Atlas');
}
// End of Connect to Mongo DB

// Bring in the models
let Recipe = require('./bootstrap/models/recipe.model')
let Ingredient = require('./bootstrap/models/ingredient.model');
//End of Bringing the models

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}
const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const S3_BUCKET = process.env.S3_BUCKET;
// aws.config.region = 'ca-central-1';
aws.config.update({
    apiVersion: 'latest',
    // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    // accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
    region: 'ca-central-1', //your bucket region
    // profile:process.env.AWS_PROFILE,
})
// aws.config.loadFromPath('./config.json');
let arrStore = [];
let imgStore = [];
let searchStore = [];
let count = 0;

app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, '/public','/uploads')));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


// For passport
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
})); // session secret

// app.use(require('flash')());
app.use(flash());

app.use(passport.initialize());

app.use(passport.session());

require('./config/passport/passport')(passport);
require('./routes/user')(app, passport);


const s3 = new aws.S3();

//Setting up multer S3
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: `${S3_BUCKET}/images`, //upload to image folder
        metadata: function (req, file, cb) {
            cb(null, {
                fieldName: file.fieldname
            });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + file.originalname)
        }
    }),
    limits: {
        fileSize: 10000000 // Maximum 10 MB
    },
    fileFilter(req, file, cb) {
        //filter out the file that we doesn't want to upload
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            // only valid image formats are allowed to upload
            return cb(new Error('Please upload an Image '))
        }
        cb(undefined, true) //pass 'flase' if u want to reject upload
    }
})
// End Setting up multer S3





app.post('/thanks', upload.single('avatar'), async function (req, res) {
    count++;

    console.log('body', req.body);
    console.log('file', req.file);
    //Local Storage for count2
    let count2 = JSON.parse(localStorage.getItem("count"));
    if (count2 === null) {
        count2 = 1;
        localStorage.setItem("count", JSON.stringify(count2));
    } else {
        count2++;
        localStorage.setItem("count", JSON.stringify(count2));
    }

    const txtString = req.body.txt;
    console.log('txtString', txtString);
    //get the ingredient string and turn it into an array of ingredients
    let splitTxt = txtString.split(',');
    console.log('server ingredients', splitTxt);

    //Insert into Mongo DB recipes collection
    const recipe = new Recipe({
        food: req.body.foodName,
        image: req.file.location,
        altName: req.file.originalname,
        filename: req.file.key,
        ingredients: splitTxt,
        instruction: req.body.inst,
        user: req.user.firstName


    });
    console.log('recipeModel', recipe);
    recipe.save(function (err) {
        if (err) return handleError(err);

    });
    //End of Insert into Mongo DB recipes collection
    // node local storage
    const obj = {};

    obj['id'] = JSON.parse(localStorage.getItem("count"));
    obj['food'] = req.body.foodName;

    obj['image'] = req.file.location;


    obj['altName'] = req.file.originalname;
    obj['filename'] = req.file.key;


    // console.log(typeof (req.body.txt));
    // console.log('txt',req.body.txt);

    // const txtString = req.body.txt;
    //temporary delete these two statements

    // const patt = /[a-zA-Z]+/g;
    // const result = txtString.match(patt);
    //end temporary delete these two statements
    // console.log('txtString', txtString);
    //get the ingredient string and turn it into an array of ingredients
    // let splitTxt = txtString.split(',');
    // console.log('server ingredients', splitTxt);
    obj['ingredients'] = splitTxt;
    obj['instruction'] = req.body.inst;
    // Add user
    obj['user'] = req.user.firstName;
    // obj['filename'] = req.file.filename; 
    imgStore.push(obj);


    let foodArr = JSON.parse(localStorage.getItem("food"));
    if (foodArr === null) {
        foodArr = [];
        foodArr.push(obj);
        console.log('foodArr', foodArr);
        localStorage.setItem('food', JSON.stringify(foodArr));
    } else {
        foodArr.push(obj);
        console.log('foodArr', foodArr)
        localStorage.setItem('food', JSON.stringify(foodArr));
    }

    // end node local storage

    //Insert into ingredients Collection
    splitTxt.forEach((item, index) => {
        let query = {
            ingredient: item
        };
        let update = {
            $setOnInsert: {
                ingredient: item
            }
        }
        let options = {
            upsert: true
        };
        Ingredient.findOneAndUpdate(query, update, options)
            .catch(err => console.log(err));

    })
    //End of Insert into ingredients Collection



    //store in node-local-storage
    let ingArr = JSON.parse(localStorage.getItem("ingredient"));
    if (ingArr === null) {
        ingArr = [];
        splitTxt.forEach((value, index) => {
            ingArr.push(value.toLowerCase());

        });
        localStorage.setItem('ingredient', JSON.stringify(ingArr));
    } else {
        for (let i = 0; i < splitTxt.length; i++) {
            if (ingArr.indexOf(splitTxt[i]) === -1) {
                ingArr.push(splitTxt[i]);
            }

        }
        localStorage.setItem('ingredient', JSON.stringify(ingArr))
    }
    // end node local storage for ingredients
    // store the ingredients in arrStore array 
    if (arrStore.length === 0) {

        splitTxt.forEach((value, index) => {
            arrStore.push(value.toLowerCase());

        })
        console.log('arrStore1', arrStore)
    } else {


        // let count = 0;
        for (let i = 0; i < splitTxt.length; i++) {
            if (arrStore.indexOf(splitTxt[i]) === -1) {
                arrStore.push(splitTxt[i]);
            }

        }


    }

    //end storing in arrStore array


    req.session.flash = [];
    // req.flash('success').splice(0, req.flash('success').length);
    res.redirect('/');
    // res.end();
})

app.get('/sign-s3', (req, res) => {
    const s3 = new aws.S3();
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read'
    };

    // s3.getSignedUrl('putObject', s3Params, (err, data) => {
    // if (err) {
    //     console.log(err);
    //     return res.end();
    // }
    const returnData = {
        signedRequest: 'data',
        url: `http://localhost:3000/uploads/${fileName}`
    };
    console.log('returnData', returnData)
    res.write(JSON.stringify(returnData));
    res.end();
    // });
});

app.get('/thanks', async function (req, res) {
    let ingArr = JSON.parse(localStorage.getItem("ingredient"));
    //get all documents from ingredients collection
    let AllIngredients = await Ingredient.find({});
    // res.json(arrStore);
    res.json(AllIngredients);

})

app.get('/home', async function (req, res) {

    // res.send(`<img src=${imgStore[0].image} alt=${imgStore[0].name}>`);
    //     res.send(`<figure style="text-align: center;">
    //     <img src=${imgStore[0].image} alt=${imgStore[0].name}>
    //     <figcaption>${imgStore[0].food}</figcaption>
    //   </figure>`)

    //Local Storage
    let foodArr = JSON.parse(localStorage.getItem('food'));
    // res.json(imgStore);
    // Get All recipe documents from recipes collection
    let AllRecipes = await Recipe.find({});
    res.json(AllRecipes);
})
app.get('/index', function (req, res) {
    req.session.flash = [];
    // req.flash('success').splice(0, req.flash('success').length);
    res.redirect('/');
})
app.post('/ingredients', async function (req, res) {
    searchStore = [];
    console.log('ingredients', req.body);
    const ingredArr = req.body.ingred;
    console.log(ingredArr);

    //Local Storage
    // let foodArr = JSON.parse(localStorage.getItem('food'));
    // Get all documents from recipes collection
    let AllRecipes = await Recipe.find({});
    AllRecipes.forEach((value, index) => {
        let count = 0;
        if (value.ingredients.length >= ingredArr.length) {
            for (let i = 0; i < value.ingredients.length; i++) {
                for (let j = 0; j < ingredArr.length; j++) {
                    if (value.ingredients[i] === ingredArr[j]) {
                        count++;
                    }
                }
                if (count === ingredArr.length) {
                    searchStore.push(value);
                    console.log('searchArr', searchStore);
                    break;
                }
            }
        }
    })
    // console.log("redirect");
    //res.redirect('/search');
    res.send(searchStore);
})
// app.get('/search', function (req, res) {
//     console.log("/search");
//     res.send(searchStore);
// });

app.get('/post/food', isLoggedIn, function (req, res) {
    res.redirect('/post.html');
});
app.delete('/food/:id', async function (req, res) {
    const id = req.params.id;
    console.log('del', id);
    // imgStore.forEach((item, index) => {
    //     if (item.id === Number(id)) {
    //         imgStore.splice(index, 1);
    //     }
    // });


    // let delFile;
    //Local Storage
    // let foodArr = JSON.parse(localStorage.getItem('food'));
    // console.log(foodArr);
    //Get All the documents from recipes collection
    // let AllRecipes = await Recipe.find({});
    // AllRecipes.forEach((item, index) => {
        // if (item._id === id) {
            // delFile = item.filename;
            // fs.unlinkSync(`${__dirname}/public/uploads/${item.filename}`);
            // const params = {
            //     Bucket: S3_BUCKET,
            //     Key: `folder/subfolder/filename.fileExtension`
            // };
            // foodArr.splice(index, 1);
        // }

    // });
    // const updatedFoodArr = foodArr.map((item, index) => {
    //     const obj = {};
    //     obj['id'] = index + 1;
    //     obj['food'] = item.food;
    //     obj['image'] = item.image;
    //     obj['altName'] = item.altName;
    //     obj['filename'] = item.filename;
    //     obj['ingredients'] = item.ingredients;
    //     obj['instruction'] = item.instruction;
    //     obj['user'] = item.user;
    //     return obj;
    // })
    // localStorage.setItem('food', JSON.stringify(updatedFoodArr));
    // let count = JSON.parse(localStorage.getItem("count"));
    // count = updatedFoodArr.length;
    // localStorage.setItem('count', JSON.stringify(count));
    console.log('Reached Delete');
    // Find the specific document to delete
    const delRecipe = await Recipe.findById(id).exec();
    const delFile = delRecipe.filename;
    // End of find the specific document to delete
    // Delete document from recipes collection
    await Recipe.deleteOne({
        _id: id
    })
    // End of Delete document from recipes collection
    const params = {
        Bucket: S3_BUCKET,
        Key: `images/${delFile}`
    };
    s3.deleteObject(params, (error, data) => {
        if (error) {
            res.status(500).send(error);
        }
        
        res.status(200).send("File has been deleted successfully");
    });
    // res.send("Succefully deleted food!");
})
// app.listen(PORT, () => {
//     console.log(`Server listening on http://localhost:${PORT}`);
// });



function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login.html');
    }
}
passport.isAuthorized = (userType) => {
    return (req, res, next) => {
        console.log('reached authorized');
        if (req.user) {
            if (userType === 1) {
                // user role is admin
                // console.log('reached authorized');
                if (req.user.user_type === 1) {
                    // console.log('reached authorized');
                    return next();
                } else {
                    req.error = "your role is not admin"
                    // return next();
                    return res.status(401).send(`<div style="text-align: center;font-size:50px;"><p>401</p><p>UNAUTHORIZED</p></div>`);
                }
            }
            if (userType === 2) {
                if (req.user.user_type === 2) {
                    return next();
                } else {
                    req.error = "your role is not customer"
                    // return next();
                    return res.status(401).send(`<div style="text-align: center;font-size:50px;"><p>401</p><p>UNAUTHORIZED</p></div>`);
                }
            }
        } else {
            return res.status(401).send(`<div style="text-align: center;font-size:50px;"><p>401</p><p>UNAUTHORIZED</p></div>`);
        }

    }
}
app.get('/manage', passport.isAuthorized(1), function (req, res) {
    console.log('reached manage');
    // console.log(req.error);
    // if(req.error) {
    //     res.send(req.error)
    // } else {
    //     res.redirect('/manage.html');
    // }
    res.redirect('/manage.html');

})
db.sequelize.sync({
    force: false
}).then(function () {
    app.listen(PORT, function () {
        console.log("App listening on PORT " + PORT);
    });
});