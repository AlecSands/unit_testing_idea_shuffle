myApp.controller('SelectTopicController', function(IdeaShuffleService, $mdDialog) {
  console.log('SelectTopicController created');
  var vm = this;
  vm.userService = IdeaShuffleService;
  vm.userObject = IdeaShuffleService.userObject;
  vm.test = function() {
    console.log('Prompting for new topic');
  };
  vm.showPrompt = function(ev) {
   // Appending dialog to document.body to cover sidenav in docs app
   var confirm = $mdDialog.prompt()
     .title('What is the new topic?')
     .placeholder('Topic Title')
     .ariaLabel('Topic Title')
     .initialValue('Topic')
     .targetEvent(ev)
     .ok('Create')
     .cancel('Cancel');

   $mdDialog.show(confirm).then(function(result) {
     console.log('Created a new topic');
   }, function() {
     console.log('Canceled creating a new topic');
   });
 };
});
