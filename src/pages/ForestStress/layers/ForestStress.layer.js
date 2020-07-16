import React from "react";

import MapLayer from "components/AvlMap/MapLayer";

import geojson from "./geojson"

import styled from "styled-components"

import { getColorRange } from "constants/color-ranges";


let AboutText = {
  synchrony: 'Synchrony refers to the growth patterns between multiple trees aligning over time so that their patterns appear to be in sync both with each other and with the climate. Red denotes greater Synchrony and indicates more environmental stress.',
  'future_synchrony': '',
  change: 'Over time, changes in the synchrony of growth patterns indicates either diminished or intensified environmental stress.',
  significance: 'The significance divides synchrony change into two categories: “increased” (more environmental stress) or “decreased” (less environmental stress).',
['synchrony-m'] : 'Compiling and mapping observed synchrony data allows us to depict a current model of climate synchrony.',
['future_synchrony-m'] : 'Based on collected data, this model forecasts the climate synchrony in the years 2045 to 2065.',
['change-m'] : 'Synchrony change methodology can be applied to the forecast model to depict locations that are anticipated to see either increased or decreased synchrony.'

}

/*

let rangeArray = [ {"colora": ["#CCE9F2","#E2F4F2","#6BA2CB","#83B9D7","#FFFFBF","#313695","#FDCD7E","#F67E4B","#F0F9D8","#9BCCE2","#5689BE","#FDB769","#BB1526","#E14631","#D22B26","#FEF0A9","#3A52A3","#436FB1","#EE613D","#FA9C58","#B4DDEB","#FEE294"]
  }, {"colorb": ["#C9ECF4","#41AE76","NA","#00441B",""]}, 
  {"colorc": ["#4393C3","#D6604D","NA"]} ]

let domainArray = [
  {"synchrony": [0.38,0.4,0.3,0.32,0.44,0.219634146,0.499661017,0.559722222,0.42,0.34,0.28,0.52,0.836451613,0.6,0.619047619,0.459821429,0.24,0.26,0.58,0.54,0.36,0.48]}, 
  {"change":[0.069934628,0.119782239,null,0.173569187,null] }, 
  {"significance": [0.049669276,0.049473881,null]}]*/
   

const sections = {

    "Observations": [
          { name: "Synchrony", value: "synchrony", color: "colora", scale: 'synchrony', range: getColorRange(11,'RdYlBu').reverse()},
          { name: "Synchrony change", value: "change", color: "colorb", scale: 'change', range: getColorRange(3,'BuGn') },
          { name: "Synchrony Significance", value: 'significance', color: "colorc",  scale: 'significance', range: getColorRange(4,'RdBu')}
      ],

      'Model':[
          { name: "Current climate synchrony ", value: "synchrony-m",  scale: 'synchrony', range: getColorRange(11,'RdYlBu').reverse()},
          { name: "Future climate (2045-2065) synchrony  ", value: "future_synchrony-m",  scale: 'synchrony', range: getColorRange(11,'RdYlBu').reverse()},
          { name: "Future synchrony change ", value: "change-m", scale: 'change', range: getColorRange(9,'BrBG').reverse(), domain: [0.2,.15,0.1,0.05,0,-0.05,-.1,-.15,-.2] }
      ]

}



class ForestStressLayer extends MapLayer {
  render(map) {

    const filter = this.filters.dataType,
    color = filter.domain.reduce((a, c) => c.value === filter.value ? c.color : a, "#000");

    let selection = filter.domain.filter(d => d.value === filter.value)[0]

    console.log('what', geojson.features[0].properties, selection.scale)
    if(selection.domain) {
      this.legend.type = 'threshold'

      this.legend.domain = selection.domain
      this.legend.range = selection.range
      console.log('fsc',selection.range, selection.domain, this)
    } else {


      this.legend.type = 'quantile'
      this.legend.domain = geojson.features
        .filter(d => +d.properties[selection.scale])
        .map(d => +d.properties[selection.scale].toFixed(2)).sort()
      this.legend.range = selection.range
      this.legend.active = true
    }
    

    


    filter.domain.forEach(({value}) => {

      if(filter.value === value) {
        map.setLayoutProperty(value, 'visibility', 'visible');
      } else {
        map.setLayoutProperty(value, 'visibility', 'none');
      }
    })

    // 'synchrony'.split('-')  => ['synchrony'] 
    // 'synchrony-m'.splint('-') => ['synchrony', 'm']
    if(filter.value.split('-')[1]) {
      map.setLayoutProperty('forest-stress', 'visibility', 'none');
    } else {
      map.setLayoutProperty('forest-stress', 'visibility', 'visible');
    }


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
        id: 'future_synchrony',
        source: {
          type: 'raster',
          url: 'mapbox://am3081.33m9npzt'
        }
      },
       {
        id: 'synchrony-change',
        source: {
          type: 'raster',
          url: 'mapbox://am3081.6apbxl4c'
        }
      }
      
      
    ],
    layers: [
      {
        id :'synchrony-m',
        source: 'modeled-synchrony',
        'source-layer': 'modelled_synchrony_2-4aqax3',
        type: 'raster'
      },
      {
        id :'future_synchrony-m',
        source: 'future_synchrony',
        'source-layer': 'modelled_future_synchrony-7cb4wd',
        type: 'raster'
        
      },
      {
        id :'change-m',
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
          range:[],

          active: false,
          domain: []


        
    },



    ...props,
    
    filters: {
      dataType: {
        name: "Data Type",
        type: "single",
        value: "synchrony",
        domain: [

      /*    { name: "Modelled Synchrony", value: "synchrony", color: "colora" },
          { name: "Modelled Future Synchrony", value: "future_synchrony", color: "colora" },
          { name: "Modelled Synchrony Change", value: "change", color: "colorb" },
          { name: "Synchrony Significance", value: "significance", color: "colorc" }
*/  
          ...sections.Observations,
          ...sections.Model  

        ]
      }
    },
    infoBoxes: {
      dataType: {
        title: "",
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
            <div style={{fontWeight: '700', fontSize: '1.3em', color: '#e2f4f2'}}>{ this.props.name }</div>
           
          </StyledSelector>
           {this.props.selected ? 
            (<div style={{padding: 10}}>
              {
                AboutText[this.props.value].split('\n')
                .map(d => (<p style={{color: '#cce9f2', lineHeight: '1.2em', fontSize: '1.2em'}}>{d}</p>))
              }
            </div>) 
            : ''}
        </div>
      )
    }
  }

  class DataTypeSelector extends React.Component {
    render() {
      const filter = this.props.layer.filters.dataType,
        domain = filter.domain;
      return (
        <div>
          <h4 style={{color: '#efefef'}}>About</h4>
          <div style={{padding: 10}}>
            <p style={{color: '#cce9f2', lineHeight: '1.2em', fontSize: '1.2em'}}>
             About Text Goes here
            </p>
          </div>
        {Object.keys(sections) // == ['Observations', 'Model']
        .map(section => 
          <div style={ { padding: "10px" } }>

            <h4 style={{color: '#efefef'}}>{section}</h4>
            <div>
              { sections[section].map(d =>
                  <Selector key={ d.value }
                    name={ d.name }
                    value={ d.value }
                    selected={ d.value === filter.value }
                    onClick={ () => this.props.layer.doAction(["updateFilter", "dataType", d.value]) }/>
                )
              }
            </div>
          </div>
        )}
        </div>
      )
    }
  }
