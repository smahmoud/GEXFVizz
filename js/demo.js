$(function ()  
{ $("#ccHover").popover({title: 'Closeness Centrality', content: "The distance of two nodes is the number of ’steps’ you need to go to get from one node to the other one. Therefore, to get a score for 'closeness', we take the needed distances and add them up. Because we want to get a small value for the metric whenever the distances are high, we use the reciprocal of the summed distances and standardize it by multiplying it with n-1 (n = the number of nodes in this graph)."});  
});

$(function ()  
{ $("#dcHover").popover({title: 'Degree Centrality', 
	content: "The degree centrality of a node illustrates the number of edges which are attached to the node. In order to know the standardized score, we need to divide this value by n-1 (n = the number of nodes in this graph).  "});  
});

$(function ()  
{ $("#bcHover").popover({title: 'Betweenness Centrality', content: "To calculate betweenness centrality, we take every pair of nodes within the network and count how many times a node is placed on the shortest paths between this pair of nodes. After that, we need to divide this value by (n-1)(n-2)/2 (n = the number of nodes in this graph) for standardization."});  
});

var parser;
sigma.publicPrototype.myRandomLayout = function() {
  var W = 100,
      H = 100;
  
  this.iterNodes(function(n){
    n.x = W*Math.random();
    n.y = H*Math.random();
  });

  return this.position(0,0,1).draw();
};

sigma.publicPrototype.myCircularLayout = function() {
   var R = 100,
       i = 0,
       L = this.getNodesCount();

   this.iterNodes(function(n){
     n.x = Math.cos(Math.PI*(i++)/L)*R;
     n.y = Math.sin(Math.PI*(i++)/L)*R;
   });

   return this.position(0,0,1).draw();
 };

sigma.publicPrototype.myFRLayout = function(iterations) {
	// FR variables
	var area = 800 * 600;
	var temperature = 80;
	var cooldown = temperature/iterations;
	var k = Math.sqrt(area / this.getNodesCount());
	
	// start with random positions
	var W = 100,
      H = 100;

  	this.iterNodes(function(n){
    	n.x = W*Math.random();
    	n.y = H*Math.random();
  	});
	
	// now, calculate FR-algorithm
	function calculateRepulsiveForces(){
		
	}
	
	function cooldown(){
		temperature = temperature - cooldown;

	    if (temperature < cooldown)
	    	temperature = 0;
	}
	
	for(var i=0;i<iterations;i++){
   	//calculateRepulsiveForces();
   	//calculateAttractiveForces();
   	//performDisplacement();
   	//coolDown();
   }

   return this.position(0,0,1).draw();
 };

function findBaseName(url) {
	var external = url.lastIndexOf('%2F');
	var cutURL;
	if(external == -1){
		// local url
		cutURL = url.substring(url.lastIndexOf('/') + 1);
	}else{
		// extern url
		cutURL = url.substring(url.lastIndexOf('%2F') + 3);
	}
 	return cutURL;
}

/* zoom stuff */
$(function() {
  $("#zoomCC").click(function(e) {
    e.preventDefault(); 

	$("#ccBox").zoomTarget();
	
  });
});

$(function() {
  $("#zoomDC").click(function(e) {
    e.preventDefault(); 

	$("#dcBox").zoomTarget();
	
  });
});

$(function() {
  $("#zoomBC").click(function(e) {
    e.preventDefault(); 

	$("#bcBox").zoomTarget();
	
  });
});
/* ---------------------------*/

/* Source of this snippet ? */
function getQueryVariable(variable)
{
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if(pair[0] == variable){return pair[1];}
	}
	return(false);
}
/* --------------------------- */

var show_node_as = getQueryVariable('type'); //node, book or person

