import React, { Component } from "react";
import * as d3 from "d3";

//data = "name year v1 v2 v3 v4 v5 v6 v7 v8 v9 v10\n"
function parseLine(line) {
	return {
		name: line.substring(0, 8),
		year: line.substring(8, 12),
		v1: line.substring(14, 18),
		v2: line.substring(20, 24),
		v3: line.substring(26, 30),
		v4: line.substring(32, 36),
		v5: line.substring(38, 42),
		v6: line.substring(44, 48),
		v7: line.substring(50, 54),
		v8: line.substring(56, 60),
		v9: line.substring(62, 66),
		v10: line.substring(68, 72)
	};
}

function siteDataLoader(xmlid, cb) {
	let studyUrl = `https://www.ncdc.noaa.gov/paleo-search/study/search.json?xmlId=${xmlid}`;
	console.log("studyUrl", studyUrl);
	fetch(studyUrl)
		.then(res => res.json())
		.then(studyData => {
			// Only get *.rwl files
			// we should map over studyData.study[0].site[0].paleoData[0].dataFile
			// to find all *.rwl files
			// then promise .map over them
			// and return all data in one json

			/*	console.log(
				"studyData--- data files",
				studyData.study[0].site[0].paleoData[0].dataFile
			);*/

			let studyDataFile =
				studyData.study[0].site[0].paleoData[0].dataFile;

			//find all data which has only *.rwl file--exclude out all crs, xls, noaa.rwl
			let studyDataFileSelected = studyDataFile.find(
				item => item.urlDescription === "Raw Measurements"
			);

			console.log(
				"studyDataFileSelected---dataURLs",
				studyDataFileSelected.fileUrl
			);

			let studyDataUrl = studyDataFileSelected.fileUrl;
			console.log(studyDataUrl);

			fetch(studyDataUrl)
				.then(res => res.text())
				.then(textData => {
					/*console.log(textData);*/

					let lines = textData.split("\n");
					lines.splice(0, 3);

					/*	console.log("lines-------", lines);*/

					let data = lines.map(line => parseLine(line));

					cb(data);
				});
		});
}

class Circles extends Component {
	componentDidMount() {
		/*	const sample = "/data/ak132x-noaa.tsv";*/
		siteDataLoader(this.props.site, data => {
			console.log("got the data", data);
			this.drawChart(data);
		});
		console.log("chart did mount");
	}

