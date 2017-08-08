var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Mongoose Schema
var IdeaSchema = new Schema({
    idea: {type: String, required: true, default: 'Placeholder'}
});

var CategorySchema = new Schema({
    category: {type: String, required: true, default: 'Uncategorized'},
    ideas: [IdeaSchema]
});

var TopicSchema = new Schema({
    topic: {type: String, required: true},
    categories: [CategorySchema]
});

module.exports = mongoose.model('Topic', TopicSchema);
