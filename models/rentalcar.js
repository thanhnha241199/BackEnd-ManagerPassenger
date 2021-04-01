var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var rentalSchema = new Schema({
    uid: {
        type: String
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    timestart: {
        type: String,
    },
    timeend: {
        type: String,
    },
    locationstart: {
        type: String,
    },
    locationend: {
        type: String,
    },
    quantityseat: {
        type: String,
    },
    quanticus: {
        type: String,
    },
    type: {
        type: String,
    },
    note: {
        type: String,
    },
}, { timestamps:true })

module.exports = mongoose.model('Rental', rentalSchema)