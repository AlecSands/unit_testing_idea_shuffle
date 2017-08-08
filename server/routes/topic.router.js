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

// GET route for getting all categores from the db for a topic.
router.get('/categories/:topic', function(req, res){
  console.log('Getting categories from the db');
  var topic = req.params.topic;
  console.log('The current Topic:', topic);

  // Mongoose request for all topics
  Topic.findOne({topic: topic}, function(err, result) {
    if(err) {
      console.log('find error: ', err);
      res.sendStatus(500);
    } else {
      var thisTopic = result;
      console.log('got all topics:', thisTopic);
      res.send(thisTopic);
    }
  });
});

// POST route for getting all categores from the db for a topic.
router.post('/category/:category', function(req, res){
  console.log('Adding a category to the db');
  var newCategory = req.params.category;
  var currentTopic = req.user.currentTopic;
  console.log('new topic:', newCategory);
  console.log('current topic:', currentTopic);
  // Mongoose request for all topics
  addNewCategory(currentTopic, newCategory, res, req);
});

function addNewCategory(topicId, newCategory, res, req) {
  Topic.findById({topic: topicId},
    function(err, topic) {
      if(err) {
        console.log('err with new category:', err);
        res.sendStatus(500);
      } else {
        var newCategory = {
          category: newCategory,
          ideas: [{idea: 'placeholder'}]
        };
        topic.categories.push(newCategory);
        topic.save(function(err){
          if(err) {
            console.log('error with save:', err);
            res.sendStatus(500);
          } else {
            console.log('success!');
            res.sendStatus(200);
          }
        });
      }
  }); // end findOne
}

// POST route to create a new topic.
router.post('/create/:topic', function(req, res){
  var newTopic = {topic: req.params.topic, categories: [{category: 'Uncategorized', ideas: [{idea: 'Placeholder'}]}]};
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
