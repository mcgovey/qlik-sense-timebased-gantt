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
					.domain(data.map(function (d) { return d.Dim; }))
					.round(true)
					.padding(.1)
					;

	return yScale;
}

function resizeChart( data, chartID ) {
//////////////////////////////////////////////
// Draw key size-based element ///////////////
//////////////////////////////////////////////

	//create selector vars
	let chart 		= d3.select('div#gantt_' + chartID),
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
	xAxisEl.call(xAxis)
		.transition()
			.duration(1000)
			.ease(d3.easeLinear)
			.style("opacity",(width<=480 ? 0 : 1));

	//Create bars
	bars.attr("transform", "translate(" + margin.left + "," + (margin.top) + ")")
		.transition()
			.duration(200)
     		.attr('height', yScale.bandwidth())
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
			.attr('rx', width*.01)
			.attr('ry', width*.01)
			.attr('width', function(d){
				let taskDuration = moment(moment(d.TimeStart).diff(minDate));
				let barLength = moment(d.TimeEnd.diff(taskDuration));
				return xScale(barLength.toDate());
			})
		;

	// change xAxis positioning
	xAxisEl.attr("transform", "translate(0," + height + ")");

	//change yaxis and hide if width below "small" screen size breakpoint
	yAxisEl.call(yAxis)
		.transition()
			.duration(1000)
			.ease(d3.easeLinear)
			.style("opacity",(width<=480 ? 0 : 1));

	yAxisEl.selectAll(".tick text")
		.call(axisTextWrap, (margin.left * 0.9))
		;

}

function barSelector( selections, api, chartID ) {
//////////////////////////////////////////////
// Create bar selection component ////////////
//////////////////////////////////////////////
	//create selector vars
	let chart 		= d3.select('div#gantt_' + chartID),
		svg 		= chart.select('svg'),
		artboard 	= svg.select('g.axisBoard'),
		bars		= svg.selectAll('g#bars > rect');

	//add click event
	bars.on("click",function (d) {
		// selections.selectedValue
		api.selectValues(0, [d.ID], true);
    });

	return selections;
}

function displayExperience( data, chartID ) {

	//////////////////////////////////////////////
	// Chart Config /////////////////////////////
	//////////////////////////////////////////////
	let chart = d3.select('div#gantt_' + chartID)
		.classed('container', true);

	// Define the div for the tooltip
	let tooltipDiv = chart.append("div") 
	.attr("class", "tooltip")       
	.style("opacity", 0);

	// Set the scales ranges
	var xScale 	= createXScale( data ), //d3.scaleTime(),
		// yScale 		= d3.scaleBand().rangeRound([0, height]),
		colorScale 	= d3.scaleSequential(d3.interpolatePuBuGn);

	// Define the axes
	var xAxis 	= d3.axisBottom().scale( xScale ),
	minDate 	= d3.min(data, function(d) { return d.TimeStart.toDate(); });

	// Add the svg canvas
	var svg = chart
		.append("svg");

 	// set the domain range for colors from the data
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
     .attr("transform", "translate(0,0)")//," + (margin.top+margin.bottom) + ")")
     .selectAll("rect")
     .data( data )
     .enter()
     .append("rect")
     .attr("x", function (d) {
       return xScale(minDate);
     })
     .attr('y', 0)
     .attr('width', 0)
     .attr('height', 0)
     .attr('fill', function (d, i) {
       return d.Color;
     })
    .style("stroke", 'black')
    .style("stroke-width", 0.25)
    // add tooltips to each bar
    .on("mouseover", tooltipStart)          
    .on("mouseout", tooltipEnd)
    ;

	 function tooltipStart(d, i, bars) {
		let bar				= $(bars[i])
			topBar 			= bar.offset().top,
			divParent		= bar.closest('.container'),
			topDivParent	= divParent.offset().top;
		
		// create transitions for tooltip
		tooltipDiv.transition()
		.duration(200)
		.style("opacity", .9);
		tooltipDiv .html( d.Dim+ " from " + d.TimeStart.format("MMM YYYY") + ' to ' + d.TimeEnd.format("MMM YYYY"))
		.style("left", (d3.event.pageX) + "px")
		.style("top", (topBar - topDivParent- 28) + "px");

	 }

	function tooltipEnd(d) {
		//hide tooltip
		tooltipDiv.transition()
			.duration(500)
			.style("opacity", 0);
	}

	// call function to call components based on size
	resizeChart( data, chartID );

}

//function to wrap text for axis
function axisTextWrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
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
		definition : props,
		support : {
			snapshot: true,
			export: true,
			exportData : true
		},
		resize: function ($element, layout) {
			let data = this.$scope.data,
				chartID = layout.qInfo.qId;

			resizeChart( data, chartID );
		},
		paint: function ( $element, layout ) {

			app_this = this;
			let chartID = layout.qInfo.qId;

			// set layout variable to create id used to set the div id
			app_this.$scope.id= chartID;

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

			$('div#gantt_' + chartID).empty();

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

			data = ganttData.map(function (inner_d) {
				let dynamicColorVals;
				// set the color variable based on properties
				if (colorType=='singleColor') {
					dynamicColorVals = singleColorVal;
				} else if (colorType=='useStatus' && layout.qHyperCube.qMeasureInfo[0].colorCodeBool) {
					//check type to see if rgb passed
					dynamicColorVals = typeof(inner_d.meas_0_attr_0)=='number' ? '#' + Number(inner_d.meas_0_attr_0).toString(16).substring(2) : inner_d.meas_0_attr_0;
				} else if (colorType=='useStatus' && !layout.qHyperCube.qMeasureInfo[0].colorCodeBool) {
					//use mod to repeat colors if scale is smaller than value shown
					dynamicColorVals = selectedScale[inner_d.meas_0_attr_0 % selectedScale.length];
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
				  'TimeStart'	: inner_d.dim_1 && inner_d.dim_1!='NA' ? moment(inner_d.dim_1, "M/D/YYYY") : moment(),
				  'TimeEnd'		: inner_d.dim_1 && inner_d.dim_1!='NA' ? moment(inner_d.dim_1, "M/D/YYYY").add(+inner_d.meas_0, 'days') : moment().add(1,'w'),
				  'Color'		: dynamicColorVals
				};
				return indivJob;
			});

			app_this.$scope.data = data;

			displayExperience( data, chartID );

			app_this.selections = barSelector( app_this.selections, this.backendApi, chartID );

			return qlik.Promise.resolve();
		},
		controller: ['$scope', function (/*$scope*/) {
		}]
	};

} );
