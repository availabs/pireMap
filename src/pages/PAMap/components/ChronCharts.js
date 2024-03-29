import React, { Component } from "react";
import Chronology from "./chronology";
/*import InfoBox from "./InfoBox";*/


function parseLine(line) {
	return {
		name: line.substring(0, 6),
		year: line.substring(6, 10),
		v1: line.substring(10,14 ),
		v2: line.substring(17, 21),
		v3: line.substring(24, 28),
		v4: line.substring(31, 35),
		v5: line.substring(38, 42),
		v6: line.substring(45, 49),
		v7: line.substring(52, 56),
		v8: line.substring(59, 63),
		v9: line.substring(66, 70),
		v10: line.substring(73, 77)
	};
}

function siteDataLoader(xmlid, cb) {
	let studyUrl = `https://www.ncei.noaa.gov/access/paleo-search/study/search.json?xmlId=${xmlid}`;

	console.log("studyUrl", studyUrl);

	fetch(studyUrl)
		.then(res => res.json())
		.then(studyData => {
			let studyDataFile =
				studyData.study[0].site[0].paleoData[0].dataFile;

			//find all data which has only *.crn file
			let studyDataFileSelected = studyDataFile.find(
				item => item.urlDescription === "Chronology"
			);
      
			console.log("studyDataFileSelected---------", studyDataFileSelected);

            if (studyDataFileSelected) {

            	let studyDataUrl = studyDataFileSelected.fileUrl;
			     console.log("ChronstudyDataURL---------", studyDataUrl, studyDataFile);

				fetch(studyDataUrl)
					.then(res => res.text())
					.then(textData => {


						/*console.log('textData----',textData);*/

						let lines = textData.split("\n");
							//console.log("lines1-------", lines);
						lines.splice(0, 3);
							//console.log("lines2-------", lines);
						lines.pop();
					    lines.pop();

				         /* console.log("lines3-------", lines);*/

						let data = lines.map(line => parseLine(line));
						console.log('ChronlineData-----', data)

						cb(data);
					});
            }

			

     

		});
}


class Charts extends Component {
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
			/*console.log("data---------", data);*/
		});
		//console.log("chart did mount");
		//console.log("studyData-----", this.props.authors, this.props.species)
	}

	processTreeData(data) {
		    let years = {};

	/*	let min = Infinity;
			let max = 0;*/
			let trees = data.reduce((output, row) => {

                let test = row.name;

				let treekey = test.replace(/[^A-Z0-9]/ig, "")



				//let treekey = row.name;
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
					    +values[i] !== 9990 &&
						+values[i] !== 999 &&
						+values[i] !== 8888 &&
						+values[i] !== -999 &&
						+values[i] !== -9999 

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

			let TotalTreeWidths = Object.keys(trees).map(treekey =>
				Object.values(trees[treekey]).reduce((a, b) => a + b, 0)
			);

			/*	console.log("TotalTreeWidths----", TotalTreeWidths);*/
			let TotalTreeYears = [];

			let TotalTreeYear = Object.keys(trees).map(treekey =>
				TotalTreeYears.push(...Object.keys(trees[treekey]))
			);

			let uniqTotalTreeYears = [...new Set(TotalTreeYears)].sort();
			let firstUniqTotalTreeYear = uniqTotalTreeYears[0];
			let lastUniqTotalTreeYear = uniqTotalTreeYears.pop();

			const colors = {
				ylOrRd: ["#fffde0","#feb24c","#f03b20"].reverse(),
				ylOrRdBig: ["#f6f6d5","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"]/*.reverse()*/,
				ylOrBr:  ["#ffffe5","#fff7bc","#fee391","#fec44f","#fe9929","#ec7014","#cc4c02","#993404","#662506"].reverse(),
				ylOrRd5: ["#ffffb2","#fecc5c","#fd8d3c","#f03b20","#bd0026"].reverse(),
				rdYlGn : ["#f03b20", "#ffffbf", "#006837"],
				brBg:  ["#543005","#8c510a","#bf812d","#dfc27d","#f6e8c3","#f5f5f5","#c7eae5","#80cdc1","#35978f","#01665e","#003c30"].reverse(),
				spectral: ["#fff7ec","#fee8c8","#fdd49e","#fdbb84","#fc8d59","#ef6548","#d7301f","#b30000","#7f0000"]
				/*	.range(["#bd0026", "#f7f7f7", "#053061"]);*/ // red white blue
			}
			let treeRingColor = colors['ylOrRdBig'] 
			
			    /*["#a50026", "#ffffbf", "#006837"]  */ // red yellow green
				/*["#800026", "#fd8d3c", "#ffffcc"] */     //red  to yellow
				/*["#8e0152", "#f7f7f7", "#276419"] */      //purple white green
				/*["#8e0152", "#f7f7f7", "#276419"]*/    //pinkish white green 

			let lineColor = "#2296f3"
			 // greenish --c7e9c0, 7fc97f, 4d9221 , yellow- ffffbf, white - fefefe blue-18a4f9 orange-fd6642 --green--5cb878 blue--2296f3

		return {
			trees,
			meta: {
				TotalTreeWidths,
				uniqTotalTreeYears,
				firstUniqTotalTreeYear,
				lastUniqTotalTreeYear,
				treeRingColor,
				lineColor
			}
		};
	}

	renderTrees() {
		if (!this.state.data) {
			return <div>No Chronlogy Data is available</div>;
		}

		return Object.keys(this.state.data.trees).filter(d => d).map(treeKey => {
			return (
			
				<Chronology
					name={treeKey}
					data={this.state.data.trees}
					meta={this.state.data.meta}
				/>
	
			
			);
		});
	}



/*	renderInfoBox() {
		if (!this.state.data) {
			return <div>Loading</div>;
		}

			return (
			
				<InfoBox
		
					authors={this.props.authors}
						species={this.props.species}
						xmlId={this.props.site}
						meta={this.props.meta}
				/>
	
			
			);
	
	}*/



	render() {
		return (
			<div style={{display: 'flex'}}>

					<div style={{ display: "flex", flexWrap: "wrap",   padding: 5, justifyContent: 'center', alignContent: 'center' }}> 
						{this.renderTrees()}
					</div>
{/*					<div style={{ display: "flex", flexWrap: "wrap",  flexBasis:"400px",  padding: 10}}>  border: '1px solid white', 
						<div style={{width: 300}}>
						{this.renderInfoBox()}
						</div>
				    </div>*/}

				
			</div>
		);
	}
}
export default Charts;


