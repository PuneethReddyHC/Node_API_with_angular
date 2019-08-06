/**
 * New node file
 */
var nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');
var config = require("../config");
var EmailTemplate = require('email-templates').EmailTemplate;
var fs = require('fs');


// create reusable transporter object using SMTP transport
/*var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ramshankarsc9@gmail.com',
        pass: ''
    }
});*/
 


var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: config.SENDER_EMAIL,
        pass: config.EMAIL_PASSWORD
    }
});


// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails
module.exports = {
    sendMail: function (data) {
        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: data.from, // sender address
            to: data.to, // list of receivers
            subject: 'Alert', // Subject line
            text: "",
            attachments: [
                {   // utf-8 string as an attachment
                    filename: 'text1.txt',
                    content: 'hello world!'
                }
            ]
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('Error sending message: ' + error);
            } else {
                console.log('Message sent: ' + info.response);
            }
        });
    },

    //Send Mail using nodemailer

    // sendMailNotification: function (data) {
    //     // setup e-mail data with unicode symbols
    //
    //     var mailOptions = {
    //         from: data.from, // sender address
    //         to: data.to, // list of receivers
    //         subject: data.subject, // Subject line
    //         html: data.html
    //     };
    //     // send mail with defined transport object
    //     transporter.sendMail(mailOptions, function (error, info) {
    //         if (error) {
    //             console.log('Error sending message: ' + error);
    //         } else {
    //             console.log('Message sent: ' + info.response);
    //         }
    //     });
    // },

    //Send Mail using Sendgrid

    
    sendMailNotification: function (data) {
        
        var mailOptions = {
            from: data.from, // sender address
            to: data.to, // list of receivers
            subject: data.subject, // Subject line
            html: data.html
        };
        // send mail with defined transport object
        sgMail.send(mailOptions, function (error, info) {
            if (error) {
                console.log('Error sending message ');
            } else {
                console.log('Message sent to %s from %s', data.to , data.from);
            }
        });
    },

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

    sendMailMongo: function (data) {
        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: 'puneethreddy951@gmail.com', // sender address
            to: data.email, // list of receivers
            subject: 'Highway App  Demo  Server Alert ', // Subject line
            text: 'MongoDb server went down', // plaintext body
            html: '<b>MongoDb server went down</b>' // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('Error sending message: ' + error);
            } else {
                console.log('Message sent: to ' + info.response +'puneeth');
            }

        });

    }
};
