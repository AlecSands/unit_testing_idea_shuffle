var myApp = angular.module('myApp', ['ngRoute', 'ngMaterial', 'as.sortable']);

/// Routes ///
myApp.config(function($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');
  console.log('myApp -- config');
  $routeProvider
    .when('/home', {
      templateUrl: '/views/templates/home.html',
      controller: 'LoginController as lc',
    })
    .when('/register', {
      templateUrl: '/views/templates/register.html',
      controller: 'LoginController as lc'
    })
    .when('/selectTopic', {
      templateUrl: '/views/templates/selectTopic.html',
      controller: 'SelectTopicController as stc',
      resolve: {
        getuser : function(IdeaShuffleService){
          return IdeaShuffleService.getuser();
        }
      }
    })
    .when('/currentTopic', {
      templateUrl: '/views/templates/currentTopic.html',
      controller: 'CurrentTopicController as ctc',
      resolve: {
        getuser : function(IdeaShuffleService){
          return IdeaShuffleService.getuser();
        }
      }
    })
    .otherwise({
      redirectTo: 'home'
    });
});
