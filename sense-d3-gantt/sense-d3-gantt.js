define( ["qlik"
		,"jquery"
		, "text!./style.css"
		, "text!./template.html"
		// , "./assets/js/drawchart"
		,'//d3js.org/d3.v4.min.js'
		,'require'
		,'https://momentjs.com/downloads/moment.js'
		// ,'https://d3js.org/d3-scale-chromatic.v1.min.js'
		], 
	function (qlik, $, cssContent, template, /*displayExperience,*/ d3, localRequire, moment) {


//------------------------Temporarily include data for extension validation
var path = localRequire.toUrl( "extensions/sense-d3-gantt/assets/data/profile.csv" );


	'use strict';
    $("<style>").html(cssContent).appendTo("head");


function displayExperience( data ) {
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
      // colorScale(i)
       return 'black';
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


	return {
       template: template,
       initialProperties : {
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 10,
					qHeight : 50
				}]
			}
		},
		definition : {
			type : "items",
			component : "accordion",
			items : {
				dimensions : {
					uses : "dimensions",
					min : 1
				},
				measures : {
					uses : "measures",
					min : 0
				},
				sorting : {
					uses : "sorting"
				},
				settings : {
					uses : "settings",
					items : {
						initFetchRows : {
							ref : "qHyperCubeDef.qInitialDataFetch.0.qHeight",
							label : "Initial fetch rows",
							type : "number",
							defaultValue : 50
						}
					}
				}
			}
		},
		support : {
			snapshot: true,
			export: true,
			exportData : true
		},
		paint: function ( $element, layout ) {



			d3.csv(path, function ( d ) {
				console.log('csv data', d);

				// initialize storage arrays
				var roleIDArr = [], jobLvlData = [], skillsData = [];
				data = d.map(function (inner_d) {
				    //initialize profiletext counter

				    // Only get rows with experience data
				    if (inner_d.Type=='Experience') {

				      // Create an array of objects with only the length, experience, company, and role type
				      // Check if the role ID does not exist in the array yet
				      // If it is not been found yet, store it in an array, create a list group box and store the first desc
				      if ($.inArray(+inner_d.RoleID, roleIDArr) == -1) {
				        //add the role to the array t
				        roleIDArr.push(+inner_d.RoleID);
				        var indivJob = {
				          'Firm'      : inner_d.Firm,
				          'Location'  : inner_d.Location,
				          'Role'      : inner_d.Role,
				          'RoleID'    : +inner_d.RoleID,
				          'TimeStart' : moment(inner_d.TimeStart, "YY-MMM"),
				          'TimeEnd'   : inner_d.TimeEnd ? moment(inner_d.TimeEnd, "YY-MMM") : moment()
				        }

				        jobLvlData.push(indivJob);
				    	}
					}
				});

				console.log('jobdata', jobLvlData);

//will eventually want to pass div id for selector as well

				displayExperience(jobLvlData);

			});

			//setup scope.table
			if ( !this.$scope.table ) {
				this.$scope.table = qlik.table( this );
			}
			return qlik.Promise.resolve();
		},
		controller: ['$scope', function (/*$scope*/) {
		}]
	};

} );
