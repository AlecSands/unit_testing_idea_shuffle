var express = require('express');
var router = express.Router();

var Users = require('../models/user.js');

// Handles Ajax request for user information if user is authenticated
router.get('/', function(req, res) {
  console.log('get /user route');
  // check if logged in
  if(req.isAuthenticated()) {
    // send back user object from database
    console.log('logged in', req.user);
    var userInfo = {
      username : req.user.username,
      currentTopic: req.user.currentTopic
    };
    res.send(userInfo);
  } else {
    // failure best handled on the server. do redirect here.
    console.log('not logged in');
    // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
    res.send(false);
  }
});

// clear all server session information about this user
router.get('/logout', function(req, res) {
  // Use passport's built-in method to log out the user
  console.log('Logged out');
  req.logOut();
  res.sendStatus(200);
});

router.put('/currenttopic/:topic', function(req, res) {
  var updatedCurrentTopic = {currentTopic: req.params.topic};
  console.log(updatedCurrentTopic);
  console.log(req.user._id);
  var id = req.user._id;
  Users.findByIdAndUpdate(id, updatedCurrentTopic, {new: true}, function(err, model) {
    if (err) {
      console.log('Error with mongoose PUT:', err);
      res.sendStatus(500);
    } else {
      var updatedUser = {
        username: model.username,
        currentTopic: model.currentTopic
      };
      res.send(updatedUser);
    }
  });
});

//     var id = args._id;
//     var updateObj = {updatedDate: Date.now()};
//     _.extend(updateObj, args);
//
//     Model.findByIdAndUpdate(id, updateObj, function(err, model) {
//         if (err) {
//             logger.error(modelString +':edit' + modelString +' - ' + err.message);
//             self.emit('item:failure', 'Failed to edit ' + modelString);
//             return;
//         }
//         self.emit('item:success', model);
//     });


module.exports = router;
