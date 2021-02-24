var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var scheduleSchema = new Schema({
    locationstart: {
        type: String,
        require: true,
        unique: true
    },
    locattionend: {
        type: String,
        require: true
    },
    idtour: {
        type: String,
        require: true
    },
}, { timestamps:true })

module.exports = mongoose.model('Chedule/', addressSchema)