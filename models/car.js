var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var carSchema = new Schema({
    tourid: {
        type: String
    },
    driverid: {
        type: String
    },
    supportid: {
        type: String
    },
    name: {
        type: String
    },
    numberplate: {
        type: String
    },
    status: {
        type: String
    },  
    description: {
        type: String
    },
}, { timestamps:true })

module.exports = mongoose.model('Car', carSchema)