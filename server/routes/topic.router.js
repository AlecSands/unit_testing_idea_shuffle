var express = require('express');
var router = express.Router();

// requires the topic schema.
var Topic = require('../models/topic.js');

// GET route for getting all topics from the db.
router.get('/', function(req, res){
  console.log('Getting topics from the db');

  // Mongoose request for all topics
  Topic.find({}, function(err, result) {
    if(err) {
      console.log('find error: ', err);
      res.sendStatus(500);
    } else {
      var allTopics = result;
      console.log('got all topics:', allTopics);
      res.send(allTopics);
    }
  });
});

// POST route to create a new topic.
router.post('/create/:topic', function(req, res){
  var newTopic = {topic: req.params.topic, categories: [{category: 'Misc'}]};
  console.log('Creating a new topic:', newTopic.topic);


  // send the new topic to the db using Mongoose.
  Topic.create(newTopic, function(err, post) {
    console.log('post /topic -- Topic.create');
       if(err) {
         console.log('post /topic -- Topic.create -- failure');
         // next() here would continue on and route to routes/index.js
         next(err);
       } else {
         console.log('post /topic -- Topic.create -- success');
        // route a new express request for GET '/'
        res.sendStatus(200);
       }
  });
});

module.exports = router;
