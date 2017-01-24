//--------------wrapper for responsive chart creation
(function displayExperience( data ) {
  //////////////////////////////////////////////
  // Chart Config /////////////////////////////
  //////////////////////////////////////////////

  // Define the div for the tooltip
  let tooltipDiv = d3.select("div#gannt").append("div") 
      .attr("class", "tooltip")       
      .style("opacity", 0);

  // Set the dimensions of the canvas / graph
  var margin      = {top: 30, right: 20, bottom: 30, left: 100},
  		width,      // width gets defined below
      height      = 450 - margin.top - margin.bottom;

  // Set the scales ranges
  var xScale      = d3.scaleTime(),
      yScale      = d3.scaleBand().rangeRound([0, height]),
      colorScale  = d3.scaleSequential(d3.interpolatePuBuGn);

  // Define the axes
  var xAxis       = d3.axisBottom().scale( xScale ),
      yAxis       = d3.axisLeft().scale( yScale )
                      .tickSizeOuter(0),
      minDate     = d3.min(data, function(d) { return d.TimeStart.toDate(); });

  // Add the svg canvas
  var svg = d3.select("div#gannt")
      .append("svg")
  		.attr("height", height + margin.top + margin.bottom);

  // set the domain range from the data
  xScale.domain([
		minDate,
		d3.max(data, function(d) { return d.TimeEnd.toDate(); })
	]);
  yScale.domain(data.map(function (d) { return d.Role; }));
  colorScale.domain([-1, d3.max(data, function(d, i) { return i; })]);

  // create element for where elements will be drawn
  var artboard = svg.append("g")
    // .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // .attr("transform", "translate(0," + margin.top + ")");

  // Add the X Axis
  var xAxisEl = artboard.append("g")
    .attr("class","xAxis gantt")
    .attr("transform", "translate(0," + height + ")");

  // Add the Y Axis
  // we aren't resizing height in this demo so the yAxis stays static, we don't need to call this every resize
  var yAxisEl = artboard.append("g")
    .attr("class","yAxis gantt")
    .call(yAxis);

  //Create bars
  var bars = svg.append("g")
     .attr("id", "bars")
     .attr("transform", "translate(0," + (margin.top+margin.bottom) + ")")
     .selectAll("rect")
     .data( data )
     .enter()
     .append("svg:a")
     .attr("xlink:href", function(d){return '#divDetails_'+d.RoleID;})
     .append("rect")
     .attr("x", function (d) {
       return xScale(minDate);
     })
     .attr("y", function(d) {
       return yScale(d.Role);
     })
     .attr('width', 0)
     .attr('height', (height * .115))
     .attr('fill', function (d, i) {
       return colorScale(i);
     })
    .style("stroke", 'black')
    .style("stroke-width", 0.25)
    // add tooltips to each bar
    .on("mouseover", tooltipStart)          
    .on("mouseout", tooltipEnd);



  function tooltipStart(d) {
    // create transitions for tooltip
    tooltipDiv.transition()
      .duration(200)
      .style("opacity", .9);
    tooltipDiv .html( d.Role+ " at " + d.Firm + " from " + d.TimeStart.format("MMM YYYY") + ' to ' + d.TimeEnd.format("MMM YYYY"))
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY - 28) + "px");
  }

  function tooltipEnd(d) {
    //hide tooltip
    tooltipDiv.transition()
      .duration(500)
      .style("opacity", 0);
  }

  // call this once to draw the chart initially
  drawChart();

  //////////////////////////////////////////////
  // Drawing ///////////////////////////////////
  //////////////////////////////////////////////
  function drawChart() {

    // reset the width
    divWidth      = parseInt(d3.select("div#gannt").style('width'), 10),
      margin.left = divWidth <= 480 ? 0 : 100,
      margin.top  = divWidth <= 480 ? 0 : 30,
      width       = divWidth - margin.left - margin.right;

    artboard.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    // set the svg dimensions
    svg.attr("width", width + margin.left + margin.right);

    // Set new range for xScale
    xScale.range([0, width]);

    // give the x axis the resized scale
    xAxis.scale(xScale);

    // draw the new xAxis
    xAxisEl.call(xAxis);

    // create transition
    var t = d3.transition()
      .duration(1500)
      .ease(d3.easeLinear);

    //Create bars
    bars.attr("transform", "translate(" + margin.left + "," + (margin.top-30) + ")")
      .transition(t)
        .delay(function(d, i) { return i * 500; })
        .attr("x", function (d) {
           return xScale(d.TimeStart.toDate());
         })
        .attr('width', function(d){
           var taskDuration = moment(moment(d.TimeStart).diff(minDate));
           var barLength = moment(d.TimeEnd.diff(taskDuration));
           return xScale(barLength.toDate());
        })
     ;

    yAxisEl.selectAll(".tick text")
          // .call(wrap, (margin.left * 0.9))
          ;

    //change xaxis and translations if width below "small" screen size breakpoint
    yAxisEl.transition(t)
      .style("opacity",(width<=480 ? 0 : 1))

  }



  //////////////////////////////////////////////
  // Resizing //////////////////////////////////
  //////////////////////////////////////////////

  // redraw chart on resize
  // APP.onResize(drawChart);
}


// // Create APP container with debounce function so resize is not called excessively
// var APP = (function () {

//   // Debounce is a private function
// 	function debounce(func, wait, immediate) {
// 		var timeout;
// 		return function() {
// 			var context = this, args = arguments;
// 			clearTimeout(timeout);
// 			timeout = setTimeout(function() {
// 				timeout = null;
// 				if (!immediate) func.apply(context, args);
// 			}, wait);
// 			if (immediate && !timeout) func.apply(context, args);
// 		};
// 	}

//   // onResize function is made public
// 	var me = {onResize : function(callback) {
// 		callback(); // optionally execute callback func imediatly

//     window.addEventListener('resize', debounce(function() {
//       callback();
//     }, 60), false);
// 	}};

//   // returns the me object that has all the public functions in it
// 	return me;
// })();

// //function to wrap text for axis
// function wrap(text, width) {
//   text.each(function() {
//     var text = d3.select(this),
//         words = text.text().split(/\s+/).reverse(),
//         word,
//         line = [],
//         lineNumber = 0,
//         lineHeight = 1.1, // ems
//         y = text.attr("y"),
//         dy = parseFloat(text.attr("dy")),
//         tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
//     while (word = words.pop()) {
//       line.push(word);
//       tspan.text(line.join(" "));
//       if (tspan.node().getComputedTextLength() > width) {
//         line.pop();
//         tspan.text(line.join(" "));
//         line = [word];
//         tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
//       }
//     }
//   });
// }
)();