const express = require('express');
const session = require('express-session');
const path = require('path');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const multer = require('multer');
const passport = require('passport');
const db = require("./models");

const app = express();


const PORT = 3000;
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
    const obj = {};
    obj['id'] = count;
    obj['food'] = req.body.foodName;
    obj['image'] = req.file.path;
    obj['altName'] = req.file.originalname;

    console.log('file', req.file);

    // console.log(typeof (req.body.txt));
    // console.log('txt',req.body.txt);
    const txtString = req.body.txt;
    const patt = /[a-zA-Z]+/g;
    const result = txtString.match(patt);
    obj['ingredients'] = result;
    obj['instruction'] = req.body.inst;
    imgStore.push(obj);
    console.log('imgStore', imgStore);
    // console.log('result',result);
    if (arrStore.length === 0) {
        // arrStore = [...arrStore, ...result];
        result.forEach((value, index) => {
            arrStore.push(value.toLowerCase());
        })
    } else {
        // result.forEach((value, index)=> {

        //     if(arrStore.indexOf(value) === -1) {
        //         arrStore.push(value);
        //     }
        // })
        for (let i = 0; i < result.length; i++) {
            let count = 0;
            for (let j = 0; j < arrStore.length; j++) {
                if (arrStore[j].toUpperCase() === result[i].toUpperCase()) {
                    count++;
                    break;
                }
            }
            if (count === 0) {
                arrStore.push(result[i].toLowerCase());
            }

        }

    }
    // arrStore = [...arrStore, ...result];
    // console.log('store', arrStore);

    // res.end();
    // res.redirect('/home');
    // res.sendFile(`${__dirname}/index.html`);
    res.redirect('/index.html');
})
app.get('/thanks', function (req, res) {
    res.json(arrStore);
})
app.get('/home', function (req, res) {
    // res.send(`<img src=${imgStore[0].image} alt=${imgStore[0].name}>`);
    //     res.send(`<figure style="text-align: center;">
    //     <img src=${imgStore[0].image} alt=${imgStore[0].name}>
    //     <figcaption>${imgStore[0].food}</figcaption>
    //   </figure>`)
    res.json(imgStore);
})
app.post('/ingredients', function (req, res) {
    searchStore = [];
    console.log('ingredients', req.body);
    const ingredArr = req.body.ingred;
    console.log(ingredArr);
    imgStore.forEach((value, index) => {
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

app.get('/post/food', isLoggedIn, function(req, res) {
    res.redirect('/post.html');
})
// app.listen(PORT, () => {
//     console.log(`Server listening on http://localhost:${PORT}`);
// });
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
       return next();
    } else {
        res.redirect('/login.html');
    }
}
db.sequelize.sync({
    force: false
}).then(function () {
    app.listen(PORT, function () {
        console.log("App listening on PORT " + PORT);
    });
});