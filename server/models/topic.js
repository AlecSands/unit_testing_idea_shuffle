var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Mongoose Schema
var CategorySchema = new Schema({
    category: {type: String, required: true, default: 'Uncategorized'},
});

var TopicSchema = new Schema({
    topic: {type: String, required: true},
    categories: [CategorySchema]
});

module.exports = mongoose.model('Topic', TopicSchema);
