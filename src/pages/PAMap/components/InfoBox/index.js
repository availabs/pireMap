import React, { Component } from "react";
import styled from "styled-components";

const InfoBoxContainer = styled.div`
	width: 280px;
	height: 300px;
	margin: 10px;
	border-radius: 10px;
	background: #2e2e2e;
	box-shadow:  -5px -5px 10px #272727, 
             5px 5px 15px #353535;
`;


const titleStyle = {
	  borderRadius: "7px",
    /*background: "#10a6f9",*/   /* 10a6f9 fe5029*/ 
   /* boxShadow: "-4px 4px 8px #c77310, \n             4px -4px 8px #fd9314",*/
 /*   background:'#fd8d3c',*/
      background: "#f89f34",
      border: '0.5px solid #fd8d3c', 
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
 /*     justifyContent: 'space-between',
      display: 'flex',*/
      fontWeight: 'bold'

    };  



const InfoBox = ({ xmlId,authors,species, studyNotes}) => {
	console.log("index props ----", xmlId,authors,species )
	/*	let startYears = Object.keys(data[name]).sort();
		let startYear=	startYears[0];
		let EndYear = startYears[startYears.length - 1];*/
	/*	console.log('startYears----', startYear, EndYear)*/

	return (
		<InfoBoxContainer>
			<div style={titleStyle}> Study Site InfoBox </div>
			<div style={subTitleStyle}> 
				<div>ID: {xmlId}</div>
				<div>Authors: {authors} </div>
					<div>Species: {species} </div>
					<div>Study Notes: {studyNotes} </div>

			</div>
			
		</InfoBoxContainer>
	);
};

export default InfoBox;
