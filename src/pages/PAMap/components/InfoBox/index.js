import React, { Component } from "react";
import styled from "styled-components";

const InfoBoxContainer = styled.div`
	width: 300px;
	height: 600px;
	margin: 10px;
	border-radius: 10px;
	background: #2e2e2e;
	box-shadow:  -5px -5px 10px #272727, 
             5px 5px 15px #353535;
              border: 'dotted 2px #78909C';
`;

const InfoList = styled.ul`
	list-style: none;
	padding: 0px;

	li {
	
		padding-bottom: 5px;
		/*font-weight: bold;*/


	}
	
`


const titleStyle = {
	  borderRadius: "7px",
   /* background: "#fe5029", */  /* 10a6f9 fe5029*/ 
   /* boxShadow: "-4px 4px 8px #c77310, \n             4px -4px 8px #fd9314",*/
 /*   background:'#fd8d3c',*/
      background: "#f48826", //f89f34 //ee5133
     /* border: '2px solid #fd8d3c',*/
      /*borderBottomStyle: "solid",//fd8d3c
      borderTopStyle:'solid',
      borderRightStyle:'solid',
      borderLeftStyle:'solid',*/
     
      color: '#fefefe',
      fontSize: "16px",
      textAlign:'center',
      width: '100%',
      padding: '15px',
      fontFamily: 'Roboto',
      fontWeight: 'bold'
    
    };


const subTitleStyle = {

	  borderRadius: '10px',
      padding: '0.5rem',
    //  border: 'solid 1px #78909C',
      color: '#fefefe',
      fontSize: "15px",
 
      fontFamily: /*"Source Sans Pro",*/"Roboto",
     
      display: 'flex',
      flexWrap: "wrap",
      justifyContent: 'flex-start ',
      margin: '10px',
      fontWeight: 'bold'

    };  


const textStyle = {

	  borderRadius: '10px',
      padding: '0.5rem',
     //border: 'dotted 2px #78909C',
      color: '#fefefe',
      fontSize: "12px",
 
      fontFamily: /*"Source Sans Pro",*/"Roboto",
     
      display: 'flex',
      flexWrap: "wrap",
      justifyContent: 'flex-start ',
      margin: '15px',
     // fontWeight: 'bold'

    };  



const InfoBox = ({ xmlId,authors,species, meta}) => {
	console.log("index props ----", xmlId,authors,species )
	/*	let startYears = Object.keys(data[name]).sort();
		let startYear=	startYears[0];
		let EndYear = startYears[startYears.length - 1];*/
	/*	console.log('startYears----', startYear, EndYear)*/

	return (
		<InfoBoxContainer>

			<div style={titleStyle}> Study Site InfoBox </div>

			
			<div style={subTitleStyle}>{meta.studyName} </div>

			<div style={textStyle}>

			  <InfoList  style={{listStyle: 'none'}}>
				
				<li>XML ID: {xmlId}</li>
				<li>NOAA Study ID:  {meta.studyId} </li>
			    <li>Study Code:  {meta.studyCode} </li>
				<li style={{ fontWeight:'900'}}>Authors:  {authors} </li> {/*color: '#D4953C',*/}
				<li style={{ fontWeight:'900'}}>Species: {species} </li> {/*color: '#D4953C',*/}
		
				<li>DOI: <a href={meta.doi} target ='_blank' color>{meta.doi}</a> </li>
				<li>Original Data from NOAA ITRDB: <a href={meta.onlineResourceLink} target ='_blank'> {meta.onlineResourceLink}</a> </li>
		    	<li>Study Notes: {meta.studyNotes} </li>

			  </InfoList>
			</div>
		</InfoBoxContainer>
	);
};

export default InfoBox;
