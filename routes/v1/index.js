var bCrypt = require('bcrypt-nodejs');
var async = require('async');
var express = require('express');
var multiparty = require('multiparty');
var fs = require('fs');
var path = require('path');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var email = require("../../utils/mailer");
var router = express.Router();
var BASE_API_URL = "";
var version = "1.0"; // version code
/* congig */
var configuration = require("../../config");
/* utils*/

/* handler */
var EventHandler = require("../../handlers/event_handler");
var CollegeHandler = require("../../handlers/college_handler");
var PostHandler = require("../../handlers/post_handler");

/* Generates hash using bCrypt*/
var createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

/* Authentication function*/
var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    }
    // if the user is not authenticated then redirect him to the login page
    res.redirect(BASE_API_URL + '/');
};

var isAuthenticatedAccessToken = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers.authorization;
    console.log(token);
    //var token = req.headers['x-access-token'];

    // decode token
    if (token) {
        // console.log(token);
        // verifies secret and checks exp
        jwt.verify(token, configuration.TOKEN_SECRET, function (err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                // if everything is good, save to request for use in other
                // routes
                //console.log(decoded)
                req.user = decoded;
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        return res.status(403).send({
            statuscode: 203,
            msgkey: "api.access.token.failed",
            v: version
        });
    }
}

module.exports = function (passport) {

    /*API to accress root*/
    router.get(BASE_API_URL + '/', function (req, res) {

        var reponseJson = {
            statuscode: 200,
            msgkey: "login.first.to.access.api",
            v: version
        };
        // res.render('/', { message: req.flash('message') });
        res.json(reponseJson);
    });

    /* sign up user exist*/
    router.get(BASE_API_URL + '/_signupfailure', function (req, res) {

        var reponseJson = {
            statuscode: 203,
            msgkey: "auth.signup.exist",
            v: version
        };
        res.json(reponseJson);
    });

    /* API for Login*/
    router.post(BASE_API_URL + '/login', function (req, res, next) {
        passport.authenticate('login', function (err, user, info) {
            if (err) {
                var reponseJson = {
                    statuscode: 203,
                    msgkey: "login failure",
                    v: version
                };
                res.json(reponseJson);
            } else if (info) {
                var reponseJson = {
                    statuscode: 203,
                    msgkey: "login failure",
                    v: version
                };
                res.json(reponseJson);

            } else {
                var reponseJson = {
                    statuscode: 200,
                    msgkey: "login success",
                    v: version,
                    data: user
                };
                res.json(reponseJson);
            }
        })(req, res, next);
    });
    
    
    /* API for GET Home Page */
    router.get(BASE_API_URL + '/home', function (req, res) {
        if (req.user.username) {
            var reponseJson = {
                statuscode: 200,
                msgkey: "login.success",
                v: version,
                data: req.user
            };
        }
        res.json(reponseJson);
    });

    /* API for login failure*/
    router.get(BASE_API_URL + '/_loginfailure', function (req, res) {
        var reponseJson = {
            statuscode: 203,
            msgkey: "login.failure",
            registered: false,
            v: version
        };
        res.json(reponseJson);
    });
    /* API for Handle Logout */
    router.get(BASE_API_URL + '/logout', function (req, res) {
        req.session.destroy(function (err) {
            var reponseJson = {
                statuscode: 200,
                msgkey: "logout.success",
                v: version
            };
            res.json(reponseJson);
        });

    });


    /* API for Handle Registration POST */
    router.post('/signup', function (req, res, next) {
        passport.authenticate('signup', function (err, user, info) {
            if (err) {
                //  console.log("Error 1: ", err);
                var reponseJson = {
                    statuscode: 203,
                    msgkey: "auth.signup.exist",
                    v: version
                };
                res.json(reponseJson);
            } else if (info) {
                //console.log("User info" + user);
                //  console.log("Info: ", info);
            } else {
                //  console.log("User Outside");
                //  console.log(user);
                //console.log(req);

                var registered = false;

                var reponseJson = {
                    statuscode: 200,
                    msgkey: "auth.signup.success",
                    username: user.username,
                    v: version
                };

                // res.render('home', { user: req.user });
                req.logout();
                res.json(reponseJson);
            }
        })(req, res, next);
    });

    /* API for signup success page */
    router.get(BASE_API_URL + '/_signupsuccess', function (req, res) {
        var registered = false;
        if (req.user.isActive === "1") {
            registered = true;
        }

        var reponseJson = {
            statuscode: 200,
            msgkey: "auth.signup.success",
            registered: registered,
            username: req.user.username,
            v: version
        };

        // res.render('home', { user: req.user });
        req.logout();
        res.json(reponseJson);
    });

    router.post(BASE_API_URL + '/add_event', function (req, res) {
        var data = req.body;
        EventHandler.add_event(data, function (response) {
            response.version = version;
            res.json(response);
        });
    });

    router.get(BASE_API_URL + '/get_event', function (req, res) {
        var data = req.query;
        EventHandler.get_event(data, function (response) {
            response.version = version;
            res.json(response);
        });
    });

    router.get(BASE_API_URL + '/list_events', function (req, res) {
        EventHandler.list_events(function (response) {
            response.version = version;
            res.json(response);
        });
    });




    router.post(BASE_API_URL + '/delete_event', function (req, res) {
        var data = req.body;
        console.log("datatat", data);
        EventHandler.delete_event(data, function (response) {
            response.version = version;
            res.json(response);
        });
    });

    router.post(BASE_API_URL + '/edit_event', function (req, res) {
        var data = req.body;
        EventHandler.edit_event(data, function (response) {
            response.version = version;
            res.json(response);
        });
    });


    router.post(BASE_API_URL + '/add_college', function (req, res) {
        var data = req.body;
        CollegeHandler.add_college(data, function (response) {
            response.version = version;
            res.json(response);
        });
    });

    router.get(BASE_API_URL + '/get_college', function (req, res) {
        var data = req.query;
        CollegeHandler.get_college(data, function (response) {
            response.version = version;
            res.json(response);
        });
    });

    router.get(BASE_API_URL + '/list_colleges', function (req, res) {
        CollegeHandler.list_colleges(function (response) {
            response.version = version;
            res.json(response);
        });
    });

    router.post(BASE_API_URL + '/delete_college', function (req, res) {
        var data = req.body;
        console.log("datatate", data);
        CollegeHandler.delete_college(data, function (response) {
            response.version = version;
            res.json(response);
        });
    });

    router.post(BASE_API_URL + '/edit_college', function (req, res) {
        var data = req.body;
        CollegeHandler.edit_college(data, function (response) {
            response.version = version;
            res.json(response);
        });
    });


    router.post(BASE_API_URL + '/add_post', function (req, res) {
        var data = req.body;
        console.log("addpost", data.postId);
        PostHandler.add_post(data, function (response) {
            response.version = version;
            res.json(response);
        });
    });

    router.get(BASE_API_URL + '/get_post', function (req, res) {
        var data = req.query;
        console.log("getpost", data);
        PostHandler.get_post(data, function (response) {
            response.version = version;
            res.json(response);
        });
    });

    router.get(BASE_API_URL + '/list_posts', function (req, res) {
        PostHandler.list_posts(function (response) {
            response.version = version;
            res.json(response);
        });
    });




    router.post(BASE_API_URL + '/delete_post', function (req, res) {
        var data = req.body;
        console.log("delete", data.postId);
        PostHandler.delete_post(data, function (response) {
            response.version = version;
            res.json(response);
        });
    });

    router.post(BASE_API_URL + '/edit_post', function (req, res) {
        var data = req.body;
        console.log("editpost", data.postId);
        PostHandler.edit_post(data, function (response) {
            response.version = version;
            res.json(response);
        });
    });
    router.post(BASE_API_URL + '/edit_views', function (req, res) {
        var data = req.body;
        PostHandler.edit_views(data,function (response) {
            response.version = version;
            res.json(response);
        });
    });

    return router;
};
