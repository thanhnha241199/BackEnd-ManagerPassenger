var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var carSchema = new Schema({
    driverid: {
        type: String,
        require: true
    },
    supportid: {
        type: String
    },
    tourid: {
        type: String
    },
    status: {
        type: String
    },
}, { timestamps:true })

module.exports = mongoose.model('Car', carSchema)