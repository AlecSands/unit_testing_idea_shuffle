var express = require('express');
var router = express.Router();

// requires the topic schema.
var Topic = require('../models/topic.js');


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

  // var exampleD3 = {
  //   "nodes": [
  //     {"id": "Alec", "group": 1},
  //     {"id": "Pam", "group": 1},
  //     {"id": "Mary", "group": 2},
  //     {"id": "Scott", "group": 2},
  //     {"id": "Andrea", "group": 4},
  //     {"id": "Zach", "group": 3},
  //     {"id": "Walter", "group": 3},
  //     {"id": "Howard", "group": 3}
  //   ],
  //   "links": [
  //     {"source": "Alec", "target": "Pam", "value": 1},
  //     {"source": "Alec", "target": "Mary", "value": 1},
  //     {"source": "Alec", "target": "Scott", "value": 1},
  //     {"source": "Alec", "target": "Walter", "value": 1},
  //     {"source": "Alec", "target": "Howard", "value": 1},
  //     {"source": "Alec", "target": "Zach", "value": 1},
  //     {"source": "Mary", "target": "Scott", "value": 1},
  //     {"source": "Howard", "target": "Zach", "value": 1},
  //     {"source": "Walter", "target": "Zach", "value": 1},
  //     {"source": "Walter", "target": "Howard", "value": 1},
  //     {"source": "Pam", "target": "Andrea", "value": 1}
  //   ]
  // };

});


module.exports = router;
