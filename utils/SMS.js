/**
 * New node file
 */
var request = require("request");

module.exports = {
    sendSMS: function (data) {
        // setup e-mail data with unicode symbols
        var smsOptions = {
            send_to: '+919535688928', // sender address
            msg: "Welcome to Smarthub. Your OTP is 9535",
            method: "SendMessage",
            msg_type: "TEXT",
            userid: "2000154870",
            auth_scheme: "plain",
            password: "yM8uCemXx",
            version: "1.1",
            format: "text"
            //49391A7dKGSELS53f44076
        };

        console.log("sending SMS to " + smsOptions.mobiles);
        request({
            uri: "http://enterprise.smsgupshup.com/GatewayAPI/rest",
            method: "POST",
            form: smsOptions
        }, function (error, response, body) {
            console.log("response from SMS Provider is: " + body);
        });

    }
};
