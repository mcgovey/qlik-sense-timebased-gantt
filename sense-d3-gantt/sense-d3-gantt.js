define( ["qlik"
		,"jquery"
		,"./assets/js/properties"
		,"./assets/js/colorPalettes"
		, "text!./style.css"
		, "text!./template.html"
		,'//d3js.org/d3.v4.min.js'
		,'require'
		,'https://momentjs.com/downloads/moment.js'
		,'./bower_components/QlikSenseD3Utils/senseD3utils'
		// ,'https://d3js.org/d3-scale-chromatic.v1.min.js'
		], 
	function (qlik, $, props, colorPalette, cssContent, template, d3, localRequire, moment) {

	// 'use strict';
    $("<style>").html(cssContent).appendTo("head");

function createXScale( data ) {
//////////////////////////////////////////////
// Create xScale component ///////////////////
//////////////////////////////////////////////
	let xScale 	= d3.scaleTime()
					.domain([
						d3.min(data, function(d) { return d.TimeStart.toDate(); }),
						d3.max(data, function(d) { return d.TimeEnd.toDate(); })
					]);

	return xScale;
}

function createYScale( data, height ) {
//////////////////////////////////////////////
// Create yScale component ///////////////////
//////////////////////////////////////////////
	let yScale 	= d3.scaleBand().rangeRound([0, height])
					.domain(data.map(function (d) { return d.Dim; }));

	return yScale;
}

function resizeChart( data ) {
//////////////////////////////////////////////
// Draw key size-based element ///////////////
//////////////////////////////////////////////

	//create selector vars
	let chart 		= d3.select("div#gantt"),
		svg 		= chart.select('svg'),
		artboard 	= svg.select('g.axisBoard'),
		bars		= svg.selectAll('g#bars > rect'),
		xAxisEl		= artboard.select('g.xAxis.gantt'),
		yAxisEl		= artboard.select('g.yAxis.gantt');

	// create dynamic sizing
		divWidth 		= parseInt(chart.style('width'), 10),
		divHeight		= parseInt(chart.style('height'), 10),
		margin 			= {right: 20, bottom: 30},
		margin.left 	= divWidth <= 480 ? 0 : 100,
		margin.top 		= divWidth <= 480 ? 0 : 30,
		width 			= divWidth - margin.left - margin.right,
		height 			= divHeight - margin.top - margin.bottom;

	// set data related vars
	let xScale 		= createXScale( data ),
		yScale 		= createYScale( data, height ),
		minDate		= d3.min(data, function(d) { return d.TimeStart.toDate(); }),
		xAxis       = d3.axisBottom().scale( xScale ),
		yAxis       = d3.axisLeft().scale( yScale )
                      .tickSizeOuter(0);

	// translate g inside svg for axis container
	artboard.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

	// set the svg dimensions
	svg.attr("width", divWidth)
		.attr("height", divHeight);

	// Set new range for xScale
	xScale.range([0, width]);

	// give the x axis the resized scale
	xAxis.scale(xScale);

	// draw the new xAxis
	xAxisEl.call(xAxis);

	//Create bars
	bars.attr("transform", "translate(" + margin.left + "," + (margin.top-30) + ")")
		.transition()
			.duration(200)
//=====================================================================
//Replace with dynamic bar size based on number of bars
//=====================================================================
     		.attr('height', (height * .115))
			.attr("y", function(d) {
				return yScale(d.Dim);
			})
		.transition()
			.duration(1000)
			.ease(d3.easeLinear)
			.delay(function(d, i) { return i * 500; })
			.attr("x", function (d) {
			 	return xScale(d.TimeStart.toDate());
			 })
			.attr('width', function(d){
				let taskDuration = moment(moment(d.TimeStart).diff(minDate));
				let barLength = moment(d.TimeEnd.diff(taskDuration));
				return xScale(barLength.toDate());
			})
		;

	// yAxisEl.selectAll(".tick text")
	//       // .call(wrap, (margin.left * 0.9))
	//       ;

	// change xAxis positioning
	xAxisEl.attr("transform", "translate(0," + height + ")");

	//change yaxis and hide if width below "small" screen size breakpoint
	yAxisEl.call(yAxis)
		.transition()
			.duration(1000)
			.ease(d3.easeLinear)
			.style("opacity",(width<=480 ? 0 : 1))

}

function barSelector( selections, api ) {
//////////////////////////////////////////////
// Create bar selection component ////////////
//////////////////////////////////////////////
	//create selector vars
	let chart 		= d3.select("div#gantt"),
		svg 		= chart.select('svg'),
		artboard 	= svg.select('g.axisBoard'),
		bars		= svg.selectAll('g#bars > rect');

	//add click event
	bars.on("click",function (d) {
console.log('clicked element', d, 'api', api);
		// selections.selectedValue
		api.selectValues(0, [d.ID], true);
    });

	return selections;
}

function displayExperience( data, api ) {

	//////////////////////////////////////////////
	// Chart Config /////////////////////////////
	//////////////////////////////////////////////
	let chart = d3.select("div#gantt");

	// Define the div for the tooltip
	let tooltipDiv = chart.append("div") 
	.attr("class", "tooltip")       
	.style("opacity", 0);

	// Set the dimensions of the canvas / graph
	var margin      = {top: 30, right: 20, bottom: 30, left: 100},
		width,      // width gets defined below
		height      = 450 - margin.top - margin.bottom;

	// Set the scales ranges
	var xScale 	= createXScale( data ), //d3.scaleTime(),
		yScale 		= d3.scaleBand().rangeRound([0, height]),
		colorScale 	= d3.scaleSequential(d3.interpolatePuBuGn);

	// Define the axes
	var xAxis 	= d3.axisBottom().scale( xScale ),
	yAxis 		= d3.axisLeft().scale( yScale )
					.tickSizeOuter(0),
	minDate 	= d3.min(data, function(d) { return d.TimeStart.toDate(); });

	// Add the svg canvas
	var svg = chart
		.append("svg");

 	// set the domain range for colors from the data
	yScale.domain(data.map(function (d) { return d.Dim; }));
	colorScale.domain([-1, d3.max(data, function(d, i) { return i; })]);

  // create element for where elements will be drawn
  var artboard = svg.append("g")
  	.classed('axisBoard', true);

  // Add the X Axis
  var xAxisEl = artboard.append("g")
    .attr("class","xAxis gantt")
    ;

  // Add the Y Axis
  var yAxisEl = artboard.append("g")
    .attr("class","yAxis gantt");

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
       return yScale(d.Dim);
     })
     .attr('width', 0)
     .attr('height', (height * .115))
     .attr('fill', function (d, i) {
      // colorScale(i)
       return d.Color;
     })
    .style("stroke", 'black')
    .style("stroke-width", 0.25)
    // add tooltips to each bar
    .on("mouseover", tooltipStart)          
    .on("mouseout", tooltipEnd)
    ;



  function tooltipStart(d) {
    // create transitions for tooltip
    tooltipDiv.transition()
      .duration(200)
      .style("opacity", .9);
    tooltipDiv .html( d.Dim+ " from " + d.TimeStart.format("MMM YYYY") + ' to ' + d.TimeEnd.format("MMM YYYY"))
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY - 28) + "px");
  }

  function tooltipEnd(d) {
    //hide tooltip
    tooltipDiv.transition()
      .duration(500)
      .style("opacity", 0);
  }

  // call function to call components based on size
  resizeChart( data );

}
// var palette = [
// 	"#b0afae",
// 	"#7b7a78",
// 	"#545352",
// 	"#4477aa",
// 	"#7db8da",
// 	"#b6d7ea",
// 	"#46c646",
// 	"#f93f17",
// 	"#ffcf02",
// 	"#276e27",
// 	"#ffffff",
// 	"#000000"
// ];

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
		definition : props,
		// definition : {
		// 	type : "items",
		// 	component : "accordion",
		// 	items : {
		// 		dimensions : {
		// 			uses : "dimensions",
		// 			min : 1
		// 		},
		// 		measures : {
		// 			uses : "measures",
		// 			min : 1,
		// 			max : 1,
		// 			items: {
		// 				colorType: {
		// 					ref: "qDef.colorType",
		// 					label: "Color Format",
		// 					type: "string",
		// 					component: "dropdown",
		// 					options: 
		// 						[{
		// 							value: "singleColor",
		// 							label: "Single Color"
		// 						}, 
		// 						{
		// 							value: "useStatus",
		// 							label: "Color by Expression"
		// 						}]
		// 				},
		// 				color: {
		// 					ref 		: "qAttributeExpressions.0.qExpression",
		// 					label 		: "Status Colors",
		// 					type 		: "string",
		// 					expression 	: "optional",
		// 					defaultValue: "",
		// 					show		: function(data) {
		// 						return data.qDef.colorType == "useStatus";
		// 					}
		// 				},
		// 				singleColor: {
		// 					ref 		: "qDef.singleColorVal",
		// 					label 		: "Bar color",
		// 					component 	: "color-picker",
		// 					type 		: "integer",
		// 					defaultValue: 3,
		// 					show 		: function(data) {
		// 						return data.qDef.colorType == "singleColor";
		// 					}
		// 				},
		// 			}
		// 		},
		// 		sorting : {
		// 			uses : "sorting"
		// 		},
		// 		settings : {
		// 			uses : "settings",
		// 			items : {
		// 				initFetchRows : {
		// 					ref : "qHyperCubeDef.qInitialDataFetch.0.qHeight",
		// 					label : "Initial fetch rows",
		// 					type : "number",
		// 					defaultValue : 50
		// 				}
		// 			}
		// 		}
		// 	}
		// },
		support : {
			snapshot: true,
			export: true,
			exportData : true
		},
		resize: function (layout) {
			let data = this.$scope.data;

			resizeChart( data );
		},
		paint: function ( $element, layout ) {

			app_this = this;

			// set layout variable to create id used to set the div id
			app_this.$scope.id= layout.qInfo.qId;

			// set layout variables for panel display show/hide
			app_this.$scope.$watch("layout", function (newVal, oldVal) {
				// let calcCondition = ((layout.properties.mapData.calculationConditionToggle==true && layout.properties.mapData.calculationCondition==-1) || layout.properties.mapData.calculationConditionToggle!=true) ? -1 : 0,
				// 	calcConditionMsg = (layout.properties.mapData.calculationConditionMessage === "" || layout.properties.mapData.calculationConditionMessage === null)? "Calculation condition unfulfilled" : layout.properties.mapData.calculationConditionMessage;

				// app_this.$scope.vars = {
				// 	panelDisplay		: layout.properties.p2pConfig.drivingModeConfig.mapPanelBool,
				// 	calcCondition 		: calcCondition,
				// 	calcConditionStmt	: calcConditionMsg
				// };

				//set flag to re-render below anytime preferences are changed
				app_this.painted = false;

			});

			//control initialization to only paint once
			if(app_this.painted) return;  
			app_this.painted = true;

//=======================================================================================
//Reference chart by ID
//=======================================================================================
			$('div#gantt').empty();

			let numOfDims 	= senseD3.findNumOfDims(layout),
				ganttData	= senseD3.createJSONObj(layout, numOfDims);

			let colorType		= layout.qHyperCube.qMeasureInfo[0].colorType,
				//get the value selected in props and find the associated value in the palette array
				singleColorVal 	= colorPalette.singlePalette[layout.qHyperCube.qMeasureInfo[0].singleColorVal],
				// get scale selected from property
				selectedScaleObj	= colorPalette.scales[layout.qHyperCube.qMeasureInfo[0].scaleColorVal],
				// create an array of scale keys
				selectedScaleKeys 	= Object.keys(selectedScaleObj),
				// max scale
				selectedScaleMax  	= (selectedScaleKeys.length+2),
				// get the max if the values in the range are more than the values in the dropdown selected
				selectedScale = selectedScaleObj[layout.qHyperCube.qMeasureInfo[0].numOfColorVals > selectedScaleMax ? selectedScaleMax : layout.qHyperCube.qMeasureInfo[0].numOfColorVals]
				;

// console.log('selected scale', selectedScale, 'keys', selectedScaleKeys, 'max', selectedScaleMax);

			data = ganttData.map(function (inner_d) {
				let dynamicColorVals;
				// set the color variable based on properties
				if (colorType=='singleColor') {
					dynamicColorVals = singleColorVal;
				} else if (colorType=='useStatus' && layout.qHyperCube.qMeasureInfo[0].colorCodeBool) {
					//check type to see if rgb passed
					dynamicColorVals = typeof(inner_d.meas_0_color)=='number' ? '#' + Number(inner_d.meas_0_color).toString(16).substring(2) : inner_d.meas_0_color;
				} else if (colorType=='useStatus' && !layout.qHyperCube.qMeasureInfo[0].colorCodeBool) {
					//use mod to repeat colors if scale is smaller than value shown
					dynamicColorVals = selectedScale[inner_d.meas_0_color % selectedScale.length];
				} else if (colorType=='colorByDim') {
					//use mod to repeat colors if scale is smaller than value shown
					dynamicColorVals = selectedScale[inner_d.id % selectedScale.length];
				} else {
					dynamicColorVals = '#000000';
				};
				// Create an array of objects with only the dimension, id, start, end, and color
				var indivJob = {
				  'Dim'			: inner_d.dim_0 || 'N/A',
				  'ID'			: inner_d.id || 0,
				  'TimeStart'	: inner_d.dim_1 ? moment(inner_d.dim_1, "M/D/YYYY") : moment(),
				  'TimeEnd'		: inner_d.dim_1 ? moment(inner_d.dim_1, "M/D/YYYY").add(+inner_d.meas_0, 'days') : moment().add(1,'w'),
				  'Color'		: dynamicColorVals
				};
				return indivJob;
			});
// console.log('data struc', layout);

			app_this.$scope.data = data;
console.log('cleaned data', data);


//=======================================================================================
// will eventually want to pass div id for selector as well
//=======================================================================================
			displayExperience( data );

			app_this.selections = barSelector( app_this.selections, this.backendApi );

//=======================================================================================
//Delete this section after above is raring to go!
//=======================================================================================
			if ( !app_this.$scope.table ) {
				app_this.$scope.table = qlik.table( this );
			}

// console.log('table cleaner', senseD3.createJSONObj( app_this.$scope.table ));
console.log('$scope', app_this.$scope);

			return qlik.Promise.resolve();
		},
		controller: ['$scope', function (/*$scope*/) {
		}]
	};

} );
