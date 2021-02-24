var mongoose = require('mongoose')
var Schema = mongoose.Schema

var tourbusSchema = new Schema({
    locationstart: {
        type: String,
    },
    locattionend: {
        type: String,
    },
    time: {
        type: String,
    },
    range: {
        type: String,
    },
    price: {
        type: String,
    }
}, { timestamps:true })

module.exports = mongoose.model('Tourbus', tourbusSchema)