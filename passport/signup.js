var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');
var nodeMailer = require('nodemailer');
var configuration = require("../config");
var email = require("../utils/mailer");
var sms = require("../utils/SMS");
var fs = require('fs');


module.exports = function (passport) {
    passport.use('signup', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        }, function (req, username, password, done) {

            findOrCreateUser = function () {
                //console.log("inside signup: ", req);
                var data = req.body;
            
                User.findOne({username:data.username}, function (err, user) {
                    if (err) {
                        return done({message: err});
                    }
                    if (user) {
                        console.log("Username " +username);
                        return done({message: "Username " +username}, false, {message: req.flash(username + " is already taken.")});
                    } else {
                        var newUser = new User();
                        newUser.username = username;
                        newUser.password = createHash(password);
                        var date = new Date();
                        newUser.createdAt = date.toUTCString();
                        newUser.expiresAt = date.toUTCString();

                        createHash(username);
                        var time = new Date().getTime();
                        var crypto = require('crypto');
                        var name = username;
                        var signupcry = crypto.createHash('md5').update(name).digest('hex');
                        var passtoken = signupcry.concat(time);

                        newUser.passtoken = passtoken;
                        newUser.role = data.user_role;
                        newUser.isActive = true;
                        newUser.isEmailVerified = false;
                        newUser.save(function (err) {
                            if (err) {
                                console.log('Error in Saving user: ' + err);
                                return done(err);
                            }
                            console.log("User Registration succesful");
                            console.log( configuration.SIGNUP_PASSWORD_URL + passtoken );
                           

                            
                            var msgBody = "Hello,<br> Please Click on the link to verify your email.<br><a href=" + configuration.SIGNUP_PASSWORD_URL + passtoken + " >Click here to verify</a>..";
                            let mailOptions = {
                                from: '"Student-platform" <' + configuration.SENDER_EMAIL + '>', // sender address
                                to: username, // list of receivers
                                subject: 'Welcome to Student-platform', // Subject line
                                text: "req.body.body", // plain text body
                                html: msgBody
                            };
                            let smsOptions = {
                                countrycode: '+91',
                                mobilenumber:'9535688928' // sender address
                                
                            };
                            
                            email.sendMailNotification(mailOptions,(error, info) => {
                                if (error) {
                                    return console.log(error);
                                }
                                console.log('Message %s sent: %s', info.messageId, info.response);
                                res.render('index');
                            });
                            sms.sendSMS(smsOptions,(error, info) => {
                                if (error) {
                                    return console.log(error);
                                }
                                
                            });
                            return done(null, newUser);
                        });
                    }
                });


            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );

/* Generates hash using bCrypt*/
    var createHash = function (password) {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}
