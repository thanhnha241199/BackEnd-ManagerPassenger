var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var reviewSchema = new Schema({
    rating: {type: String},
    description: {type: String},
})

module.exports = mongoose.model('Review', reviewSchema)