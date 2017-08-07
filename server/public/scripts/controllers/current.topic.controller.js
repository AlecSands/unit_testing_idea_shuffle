myApp.controller('CurrentTopicController', function(IdeaShuffleService) {
  console.log('CurrentTopicController created');
  var vm = this;
  vm.userService = IdeaShuffleService;
});
