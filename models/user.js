var mongoose = require('mongoose');
module.exports = mongoose.model('registration', {
    id: String,
    password: String,
    firstname:String,
    lastname:String,
    pdata: String,
    createdAt: String,
    expiresAt: String,
    role:String,
    otpExpiry: String,
    passtoken :String,
    token: String,
    jwt_token: String,
    isActive: String,
    loggedOut: String,
    loggedIn: String,
    isEmailVerified :String,
    username: {type: String, index: true}
});
