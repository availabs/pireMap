
import React, { Component, useState, useEffect } from "react";
/*import Chart from "pages/PAMap/components/svg.js";*/
/*import StudySite from "pages/PAMap/components/StudySite.js";
*/
import Charts from "pages/PAMap/components/Charts.js";
import Globe from 'pages/PAMap/components/globe/globe.react'
import dynamicData from 'pages/PAMap/components/globe/dynamicData'

import { ResponsiveLine as NivoLine } from "@nivo/line"

import colorbrewer from "colorbrewer"

import deepequal from "deep-equal"
import get from "lodash.get"
import styled from "styled-components"
import * as d3array from "d3-array"
import { format as d3format } from "d3-format"
import d3 from "d3v3"

//const tempData = require('pages/PAMap/components/globe/data.json')
// const tempData = require('pages/PAMap/components/globe/dynamic_data.js')
//
// console.log('array length', tempData.data.length)

const MAX_YEAR = 1785,
// const MAX_YEAR = 500,
  START_DATA = []
for (let i = 0; i < MAX_YEAR; ++i) {
  START_DATA.push({ x: i + 1, y: null });
}

const RANGE = [MAX_YEAR - 100, MAX_YEAR];

class Home extends React.Component {

  MOUNTED = false;

  state = {
    year: 0,
    allData: {},

    data: [...START_DATA],
    min: Infinity,
    max: -Infinity,

    mapClick: null,

    loading: false,

    displayMode: "global-temps",
    anomalyRange: [...RANGE],
    arUpdate: [...RANGE],
    anomalyRangeMeans: []
  }

  setState(...args) {
    this.MOUNTED && super.setState(...args);
  }

  componentDidMount() {
    this.MOUNTED = true;

    const years = d3array.range(1, MAX_YEAR + 1);

    const allData = {},
      data = [...START_DATA];

    let min = Infinity,
      max = -Infinity;

    this.setState({ loading: true });

    years.reduce((a, c, i) =>
      this.MOUNTED && a.then(() =>
        this.getData(c)
          .then(d => {
            allData[c] = d;

            const mean = d3array.mean(d);
            data[i] = { ...data[i], y: mean };
            min = Math.min(min, mean);
            max = Math.max(max, mean);

            if (!(i % 50)) {
              this.setState({ allData, data, min, max });
            }
            if(this.state.year === 0 ) {
              this.setState({year: 1})
            }
          })
      )
    , Promise.resolve())
      .then(() => {
        this.setState({ allData, data, min, max });
        this.calcAnomalyRangeMeans();
        this.setState({ loading: false });
      });
  }
  componentWillUnmount() {
    this.MOUNTED = false;
  }

  getData(year) {
    return fetch(`/data/climate/${ year }.json`)
      .then(res => res.json())
      .catch(err => (console.log('error', err), []));
  }

  getLineData() {
    const { data, anomalyRangeMeans, displayMode } = this.state,
      arMean = d3array.mean(anomalyRangeMeans);
    switch (displayMode) {
      case "global-temps":
        return data;
      case "global-anomalies":
        return data.map(({ y, x }) => ({ y: y - arMean, x }));
    }
  }

  getGlobeData() {
    const { allData, year, displayMode, anomalyRangeMeans } = this.state,
      data = get(allData, year, []);
    switch (displayMode) {
      case "global-temps":
        return data;
      case "global-anomalies":
        return data.map((t, i) => t - anomalyRangeMeans[i]);
    }
  }

