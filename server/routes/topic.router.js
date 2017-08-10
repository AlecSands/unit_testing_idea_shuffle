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
  console.log('getting current topic');
  var topic = req.params.topic;
  // Mongoose request for the current topic
  Topic.findOne({topic: topic}, function(err, result) {
    console.log('Mongoose Finding');
    if(err) {
      console.log('find error: ', err);
      res.sendStatus(500);
    } else {
      console.log('about to send the result', result);
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

  // Modify a category in the db
  router.put('/category/:modCategory', function(req, res) {
    var modifiedCategory = req.params.modCategory;
    var currentTopic = req.user.currentTopic;
    var currentCategory = req.body;
    console.log('current category to be modified:', currentCategory);

    Topic.findOne({topic: currentTopic},
      function(err, data) {
        if(err) {
          console.log('Unable to find topic:', err);
          res.sendStatus(500);
        } else {
          console.log('Data retrieved from the db', data);
          // Loop through all the categories in the topic.
          for (i=0; i<data.categories.length; i++) {
              // Checks if the current category matches the target category
              if (data.categories[i]._id == currentCategory._id) {
                data.categories[i].category = modifiedCategory;
              }
            }
          }
          console.log('updated topic:', JSON.stringify(data));
          // Save the updated topic to the db.
          data.save(function(err){
            if(err) {
              console.log('error with save:', err);
              res.sendStatus(500);
            } else {
              res.sendStatus(200);
            }
          });
      
  });
});

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


      // delete an idea in the database.
      router.delete('/:ideaId', function(req, res){
        console.log('Removing an idea from the db');
        var removeIdeaId = req.params.ideaId;
        var currentTopic = req.user.currentTopic;
        console.log('idea to remove:', removeIdeaId);

        Topic.findOne({topic: currentTopic},
          function(err, data) {
            if(err) {
              console.log('Unable to find topic:', err);
              res.sendStatus(500);
            } else {
              console.log('Data retrieved from the db', data);
              // Loop through all the categories in the topic.
              for (i=0; i<data.categories.length; i++) {
                var ideaToRemove = -1;
                // Loop through all the ideas in each category.
                for (j=0; j<data.categories[i].ideas.length; j++) {
                  // Checks if the current idea matches the target idea
                  if (data.categories[i].ideas[j]._id == removeIdeaId) {
                    ideaToRemove = j;
                  }
                }
                // if there was a match remove it from the array.
                if (ideaToRemove >= 0) {
                  data.categories[i].ideas.splice(ideaToRemove, 1);
                }
              }
              console.log('updated topic:', JSON.stringify(data));
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
        });

        router.put('/idea/:modIdea', function(req, res) {
          var modifiedIdea = req.params.modIdea;
          var currentTopic = req.user.currentTopic;
          var currentIdea = req.body;
          console.log('current idea to be modified:', currentIdea);

          Topic.findOne({topic: currentTopic},
            function(err, data) {
              if(err) {
                console.log('Unable to find topic:', err);
                res.sendStatus(500);
              } else {
                console.log('Data retrieved from the db', data);
                // Loop through all the categories in the topic.
                for (i=0; i<data.categories.length; i++) {
                  // Loop through all the ideas in each category.
                  for (j=0; j<data.categories[i].ideas.length; j++) {
                    // Checks if the current idea matches the target idea
                    if (data.categories[i].ideas[j]._id == currentIdea._id) {
                      data.categories[i].ideas[j].idea = modifiedIdea;
                    }
                  }
                }
                console.log('updated topic:', JSON.stringify(data));
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
        });
});

        module.exports = router;
