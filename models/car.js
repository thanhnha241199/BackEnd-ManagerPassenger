var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var carSchema = new Schema({
    tourid: {
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
}, { timestamps:true })

module.exports = mongoose.model('Car', carSchema)