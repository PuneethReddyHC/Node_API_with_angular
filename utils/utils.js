/**
 * New node file */
//var mailer = require('../utils/mailer');
var sms = require('../utils/SMS');
const uuidV4 = require('uuid/v4');
module.exports = {
    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    sendOTP: function (data) {
        //mailer.sendMail(data);
        sms.sendSMS(data);
    },
    getUniqueId: function () {
        return uuidV4();
    }
};

