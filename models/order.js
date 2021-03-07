var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    id: {
        type: String
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    tour: {
        type: String,
    },
    timetour: {
        type: String,
    },
    quantity: {
        type: String,
    },
    seat: {
        type: String,
    },
    price: {
        type: String,
    },
    totalprice: {
        type: String,
    },
}, { timestamps:true })

module.exports = mongoose.model('Order', orderSchema)