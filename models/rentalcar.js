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
    timestart: {
        type: Date,
    },
    timeend: {
        type: Date,
    },
    phone: {
        type: String,
    },
    note: {
        type: String,
    },
    type: {
        type: String,
    },
    quantityseat: {
        type: String,
    },
    typecar: {
        type: String,
    },
    seatcar: {
        type: String,
    },
}, { timestamps:true })

module.exports = mongoose.model('Rental', rentalSchema)