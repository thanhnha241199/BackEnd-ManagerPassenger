var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var addressSchema = new Schema({
    title: {
        type: String,
        require: true,
        unique: true
    },
    address: {
        type: String,
        require: true
    },
    uid: {
        type: String,
        require: true
    }
}, { timestamps:true })

module.exports = mongoose.model('Address', addressSchema)