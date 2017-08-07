var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Mongoose Schema
var TopicSchema = new Schema({
    topic: {type: String, required: true},
});

module.exports = mongoose.model('Topic', TopicSchema);
