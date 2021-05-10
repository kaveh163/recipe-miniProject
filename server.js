const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');



const app = express();


const PORT = 3000;
let arrStore = [];
let imgStore = [];
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.use(express.static(__dirname));
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
    const obj = {};
    obj['food'] = req.body.foodName;
    obj['image'] = req.file.path;
    imgStore.push(obj);
    console.log('file', req.file);
    console.log(imgStore);
    // console.log(typeof (req.body.txt));
    // console.log(req.body.txt);
    const txtString = req.body.txt;
    const patt = /[a-zA-Z]+/g;
    const result = txtString.match(patt);
    // console.log(result);
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
    res.redirect('/');
})
app.get('/thanks', function (req, res) {
    res.json(arrStore);
})
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});