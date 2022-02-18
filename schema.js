const mongoose = require('mongoose');
var roomm = require('./socket');

var chatschema = mongoose.Schema({
    user : String,
    text : String,
    created : String,
    email : String,
});

module.exports = Chat = mongoose.model(roomm,chatschema);