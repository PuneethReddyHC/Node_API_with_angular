var mongoose = require('mongoose');
module.exports = mongoose.model('event', {
    event_id: String,
    event_name: String
});