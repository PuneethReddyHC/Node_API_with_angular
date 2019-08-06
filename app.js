var express = require('express');
var path = require('path');
//var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var mongoose = require('mongoose');
var cors = require('cors');
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var csrf = require('csrf');
var httpProxy = require('http-proxy');
var flash = require('connect-flash');

var dbConfig = require('./db');
const fileUpload = require('express-fileupload');
var app = express();
//app.use('/images', express.static('images'));
app.use(fileUpload());

// configuration of environment
app.set('env', "development");
//app.set('env',"production");

if (app.get('env') === 'development') {

    //create a write stream (in append mode)
    var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {
        flags: 'a'
    });
    //var accessLogStream = fs.createWriteStream('/var/log/origin/access.log',{flags: 'a'});

    // logging options
    morganOptions = {
        stream: accessLogStream
        // , skip: function (req, res) { return res.statusCode < 400; }  // uncomment this to log errors only
    };
    // enable logger
    app.use(logger('combined', morganOptions));

    // setup the logger
    //app.use(logger('combined', {stream: accessLogStream}));

//app.use(express.errorHandler());

}

//SendGrid
// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey('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');
// const msg = {
//     to: 'krupal.s@avohi.com',
//     from: 'krupalsharmakn1@gmail.com',
//     subject: 'Sending with SendGrid is Fun',
//     text: 'and easy to do anywhere, even with Node.js',
//     html: '<strong>And easy to do anywhere, even with Node.js</strong>',
// };
// sgMail.send(msg);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon());
app.use(logger('dev'));

var expressSession = require('express-session');

var sessionstore = require('sessionstore');
// TODO - Why Do we need this key ?
app.use(expressSession({
    store: sessionstore.createSessionStore(),
    secret: '!@project_name@!',
    resave: true,
    saveUninitialized: true,
    key: 'sid',
    cookie: {
        maxAge: null,
        httpOnly: true
    }

}));
app.use('/images', express.static('images'));//imp for image upload
//Setting memory body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({
    limit: '10mb'
}));

app.use(require('express-method-override')('method_override_param_name'));

var proxyOptions = {
    changeOrigin: true
};

httpProxy.prototype.onError = function (err) {
    console.log(err);
};

var apiProxy = httpProxy.createProxyServer(proxyOptions);

var allowCrossDomain = function (req, res, next) {
    // console.log(req.body);
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, if-none-match, x-access-token, Authorization');
    res.header("Access-Control-Expose-Headers", "Etag, Authorization, Origin, X-Requested-With, Content-Type, Accept, If-None-Match, Access-Control-Allow-Origin");
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
};
app.use(allowCrossDomain);

app.use(cookieParser());
app.use(express.static(path.join(__dirname + '.../public')));

var d = require('domain').create();
d.on('error', function (err, req, res, next) {

    var MongoMail = require(__dirname + '/utils/mailer');
    console.log('Oh no, something wrong with DB');
    mongoalertStatus = 1;
    data = {
        email: 'puneethreddy951@gmail.com'
    };
   MongoMail.sendMailMongo(data);

});

d.run(function () {
    mongoose.connect(dbConfig.url);
    console.log("MongoDb connected Successfully !!!");
});

//Session management in DB
var MongoStore = require('connect-mongo')(expressSession);

app.use(expressSession({
    secret: 'mySecretKey',
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 60000 * 60 * 24 * 365},
    store: new MongoStore(
        {
            mongooseConnection: mongoose.connection, // it re- use the already connected instance
            //url: dbConfig.url, //it opens new connection
            autoRemoveExpiredSession: true,
        },

        function (err) {
            console.log(err || 'connect-mongodb setup ok');
        })
}));

// Configuring Passport
var passport = require('passport');

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/v1/index')(passport);
var routesv1 = require('./routes/v1/index')(passport);
app.use(require('express-domain-middleware'));

app.use('/', routes);
app.use('/project_name/api/v1', routesv1);

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    //next(err);
    res.status(err.status || 404);
    res.send({
        "code": "404",
        "error": "Not Found"
    });
});

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        if (app.get('env') === 'production') {

            accessLogStream.write(err.stack);

        }
        console.log(err.message)
        res.status(err.status || 500);
        //        res.render('error', {
        //            message: err.message,
        //            error: err
        //        });
        res.send({
            "code": "500",
            "error": "Internal Server Error"
        });
    });
}
// var cron = require('node-cron');

/*cron.schedule('* * * * *', function(){
    mailer.sendMail();
    console.log('running a task every two minutes');
});*/
if (app.get('env') === 'production') {

    console.log = function () {
    };

}


module.exports = app;
