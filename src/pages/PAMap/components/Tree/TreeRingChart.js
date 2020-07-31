import React, { Component } from "react";
import * as d3 from "d3v5";

class Circles extends Component {

	constructor() {
    super();

   //this.state = {value: Species };
    this.state = {
    	fullData:{},
    	ringColorScale: () => {}
    };

    }



	componentDidMount() {
		this.drawTreeRing();
	}



	drawTreeRing() {
		let trees = this.props.data;
/*		console.log('trees----', trees)*/


		let meta = this.props.meta;
		console.log("meta---", meta);

        let TotalTreeWidths = meta.TotalTreeWidths; // add of threewidth on that year 

        let treeRingColor= meta.treeRingColor;

		const ringColorScale = meta.ringColorScale



		var margin = { top: 70, right: 40, bottom: 0, left: 40 },
			width = 320,
			height = 320;

		let treeKey = this.props.name;
         // console.log("Tree this.props.name---", this.props.name)

		let dataValue = Object.values(trees[treeKey]).reverse();
		let years= Object.keys(trees[treeKey]).reverse()  


		//circle chart start here ----


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

		console.log('accuRingWidths---', accuRingWidths  )


		var ringScale = d3
			.scaleLinear()
			.domain([ 0, d3.max(TotalTreeWidths)])  // With Total Tree Ring Width for all years of Study
			//.domain([ d3.min(accuRingWidths), d3.max(accuRingWidths)])      
			.range([5, height / 2]);


	/*	let LinearScaleInterval = (d3.max(meta.AllTreeWidths) - d3.min(meta.AllTreeWidths)) / treeRingColor.length

		let LinearScale = []
		for(let i = d3.min(meta.AllTreeWidths); i <= d3.max(meta.AllTreeWidths); i+= LinearScaleInterval){
			LinearScale.push(i)
		}


		var ringColorScale_Linear = d3
			.scaleLinear()
    		//.base(2)
			//.domain([d3.min(dataValue),d3.max(dataValue)])
			
			.domain(LinearScale)
			.range(treeRingColor); 


		var ringColorScale_Quantile = d3
			.scaleQuantile()
			.domain(meta.AllTreeWidths)
			.range(treeRingColor)

		//console.log('Quantiles',ringColorScale_Quantile.quantiles())

		var ringColorScale_Threshold = d3
			.scaleThreshold()
			.domain([d3.min(dataValue),d3.median(dataValue), d3.max(dataValue)])
			.range(treeRingColor)*/




// adding tooltips

			  var tooltip = d3.select(`.tooltip-${this.props.name}`)
		    
		      .style("opacity", 1)
		      .style("position", 'relative')
		   //   .style("background-color", "gray")
		      .style("border-radius", "1px")
		      .style("padding", "2px")
		      .style("color", "white")
		      .style("height", "5px")
		      .style("width", "30px")
		     // .html(" d3ed")

		//console.log(d3.select(`.tooltip-${this.props.name}`), `.tooltip-${this.props.name}`)


		  // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
		  let changeData = this.props.onChange

		  var showTooltip = function(d, i) {
		  	console.log("tooltip")
		    tooltip
		      .transition()
		      .duration(200)
		    tooltip
		      .style("opacity", 1)
		     // .style("z-index", 1000)
		      //.html(/*"Ring Width Index: " + */`<div style="padding:10;background-color:white;color:black;">year:${years[i]}, ${dataValue[i]}</div>`)
		      .html(/*"Ring Width Index: " + */`<div style="background-color:white;color:black;"> ${dataValue[i]}</div>`)
		      .style("left", (d3.mouse(this)[0]+30) + "px")
		      .style("top", (d3.mouse(this)[1]+30) + "px")
		    
              changeData(years[i], dataValue[i])
              
              d3.select('.year_'+years[i])
	      	 .attr("fill", function(d, i) {
			//console.log(dataValue[i], ringColorScale(dataValue[i]))
			   return 'chartreuse' //'rgba(0,0,0,0)' //"hsl(" + Math.random() * 360 + ",100%,100%)";
		      })

		  }

		  var moveTooltip = function(d) {
		    tooltip
		      .style("left", (d3.mouse(this)[0]+30) + "px")
		      .style("top", (d3.mouse(this)[1]+30) + "px")
		  /*       .style("left", "150px")
		      .style("top", "150px")*/
		  }


		  var hideTooltip = function(d, i) {
		    tooltip
		      .transition()
		      .duration(200)
		      .style("opacity", 0)

		    d3.select('.year_'+years[i])
		     	.attr("fill", function(d, x) {
				//console.log(dataValue[i], ringColorScale(dataValue[i]))\
				return ringColorScale(dataValue[i]) //'rgba(0,0,0,0)' //"hsl(" + Math.random() * 360 + ",100%,100%)";
			})
		  }




//add circle charts


		var chart = d3.select(".a-" + treeKey);
		var g = chart
			.selectAll("g")
			.data(accuRingWidths.reverse())
			.enter();
		//.append('g')

		g.append("circle")

	   	    .attr('class', (d,i) => 'year_'+this.props.name+'_'+years[i])

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
			.attr("stroke-width", 0.1)
		     // -3- Trigger the functions
		    .on("mouseover", showTooltip )
		    .on("mousemove", moveTooltip )
		    .on("mouseleave", hideTooltip )


		    this.setState({
		    	fullData: trees[treeKey],
		    	ringColorScale
		    })


	}




	componentDidUpdate(prevProps) {
		if(prevProps.year !== this.props.year) {
			console.log('going to update the treering',this.props.year)
			d3.select('.year_'+this.props.name+'_'+this.props.year)
		      	.attr("fill", function(d, x) {
				//console.log(dataValue[i], ringColorScale(dataValue[i]))\
				return 'chartreuse'//'rgba(0,0,0,0)' //"hsl(" + Math.random() * 360 + ",100%,100%)";
			})
		    d3.select('.year_'+this.props.name+'_'+prevProps.year)
		      	.attr("fill", (d, x) => {
				//console.log(dataValue[i], ringColorScale(dataValue[i]))\
				return this.state.ringColorScale(this.state.fullData[prevProps.year])//'rgba(0,0,0,0)' //"hsl(" + Math.random() * 360 + ",100%,100%)";
			})
		}
	}






	render() {
		return (
			<div>
				<div className={`tooltip-${this.props.name}`} style={{position: 'relative'}}></div>
				<div className={`tree-${this.props.name}`} />
			</div>
			    );
	}
}


export default Circles;
