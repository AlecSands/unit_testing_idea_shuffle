myApp.controller('VisualsController', function(IdeaShuffleService, $http, $mdDialog) {
  console.log('VisualsController created');
  var vm = this;
  vm.userService = IdeaShuffleService;
  vm.userService.getuser();
  console.log(vm.userService);

  vm.getCurrentTopic = function() {
    console.log(vm.userService.userObject.currentTopic);
    $http.get('/topic/categories/' + vm.userService.userObject.currentTopic)
      .then(function(response){
        console.log('Got response from categories GET:', response);
        vm.userService.currentTopicInfo = response;
        vm.svg = "";
        vm.refreshGraph();
      });
  };

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
         $http.post('/topic/idea/visuals/' + result, category).then(function(response){
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

  // D3
  vm.refreshGraph = function() {
      var width = window.innerWidth;
      var height = 600;

      d3.select("#svgElement").remove();


      // Selects the svg element on the DOM and stores it in a variable
      vm.svg = d3.select("#canvasContainer").append("svg").attr("width", width).attr("height", height).attr("id", "svgElement");

      //  Sets the color scale to be used when coloring svg elements
      var color = d3.scaleOrdinal(d3.schemeCategory20);

      // Sets the parameters that control the characteristics of the FDG
      var simulation = d3.forceSimulation()
          //
          .force("link", d3.forceLink().id(function(d) { return d.id; }))
          // Sets the strength of the force which pushes dots apart
          .force("charge", d3.forceManyBody().strength(-100))
          // Sets the center of gravity for the graph
          .force("center", d3.forceCenter(width / 2, height / 2));

      // This function calls the server with a GET request and returns an object into
      // the graph parameter
      d3.json('visuals/' + vm.userService.userObject.currentTopic, function(error, graph) {

        if (error) throw error;

        // Appends a group to the svg with all of the links as line elements,
        // using data from graph.links
        var link = vm.svg.append("g")
            // sets a class for the g element to 'links'
            .attr("class", "links")
          .selectAll("line")
          .data(graph.links)
          .enter().append("line")
            .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

        var node = vm.svg.append("g")
            .attr("class", "nodes")
          .selectAll("circle")
          .data(graph.nodes)
          .enter().append("circle")
            // Adds a class to each node
            .attr("class", function(d) {return '"' + d.group + '"'; })
            // Sets the radius of each node
            .attr("r", 5)
            // Sets the color of each node based on its group
            .attr("fill", function(d) { if (d.group == 'complete') {
              return "#d3d3d3";
            } if (d.group == 'notComplete') {
              return "red";
            } else {return color(d.group);} })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        node.append("title")
            .text(function(d) {
              return d.id;
            });


        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links);

        function ticked() {
          link
              .attr("x1", function(d) { return d.source.x; })
              .attr("y1", function(d) { return d.source.y; })
              .attr("x2", function(d) { return d.target.x; })
              .attr("y2", function(d) { return d.target.y; });

          node
              .attr("cx", function(d) { return d.x; })
              .attr("cy", function(d) { return d.y; });
        }

        function dragstarted(d) {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }

        function dragged(d) {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        }

        function dragended(d) {
          if (!d3.event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
          console.log('inside of drag ended on:', d);
          vm.addIdea(d);
        }
      });
    };

    vm.refreshGraph();

});
