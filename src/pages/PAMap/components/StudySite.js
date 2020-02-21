import React, { Component } from "react";
import Tree from "./Tree";
/*import Line from "./Line";*/


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
	constructor() {
		super();
		this.state = {
			data: null
		};
	}

	/*state = {
		data: null
	};*/

	componentDidMount() {
		/*	const sample = "/data/ak132x-noaa.tsv";*/
		siteDataLoader(this.props.site, data => {
			this.setState({ data: this.processTreeData(data) });
			console.log("data", data);
		});
		console.log("chart did mount");
	}

	processTreeData(data) {
		let years = {};

		let min = Infinity;
		let max = 0;
		let trees = data.reduce((output, row) => {
			let treekey = row.name;
			let startYear = +row.year;
			let rowYears = [];
			for (let i = 0; i < 10; i++) {
				rowYears.push(startYear + i);
			}

			let values = Object.values(row).slice(2);

			console.log("values---", values, treekey, startYear, rowYears);

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
					if (!years[rowYears[i]]) {
						years[rowYears[i]] = [];
					}

					years[rowYears[i]].push(+values[i]);
					output[treekey][`${rowYears[i]}`] = +values[i];
				}
				// output[treekey] = {Object.values(startYear): values}
			}

			return output;
		}, {}); //parsed data with new final format

		console.log("treedata---------------------", trees);
/*
		let treekeyStartYears = Object.keys(trees).map(treekey =>  {
			  return {
			  	key: treekey, 
			  	year:Object.keys(trees[treekey])
			  }
			})

		console.log('treekeyStartYears---', treekeyStartYears )*/

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

		return {
			trees,
			meta: {

				TotalTreeWidths,
				uniqTotalTreeYears,
				firstUniqTotalTreeYear,
				lastUniqTotalTreeYear

			}
		};
	}

	renderTrees() {
		if (!this.state.data) {
			return <div>Loading</div>;
		}

		return Object.keys(this.state.data.trees)
			.filter(d => d !== '') //or 	.filter(d => d) both works
			.map(treeKey => {
			return (
			
				<Tree
					name={treeKey}
					data={this.state.data.trees}
					meta={this.state.data.meta}
				/>
	
			
			);
		});
	}

	render() {
		return (
			<div style={{ display: "flex", flexWrap: "wrap" }}>
				<h4>{this.props.site}</h4>
				{this.renderTrees()}
			</div>
		);
	}
}
export default Circles;
