myApp.factory('IdeaShuffleService', function($http, $location){
  console.log('IdeaShuffleService Loaded');

  var userObject = {};

  return {
    userObject : userObject,

    getuser : function(){
      console.log('IdeaShuffleService -- getuser');
      $http.get('/user').then(function(response) {
          if(response.data.username) {
              // user has a curret session on the server
              userObject.userName = response.data.username;
              userObject.currentTopic = response.data.currentTopic;
              console.log('IdeaShuffleService -- getuser -- User Data: ', userObject.userName);
          } else {
              console.log('IdeaShuffleService -- getuser -- failure');
              // user has no session, bounce them back to the login page
              $location.path("/home");
          }
      },function(response){
        console.log('IdeaShuffleService -- getuser -- failure: ', response);
        $location.path("/home");
      });
    },

    logout : function() {
      console.log('IdeaShuffleService -- logout');
      $http.get('/user/logout').then(function(response) {
        console.log('IdeaShuffleService -- logout -- logged out');
        $location.path("/home");
      });
    }
  };
});
