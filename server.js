const express = require('express');
const cors = require('cors')
const aws = require('aws-sdk');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const multer = require('multer');
const passport = require('passport');
const db = require("./models");

//import mongoose and connect to mongo db
const mongoose = require('mongoose');

main().catch(err => console.log('Error in DB connection : ' + err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/RecipeDB');
    console.log('MongoDB connection succeeded')
}
// End of import mongoose and connect to mongo db
// Bring in the models
let Recipe = require('./bootstrap/models/recipe.model')
let Ingredient = require('./bootstrap/models/ingredient.model');
// end of bringing the models

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}
const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const S3_BUCKET = process.env.S3_BUCKET || 'myBucket';
aws.config.region = 'ca-central-1';
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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname + '/public/uploads/'))
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname.match(/(.jpg$|.png$)/g))

        // cb(null, file.originalname)
    }
})

const upload = multer({
    storage: storage
})

app.post('/thanks', upload.single('avatar'), async function (req, res) {
    count++;

    console.log('body', req.body);
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

    //Insert into Mongo DB
    const recipe = new Recipe({
        food: req.body.foodName,
        image: "http://localhost:3000/uploads/" + req.file.filename,
        altName: req.file.originalname,
        filename: req.file.filename,
        ingredients: splitTxt,
        instruction: req.body.inst,
        user: req.user.firstName


    });
    console.log('recipeModel', recipe);
    recipe.save(function (err) {
        if (err) return handleError(err);

    });
    const allRecipes = await Recipe.find({});
    console.log(allRecipes);
    //End of inserting to Mongo DB


    // node local storage


    const obj = {};

    obj['id'] = JSON.parse(localStorage.getItem("count"));
    obj['food'] = req.body.foodName;
    if (S3_BUCKET === 'myBucket') {
        obj['image'] = "http://localhost:3000/uploads/" + req.file.filename;
    } else {
        obj['image'] = req.body.url;
    }

    obj['altName'] = req.file.originalname;
    obj['filename'] = req.file.filename;
    console.log('file', req.file);

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


    //insert into ingredients collection
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


    // end of insert into ingredients collection


    //store in node-local-storage for ingredient storage
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
    // let foodArr = JSON.parse(localStorage.getItem('food'));
    let AllRecipes = await Recipe.find({});
    // res.json(imgStore);
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
    let foodArr = JSON.parse(localStorage.getItem('food'));
    // get All documents from recipes collection
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
    res.redirect('/search');
})
app.get('/search', function (req, res) {
    res.send(searchStore);
});

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
    await Recipe.deleteOne({_id: id})
    //Local Storage
    let foodArr = JSON.parse(localStorage.getItem('food'));
    // get All the documents from recipes collection
    let AllRecipes = await Recipe.find({});
    console.log(foodArr);
    AllRecipes.forEach((item, index) => {
        if (item._id === id) {
            fs.unlinkSync(`${__dirname}/public/uploads/${item.filename}`);
            // AllRecipes.splice(index, 1);
        }

    });
    const updatedFoodArr = foodArr.map((item, index) => {
        const obj = {};
        obj['id'] = index + 1;
        obj['food'] = item.food;
        obj['image'] = item.image;
        obj['altName'] = item.altName;
        obj['filename'] = item.filename;
        obj['ingredients'] = item.ingredients;
        obj['instruction'] = item.instruction;
        obj['user'] = item.user;
        return obj;
    })
    localStorage.setItem('food', JSON.stringify(updatedFoodArr));
    let count = JSON.parse(localStorage.getItem("count"));
    count = updatedFoodArr.length;
    localStorage.setItem('count', JSON.stringify(count));
    console.log('Reached Delete');
    res.send("Succefully deleted food!");
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