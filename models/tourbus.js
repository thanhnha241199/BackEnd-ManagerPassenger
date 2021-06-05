var mongoose = require('mongoose')
var Schema = mongoose.Schema
var tourbusSchema = new Schema({
    locationstart: {
        type: String,
    },
    locationend: {
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
    },
    carid: {
        type: String,
    },
    shuttle: {
        type: String,
    },
    driverid: {
        type: String,
    }, 
    supportid: {
        type: String,
    },
    review: [
        {
            rating: {type: String},
            description: {type: String},
        }
    ],
}, { timestamps:true })

module.exports = mongoose.model('Tourbus', tourbusSchema)