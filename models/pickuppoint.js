var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var pickuppointSchema = new Schema({
    address: [
        {
            title: {type: String},
            address: {type: String},
        }
    ],
    tourid: {
        type: String
    },
    time: [{
        type: Array
    }]
}, { timestamps:true })

module.exports = mongoose.model('PickupPoint', pickuppointSchema)