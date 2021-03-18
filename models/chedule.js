var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var scheduleSchema = new Schema({
    idtour: {
        type: String,
        require: true
    },
    locationstart: {
        type: String,
    },
    locationend: {
        type: String,
    },
    schedule: [
        {
            time: { type: String },
            location: { type: String,},
            address: { type: String,},
       }
    ]
}, { timestamps:true })

module.exports = mongoose.model('Chedule', scheduleSchema)