const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models').User;
module.exports = function (app, passport) {
    app.post('/register', async function (req, res) {
        const userPassword = generateHash(req.body.password);
        const data = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            genHash: userPassword,
            user_type: req.body.userType

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
            // successRedirect: '/',
            failureRedirect: '/login.html',
            failureFlash: true,
            // successFlash: 'Logged In!'
        }),
        function (req, res) {
            // res.locals.flash = [];
            req.flash('success', 'Logged In!');
            req.session.flash = req.flash('success');
            console.log('flashlogout', req.flash('success'));
            req.flash('success').splice(0, req.flash('success').length);
            console.log('session', req.session);
            // req.session.flash = res.locals.flash;
            res.redirect('/');
        }
    );
    app.get('/login', function (req, res) {
        res.json({
            error: req.flash('error')
        });
    })

    app.get('/flash', function (req, res) {
        let flashMess = req.session.flash;
        req.session.flash = [];
        req.flash('success').splice(0, req.flash('success').length);
        res.json({
            mess: flashMess
        })
    })
    // success route
    // app.get('/success', function (req, res) {
    //     // req.session.flash = req.flash('success');
    //     // let flashMess = req.session.flash;
    //     // req.session.flash = [];
    //     // req.flash('success') = [];
    //     let flashMess = req.session.flashMess;
    //     req.session.flashMess= [];
    //     // res.json({
    //     //     success: req.flash('success')
    //     // });
    //     res.json({
    //         success: flashMess
    //     });
    // })
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
        // req.flash('logout', "Successfully Logged Out");
        // res.locals.flash = [];
        req.flash('success', "Successfully Logged Out");
        req.session.flash = req.flash('success');

        req.flash('success').splice(0, req.flash('success').length);
        // req.session.flash = res.locals.flash;
        // req.flash('logout', '');
        req.logout();
        console.log('session', req.session);
        // req.session.destroy();
        console.log('session', 'empty');

        res.redirect('/');
    });
    
    //logout/user route
    // app.get('/logout/user', function (req, res) {
    //     // let flashMess = req.session.flash;
    //     // req.session.flash = [];
    //     // req.session.flash2 = req.flash('success');
    //     // req.flash('success', '');
    //     // req.session.user = req.flash('logout');
    //     // console.log('sess', req.session.user);
    //     res.json({
    //         // logout: req.flash('logout')
    //         logout: req.flash('success')
    //         // logout: req.session.flash2
    //     });
    //     // res.json({
    //     //     logout: flashMess
    //     // });
    // });
    const generateHash = function (password) {
        const hash = bcrypt.hashSync(password, saltRounds);
        return hash;

    }

}