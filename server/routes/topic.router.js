// express module
var express = require('express');

// Express router to mount market related functions on.
var router = express.Router();

// POST route to create a new topic.
router.post('/create/:topic', function(req, res){
  var newTopic = req.params.topic;
  console.log('Creating a new topic:', newTopic);
  res.sendStatus(200);
});

module.exports = router;
