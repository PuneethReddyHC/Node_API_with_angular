var mongoose = require('mongoose');
module.exports = mongoose.model('college', {
    college_id: String,
    college_name: String,
    college_loc:String
});