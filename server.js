const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const multer = require('multer');
const passport = require('passport');
const db = require("./models");

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}
const app = express();


const PORT = process.env.PORT || 3000;
let arrStore = [];
let imgStore = [];
let searchStore = [];
let count = 0;

app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
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
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname.match(/(.jpg$|.png$)/g))

        // cb(null, file.originalname)
    }
})

const upload = multer({
    storage: storage
})

app.post('/thanks', upload.single('avatar'), function (req, res) {
    count++;

    //Local Storage for count2
    let count2 = JSON.parse(localStorage.getItem("count"));
    if (count2 === null) {
        count2 = 1;
        localStorage.setItem("count", JSON.stringify(count2));
    } else {
        count2++;
        localStorage.setItem("count", JSON.stringify(count2));
    }

    const obj = {};
    obj['id'] = JSON.parse(localStorage.getItem("count"));
    obj['food'] = req.body.foodName;
    obj['image'] = req.file.path;
    obj['altName'] = req.file.originalname;

    console.log('file', req.file);

    // console.log(typeof (req.body.txt));
    // console.log('txt',req.body.txt);

    const txtString = req.body.txt;
    //temporary delete these two statements

    // const patt = /[a-zA-Z]+/g;
    // const result = txtString.match(patt);
    //end temporary delete these two statements
    console.log('txtString', txtString);
    //get the ingredient string and turn it into an array of ingredients
    let splitTxt = txtString.split(',');
    console.log('server ingredients', splitTxt);
    obj['ingredients'] = splitTxt;
    obj['instruction'] = req.body.inst;
    // Add user
    obj['user'] = req.user.firstName;
    // obj['filename'] = req.file.filename; 
    imgStore.push(obj);
    console.log('imgStore', imgStore);

    //node Local Storage
    let foodArr = JSON.parse(localStorage.getItem("food"));
    if (foodArr === null) {
        foodArr = [];
        foodArr.push(obj);
        localStorage.setItem('food', JSON.stringify(foodArr));
    } else {
        foodArr.push(obj);
        localStorage.setItem('food', JSON.stringify(foodArr));
    }

    

    //store in node-local-storage
    let ingArr = JSON.parse(localStorage.getItem("ingredient"));
    if(ingArr === null) {
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
})
app.get('/thanks', function (req, res) {
    let ingArr = JSON.parse(localStorage.getItem("ingredient"));
    // res.json(arrStore);
    res.json(ingArr);

})

app.get('/home', function (req, res) {
    
    // res.send(`<img src=${imgStore[0].image} alt=${imgStore[0].name}>`);
    //     res.send(`<figure style="text-align: center;">
    //     <img src=${imgStore[0].image} alt=${imgStore[0].name}>
    //     <figcaption>${imgStore[0].food}</figcaption>
    //   </figure>`)

    //Local Storage
    let foodArr = JSON.parse(localStorage.getItem('food'));
    // res.json(imgStore);
    res.json(foodArr);
})
app.get('/index', function (req, res) {
    req.session.flash = [];
    // req.flash('success').splice(0, req.flash('success').length);
    res.redirect('/');
})
app.post('/ingredients', function (req, res) {
    searchStore = [];
    console.log('ingredients', req.body);
    const ingredArr = req.body.ingred;
    console.log(ingredArr);

    //Local Storage
    let foodArr = JSON.parse(localStorage.getItem('food'));
    foodArr.forEach((value, index) => {
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
app.delete('/food/:id', function (req, res) {
    const id = req.params.id;
    console.log('del', id);
    imgStore.forEach((item, index) => {
        if (item.id === Number(id)) {
            imgStore.splice(index, 1);
        }
    });
    //Local Storage
    let foodArr = JSON.parse(localStorage.getItem('food'));
    console.log(foodArr);
    foodArr.forEach((item, index) => {
        if (item.id === Number(id)) {
            fs.unlinkSync(`${item.image}`);
            foodArr.splice(index, 1);
        }

    });
    const updatedFoodArr = foodArr.map((item, index) => {
        const obj = {};
        obj['id'] = index + 1;
        obj['food'] = item.food;
        obj['image'] = item.image;
        obj['altName'] = item.altName;
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