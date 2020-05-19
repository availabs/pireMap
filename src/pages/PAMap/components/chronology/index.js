import React, { Component } from "react";
import TreeRingChart from "./TreeRingChart";
import LineChart from "./LineChart";
import styled from "styled-components";

const TreeContainer = styled.div`
	width: 1235px;
	height: 500px;
	margin: 10px;
	border-radius: 20px;
	background: #2e2e2e;
    align-items: center;
	box-shadow:  -5px -5px 10px #272727, 
             5px 5px 15px #353535;
`;



//const titleStyle = {
	/*  borderRadius: "7px",*/
    /*background: "#10a6f9",*/   /* 10a6f9 fe5029*/ 
   /* boxShadow: "-4px 4px 8px #c77310, \n             4px -4px 8px #fd9314",*/
 /*   background:'#fd8d3c',*/
     /* background: "#f89f34",*/
/*      border: '0.5px solid #fa851a',  //orange--fd8d3c  blue--2296f3
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
      fontWeight: 'bold'*/
    
   // };


const titleStyle = {
	  borderRadius: "7px",
      background: "#f48826", //f89f34 //ee5133
      color: '#fefefe',
      fontSize: "16px",
      textAlign:'center',
      width: '100%',
      padding: '15px',
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


const Tree = ({ name, data, meta, ...rest }) => {
	console.log("index props ----", name, data, meta )
		let startYears = Object.keys(data[name]).sort();
		let startYear=	startYears[0];
		let EndYear = startYears[startYears.length - 1];
	/*	console.log('startYears----', startYear, EndYear)*/

	return (
		<TreeContainer>
			<div style={titleStyle}> Chronology</div>
		

			<div className='linechartContainer' style={{marginTop: 40}}>

				<LineChart name={name} data={data} meta={meta}  />
				
			</div>
			

			{/*<TreeRingChart name={name} data={data} meta={meta}/>*/}
		</TreeContainer>
	);
};

export default Tree;


