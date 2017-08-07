myApp.controller('SelectTopicController', function(IdeaShuffleService, $mdDialog, $http) {
  console.log('SelectTopicController created');
  var vm = this;
  // Loads the service into the controller.
  vm.userService = IdeaShuffleService;
  vm.userObject = IdeaShuffleService.userObject;
  vm.test = function() {
    console.log('Prompting for new topic');
  };

  // This array for getting topings from the db.
  vm.topics = ['Lord of the Rings', 'Endless Space', 'Nature walks'];

  // Get topics from the db.
  vm.getTopics = function() {
      console.log('Getting topics from the db');
      $http.get('/topic').then(function(response){
        console.log('Got response from topics GET:', response);
      });
  };

  // Create a dialogue prompt for creating a new topic.
  vm.showPrompt = function(ev) {
     // Setup the properties for the prompt.
     var confirm = $mdDialog.prompt()
       .title('What is the new topic?')
       .placeholder('Topic Title')
       .ariaLabel('Topic Title')
       .initialValue('Topic')
       .targetEvent(ev)
       .ok('Create')
       .cancel('Cancel');

     // How to respond to the users input to the prompt.
     $mdDialog.show(confirm).then(function(result) {
       // This will run if the user clicks create.
       console.log('Creating a new topic:', result);
       // basic POST request to create a new topic.
       $http.post('/topic/create/' + result).then(function(response){
         console.log('Got response from new topic Post:', response);
       });
     }, function() {
       // This will run if the user clicks cancel.
       console.log('Canceled creating a new topic');
     });
  };

  vm.getTopics();
});
