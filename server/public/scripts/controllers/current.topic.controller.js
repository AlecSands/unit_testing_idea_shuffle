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

  vm.dragControlListeners = {
    // accept: function (sourceItemHandleScope, destSortableScope) {return boolean;}, //override to determine drag is allowed or not. default is true.
    itemMoved: function (event) {
      console.log('in item moved:', vm.categories1, vm.categories2);
    },
    orderChanged: function(event) {
      console.log('changing order', vm.categories1, vm.categories2);
    },
    containment: '#drag-containment', //optional param.
    clone: false, //optional param for clone feature.
    allowDuplicates: true, //optional param allows duplicates to be dropped.
  };

  vm.categories1 = ['test1', 'test2', 'test with longer text'];
  vm.categories2 = ['test with some stuff', 'testing', 'test with longer text for fun'];

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
});
