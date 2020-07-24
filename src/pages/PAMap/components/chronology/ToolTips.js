import React, { Component } from "react";
import * as d3 from "d3v5";

class RingAndLine extends Component {

	constructor(props) {
    super(props);

   //this.state = {value: Species };
    this.state = {
      year: "" ,
      value: ""
    };

    this.gotData = this.gotData.bind(this);
  }


/*  gotData(event) {
  	console.log('gotData', event)

    this.setState({year:      , value: event.target.value});
   
  }
*/


  gotData(type, value) {
  	console.log('gotData', type, value)

    this.setState({year:"", type: type,  value: value});
   
  }


  componentDidMount() {
		this.drawLine();
	}



  drawLine() {

 //data prep 	

		let trees = this.props.data;
	/*	console.log('trees----', trees)*/

		let treeKey = this.props.name;

	//	console.log('this.props.name----', this.props.name)

		let meta = this.props.meta;
		
	//	console.log("meta---", meta);

	    let TotalTreeWidths = meta.TotalTreeWidths;

	    let lineColor = meta.lineColor;

	    let treeRingColor= meta.treeRingColor

	
		let uniqTotalTreeYears = meta.uniqTotalTreeYears;
		let firstUniqTotalTreeYear = meta.firstUniqTotalTreeYear;
		let lastUniqTotalTreeYear = meta.lastUniqTotalTreeYear;

		/*	let startYears = meta.rowYears;*/

		let startYears = Object.keys(trees[treeKey]).sort();
	
		/*console.log('startYears---', startYears)*/

		let dataValue = Object.values(trees[treeKey]);
	    console.log('dataValue----', dataValue)

		let lineData = [];

		startYears.forEach((year, i) => {
			// AvgData[year] =yearAvg[i]
			lineData.push({ year: year, value: dataValue[i] });
		});
       console.log("lineData-----", lineData);



//line chart start here ----

		var margin = { top: 5, right: 40, bottom: 30, left: 40 },
			width = 900,
			height = 300;

		var bisectDate = d3.bisector(function(d) { return d.year; }).left

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
			        .attr("stroke-width", 1)
					.attr('style', 'font-size:1em')
					.call(
						d3
							.axisBottom(x)
						/*	.tickValues([
								firstUniqTotalTreeYear,
								lastUniqTotalTreeYear
							])*/
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
					svg.append("g")
					.attr("stroke", "#fefefe")
				    .attr("stroke-width", 1)
					.call(d3.axisLeft(y));

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

    //coerce to number

				function type(d) {
					d.value = +d.value; // coerce to number
					return d;
				}

     
    // adding Line tooltip

		        var focus = svg.append("g")
		            .style("display", "none");


             // hover line 
		      /*  focus.append("line")
	                .attr("class", "x-hover-line")
		            .attr("stroke", "#fff")
			        .attr("stroke-width", 0.5)
			        .attr("stroke-dasharray", 3,3)
			        .attr("y1", 0)
			        .attr("y2", height);
           */

		        focus.append("circle")
		            .attr("fill", "#fff")
		            .attr("stroke", "#fff")
			        .attr("stroke-width", 0.5)
		            .attr("r", 1.5);

			    focus.append("text")
			        .attr("stroke", "#fff")
			        .attr("x", 15)
			      	.attr("dy", ".31em");

			    svg.append("rect")
			        .attr("transform", "translate(" + 0 + "," + margin.top + ")")
		            .attr("fill", "none")
			        .attr("pointer-events", "all")
			        .attr("width", width)
			        .attr("height", height)
			        .on("mouseover", function() { focus.style("display", null); })
			        .on("mouseout", function() { focus.style("display", "none"); })
			        .on("mousemove", mousemove);

			    function mousemove() {
			      var x0 = x.invert(d3.mouse(this)[0]),
			          i = bisectDate(lineData, x0, 1),
			          d0 = lineData[i - 1],
			          d1 = lineData[i],
			          d = x0 - d0.year > d1.year - x0 ? d1 : d0;

			          //console.log('mousemove-------', x0,i,d)

			      focus.attr("transform", "translate(" + x(d.year) + "," + y(d.value) + ")");
			      focus.select("text").text(function() { return d.value; });
			      focus.select(".x-hover-line").attr("y2", height - y(d.value));

			    }




//draw circle start here
//circle bases


	   var cmargin = { top: 5, right: 40, bottom: 0, left: 40 },
			cwidth = 350,
			cheight = 350;

	
		let TreeContainer = d3
			.select(`.tree-${this.props.name}`)
			.append("div")
			.attr("class", "div-" + treeKey);

		TreeContainer
			.append("svg")
			.attr("class", "a-" + treeKey)
			.attr("width", cwidth + cmargin.left + cmargin.right)
			.attr("height", cheight + cmargin.top + cmargin.bottom);

		var accuRingWidths = dataValue.reduce(function(r, a) {
			if (r.length > 0) a += r[r.length - 1];
			r.push(a);
			//console.log('a---', a)
			return r;
		}, []);

		console.log('accuRingWidths---', accuRingWidths  )
		
	    var ringScale = d3
			.scaleLinear()
			.domain([ d3.min(accuRingWidths), d3.max(accuRingWidths)]) // d3.max(TotalTreeWidths)
			.range([5, height / 2]);


		var ringColorScale_Linear = d3
			.scaleLog()
    		.base(2)
			//.domain([d3.min(dataValue),d3.max(dataValue)])

			.domain([d3.min(dataValue),d3.median(dataValue), d3.max(dataValue)])
			.range(treeRingColor); 


		var ringColorScale_Quantile = d3
			.scaleQuantile()
			.domain(dataValue)
			.range(treeRingColor)

		var ringColorScale_Threshold = d3
			.scaleThreshold()
			.domain([d3.min(dataValue),d3.median(dataValue), d3.max(dataValue)])
			.range(treeRingColor)

		const ringColorScale = ringColorScale_Quantile


// adding circle tooltips

		  var tooltip = d3.select(`.tooltip-${this.props.name}`)
		    
		      .style("opacity", 1)
		      .style("position", 'relative')
		   //   .style("background-color", "gray")
		      .style("border-radius", "1px")
		      .style("padding", "1px")
		      .style("color", "white")
		       .style("height", "10px")
		       .style("width", "35px")
		     // .html(" d3ed")

		console.log(d3.select(`.tooltip-${this.props.name}`), `.tooltip-${this.props.name}`)


		  //Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
		  var showTooltip = function(d, i) {
		  	console.log("tooltip")
		    tooltip
		      .transition()
		      .duration(200)
		    tooltip
		      .style("opacity", 1)
		      .style("z-index", 1000)
		      .html(/*"Ring Width Index: " +*/ dataValue[i])
		      .style("left", (d3.mouse(this)[0]+30) + "px")
		      .style("top", (d3.mouse(this)[1]+30) + "px")
		    /*     .style("left", "150px")
		      .style("top", "150px")*/
		  }
		  var moveTooltip = function(d) {
		    tooltip
		      .style("left", (d3.mouse(this)[0]+30) + "px")
		      .style("top", (d3.mouse(this)[1]+30) + "px")
		  /*       .style("left", "150px")
		      .style("top", "150px")*/
		  }
		  var hideTooltip = function(d) {
		    tooltip
		      .transition()
		      .duration(200)
		      .style("opacity", 1)
		  }

    //draw circle charts
    

		var chart = d3.select(".a-" + treeKey);
		var g = chart
			.selectAll("g")
			.data(accuRingWidths.reverse())
			.enter();
		//.append('g')

		g.append("circle")

			.attr("cx", function(d) {
				return (cwidth + cmargin.left + cmargin.right)/ 2;
			})

			.attr("cy", function(d, i) {
				return (height + cmargin.top)/ 2;
			})

			.attr("r", function(d, i) {
				return ringScale(d);
				//return d*0.0004
			})

			//.attr("fill-opacity","0.2")

			.attr("fill", function(d, i) {
				//console.log(dataValue[i], ringColorScale(dataValue[i]))
				return ringColorScale(dataValue[i]); //'rgba(0,0,0,0)' //"hsl(" + Math.random() * 360 + ",100%,100%)";
			})
			.attr("stroke", "#fff")
			.attr("stroke-width", 0.1)
			.on("mouseover", showTooltip )
		    .on("mousemove", moveTooltip )
		    .on("mouseleave", hideTooltip )


	}




	LineHover(value) {
		this.props.onChange('Line', value)
	}




	render() {
		return (
		<div style={{display: 'flex'}}> 
			<div className={`line-${this.props.name}`} /> 

			<div className={`tooltip-${this.props.name}`} style={{position: 'relative'}}></div>
			<div className={`tree-${this.props.name}`} />
	    </div> 
	    )
	}
}
export default RingAndLine;