	drawChart(data) {
		// let data = this.props.data
		console.log("testing tsv loader", data);

		let years = {};

		let min = Infinity;
		let max = 0;
		let trees = data.reduce((output, row) => {
			let treekey = row.name;
			let startYear = +row.year;
			let startYears = [];
			for (let i = 0; i < 10; i++) {
				startYears.push(startYear + i);
			}

			let values = Object.values(row).slice(2);

			console.log("values---", values, treekey, startYear, startYears);

			if (!output[treekey]) {
				output[treekey] = {};
			}
			for (let i = 0; i < 10; i++) {
				if (
					!isNaN(+values[i]) &&
					+values[i] !== 0 &&
					+values[i] !== 9999 &&
					+values[i] !== 999 &&
					+values[i] !== 8888
				) {
					if (!years[startYears[i]]) {
						years[startYears[i]] = [];
					}

					years[startYears[i]].push(+values[i]);
					output[treekey][`${startYears[i]}`] = +values[i];
				}
				// output[treekey] = {Object.values(startYear): values}
			}

			return output;
		}, {}); //parsed data with new final format

		//	console.log("treedata---------------------", trees);

		let TotalTreeWidths = Object.keys(trees).map(treekey =>
			Object.values(trees[treekey]).reduce((a, b) => a + b, 0)
		);

		/*	console.log("TotalTreeWidths----", TotalTreeWidths);
		 */
		let TotalTreeYears = [];

		let TotalTreeYear = Object.keys(trees).map(treekey =>
			TotalTreeYears.push(...Object.keys(trees[treekey]))
		);

		let uniqTotalTreeYears = [...new Set(TotalTreeYears)].sort();
		let firstUniqTotalTreeYear = uniqTotalTreeYears[0];
		let lastUniqTotalTreeYear = uniqTotalTreeYears.pop();

		console.log("TotalTreeYears----", TotalTreeYears);

		console.log(
			"uniqTotalTreeYears----",
			uniqTotalTreeYears,
			firstUniqTotalTreeYear,
			lastUniqTotalTreeYear
		);

		Object.keys(trees)
			.sort((a, b) => Object.keys(trees[a])[0] - Object.keys(trees[b])[0])
			/*	.filter((d, i) => i < 10)*/
			//.map(tree => <TreeVisualizer data={treeData} ...rest />)
			// .map(tree => (
			// 	<div class={treeContainer}>
			// 		<TreeTitle tree={tree}/>
			// 		<TreeRing data={treeData} minYear={minYear} maxYear={maxYear} activeYear={this.state.activeYear}/>
			// 		<TreeLineGraph ddata={treeData} minYear={minYear} maxYear={maxYear} onHover={this.changeYear}/>
			// 	</div>
			// ))

			.map(treeKey => {
				let startYears = Object.keys(trees[treeKey]);

				let FirststartYear = Object.keys(trees[treeKey])[0];

				let dataValue = Object.values(trees[treeKey]);

				console.log("treeRing---", dataValue, startYears);

				let lineData = [];

				startYears.forEach((year, i) => {
					// AvgData[year] =yearAvg[i]
					lineData.push({ year: year, value: dataValue[i] });
					/*console.log("lineData-----", lineData);*/
				});

				var margin = { top: 60, right: 40, bottom: 0, left: 40 },
					width = 300,
					height = 300;

				//circle chart start here ----

				let TreeContainer = d3
					.select(".treering-container")
					.append("div")
					.attr("class", "div" + treeKey);

				TreeContainer
					//.attr('class', treeKey)
					.append("div")
					.append("svg")
					.attr("class", "a" + treeKey)
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom);

				var accuRingWidths = dataValue.reduce(function(r, a) {
					if (r.length > 0) a += r[r.length - 1];
					r.push(a);
					//console.log('a---', a)
					return r;
				}, []);

				// console.log('accuRingWidths---', accuRingWidths  )

				//console.log([min,max], [d3.min(accuRingWidths), d3.max(accuRingWidths)])

				var ringScale = d3
					.scaleLinear()
					.domain([
						d3.min(TotalTreeWidths),
						d3.max(TotalTreeWidths) /*d3.max(accuRingWidths)*/
					]) // d3.max(TotalTreeWidths)
					.range([5, height / 2]);

				//console.log('scale test', [d3.min(dataValue), d3.max(dataValue),d3.min(accuRingWidths)])

				var ringColorScale = d3
					.scaleLinear()
					.domain([0.1, d3.mean(dataValue), d3.max(dataValue)])
					.range(["#e41a1c", "#f7f7f7", "#2d004b"]);

				/*        var ringwidths = dataValue.reduce((accumulator, currentValue) => {
			                     return accumulator + currentValue
			                       })
			       */

				var chart = d3.select(".a" + treeKey);
				var g = chart
					.selectAll("g")
					.data(accuRingWidths.reverse())
					.enter();
				//.append('g')

				g.append("circle")

					.attr("cx", function(d) {
						return width / 2;
					})

					.attr("cy", function(d, i) {
						return height / 2;
					})

					.attr("r", function(d, i) {
						return ringScale(d);
						//return d*0.005/2
					})

					//.attr("fill-opacity","0.2")

					.attr("fill", function(d, i) {
						//console.log(dataValue[i], ringColorScale(dataValue[i]))
						return ringColorScale(dataValue[i]); //'rgba(0,0,0,0)' //"hsl(" + Math.random() * 360 + ",100%,100%)";
					})
					.attr("stroke", "#fff")
					.attr("stroke-width", 0.5);

				chart
					.append("text")
					.attr("x", function(d, i) {
						return width / 2 + ringScale(d);
					})

					.attr("y", height + 20)
					.attr("stroke", "#525252")
					.attr("text-anchor", "right")

					.attr("font-size", "10px")
					.attr("font-family", "sans-serif")

					.text("TreeKey: " + treeKey);

				chart
					.append("text")
					.attr("x", function(d, i) {
						return width / 2 + ringScale(d);
					})

					.attr("y", height + 31)
					.attr("stroke", "#525252")
					.attr("text-anchor", "right")

					.attr("font-size", "10px")
					.attr("font-family", "sans-serif")

					.text(
						"Start Year: " +
							startYears[0] +
							", End Year: " +
							startYears[startYears.length - 1]
					);

				// line chart start here --

				// append the svg object for line graph to the body of the page

				var margin = { top: 0, right: 40, bottom: 60, left: 40 },
					width = 300,
					height = 150;

				var svg = TreeContainer.append("div")
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
					.attr("stroke", "steelblue")
					.attr("stroke-width", 1.5)
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
			});
	}

	render() {
		return (
			<div>
				<h4>{this.props.site}</h4>
				<div
					className="treering-container"
					style={{ display: "flex", flexWrap: "wrap" }}
				/>
			</div>
		);
	}
}
export default Circles;
