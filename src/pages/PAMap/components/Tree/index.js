import React, { Component } from "react";
import TreeRingChart from "./TreeRingChart";
import LineChart from "./LineChart";
import styled from "styled-components";

const TreeContainer = styled.div`
	width: 400px;
	height: 650px;
	margin: 10px;
	border-radius: 20px;
	background: #2e2e2e;
	box-shadow:  -5px -5px 10px #272727, 
             5px 5px 15px #353535;
`;



const titleStyle = {
	 /* borderRadius: "7px",*/
    /*background: "#10a6f9",*/   /* 10a6f9 fe5029*/ 
   /* boxShadow: "-4px 4px 8px #c77310, \n             4px -4px 8px #fd9314",*/
 /*   background:'#fd8d3c',*/
    /*  background: "#f89f34",*/
      border: '0.5px solid #fa851a',  //orange--fd8d3c  blue--2296f3
      borderBottomStyle: "solid",//fd8d3c
      borderTopStyle:'none',
      borderRightStyle:'none',
      borderLeftStyle:'none',
      color: '#fefefe',
      fontSize: "15px",
      textAlign:'center',
      width: '100%',
      padding: '10px',
      fontFamily: 'Roboto',
      fontWeight: 'bold'
    
    };


const subTitleStyle = {
      color: '#fefefe',
      fontSize: "12px",
      padding: '10px',
      fontFamily: /*"Source Sans Pro",*/"Roboto",
      justifyContent: 'space-between',
      display: 'flex',
      fontWeight: 'bold'

    };  


const textStyle = {

      color: '#f48826',  //fefefe,  f48826, 2296f3
      borderRadius: '10px',
    //  padding: '0.1rem',
      fontSize: "12px",
 
      fontFamily: /*"Source Sans Pro",*/"Roboto",
        fontWeight: 'bold',
     
      display: 'flex',
      flexWrap: "wrap",
      justifyContent: 'center',
    //  margin: '2px',
      fontWeight: 'bold'

    };  


class Tree extends Component {


	constructor() {
	super();

	//this.state = {value: Species };
	this.state = {
	  year: 0  ,
	  value: 0
	};

	this.gotData = this.gotData.bind(this);
	}



	gotData(year, value) {
	this.setState({year: parseInt(year), value})
	}



	render () {

			const {name, data, meta} = this.props


				/*console.log("index props ----", name, data, meta )*/
					let startYears = Object.keys(data[name]).sort();
					let startYear=	startYears[0];
					let EndYear = startYears[startYears.length - 1];
				/*	console.log('startYears----', startYear, EndYear)*/

				return (
					<TreeContainer>
						<div style={titleStyle}> TREEKEY: {name}</div>
						<div style={subTitleStyle}> 
							<div>START YEAR: {startYear}</div>
							<div>END YEAR: {EndYear} </div>
						</div>

							<div style={textStyle}>Year:{this.state.year} &nbsp; TRW:{this.state.value}</div>

					
						 <TreeRingChart name={name} data={data} meta={meta}  onChange={this.gotData} year={this.state.year} value={this.state.value} />

						<div className='linechartContainer' style={{marginTop: -40}}>

							<LineChart name={name} data={data} meta={meta}   onChange={this.gotData} year={this.state.year} value={this.state.value} />
							
						</div>
						
					</TreeContainer>
				);
		



	}



}





export default Tree;
