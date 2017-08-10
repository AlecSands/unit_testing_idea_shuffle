var express = require('express');
var router = express.Router();

// requires the topic schema.
var Topic = require('../models/topic.js');

//D3
// Will send d3 compatable data.
router.get('/:topic', function(req, res) {
  console.log('Request for d3 recieved.');

  var topic = req.params.topic;
  console.log('The current Topic:', topic);

  // Mongoose request for all topics
  Topic.findOne({topic: topic}, function(err, result) {
    if(err) {
      console.log('find error: ', err);
      res.sendStatus(500);
    } else {
      var thisTopic = result;
      console.log('got the topic:', thisTopic);

      // converting to d3
      var topicD3 = {
        "nodes": [
          {"id": thisTopic.topic, "group": 1},
        ],
        "links": [
          // {"source": thisTopic.topic, "target": "testing", "value": 1}
        ]
      };

      for (i=0; i<thisTopic.categories.length; i++) {
        topicD3.nodes.push({"id": thisTopic.categories[i].category, "group": 2});
        topicD3.links.push({"source": thisTopic.topic, "target": thisTopic.categories[i].category, "value": 1});
        for (j=0; j<thisTopic.categories[i].ideas.length; j++) {
          topicD3.nodes.push({"id": thisTopic.categories[i].ideas[j].idea, "group": 3});
          topicD3.links.push({"source": thisTopic.categories[i].category, "target": thisTopic.categories[i].ideas[j].idea, "value": 1});
        }
      }

      console.log('updated d3:', topicD3);

      res.send(topicD3);
    }
  });

});

// Watson

// var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
//
// var tone_analyzer = new ToneAnalyzerV3({
//   "url": "https://gateway.watsonplatform.net/tone-analyzer/api",
//   "username": "288f2ed6-0c43-41ad-b4f5-f7a546c145c2",
//   "password": "EKwe43kJF11z",
//   version_date: '2016-05-19'
// });
//
// tone_analyzer.tone({ text: 'I am thinking that hiding ducks around Prime is really fun.' },
//   function(err, tone) {
//     if (err)
//       console.log(err);
//     else
//       console.log(JSON.stringify(tone, null, 2));
// });


module.exports = router;
