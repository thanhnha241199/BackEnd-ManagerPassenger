var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var tourbusSchema = new Schema({
    locationstart: {
        type: String,
        require: true,
        unique: true
    },
    locattionend: {
        type: String,
        require: true
    },
    timestart: {
        type: String,
        require: true
    },
    timesend: {
        type: String,
        require: true
    },
    dumplex: {
        type: Boolean,
        require: true
    },
    timesback: {
        type: String,
        require: true
    }
}, { timestamps:true })

module.exports = mongoose.model('Tourbus', addressSchema)