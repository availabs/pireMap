import React, { Component } from "react";
import * as d3 from "d3v5";

class Circles extends Component {
	componentDidMount() {
		this.drawTreeRing();
	}

	drawTreeRing() {
		let trees = this.props.data;
/*		console.log('trees----', trees)*/


		let meta = this.props.meta;
	/*	console.log("meta---", meta);

*/      let TotalTreeWidths = meta.TotalTreeWidths;

        let treeRingColor= meta.treeRingColor


		var margin = { top: 70, right: 40, bottom: 0, left: 40 },
			width = 300,
			height = 300;

		let treeKey = this.props.name;


		let dataValue = Object.values(trees[treeKey]);
		/*console.log('dataValue----', dataValue)*/


		//circle chart start here ----

		var ringScale = d3
			.scaleLinear()
			.domain([ d3.min(TotalTreeWidths), d3.max(TotalTreeWidths) /* d3.max(accuRingWidths)*/]) // d3.max(TotalTreeWidths)
			.range([5, height / 2]);

		let TreeContainer = d3
			.select(`.tree-${this.props.name}`)
			.append("div")
			.attr("class", "div-" + treeKey);

		TreeContainer
			.append("svg")
			.attr("class", "a-" + treeKey)
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom);

		var accuRingWidths = dataValue.reduce(function(r, a) {
			if (r.length > 0) a += r[r.length - 1];
			r.push(a);
			//console.log('a---', a)
			return r;
		}, []);

	/*	console.log('accuRingWidths---', accuRingWidths  )*/



		var ringColorScale_Linear = d3
			.scaleLog()
    		.base(2)
			//.domain([d3.min(dataValue),d3.max(dataValue)])
			
			.domain([d3.min(dataValue),d3.median(dataValue) /*d3.mean(dataValue)*/, d3.max(dataValue)])
			.range(treeRingColor); 


		var ringColorScale_Quantile = d3
			.scaleQuantile()
			.domain(dataValue)
			.range(treeRingColor)

		var ringColorScale_Threshold = d3
			.scaleThreshold()
			.domain([d3.min(dataValue),d3.median(dataValue) /*d3.mean(dataValue)*/, d3.max(dataValue)])
			.range(treeRingColor)

		const ringColorScale = ringColorScale_Quantile




		var chart = d3.select(".a-" + treeKey);
		var g = chart
			.selectAll("g")
			.data(accuRingWidths.reverse())
			.enter();
		//.append('g')

		g.append("circle")

			.attr("cx", function(d) {
				return (width + margin.left + margin.right)/ 2;
			})

			.attr("cy", function(d, i) {
				return (height + margin.top)/ 2;
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
			.attr("stroke-width", 0.1);

	}

	render() {
		return <div className={`tree-${this.props.name}`} />;
	}
}
export default Circles;
