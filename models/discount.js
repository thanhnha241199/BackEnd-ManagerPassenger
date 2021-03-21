var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var discountSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    sale: {
        type: Number,
        require: true
    },
    timestart: {
        type: Date,
        require: true,
        default: Date.now
    },
    timeend: {
        type: Date,
        require: true,
        default: () => new Date(+new Date() + 30*24*60*60*1000)
    },
    code: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    }
}, { timestamps:true })

module.exports = mongoose.model('Discount', discountSchema)