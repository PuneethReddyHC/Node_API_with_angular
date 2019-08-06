var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
//var Company = require('../models/company');

var bCrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var configurations = require("../config");

module.exports = function (passport) {
    passport.use('login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, username, password, done) {
        var data = req.body;
        var date = new Date().toUTCString();

        User.findOne({
            'username': username,
            'isActive': true
        }, function (err, user) {
            // In case of any error, return using the done method
            if (err) {
                return done({ error: err });
            }
            // Username does not exist, log the error and redirect back
            if (!user) {
                console.log('User Not Found with username' + username);
                return done(null, false, { 'message': 'User Not found.' });
            }
            // User exists but wrong password, log the error
            if (!isValidPassword(user, password)) {
                console.log('Invalid Password');
                return done(null, false, { 'message': 'Invalid Password' }); // redirect back to login page
            }

            user.expiresAt = null;
            user.jwt_token = "";

            var jwt_object = {};
            jwt_object.username = user.username;
            jwt_object.user_id = user.id;
            //  jwt_object.company_key= user.company_key;
            //  jwt_object.company_id= comp_res.id;

            var jwt_token = jwt.sign({
                data: jwt_object
                //exp: Math.floor(Date.now() / 1000) + (2 * 60 * 60),
            }, configurations.TOKEN_SECRET);

            user.jwt_token = jwt_token;
            
            user.save({
                'username': username
            }, function (err, users) {
                if (users) {
                    
                    is_profile_created = true;
                    user_first_name = users.first_name + " " + users.last_name;
                    //  user_last_name =
                    console.log("getUsers data fetch successful " + is_profile_created);
                    return done(null, {
                        jwt_token: user.jwt_token,
                        username: user.username,
                        id: user._id,
                        is_profile_created: is_profile_created,
                        //user_first_name: user_first_name
                    });
                } else {

                    is_profile_created = false;
                    console.log('Error  in getUsers : ' + is_profile_created);
                    return done(null, {
                        jwt_token: user.jwt_token,
                        username: user.username,
                        id: user._id,
                        is_profile_created: is_profile_created
                    });
                }
            });


        });

    })
    );

    // Utility Function
    var isValidPassword = function (user, password) {

        return bCrypt.compareSync(password.toString(), user.password);
    }

};
