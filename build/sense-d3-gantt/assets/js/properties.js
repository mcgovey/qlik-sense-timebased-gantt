define( [], function () {
    'use strict';
    var colorOptions = [
		{
			value: 'YlGn',
			label: 'Colorbrewer YlGn'
		},
		{
			value: 'YlGnBu',
			label: 'Colorbrewer YlGnBu'
		},
		{
			value: 'GnBu',
			label: 'Colorbrewer GnBu'
		},
		{
			value: 'BuGn',
			label: 'Colorbrewer BuGn'
		},
		{
			value: 'PuBuGn',
			label: 'Colorbrewer PuBuGn'
		},
		{
			value: 'PuBu',
			label: 'Colorbrewer PuBu'
		},
		{
			value: 'BuPu',
			label: 'Colorbrewer BuPu'
		},
		{
			value: 'RdPu',
			label: 'Colorbrewer RdPu'
		},
		{
			value: 'PuRd',
			label: 'Colorbrewer PuRd'
		},
		{
			value: 'OrRd',
			label: 'Colorbrewer OrRd'
		},
		{
			value: 'YlOrRd',
			label: 'Colorbrewer YlOrRd'
		},
		{
			value: 'YlOrBr',
			label: 'Colorbrewer YlOrBr'
		},
		{
			value: 'Purples',
			label: 'Colorbrewer Purples'
		},
		{
			value: 'Blues',
			label: 'Colorbrewer Blues'
		},
		{
			value: 'Greens',
			label: 'Colorbrewer Greens'
		},
		{
			value: 'Oranges',
			label: 'Colorbrewer Oranges'
		},
		{
			value: 'Reds',
			label: 'Colorbrewer Reds'
		},
		{
			value: 'Greys',
			label: 'Colorbrewer Greys'
		},
		{
			value: 'PuOr',
			label: 'Colorbrewer PuOr'
		},
		{
			value: 'BrBG',
			label: 'Colorbrewer BrBG'
		},
		{
			value: 'PRGn',
			label: 'Colorbrewer PRGn'
		},
		{
			value: 'PiYG',
			label: 'Colorbrewer PiYG'
		},
		{
			value: 'RdBu',
			label: 'Colorbrewer RdBu'
		},
		{
			value: 'RdGy',
			label: 'Colorbrewer RdGy'
		},
		{
			value: 'RdYlBu',
			label: 'Colorbrewer RdYlBu'
		},
		{
			value: 'Spectral',
			label: 'Colorbrewer Spectral'
		},
		{
			value: 'RdYlGn',
			label: 'Colorbrewer RdYlGn'
		},
		{
			value: 'Accent',
			label: 'Colorbrewer Accent'
		},
		{
			value: 'Dark2',
			label: 'Colorbrewer Dark2'
		},
		{
			value: 'Paired',
			label: 'Colorbrewer Paired'
		},
		{
			value: 'Pastel1',
			label: 'Colorbrewer Pastel1'
		},
		{
			value: 'Pastel2',
			label: 'Colorbrewer Pastel2'
		},
		{
			value: 'Set1',
			label: 'Colorbrewer Set1'
		},
		{
			value: 'Set2',
			label: 'Colorbrewer Set2'
		},
		{
			value: 'Set3',
			label: 'Colorbrewer Set3'
		}
	];
    //----------final properties creation---------------
    return {
			type : "items",
			component : "accordion",
			items : {
				dimensions : {
					uses : "dimensions",
					min : 2,
					items: {
						startDateFlag: {
							type 		: "boolean",
							label 		: "Bar Start Date",
							ref 		: "qDef.startDate",
							defaultValue: false,
							show		: function(data, ext) {
								//check that milestones are used before showing this property
								var dimProps = ext.layout.qHyperCube.qDimensionInfo;
								function findMilestoneFlags(dim) { 
									return dim.startDate === true;
								}
								var flagSearchVal = dimProps.find(findMilestoneFlags);
								//show prop if the flag hasn't been set or the flag has only been set for the current prop - and the current prop does not have a milstone flag and the milestone date flag has not been set 
								return (typeof flagSearchVal !== 'object' || flagSearchVal.cId === data.qDef.cId) && data.qDef.milestoneFlag !== true && data.qDef.milestoneDateFlag !== true;
							}
						},
						milestoneFlag: {
							type 		: "boolean",
							label 		: "Milestone Flag (Yes/No, 1/0)",
							ref 		: "qDef.milestoneFlag",
							defaultValue: false,
							show		: function(data, ext) {
								//check that milestones are used before showing this property
								var dimProps = ext.layout.qHyperCube.qDimensionInfo;
								function findMilestoneFlags(dim) { 
									return dim.milestoneFlag === true || dim.milestoneDateFlag === true;
								}
								var flagSearchVal = dimProps.find(findMilestoneFlags);
								//show prop if the flag hasn't been set or the flag has only been set for the current prop - and the current prop does not have a milstone date flag and the start date has not been set 
								return (typeof flagSearchVal !== 'object' || flagSearchVal.cId === data.qDef.cId) && data.qDef.milestoneDateFlag !== true && data.qDef.startDate !== true;
							}
						},
						milestoneDate: {
							type 		: "boolean",
							label 		: "Milestone Date",
							ref 		: "qDef.milestoneDateFlag",
							defaultValue: false,
							// show		: function(data) {
							// 	return true;//data.qDef.colorType == "useStatus";
							// }
							show		: function(data, ext) {
								//check that milestones are used before showing this property
								var dimProps = ext.layout.qHyperCube.qDimensionInfo;
								function findMilestoneFlags(dim) { 
									return dim.milestoneDateFlag === true || dim.milestoneFlag === true;
								}
								var flagSearchVal = dimProps.find(findMilestoneFlags);
								//show prop if the flag hasn't been set or the flag has only been set for the current prop - and the current prop does not have a milstone flag and the start date has not been set 
								return (typeof flagSearchVal !== 'object' || flagSearchVal.cId === data.qDef.cId) && data.qDef.milestoneFlag !== true && data.qDef.startDate !== true;
							}
						},
						milestoneIcon: {
							type 		: "string",
							expression	: "optional",
							label 		: "Icon for milestone",
							ref 		: "qDef.milestoneIcon",
							defaultValue: "",
							show		: function(data) {
								return data.qDef.milestoneDateFlag===true || data.qDef.milestoneFlag===true;
							}
						}
					}
					// Possible data validations
					// no start date selected
					// multiple start dates selected
					// milestone flag and date selected

				},
				measures : {
					uses : "measures",
					min : 1,
					max : 1,
					items: {
						colorType: {
							ref: "qDef.colorType",
							label: "Color Format",
							type: "string",
							component: "dropdown",
							options: 
								[{
									value: 'singleColor',
									label: 'Single Color'
								},
								{
									value: 'colorByDim',
									label: 'Color by Dimension'
								},
								{
									value: 'useStatus',
									label: 'Color by Expression'
								}]
						},
						color: {
							ref 		: "qAttributeExpressions.0.qExpression",
							label 		: "Status Colors",
							type 		: "string",
							expression 	: "optional",
							defaultValue: "",
							show		: function(data) {
								return data.qDef.colorType == "useStatus";
							}
						},
						colorCodeBool: {
							type 		: "boolean",
							label 		: "Expression contains color code",
							ref 		: "qDef.colorCodeBool",
							defaultValue: true,
							show		: function(data) {
								return data.qDef.colorType == "useStatus";
							}
						},
						singleColor: {
							ref 		: "qDef.singleColorVal",
							label 		: "Bar color",
							component 	: "color-picker",
							type 		: "integer",
							defaultValue: 3,
							show 		: function(data) {
								return data.qDef.colorType == "singleColor";
							}
						},
						scaleSelection: {
							type 		: "string",
							component 	: "dropdown",
							label 		: "Scale Selection",
							ref 		: "qDef.scaleColorVal",
							options 	: colorOptions,
							show 		: function(data) {
								return data.qDef.colorType == "colorByDim" || (data.qDef.colorType == "useStatus" && !data.qDef.colorCodeBool);
							}
							// ,defaultValue: "v"
						},
						numOfColorVals: {
							type 		: "number",
							component 	: "slider",
							label 		: "Number of values before repeating",
							ref 		: "qDef.numOfColorVals",
							min 		: 3,
							max 		: 12,
							step 		: 1,
							defaultValue: 8,
							show 		: function(data) {
								return data.qDef.colorType == "colorByDim" || (data.qDef.colorType == "useStatus" && !data.qDef.colorCodeBool);
							}
						}
					}
				},
				sorting : {
					uses : "sorting"
				},
				settings : {
					uses : "settings"
					,items : {
						appearance: {
							type : "items",
							label: "Configuration",
							items : {
								initFetchRows : {
									ref : "qHyperCubeDef.qInitialDataFetch.0.qHeight",
									label : "Max Rows to Display",
									type : "number",
									defaultValue : 50
								},
								calcCondition : {
									ref : "calcCondition",
									label : "Calculation Condition",
									type: "string",
									expression: "optional",
									defaultValue: ""
								},
								invalidConfigMessage : {
									ref : "calcConditionMsg",
									label : "Text Displayed if Chart Not Configured Properly",
									type: "string",
									expression: "optional",
									defaultValue: "Please flag one dimension as the start date"
								}
							}
						}
						
					}
				}
			}
		}

} );
