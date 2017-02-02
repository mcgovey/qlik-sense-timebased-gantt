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
					min : 1,
					max : 2
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
					// ,items : {
					// 	initFetchRows : {
					// 		ref : "qHyperCubeDef.qInitialDataFetch.0.qHeight",
					// 		label : "Initial fetch rows",
					// 		type : "number",
					// 		defaultValue : 50
					// 	}
					// }
				}
			}
		}

} );
