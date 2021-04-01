var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var cardSchema = new Schema({
    uid: {
        type: String
    },
    cardNumber: {
        type: String
    },
    expiryDate: {
        type: String
    },
    cardHolderName: {
        type: String
    },
    cardHolderName: {
        type: String
    },
    cvvCode: {
        type: String
    },
    showBackView: {
        bool: String
    },
}, { timestamps:true })

module.exports = mongoose.model('Card', cardSchema)