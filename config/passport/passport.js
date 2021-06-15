var bcrypt = require('bcrypt');
const User = require("../../models").User;
const flash = require('connect-flash');
const saltRounds = 10;
const LocalStrategy = require('passport-local').Strategy;
// function to be called while there is a new sign/signup 
// We are using passport local signin/signup strategies for our app
module.exports = function (passport) {


    passport.use('local-signin', new LocalStrategy(
        async function (username, password, done) {
            try {
                const user = await User.findOne({
                    where: {
                        username: username
                    }
                })
                if (!user) {
                    return done(null, false, {
                        message: 'Incorrect username.'
                    });
                }
                const isPassword = bcrypt.compareSync(password, user.genHash);
                if (isPassword) {
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
                // if (user.password !== password) {
                //     return done(null, false, {
                //         message: 'Incorrect password.'
                //     });
                // }

                // return done(null, user);
            } catch (error) {
                console.log(error);
            }


        }
    ));





    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    // passport.deserializeUser(function (user, done) {
    //     console.log('deserialize')
    //     done(null, user);
    // });

    passport.deserializeUser(async function (id, done) {
        try {
            const user = await User.findByPk(id)
            done(null, user);
        } catch (error) {
            console.log('found error', error);

        }
    });

}