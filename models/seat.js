var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var seatSchema = new Schema({
    idtour: {
        type: String,
    },
    idcar: {
        type: String,
    },
    floors1: {
        type: Array
    },
    floors2: {
        type: Array
    }
}, { timestamps:true })

module.exports = mongoose.model('Seat', seatSchema)