myApp.controller('CurrentTopicController', function(IdeaShuffleService, $http, $mdDialog) {
  console.log('CurrentTopicController created');
  var vm = this;
  vm.userService = IdeaShuffleService;

  vm.userService.getuser();

  vm.getCurrentTopic = function() {
    console.log(vm.userService.userObject.currentTopic);
    $http.get('/topic/categories/' + vm.userService.userObject.currentTopic)
      .then(function(response){
        console.log('Got response from categories GET:', response);
        vm.userService.currentTopicInfo = response;
      });
  };

  // Add a new idea to the current category
  // This will trigger a prompt window where you can first confirm the category.
  vm.addIdea = function(category) {
    console.log('adding idea within', category);
    // Create a dialogue prompt for adding a new idea.
    vm.showIdeaPrompt = function(ev) {
       // Setup the properties for the prompt.
       var confirm = $mdDialog.prompt()
         .title('Got a new idea?')
         .placeholder('Idea Description')
         .ariaLabel('Idea Description')
         .targetEvent(ev)
         .ok('Add')
         .cancel('Cancel');

       // How to respond to the users input to the prompt.
       $mdDialog.show(confirm).then(function(result) {
         // This will run if the user clicks create.
         console.log('Creating a new idea:', result);
         // basic POST request to create a new topic.
         $http.post('/topic/idea/' + result, category).then(function(response){
           console.log('Got response from new topic Post:', response);
           vm.getCurrentTopic();
         });
       }, function() {
         // This will run if the user clicks cancel.
         console.log('Canceled creating a new topic');
       });
    };

    vm.showIdeaPrompt();
  };

  vm.dragControlListeners = {
    // accept: function (sourceItemHandleScope, destSortableScope) {return boolean;}, //override to determine drag is allowed or not. default is true.
    itemMoved: function (event) {
      console.log('in item moved:', vm.userService.currentTopicInfo);
      topic = vm.userService.currentTopicInfo;
      $http.put('/topic/idea/', topic).then(function(response){
        console.log('Updating the database:', response);
        vm.getCurrentTopic();
      });
    },
    orderChanged: function(event) {
      console.log('changing order', vm.userService.currentTopicInfo);
      topic = vm.userService.currentTopicInfo;
      $http.put('/topic/idea/', topic).then(function(response){
        console.log('Updating the database:', response);
        vm.getCurrentTopic();
      });
    },
    containment: '#drag-containment', //optional param.
    clone: false, //optional param for clone feature.
    allowDuplicates: true, //optional param allows duplicates to be dropped.
  };

  vm.getCurrentTopic();

  // Create a dialogue prompt for adding a new category.
  vm.showPrompt = function(ev) {
     // Setup the properties for the prompt.
     var confirm = $mdDialog.prompt()
       .title('What is the new category?')
       .placeholder('Category Name')
       .ariaLabel('Category Name')
       .initialValue('Category')
       .targetEvent(ev)
       .ok('Add')
       .cancel('Cancel');

     // How to respond to the users input to the prompt.
     $mdDialog.show(confirm).then(function(result) {
       // This will run if the user clicks create.
       console.log('Creating a new category:', result);
       // basic POST request to create a new topic.
       $http.post('/topic/category/' + result).then(function(response){
         console.log('Got response from new topic Post:', response);
         vm.getCurrentTopic();
       });
     }, function() {
       // This will run if the user clicks cancel.
       console.log('Canceled creating a new topic');
     });
  };


  // Removes an idea from the db.
  vm.removeIdea = function(idea) {
    $http.delete('/topic/' + idea._id).then(function(response) {
      console.log('got a response on the delete route:', response);
      vm.getCurrentTopic();
    });
  };

  // Removes a category from the db.
  vm.removeCategory = function(category) {
    $http.delete('/topic/category/' + category._id).then(function(response) {
      console.log('got a response on the category delete route:', response);
      vm.getCurrentTopic();
    });
  };

  // Create a dialogue prompt for modifying an idea.
  vm.showModifyIdeaPrompt = function(currentIdea) {
     // Setup the properties for the prompt.
     var confirm = $mdDialog.prompt()
       .title('What would you like to change?')
       .initialValue(currentIdea.idea)
       .ariaLabel('Idea Description')
       .targetEvent(currentIdea)
       .ok('Update')
       .cancel('Cancel');

     // How to respond to the users input to the prompt.
     $mdDialog.show(confirm).then(function(result) {
       // This will run if the user clicks create.
       console.log('Updating an idea:', result);
       // basic POST request to create a new topic.
       $http.put('/topic/idea/' + result, currentIdea).then(function(response){
         console.log('Got response from new topic Post:', response);
         vm.getCurrentTopic();
       });
     }, function() {
       // This will run if the user clicks cancel.
       console.log('Canceled creating a new topic');
     });
  };

  // Create a dialogue prompt for modifying a category.
  vm.showModifyCategoryPrompt = function(currentCategory) {
     // Setup the properties for the prompt.
     var confirm = $mdDialog.prompt()
       .title('What would you like to change?')
       .initialValue(currentCategory.category)
       .ariaLabel('Idea Description')
       .targetEvent(currentCategory)
       .ok('Update')
       .cancel('Cancel');

     // How to respond to the users input to the prompt.
     $mdDialog.show(confirm).then(function(result) {
       // This will run if the user clicks create.
       console.log('Updating an idea:', result);
       // basic POST request to create a new topic.
       $http.put('/topic/category/' + result, currentCategory).then(function(response){
         console.log('Got response from update category PUT:', response);
         vm.getCurrentTopic();
       });
     }, function() {
       // This will run if the user clicks cancel.
       console.log('Canceled creating a new topic');
     });
  };
});
