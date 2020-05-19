
import React, { Component, useState, useEffect } from "react";
/*import Chart from "pages/PAMap/components/svg.js";*/
/*import StudySite from "pages/PAMap/components/StudySite.js";
*/
import Charts from "pages/PAMap/components/Charts.js";
import Globe from 'pages/PAMap/components/globe/globe.react'
import dynamicData from 'pages/PAMap/components/globe/dynamicData'

//const tempData = require('pages/PAMap/components/globe/data.json')
const tempData = require('pages/PAMap/components/globe/dynamic_data.js')

console.log('array length', tempData.data.length)


class Home extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      tempData: [],
      allData: {}
    }
    this.getData = this.getData.bind(this)

    this.getData()
  }

    
  getData () {
      
    console.time('loadAllYears')
    fetch("/data/climate/1.json")
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        this.setState({
          tempData: res,
        })
      })
      .catch(err => console.log('error', err));

  }


  render() {
    console.log('tempdata', this.state.tempData, this.state.tempData.length)

      
    return (

        <div style={{ width: "100vw", minHeight: "100vh", backgroundColor: '#2e2e2e' }}>
          <Globe
              canvasData={{
                "header": {
                  "lo1": 0,
                  "la1": 90,
                  "dx": 2.5,
                  "dy": 1.9,
                  "nx": 144,
                  "ny": 96
                 },
                 data: this.state.tempData
              }}
            
              height={'100vh'}
              leftOffset={1}
          />
        </div>
      );
    }
    
}

export default {
  path: "/test",
  exact: true,
  mainNav: false,
  menuSettings: {
    image: "none",
    display: "none",
    scheme: "color-scheme-dark",
    position: "menu-position-top",
    layout: "menu-layout-compact",
    style: "color-style-default"
  },
  name: "Test",
  auth: false,
  component: Home
};

