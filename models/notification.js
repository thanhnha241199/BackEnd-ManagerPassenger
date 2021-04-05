var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var notificationSchema = new Schema({
    uid: {
        type: String
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    time: {
        type: Date,
    },
})

module.exports = mongoose.model('Notification', notificationSchema)