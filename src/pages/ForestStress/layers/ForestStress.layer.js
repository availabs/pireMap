import React from "react";

import MapLayer from "components/AvlMap/MapLayer";

import geojson from "./geojson"

import styled from "styled-components"

class ForestStressLayer extends MapLayer {
  render(map) {
    const filter = this.filters.dataType,
      color = filter.domain.reduce((a, c) => c.value === filter.value ? c.color : a, "#000");

    map.setPaintProperty("forest-stress", "circle-color",
      ["to-color", ["get", color], "#000"]
    );
    map.setPaintProperty("forest-stress", "circle-opacity",
      ["case", ["==", ["get", color], "NA"], 0.5, 1.0]
    );
    // map.setLayoutProperty("forest-stress", "circle-sort-key", 3);
  }
}

export default (props = {}) =>
  new ForestStressLayer("Forest Stress", {
    version: 2.0,

    sources: [
      { id: "fs-source",
        source: {
          type: "geojson",
          data: geojson
        }
      }
    ],
    layers: [
      { id: "forest-stress",
        source: "fs-source",
        type: "circle",
        paint: {
          "circle-color": ["to-color", ["get", "colora"], "#000"],
          "circle-radius": [
            "interpolate", ["linear"], ["zoom"],
            2, 10, 10, 60, 20, 120
          ],
          "circle-blur": [
            "interpolate", ["linear"], ["zoom"],
            2, 1, 8, 0.5, 16, 0.0
          ],
          "circle-pitch-alignment": "map"
        }
      }
    ],

    ...props,
    
    filters: {
      dataType: {
        name: "Data Type",
        type: "single",
        value: "synchrony",
        domain: [
          { name: "Synchrony", value: "synchrony", color: "colora" },
          { name: "Synchrony Change", value: "change", color: "colorb" },
          { name: "Synchrony Significance", value: "significance", color: "colorc" }
        ]
      }
    },
    infoBoxes: {
      dataType: {
        title: "Data Type",
        comp: DataTypeSelector,
        show: true
      }
    }
  })

  const StyledSelector = styled.div`
    padding: 2px;
    position: relative;
    display: flex;
    width: 100%;
    border: 2px solid transparent;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.15s;
    margin-bottom: 3px;
    :last-child {
      margin-bottom: 0px;
    }

    > div {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    > div > span.fa {
      display: none;
    }
    &.selected, :hover {
      border-color: currentColor;
    }
    &.selected > div > span.fa {
      display: inline-block;
    }
  `

  class Selector extends React.Component {
    render() {
      return (
        <StyledSelector
          className={ this.props.selected ? "selected" : null }
          onClick={ this.props.selected ? null : this.props.onClick }>
          <div style={ { width: "30px" } }>
            <span className="fa fa-check"/>
          </div>
          <div>{ this.props.name }</div>
        </StyledSelector>
      )
    }
  }

  class DataTypeSelector extends React.Component {
    render() {
      const filter = this.props.layer.filters.dataType,
        domain = filter.domain;
      return (
        <div style={ { padding: "10px" } }>
          { domain.map(d =>
              <Selector key={ d.value }
                name={ d.name }
                value={ d.value }
                selected={ d.value === filter.value }
                onClick={ () => this.props.layer.doAction(["updateFilter", "dataType", d.value]) }/>
            )
          }
        </div>
      )
    }
  }
