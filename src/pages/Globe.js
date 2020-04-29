
import React, { Component, useState, useEffect } from "react";
/*import Chart from "pages/PAMap/components/svg.js";*/
/*import StudySite from "pages/PAMap/components/StudySite.js";
*/
import Charts from "pages/PAMap/components/Charts.js";
import Globe from 'pages/PAMap/components/globe/globe.react'
import dynamicData from 'pages/PAMap/components/globe/dynamicData'

import { ResponsiveLine as NivoLine } from "@nivo/line"

import * as d3array from "d3-array"
import { format as d3format } from "d3-format"

//const tempData = require('pages/PAMap/components/globe/data.json')
const tempData = require('pages/PAMap/components/globe/dynamic_data.js')

console.log('array length', tempData.data.length)

let startData = []
for(let i=0; i < 1787; i++) {
  startData[i] = ({x:i, y: null})
}

class Home extends React.Component {

  MOUNTED = false;

  state = {
    year: 1,
    allData: {},

    data: startData,
    min: Infinity,
    max: -Infinity
  }

  setState(...args) {
    this.MOUNTED && super.setState(...args);
  }

  componentDidMount() {
    this.MOUNTED = true;

    const MAX_YEAR = 1785, //1786,
      years = d3array.range(1, MAX_YEAR + 1);

    const allData = {},
      data = startData;

    let min = Infinity,
      max = -Infinity;

    years.reduce((a, c, i) =>
      a.then(() =>
        this.getData(c)
          .then(d => {
            allData[c] = d;

            const mean = d3array.mean(d);
            data.push({ x: c, y: mean });
            min = Math.min(min, mean);
            max = Math.max(max, mean);

            if (!(i % 50)) {
              this.setState({ allData, data, min, max });
            }
          })
      )
    , Promise.resolve())
      .then(() => this.setState({ allData, data, min, max }));
  }
  componentWillUnmount() {
    this.MOUNTED = false;
  }

  getData(year) {
    return fetch(`/data/climate/${ year }.json`)
      .then(res => res.json())
      .catch(err => (console.log('error', err), []));
  }

  render() {
    const { year, allData, data, min, max } = this.state,
      tickValues = [250, 500, 750, 1000, 1250, 1500, 1750]
        .filter(y => data.length >= y),
      _format = d3format(",d"),
      format = v => `${ _format(v) } AD`;

    return (
        <div style={ {
          width: "100vw",
          height: "100vh",
          backgroundColor: '#2e2e2e',
          position: "relative"
        } }>
          <Globe
            canvasData={ {
              header: {
                lo1: 0,
                la1: 90,
                dx: 2.5,
                dy: 1.9,
                nx: 144,
                ny: 96
               },
               data: allData[year] || []
            } }
            height={ '100%' }
            leftOffset={ 1 }
          />

          <div style={ {
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            width: "calc(100% - 25px)",
            borderRadius: "4px",
            position: "fixed",
            height: "150px",
            bottom: "10px",
            left: "10px",
          } }>
            <div style={ {
              position: "relative",
              height: "100%",
              width: "100%"
            } }>
              <NivoLine
                animate={ false }
                colors="#000"
                margin={ {
                  bottom: 30,
                  right: 20,
                  left: 50,
                  top: 20
                } }
                enableDots={ false }
                lineWidth={ 1 }
                enableGridX={ false }
                tooltipFormat=".2f"
                axisLeft={ {
                  tickValues: 4
                } }
                axisBottom={ {
                  tickValues,
                  format
                } }
                yScale={ {
                  type: "linear",
                  min: min * 0.9,
                  max: max * 1.1
                } }
                data={ [
                  { id: "Mean Temperature",
                    data }
                ] }/>
              </div>
          </div>
        </div>
      );
    }
}

export default {
  path: "/globe",
  exact: true,
  mainNav: true,
  menuSettings: {
    image: "none",
    display: "none",
    scheme: "color-scheme-dark",
    position: "menu-position-top",
    layout: "menu-layout-compact",
    style: "color-style-default"
  },
  name: "Global Climate",
  auth: false,
  component: Home
};
