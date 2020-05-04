
import React, { Component, useState, useEffect } from "react";
/*import Chart from "pages/PAMap/components/svg.js";*/
/*import StudySite from "pages/PAMap/components/StudySite.js";
*/
import Charts from "pages/PAMap/components/Charts.js";
import Globe from 'pages/PAMap/components/globe/globe.react'
import dynamicData from 'pages/PAMap/components/globe/dynamicData'

import { ResponsiveLine as NivoLine } from "@nivo/line"

import deepequal from "deep-equal"
import get from "lodash.get"
import styled from "styled-components"
import * as d3array from "d3-array"
import { format as d3format } from "d3-format"

//const tempData = require('pages/PAMap/components/globe/data.json')
// const tempData = require('pages/PAMap/components/globe/dynamic_data.js')
//
// console.log('array length', tempData.data.length)

const MAX_YEAR = 1785,
  START_DATA = []
for (let i = 0; i < MAX_YEAR; ++i) {
  START_DATA.push({ x: i + 1, y: null });
}

const RANGE = [MAX_YEAR - 100, MAX_YEAR];

class Home extends React.Component {

  MOUNTED = false;

  state = {
    year: 1,
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
          })
      )
    , Promise.resolve())
      .then(() => {
        const [l, h] = this.state.anomalyRange,
          num = h - l + 1;
        let means = null;
        for (let y = l; y <= h; ++y) {
          if (means === null) {
            means = [...this.state.allData[y]];
          }
          else {
            this.state.allData[y].forEach((v, i) => means[i] += v);
          }
        }
        this.setState({
          loading: false,
          allData, data, min, max,
          anomalyRangeMeans: means.map(v => v / num)
        })
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
    this.setState({
      anomalyRange: [...this.state.arUpdate],
      mapClick: null
    })
  }

  render() {
    const { year, allData, data, min, max, anomalyRange, arUpdate } = this.state,
      tickValues = [250, 500, 750, 1000, 1250, 1500, 1750]
        .filter(y => data.length >= y),
      _format = d3format(",d"),
      format = v => `${ _format(v) } AD`,
      float = d3format(".2f");

    return (
        <div style={ {
          width: "100vw",
          height: "100vh",
          backgroundColor: '#2e2e2e',
          position: "relative",
          marginTop: "-51px"
        } }>
          <Globe
            onGlobeClick={
              (coords, temp) => this.setState({ mapClick: { coords, temp } })
            }
            canvasData={ {
              header: {
                lo1: 0,
                la1: 90,
                dx: 2.5,
                dy: 1.9,
                nx: 144,
                ny: 96
               },
               data: this.getGlobeData()
            } }
            height={ '100%' }
            leftOffset={ 1 }
          />

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
                  <div>Coords: { this.state.mapClick.coords }</div>
                  <div>
                    Temperature{ this.state.displayMode === "global-anomalies" ? " Difference" : "" }:
                    {" "}{ float(this.state.mapClick.temp) }{ '°' }C
                  </div>
                </>
              }
              <div style={ { borderBottom: "2px solid currentColor", margin: "5px 0px" } }/>
              <Dropdown disabled={ this.state.loading }
                onSelect={ v => this.setState({ displayMode: v, mapClick: null }) }
                value={ this.state.displayMode }
                options={ [
                  { name: "Global Temperatures", value: "global-temps" },
                  { name: "Global Anomalies", value: "global-anomalies" }
                ] }>
              </Dropdown>
              { get(this.state, ["displayMode"]) === "global-temps" ? null :
                <>
                  <div style={ { marginTop: "5px" } }>
                    Base Anaomly Range
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
            backgroundColor: "rgba(255, 255, 255, 0.75)",
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
                colors="#000"
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

const ToolTip = ({ point, xFormat, yFormat }) =>
  <div style={ {
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "3px"
  } }>
    { xFormat(point.data.x) }: { yFormat(point.data.y) }{ '°' }C
  </div>

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
