var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var seatSchema = new Schema({
    name: {
        type: String,
    },
    status: {
        type: String,
    },
    quantity: {
        type: Number,
    }
}, { timestamps:true })

module.exports = mongoose.model('Seat', seatSchema)