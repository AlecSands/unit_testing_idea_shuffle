myApp.controller('SelectTopicController', function(IdeaShuffleService) {
  console.log('SelectTopicController created');
  var vm = this;
  vm.userService = IdeaShuffleService;
  vm.userObject = IdeaShuffleService.userObject;
});