function init() {	
	//load meta data
	
	//load graph
  var sigInst = sigma.init($('#sigma-example')[0]).drawingProperties({
    defaultLabelColor: '#fff'
  }).graphProperties({
    minNodeSize: 0.5,
    maxNodeSize: 5
  });
	
	if(getQueryVariable('url') != false){
		parser = sigInst.parseGexf("data/"+findBaseName(getQueryVariable('url')));
	}else{
		var file = "hash/"+getQueryVariable('id')+".gexf";
		parser = sigInst.parseGexf(file);
	}
	
  (function(){
    var popUp;

    function attributesToString(attr) {
      return '<ul>' +
        attr.map(function(o){
          return '<li>' + o.attr + ' : ' + o.val + '</li>';
        }).join('') +
        '</ul>';
    }

    function showNodeInfo(event) {
      popUp && popUp.remove();

      var node;
      sigInst.iterNodes(function(n){
        node = n;
      },[event.content[0]]);
 
      popUp = $(
        '<div class="node-info-popup"></div>'
      ).append(
        attributesToString( node['attr']['attributes'] )
      ).attr(
        'id',
        'node-info'+sigInst.getID()
      ).css({
        'display': 'inline-block',
        'border-radius': 3,
        'padding': 5,
        'background': '#fff',
        'color': '#000',
        'box-shadow': '0 0 4px #666',
        'position': 'absolute',
        'left': node.displayX,
        'top': node.displayY+15
      });

      $('ul',popUp).css('margin','0 0 0 20px');

      $('#sigma-example').append(popUp);
    }

    function hideNodeInfo(event) {
      popUp && popUp.remove();
      popUp = false;
    }

    sigInst.bind('overnodes',showNodeInfo).bind('outnodes',hideNodeInfo).draw();
  })();

	// hide nodes which should not show up at this time
	sigma.publicPrototype.HideWrongTimeNodes = function(value) {
		// update slider
		var tempcurrentDay = slider.getValue();
		slider.setValue(tempcurrentDay + value);
		currentDay = slider.getValue();
		
		// hide nodes
		L = this.getNodesCount();
		
		this.iterNodes(function(n){
		
		var localstartDate 	= n['attr']['startDate']; 
		var localendDate 	= n['attr']['endDate']; 
		
		// how many days ?
		var msecs = Date.parse(mindate);
		var msecs2 = Date.parse(maxdate);
		var diff = msecs2 - msecs;
		var alldays = (((diff / 1000) / 60) / 60) / 24;
		
		// calc diff time
		var relLocalMin = ((((Date.parse(localstartDate) - Date.parse(mindate)) / 1000) / 60) / 60) / 24;
		var relLocalMax = ((((Date.parse(maxdate) - Date.parse(localendDate)) / 1000) / 60) / 60) / 24;
			
		// find hidden nodes
		if(currentDay <= (alldays - relLocalMax) && currentDay >= relLocalMin){
			n.hidden = 0;
		}else{
			n.hidden = 1;
		}
		});
		return this.position(0,0,1).draw();
	};

	document.getElementById('randomlayout').addEventListener('click',function(){
		sigInst.myRandomLayout();
	},true);	
	document.getElementById('circlayout').addEventListener('click',function(){
		sigInst.myCircularLayout();
	},true);
	document.getElementById('frlayout').addEventListener('click',function(){
		sigInst.myFRLayout();
	},true);
	
	// bind the methods to buttons
	var diffdays = (maxdateInt - mindateInt)/1000/60/60/24; // difference of days

	if(diffdays > 365){
		// the graph contains probably years
		document.getElementById('PlayAnimation').addEventListener('click',function(){
			currentDay = slider.getValue();
			setInterval(function(){sigInst.HideWrongTimeNodes(+1)},300);
		},true);
		document.getElementById('Day-').addEventListener('click',function(){
		sigInst.HideWrongTimeNodes(-356);
		},true);
		document.getElementById('Day+').addEventListener('click',function(){
		sigInst.HideWrongTimeNodes(+356);
		},true);
	}else{
		// the graph contains probably days
		document.getElementById('PlayAnimation').addEventListener('click',function(){
			currentDay = slider.getValue();
			setInterval(function(){sigInst.HideWrongTimeNodes(+1)},500);
		},true);
		document.getElementById('Day-').addEventListener('click',function(){
		sigInst.HideWrongTimeNodes(-1);
		},true);
		document.getElementById('Day+').addEventListener('click',function(){
		sigInst.HideWrongTimeNodes(+1);
		},true);
	}
}

// play the animation
function playAnimation(){
	currentDay = slider.getValue();
	setInterval(function(){sigInst.HideWrongTimeNodes(+1)},1000);
}

if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', init, false);
} else {
  window.onload = init;
}