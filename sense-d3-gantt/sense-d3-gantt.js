define( ["qlik"
		,"jquery"
		, "text!./style.css"
		, "text!./template.html"
		,'//d3js.org/d3.v4.min.js'
		,'require'
		,'https://momentjs.com/downloads/moment.js'
		,'./bower_components/QlikSenseD3Utils/senseD3utils'
		// ,'https://d3js.org/d3-scale-chromatic.v1.min.js'
		], 
	function (qlik, $, cssContent, template, d3, localRequire, moment) {

	// 'use strict';
    $("<style>").html(cssContent).appendTo("head");


function displayExperience( data ) {
  //////////////////////////////////////////////
  // Chart Config /////////////////////////////
  //////////////////////////////////////////////

  // Define the div for the tooltip
  let tooltipDiv = d3.select("div#gantt").append("div") 
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
  var svg = d3.select("div#gantt")
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
    tooltipDiv .html( d.Role+ " from " + d.TimeStart.format("MMM YYYY") + ' to ' + d.TimeEnd.format("MMM YYYY"))
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
    divWidth      = parseInt(d3.select("div#gantt").style('width'), 10),
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
					min : 1,
					max : 1,
					items : {
						ColorProp : {
							type			: "string",
							label 			: "Color Expression",
							ref 			: "qAttributeExpressions.0.qExpression",
							expression 		: "always",
							defaultValue	: ""
						}
					}
				},
				//MAX(IF([Project Start Date]<>'NA',[Project End Date]-[Project Start Date],0))
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

			app_this = this;

			// set layout variable to create id used to set the div id
			this.$scope.id= layout.qInfo.qId;

			// set layout variables for panel display show/hide
			this.$scope.$watch("layout", function (newVal, oldVal) {
				// let calcCondition = ((layout.properties.mapData.calculationConditionToggle==true && layout.properties.mapData.calculationCondition==-1) || layout.properties.mapData.calculationConditionToggle!=true) ? -1 : 0,
				// 	calcConditionMsg = (layout.properties.mapData.calculationConditionMessage === "" || layout.properties.mapData.calculationConditionMessage === null)? "Calculation condition unfulfilled" : layout.properties.mapData.calculationConditionMessage;

				// app_this.$scope.vars = {
				// 	panelDisplay		: layout.properties.p2pConfig.drivingModeConfig.mapPanelBool,
				// 	calcCondition 		: calcCondition,
				// 	calcConditionStmt	: calcConditionMsg
				// };

				//set flag to re-render below anytime preferences are changed
				this.painted = false;

			});

			//control initialization to only paint once
			if(this.painted) return;  
			this.painted = true;
//-------------------------------------------------------------------------Reference chart by ID
			$('div#gantt').empty();

			let numOfDims 	= senseD3.findNumOfDims(layout),
				ganttData	= senseD3.createJSONObj(layout, numOfDims);


			data = ganttData.map(function (inner_d) {
				// Create an array of objects with only the length, experience, company, and role type
				var indivJob = {
				  'Role'      : inner_d.dim_0,
				  'RoleID'    : +inner_d.id,
				  'TimeStart' : moment(inner_d.dim_1, "M/D/YYYY"),
				  'TimeEnd'   : moment(inner_d.dim_1, "M/D/YYYY").add(+inner_d.meas_0, 'days')
				}

				return indivJob;
			});
console.log('cleaned data', data);


//will eventually want to pass div id for selector as well
			displayExperience(data);

//-----------------------------------Delete this section after above is raring to go! setup scope.table
			if ( !this.$scope.table ) {
				this.$scope.table = qlik.table( this );
			}

console.log('$scope', this.$scope);

			return qlik.Promise.resolve();
		},
		controller: ['$scope', function (/*$scope*/) {
		}]
	};

} );
