import React from "react";

import MapLayer from "components/AvlMap/MapLayer";

import geojson from "./geojson"

import styled from "styled-components"


let AboutText = {
  synchrony: `Climate change impacts extend well beyond an increase in temperature or changes in precipitation regimes. Climate change is affecting forest ecosystems around the world. Our forests offer many valuable services. For instance, trees are carbon sinks, capturing CO2 – the main greenhouse gas warming up our planet – from the air and storing it until they die. As climate change continues, the level of environmental stress that these trees are undergoing is changing, and so it is their potential to act as carbon sinks (among other functions).
How can we study the level of environmental stress of trees?
There are multiple ways to study this particular issue. In our case, we used more than a century’s worth of data (from 1901 to 2012) from NOAA’s International Tree Ring Data Bank to analyze historical tree growth at 3,579 forests around the world and study how climate is affecting their level of environmental stress. To do this, we assessed climate’s historical impacts, such as changes in precipitation and temperature, on forest tree-ring growth through a concept known as ‘synchrony’, which relies on the assumption that the world around us is a spatially, auto-correlated system. We found that a large portion of this synchrony can be explained by climate (temperature and precipitation). 
`,
  'future-synchrony': `The projected future synchrony.`,

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


    filter.domain.forEach(({value}) => {

      if(filter.value === value) {
        map.setLayoutProperty(value, 'visibility', 'visible');
      } else {
        map.setLayoutProperty(value, 'visibility', 'none');
      }
    })

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
      },
      {
        id: 'modeled-synchrony',
        source: {
          type: 'raster',
          url: 'mapbox://am3081.cn1kniyo'
        }
      },
      {
        id: 'future-synchrony',
        source: {
          type: 'raster',
          url: 'mapbox://am3081.33m9npzt'
        }
      },
       {
        id: 'synchrony-change',
        source: {
          type: 'raster',
          url: 'mapbox://am3081.3rzg13z6'
        }
      }
      
      
    ],
    layers: [
      {
        id :'synchrony',
        source: 'modeled-synchrony',
        'source-layer': 'modelled_synchrony_2-4aqax3',
        type: 'raster'
      },
      {
        id :'future-synchrony',
        source: 'future-synchrony',
        'source-layer': 'modelled_future_synchrony-7cb4wd',
        type: 'raster'
        
      },
      {
        id :'change',
        source: 'synchrony-change',
        'source-layer': 'modelled_synchrony_change-04jtt0',
        type: 'raster'
       
      },

      { 
        id: "forest-stress",
        source: "fs-source",
        type: "circle",
        paint: {
          "circle-color": ["to-color", ["get", "colora"], "#000"],
          "circle-radius": [
            "interpolate", ["linear"], ["zoom"],
            1, 4, 8, 15, 25, 40
          ],
          // "circle-blur": [
          //   "interpolate", ["linear"], ["zoom"],
          //   2, 1, 8, 0.5, 16, 0.0
          // ],
          "circle-pitch-alignment": "map"
        }
      },
      
    ],

    legend: {
          title: "Synchrony",
          type: "ordinal",
          types: ["ordinal"],
          vertical: false,
          range:["#CCE9F2","#E2F4F2","#6BA2CB","#83B9D7","#FFFFBF","#313695","#FDCD7E","#F67E4B","#F0F9D8","#9BCCE2","#5689BE","#FDB769","#BB1526","#E14631","#D22B26","#FEF0A9","#3A52A3","#436FB1","#EE613D","#FA9C58","#B4DDEB","#FEE294"],
          active: true,
          domain: [0.38,0.4,0.3,0.32,0.44,0.219634146,0.499661017,0.559722222,0.42,0.34,0.28,0.52,0.836451613,0.6,0.619047619,0.459821429,0.24,0.26,0.58,0.54,0.36,0.48] 

        
    },

/*        legend: {
          title: "Synchrony change",
          type: "ordinal",
          types: ["ordinal"],
          vertical: false,
          range:["#C9ECF4","#41AE76","NA","#00441B",""],
          active: true,
          domain: [0.069934628,0.119782239,null,0.173569187,null]  

        
    },
*/

 /*       legend: {
          title: "Synchrony significance",
          type: "ordinal",
          types: ["ordinal"],
          vertical: false,
          range:["#4393C3","#D6604D","NA"],
          active: true,
          domain: [0.049669276,0.049473881,null]
        
    },*/

    ...props,
    
    filters: {
      dataType: {
        name: "Data Type",
        type: "single",
        value: "synchrony",
        domain: [
          { name: "Modelled Synchrony", value: "synchrony", color: "colora" },
          { name: "Modelled Future Synchrony", value: "future-synchrony", color: "colora" },
          { name: "Modelled Synchrony Change", value: "change", color: "colorb" },
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
            <div style={{fontWeight: '700', fontSize: '1.3em'}}>{ this.props.name }</div>
           
          </StyledSelector>
           {this.props.selected ? (<div style={{padding: 10}}>{AboutText[this.props.value].split('\n').map(d => (<p style={{color: '#fff', lineHeight: '1.2em', fontSize: '1.2em'}}>{d}</p>))}</div>) : ''}
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
