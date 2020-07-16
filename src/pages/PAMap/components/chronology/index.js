import React, { Component } from "react";
import TreeRingChart from "./TreeRingChart";
import LineChart from "./LineChart";
import styled from "styled-components";

const TreeContainer = styled.div`
  width: 1800px;
  height: 700px;
  margin: 10px;
  align: center;
  border-radius: 20px;
  background: #2e2e2e;
    display: 'flex';
    justify-content: 'center';
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
      fontWeight: 'bold',
      display: "flex",
      justifyContent: 'center',
      flexDirection: 'row'
    
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
    const {name, data, meta } = this.props

      	return (


      		<TreeContainer>

      			<div style={titleStyle}> Chronology</div>



        		  <div style={{color: '#efefef'}}>Year:{this.state.year}</div>
              <div style={{color: '#efefef'}}>Ring Width Index:{this.state.value}</div>

        	  <div style={{ display: "flex", flexWrap: "wrap",    justifyContent: 'center'}} >

      				<LineChart name={name} data={data} meta={meta}  onChange={this.gotData} year={this.state.year} value={this.state.value}/>

      	      <TreeRingChart name={name} data={data} meta={meta} year={this.state.year} onChange={this.gotData} value={this.state.value}/>
      				
      			</div>
      			

      		
      		</TreeContainer>
      	);
      }
}


export default Tree;


