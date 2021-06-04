const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models').User;
module.exports = function(app, passport) {
    app.post('/register', async function (req, res) {
        const userPassword = generateHash(req.body.password);
        const data = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            genHash: userPassword,
    
        };
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        if (user) {
            req.flash('info', 'Invalid Email');
            res.redirect('/register.html');
        } else {
            const newUser = await User.create(data);
            res.redirect('/login.html');
        }
    
    })
    app.post('/login',
        passport.authenticate('local-signin', {
            successRedirect: '/',
            failureRedirect: '/login.html',
            failureFlash: true,
            successFlash: 'Welcome!'
        })
    );
    app.get('/login', function (req, res) {
        res.json({
            error: req.flash('error')
        });
    })
    app.get('/success', function (req, res) {
        res.json({
            success: req.flash('success')
        });
    })
    app.get('/register', function (req, res) {
        res.json({
            info: req.flash('info')
        });
    })
    app.get('/loggedin', function (req, res) {
        res.send(req.user);
    })
    app.get("/logout", function (req, res) {
        console.log("Log Out Route Hit");
        req.flash('logout', "Successfully Logged Out");
        req.logout();
        res.redirect('/');
    });
    app.get('/logout/user', function (req, res) {
        res.json({
            logout: req.flash('logout')
        });
    });
    const generateHash = function (password) {
        const hash = bcrypt.hashSync(password, saltRounds);
        return hash;
    
    }
    
}