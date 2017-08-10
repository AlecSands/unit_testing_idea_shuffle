var express = require('express');
var router = express.Router();

// Required Schemas.
var Topic = require('../models/topic.js');

// TOPIC ROUTES
// GET route for getting all topics from the db.
router.get('/', function(req, res){
  // Get all topics and send them to the client
  Topic.find({}, function(err, result) {
    if(err) {
      console.log('find error: ', err);
      res.sendStatus(500);
    } else {
      var allTopics = result;
      res.send(allTopics);
    }
  });
});

// POST route to create a new topic.
router.post('/create/:topic', function(req, res){
  // Create an object to be passed to the db.
  var newTopic = {
    topic: req.params.topic,
    categories: [{
      category: 'Uncategorized',
      ideas: [{idea: 'Placeholder'}]
    }]
  };
  // Create the new document in the database.
  Topic.create(newTopic, function(err, post) {
    if(err) {
      console.log('error with create request:', err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

// CATEGORY ROUTES
// GET route for getting all categores from the db for a topic.
router.get('/categories/:topic', function(req, res){
  var topic = req.params.topic;
  // Mongoose request for the current topic
  Topic.findOne({topic: topic}, function(err, result) {
    if(err) {
      console.log('find error: ', err);
      res.sendStatus(500);
    } else {
      res.send(result);
    }
  });
});

// POST to create a new category for the given topic.
router.post('/category/:category', function(req, res){
  var newCategory = req.params.category;
  var currentTopic = req.user.currentTopic;
  // Mongoose request for all topics
  addNewCategory(currentTopic, newCategory, res, req);
});

// Create a new category for the current topic on the db.
function addNewCategory(topicId, newCategory, res, req) {
  // Find the current topic in the db.
  Topic.findOne({topic: topicId},
    function(err, topic) {
      if(err) {
        console.log('err with new category:', err);
        res.sendStatus(500);
      } else {
        // Create a new category object to add to the db.
        var addCategory = {
          category: newCategory,
          ideas: []
        };
        // Push that object into the topic's category array
        topic.categories.push(addCategory);
        // Save the updated topic to the db.
        topic.save(function(err){
          if(err) {
            console.log('error with save:', err);
            res.sendStatus(500);
          } else {
            res.sendStatus(200);
          }
        });
      }
    });
  }

  // IDEAS ROUTES
  // POST to create a new idea for the given category.
  router.post('/idea/:idea', function(req, res){
    var newIdea = req.params.idea;
    var currentTopic = req.user.currentTopic;
    var currentCategory = req.body;
    // Add a new idea to the current category.
    addNewIdea(currentTopic, currentCategory, newIdea, res, req);
  });

  // Add a new idea to the current category.
  function addNewIdea(topic, category, newIdea, res, req) {
    Topic.findOne({topic: topic},
      function(err, topic) {
        if(err) {
          console.log('err with new category:', err);
          res.sendStatus(500);
        } else {
          // Loop through the categories to find amatch with the current category.
          for (i=0; i<topic.categories.length; i++) {
            if (topic.categories[i]._id == category._id) {
              // Once there is a match push the new idea into the array.
              topic.categories[i].ideas.push({idea: newIdea});
              // Save the updated topic to the database.
              // In the future put the anonymous function into a callback.
              topic.save(function(err){
                if(err) {
                  console.log('error with save:', err);
                  res.sendStatus(500);
                } else {
                  res.sendStatus(200);
                }
              });
            }
          }
        }
      }); // end findOne
    }

    // PUT to update the ideas in a given topic.
    router.put('/idea', function(req, res){
      var currentTopic = req.user.currentTopic;
      var updatedTopic = req.body.data;
      // Update the current topic in the db.
      updateTopic(currentTopic, updatedTopic, res, req);
    });

    // Updates the current topic in the db to reflect the new order.
    function updateTopic(topic, updatedTopic, res, req) {
      // Find the current topic in the db.
      Topic.findOne({topic: topic},
        function(err, data) {
          if(err) {
            console.log('err with new category:', err);
            res.sendStatus(500);
          } else {
            data.categories = updatedTopic.categories;
            // Save the updated topic to the db.
            data.save(function(err){
              if(err) {
                console.log('error with save:', err);
                res.sendStatus(500);
              } else {
                res.sendStatus(200);
              }
            });
          }
        }); // end findOne
      }


      //UNDER CONSTRUCTION
      router.delete('/:ideaId', function(req, res){
        console.log('Removing an idea from the db');
        var removeIdeaId = req.params.ideaId;
        console.log('idea to remove:', removeIdeaId);
        // Mongoose request for all topics
        // EntryPoints.update(
        //   { "onCommands._id": req.body._id },
        //   {
        //       "$pull": {
        //           "onCommands": { "_id": req.body._id }
        //       }
        //   },
        //   function (err, numAffected) { console.log("data:", numAffected) }
        // );

        Topic.update({topic: req.user.currentTopic}, {"$pull": {
          ideas: {"_id": removeIdeaId}
        }})
        .then(function(err, data) {
          if(err) {
            console.log('err with new category:', err);
            res.sendStatus(500);
          } else {
            console.log('success!');
            res.sendStatus(200);
          }
        });
      });


      module.exports = router;