  updateAnomalyRange(ar11, ar22) {
    const [ar1, ar2] = this.state.arUpdate;
    if (ar11) {
      ar11 = Math.round(ar11);
    }
    if (ar22) {
      ar22 = Math.round(ar22);
    }
    this.setState({ arUpdate: [ar11 || ar1, ar22 || ar2] });
  }
  setAnomalyRange() {
    this.clearMapClick();
    this.setState({
      anomalyRange: [...this.state.arUpdate]
    })
    this.calcAnomalyRangeMeans();
  }
  calcAnomalyRangeMeans() {
    this.setState(state => {
      const [l, h] = state.anomalyRange,
        num = h - l + 1;
      let means = null;
      for (let y = l; y <= h; ++y) {
        if (means === null) {
          means = [...state.allData[y]];
        }
        else {
          state.allData[y].forEach((v, i) => means[i] += v);
        }
      }
      return {
        anomalyRangeMeans: means.map(v => v / num)
      }
    })
  }

  clearMapClick() {
    this.setState({
      mapClick: null
    })
  }

  setDisplayMode(dm) {
    this.clearMapClick();
    this.setState({
      displayMode: dm
    })
    d3.select("#foreground .location-mark").remove();
  }
  onGlobeClick(coords, temp, index) {
    this.setState({ mapClick: { coords, temp, index } });
  }

