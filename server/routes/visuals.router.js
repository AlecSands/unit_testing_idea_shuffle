var express = require('express');
var router = express.Router();

// Require Schemas.
var Topic = require('../models/topic.js');

// D3 Related Routes
// Get route which converts topic to d3 compatable JSON.
router.get('/:topic', function(req, res) {
  var topic = req.params.topic;

  // Mongoose request for the current topic
  Topic.findOne({topic: topic}, function(err, result) {
    if(err) {
      console.log('find error: ', err);
      res.sendStatus(500);
    } else {
      var thisTopic = result;
      // converting to d3
      // Instantiating the d3 JSON object with the current topic.
      var topicD3 = {
        "nodes": [
          {"id": thisTopic.topic, "group": 1},
        ],
        "links": []
      };
      // Loop through all the categories in the current topic.
      for (i=0; i<thisTopic.categories.length; i++) {
        // Adding nodes for each category
        topicD3.nodes.push({
          "id": thisTopic.categories[i].category,
          "group": 2
        });
        // Adding links between the categories and the topic
        topicD3.links.push({
          "source": thisTopic.topic,
          "target": thisTopic.categories[i].category,
          "value": 1
        });
        // Looping through each idea in category[i]
        for (j=0; j<thisTopic.categories[i].ideas.length; j++) {
          // Adding a new node for each idea.
          topicD3.nodes.push({
            "id": thisTopic.categories[i].ideas[j].idea,
            "group": 3
          });
          // Adding a link between the idea node and the category node.
          topicD3.links.push({
            "source": thisTopic.categories[i].category,
            "target": thisTopic.categories[i].ideas[j].idea,
            "value": 1
          });
        }
      }
      res.send(topicD3);
    }
  });

});

// Watson

var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

if(process.env.MONGODB_URI != undefined) {
    // use the string value of the environment variable
    watsonUsername = process.env.WATSON_USERNAME;
    watsonPassword = process.env.WATSON_PASSWORD;
} else {
    // use the local database server
    var watson = require('..modules/ref.js');
    watsonUsername = watson.WATSON_USERNAME;
    watsonPassword = watson.WATSON_PASSWORD;
}

var tone_analyzer = new ToneAnalyzerV3({
  "url": "https://gateway.watsonplatform.net/tone-analyzer/api",
  "username": watsonUsername,
  "password": watsonPassword,
  version_date: '2016-05-19'
});

var analyzeTone = function(text) {
  return tone_analyzer.tone({ text: text },
    function(err, tone) {
      if (err) {
        console.log(err);
        return err;
      } else {
        console.log('from Watson', tone);
        return tone;
      }
    });

  };

  router.put('/tone', function (req, res) {
    console.log('analyze this', req.body);
    var text = req.body.data.topic + ". ";
    for (i=0; i<req.body.data.categories.length; i++) {
      text = text + req.body.data.categories[i].category + ". ";
      for (j=0; j<req.body.data.categories[i].ideas.length; j++) {
        text = text + req.body.data.categories[i].ideas[j].idea + ". ";
      }
    }
    console.log('text to be analyzed:', text);
    tone_analyzer.tone({ text: text },
      function(err, tone) {
        if (err) {
          console.log(err);
        } else {
          console.log('from Watson', tone);
          res.send(tone);
        }
      });
      // analyzeTone(text).then(function (response) {
      //   res.send(response);
      // });

    });


module.exports = router;
