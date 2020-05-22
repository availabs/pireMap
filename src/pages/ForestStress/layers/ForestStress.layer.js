import React from "react";

import MapLayer from "components/AvlMap/MapLayer";

import geojson from "./geojson"

import styled from "styled-components"


let AboutText = {
  synchrony: `Climate change impacts extend well beyond an increase in temperature or changes in precipitation regimes. Climate change is affecting forest ecosystems around the world. Our forests offer many valuable services. For instance, trees are carbon sinks, capturing CO2 – the main greenhouse gas warming up our planet – from the air and storing it until they die. As climate change continues, the level of environmental stress that these trees are undergoing is changing, and so it is their potential to act as carbon sinks (among other functions).
How can we study the level of environmental stress of trees?
There are multiple ways to study this particular issue. In our case, we used more than a century’s worth of data (from 1901 to 2012) from NOAA’s International Tree Ring Data Bank to analyze historical tree growth at 3,579 forests around the world and study how climate is affecting their level of environmental stress. To do this, we assessed climate’s historical impacts, such as changes in precipitation and temperature, on forest tree-ring growth through a concept known as ‘synchrony’, which relies on the assumption that the world around us is a spatially, auto-correlated system. We found that a large portion of this synchrony can be explained by climate (temperature and precipitation).
`,
  change: `What does synchrony mean?
A forest with high synchrony is more environmentally stressed. In other words, the climate stress levels of that forest are higher, and the opposite is true in forests with low synchrony. Both high and low synchrony forests have multiple implications. For instance, a high synchrony forest would have less potential to act as a carbon pool, and a low synchrony forest would be more affected by local characteristics (competition, insect outbreaks, fires, etc..). Synchrony can therefore serve as a tool for diagnosing effects of global climate change on tree growth of global forests.
`,
  significance: `Why is this important?
It is crucial to understand how the synchrony of the different forests around the world is changing with climate to determine potential adaptation/ mitigation measures for specific regions.
In addition, we use our model to predict the stress levels of the global forests in the current climate and in a future climate scenario (2045-2060). As a result, we are able to detect the potential changes that the global forests will undergo in the near future, giving us a tool to determine potential measures for ecosystem management in specific regions.
`

}

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
        <div>
          <StyledSelector
            className={ this.props.selected ? "selected" : null }
            onClick={ this.props.selected ? null : this.props.onClick }>
            <div style={ { width: "30px" } }>
              <span className="fa fa-check"/>
            </div>
            <div>{ this.props.name }</div>
           
          </StyledSelector>
           {this.props.selected ? (<div style={{padding: 10}}>{AboutText[this.props.value]}</div>) : ''}
        </div>
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
