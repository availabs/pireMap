import React, { Component } from "react";
import * as d3 from "d3";

class Lines extends Component {
	componentDidMount() {
		this.drawLine();
	}

	drawLine() {

		let trees = this.props.data;
	/*	console.log('trees----', trees)*/

		let treeKey = this.props.name;

		let meta = this.props.meta;
		
/*		console.log("meta---", meta);*/

	    let TotalTreeWidths = meta.TotalTreeWidths;

	    let lineColor = meta.lineColor;


	
		let uniqTotalTreeYears = meta.uniqTotalTreeYears;
		let firstUniqTotalTreeYear = meta.firstUniqTotalTreeYear;
		let lastUniqTotalTreeYear = meta.lastUniqTotalTreeYear;

		/*	let startYears = meta.rowYears;*/

		let startYears = Object.keys(trees[treeKey]).sort();
	
		/*console.log('startYears---', startYears)*/

		let dataValue = Object.values(trees[treeKey]);
	/*	console.log('dataValue----', dataValue)*/


		let lineData = [];

		startYears.forEach((year, i) => {
			// AvgData[year] =yearAvg[i]
			lineData.push({ year: year, value: dataValue[i] });
		});
/*       console.log("lineData-----", lineData);*/


		//line chart start here ----

		var margin = { top: 0, right: 40, bottom: 30, left: 40 },
			width = 300,
			height = 100;

		let LineContainer = d3
			.select(`.line-${this.props.name}`)
			.append("div")
			.attr("class", "div" + treeKey);

				var svg = LineContainer
				
					.append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.append("g")
					.attr(
						"transform",
						"translate(" + margin.left + "," + margin.top + ")"
					);

				/*var parser = d3.timeFormat("%Y");*/
				//lineData.year = parser(lineData.year)
				//console.log('lineData---', lineData.year  )

				// Add X axis
				let intYearFormat = f => f.toString();
				var x = d3
					.scaleLinear()
					.domain(
						d3.extent(
							uniqTotalTreeYears /*, function(d) {
							return d.year;
						}*/
						)
					)
					.range([0, width]);
				svg.append("g")
					.attr("transform", "translate(0," + height + ")")
					.attr("stroke", "#fefefe")
					.attr('style', 'font-size:1em')
					.call(
						d3
							.axisBottom(x)
							.tickValues([
								firstUniqTotalTreeYear,
								lastUniqTotalTreeYear
							])
							.tickFormat(intYearFormat)
					);

				// Add Y axis
				var y = d3
					.scaleLinear()
					.domain([
						d3.min(lineData, function(d) {
							return +d.value;
						}),
						d3.max(lineData, function(d) {
							return +d.value;
						})
					])
					.range([height, 0]);
				/*	svg.append("g").call(d3.axisLeft(y));*/

				// Add the line
				svg.append("path")
					.datum(lineData)
					.attr("fill", "none")
					.attr("stroke", lineColor) 
					.attr("stroke-width", 2)
					.attr(
						"d",
						d3
							.line()
							.x(function(d) {
								return x(d.year);
							})
							.y(function(d) {
								return y(d.value);
							})
					);

				function type(d) {
					d.value = +d.value; // coerce to number
					return d;
				}
	}

	render() {
		return <div className={`line-${this.props.name}`} />;
	}
}
export default Lines;
