myApp.controller('CurrentTopicController', function(IdeaShuffleService) {
  console.log('CurrentTopicController created');
  var vm = this;
  vm.userService = IdeaShuffleService;

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
});