  getScaleDomain(data) {
    if (this.state.displayMode === "global-anomalies") {
      // return [-4, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 4];
      const cheatingScaleTwo = d3.scale.quantile()
        .domain(data)
        .range([0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
      return cheatingScaleTwo.quantiles();
    }
    return [-25, -15, -10, -6, -3, 0, 10, 20, 26, 27, 28];
  }

  render() {
    const {
        year, allData, anomalyRangeMeans,
        anomalyRange, arUpdate,
        mapClick, loading, displayMode
      } = this.state,
      lineData = this.getLineData(),
      tickValues = [250, 500, 750, 1000, 1250, 1500, 1750]
        .filter(y => lineData.length >= y),
      _format = d3format(",d"),
      format = v => `${ _format(v) } AD`,
      float = d3format(".2f");

    const [min, max] = d3array.extent(lineData, d => d.y);

    let tMin = min, tMax = max;
    const indexData = Object.keys(allData)
      .sort((a, b) => a - b)
      .reduce((a, x) => {
        if (mapClick) {
          let y = allData[x][mapClick.index];
          if (this.state.displayMode === "global-anomalies") {
            y -= anomalyRangeMeans[mapClick.index];
          }
          tMin = Math.min(tMin, y);
          tMax = Math.max(tMax, y);
          a.push({ x, y });
        }
        return a;
      }, []);

    const colors = colorbrewer["RdYlBu"][11].slice().reverse(),
      globeData = this.getGlobeData(),
      scaleDomain = this.getScaleDomain(globeData),
      _lFormat = displayMode === "global-anomalies" ? d3format(".2f") : (v => v),
      lFormat = v => `${ _lFormat(v) }°C`

    return (
      <div style={ {
        width: "100vw",
        height: "100vh",
        backgroundColor: '#2e2e2e',
        position: "relative",
        marginTop: "-51px"
      } }>
        <Globe useQuantiles={ displayMode === "global-anomalies" }
          onGlobeClick={ (...args) => this.onGlobeClick(...args) }
          onPointRemove={ () => this.clearMapClick() }
          scaleDomain={ scaleDomain }
          canvasData={ {
            header: {
              lo1: 0,
              la1: 90,
              dx: 2.5,
              dy: 1.9,
              nx: 144,
              ny: 96
             },
             data: globeData
          } }
          height={ '100%' }
          leftOffset={ 1 }
          year={this.state.year}
          displayMode={this.state.displayMode}
          anomalyRange={this.state.anomalyRange}
        />

          <div style={ {
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            position: "absolute",
            borderRadius: "4px",
            top: "61px",
            left: "10px",
          } }>
            <LegendContainer>
              <div>Temperatures</div>
              <div>
                { colors.map(c =>
                    <div key={ c }
                      style={ { width: "50px", height: "25px", backgroundColor: c} }/>
                  )
                }
              </div>
              <div>
                { scaleDomain.map(d =>
                    <div key={ d } style={ { width: "50px", height: "25px" } }>
                     { lFormat(d) }
                    </div>
                  )
                }
              </div>
            </LegendContainer>
          </div>

        <div style={ {
          backgroundColor: "rgba(255, 255, 255, 0.75)",
          position: "absolute",
          borderRadius: "4px",
          top: "61px",
          right: "10px",
          width: "300px"
        } }>
          <div style={ { padding: "15px 20px" } }>
            <div>Current Year: { year } AD</div>
            <div>Mean Tempuature: { float(d3array.mean(allData[year] || [])) }{ '°' }C</div>
            { !get(this.state, ["mapClick"], null) ? null :
              <>
                <div style={ { borderBottom: "2px solid currentColor", margin: "5px 0px" } }/>
                <div>Coords: { mapClick.coords }</div>
                <div>
                  Temperature{ displayMode === "global-anomalies" ? " Difference" : "" }:
                  {" "}{ float(mapClick.temp) }{ '°' }C
                </div>
              </>
            }
            <div style={ { borderBottom: "2px solid currentColor", margin: "5px 0px" } }/>
            <Dropdown disabled={ loading }
              onSelect={ v => this.setDisplayMode(v) }
              value={ displayMode }
              options={ [
                { name: "Global Temperatures", value: "global-temps" },
                { name: "Global Anomalies", value: "global-anomalies" }
              ] }/>
            { displayMode === "global-temps" ? null :
              <>
                <div style={ { marginTop: "5px" } }>
                  Base Anamoly Range
                </div>
                <InputContainer>
                  <Input
                    prefix="Start"
                    postfix="AD"
                    type="number"
                    min={ 1 }
                    max={ MAX_YEAR }
                    value={ arUpdate[0] }
                    onChange={
                      e => this.updateAnomalyRange(+e.target.value, null)
                    }/>
                  <Input
                    prefix="End"
                    postfix="AD"
                    type="number"
                    min={ 1 }
                    max={ MAX_YEAR }
                    value={ arUpdate[1] }
                    onChange={
                      e => this.updateAnomalyRange(null, +e.target.value)
                    }/>
                  <Button disabled={ deepequal(anomalyRange, arUpdate) }
                    onClick={ () => this.setAnomalyRange() }>
                    Update Anomaly Range
                  </Button>
                </InputContainer>
              </>
            }
          </div>
        </div>

        <div style={ {
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          borderRadius: "4px",
          position: "fixed",
          height: "150px",
          bottom: "10px",
          left: "10px",
          right: "10px"
        } }>
          <div style={ {
            position: "relative",
            height: "100%",
            width: "100%"
          } }>

            <NivoLine
              colors={ ["#047bf8", "#a00"] }
              theme={{
                axis: {
                  ticks: {
                    text: {
                      fill: '#eee',
                      fontSize: '14px',

                    },
                    line: {
                      stroke: '#888'
                    }
                  }
                },
                grid: {
                  line: {
                    stroke: '#888',
                    strokeWidth: 1
                  }
                },
              }}
              margin={ {
                bottom: 30,
                right: 20,
                left: 50,
                top: 20
              } }
              onClick={ data => this.setState({ year: data.index }) }
              enablePoints={ false }
              lineWidth={ 1 }
              enableGridX={ false }
              tooltip={
                p => (
                  <ToolTip point={ p.point }
                    xFormat={ format }
                    yFormat={ float }/>
                )
              }
              useMesh={ true }
              axisLeft={ {
                tickValues: 4
              } }
              axisBottom={ {
                tickValues,
                format
              } }
              yScale={ {
                type: "linear",
                min: tMin * 0.9,
                max: tMax * 1.1
              } }
              data={ [
                { id: "Mean Temperature",
                  title: "Mean Tempuature",
                  data: lineData },
                { id: "Index",
                  title: "",
                  data: indexData }
              ] }/>
            </div>
        </div>
      </div>
    );
  }
}

const LegendContainer = styled.div`
  padding: 8px 20px 5px 20px;
  display: flex;
  flex-direction: column;

  > div {
    display: flex;
  }
  > div:first-child {
    font-size: 18px;
  }

  > div > div {
    text-align: center;
  }
  > div > div:first-child {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }
  > div > div:last-child {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }
`

const InputContainer = styled.div`
  > * {
    margin-bottom: 5px;
  }
  > *:last-child {
    margin-bottom: 0px;
  }
`
const InputDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  > * {
    padding: 2px 10px 1px 10px;
  }
  > input {
    border: 2px solid currentColor;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    width: 60%;
  }
  > .postfix {
    border: 2px solid currentColor;
    border-left: none;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`
const StyledInput = styled.input`
  background-color: rgba(255, 255, 255, 0.5);
`
const Input = ({ prefix, postfix, ...rest }) =>
  <InputDiv>
    { prefix ? <div>{ prefix }</div> : null }
    <StyledInput { ...rest }/>
    { postfix ? <div className="postfix">{ postfix }</div> : null }
  </InputDiv>

const ToolTip = ({ d, point, xFormat, yFormat }) => {
  return ( <div style={ {
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "3px"
  } }>
    { xFormat(point.data.x) } { point.serieId }: { yFormat(point.data.y) }{ '°' }C
  </div>)
}


const Button = styled.button`
  width: 100%;
  border: 2px solid currentColor;
  border-radius: 4px;
  padding: 2px 10px 1px 10px;
  cursor: pointer;
  background-color: transparent;
  color: currentColor;
  :hover {
    background-color: rgba(255, 255, 255, 0.5);
  }
  :disabled {
    background-color: rgba(0, 0, 0, 0.25);
  }
  :disabled:hover {
    cursor: not-allowed;
  }
`

const StlyedContentContainer = styled.div`
  position: absolute;
  left: 0px;
  top: 100%;
  padding-top: 5px;
  cursor: default;
`
const StyledDropdownContent = styled.div`
  padding: 5px;
  background-color: #eee;
  border-radius: 4px;
`
const DropdownContent = ({ children }) =>
  <StlyedContentContainer className="dropdown-content">
    <StyledDropdownContent>
      { children }
    </StyledDropdownContent>
  </StlyedContentContainer>

const StyledDropdownItem = styled.div`
  border: 2px solid transparent;
  border-radius: 3px;
  padding: 1px 10px 0px 10px;
  cursor: pointer;
  margin-bottom: 2px;
  :last-child {
    margin-bottom: 0px;
  }
  &.selected, :hover {
    border-color: currentColor;
    background-color: #cfcfcf;
  }
  &.selected:hover {
    cursor: not-allowed;
  }
`
const StyledDropdown = styled.div`
  border: 2px solid currentColor;
  border-radius: 4px;
  padding: 2px 10px 1px 10px;
  position: relative;
  cursor: s-resize;

  > .dropdown-content {
    display: none;
    width: 100%;
  }
  :hover {
    background-color: rgba(255, 255, 255, 0.5);
  }
  &.disabled {
    background-color: rgba(0, 0, 0, 0.25);
  }
  &.disabled:hover {
    cursor: not-allowed;
  }
  :hover > .dropdown-content {
    display: block;
  }
  &.disabled:hover > .dropdown-content {
    display: none;
  }
`
const Dropdown = ({ disabled, value, options = [], onSelect = (() => {}) }) =>
  <StyledDropdown className={ disabled ? "disabled" : null }>
    { options.reduce((a, c) => c.value === value ? c.name : a, "Select a value") }
    <DropdownContent>
      { options.map((o, i) =>
          <StyledDropdownItem key={ o.value }
            className={ o.value === value ? "selected" : "" }
            onClick={ o.value === value ? null : (e => onSelect(o.value)) }>
            { o.name }
          </StyledDropdownItem>
        )
      }
    </DropdownContent>
  </StyledDropdown>

export default {
  path: "/phyda",
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
  name: "PHYDA",
  auth: false,
  component: Home
};
