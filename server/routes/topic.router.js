var express = require('express');
var router = express.Router();

// requires the topic schema.
var Topic = require('../models/topic.js');

// POST route to create a new topic.
router.post('/create/:topic', function(req, res){
  var newTopic = {topic: req.params.topic};
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
