import React from "react";

import MapLayer from "../../../components/AvlMap/MapLayer";
import {
  register,
  unregister
} from "../../../components/AvlMap/ReduxMiddleware";
import { getColorRange } from "constants/color-ranges";
import { EventSource } from "./eventSource";
import { scaleQuantile, scaleQuantize, scaleThreshold } from "d3-scale";

import { fnum } from "utils/sheldusUtils";
import summary from "./summary";

class PAEventsLayer extends MapLayer {
  onAdd(map) {
    /*      let local_estimate = [];
      EventSource.source.data.features.forEach(item =>{
          if(item.properties['LOCAL ESTIMATE']){
              item.properties['LOCAL ESTIMATE'] = parseFloat(item.properties['LOCAL ESTIMATE'].toString().replace(/,/g, '')) || "0"
              local_estimate.push(item.properties['LOCAL ESTIMATE'])
          }

      });*/
    map.addSource("events_source", EventSource.source);
    // console.log('events_source', EventSource.source.data.features.forEach(d => console.log(d, d.properties['local_estimate'])))
    //console.log('local_estimate', local_estimate)

    map.addLayer({
      id: "events_layer",
      type: "circle",
      source: "events_source",
      paint: {
        "circle-radius": 5,
        "circle-opacity": 0.8,
        "circle-color": "rgb(171, 72, 33)"
      }
      /*{
              'circle-radius':
              ["step",["get","local_estimate"],
              2,
              0,
              3,
              50000,
              4,
              100000,
              6,
              500000,
              8,
              1000000,
              10
              ],
              // [
              //     'interpolate',['linear'],['zoom'],
              //     10,
              //     ['/',
              //      ['number', ['get', 'local_estimate'], 1000],
              //       100000]
              // ],
                  //["get", ["to-string", ["get", "local_estimate"]], ["literal",tmpObj]],
              'circle-opacity': 0.8,
              'circle-color':
              ["step",["get","local_estimate"],
                  "#fcffff",
                  0,
                  "#fcbba1",
                  15000,
                  "#fb6a4a",
                  50000,
                  "#ef3b2c",
                  100000,
                  "#cb181d",
                  500000,
                  "#a50f15",
                  1000000,
                  "#67000d"

              ]

          }*/
    });
  }
}

const PaLayer = (options = {}) =>
  new PAEventsLayer("Public Assistance Damage", {
    active: true,
    sources: [],
    layers: [],
    studyData: {},
    legend: {
      title: "",
      type: "quantile",
      types: ["quantile", "quantize"],
      vertical: false,
      range: [],
      active: true,
      domain: []
    },
    /*    legend: {
      title: "October Storm 2019 Events",
      subtitle: "Test 123",
      type: "ordinal",
      types: ["ordinal"],
      //vertical: true,
      range: ["#fcbba1", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"],
      active: true,
      domain: ["$15k", "$50k", "$100k", "$500k", "$1M", ""]
    },*/

    popover: {
      layers: ["events_layer"],
      dataFunc: function(topFeature, features) {
        //const { id } = topFeature.properties;
        console.log("mouseover", topFeature.properties);
        if (this.studyData[topFeature.properties.xmlId]) {
          return [
            [this.studyData[topFeature.properties.xmlId].studyName],
            ["xmlId", topFeature.properties.xmlId],

            [this.studyData[topFeature.properties.xmlId].studyNotes]
          ];
        } else {
          let studyUrl = `https://www.ncdc.noaa.gov/paleo-search/study/search.json?xmlId=${topFeature.properties.xmlId}`;
          fetch(studyUrl)
            .then(res => res.json())
            .then(studyData => {
              console.log("setting study data", studyData);
              this.studyData[topFeature.properties.xmlId] = studyData.study[0];
            });
          return [
            "Loading...",
            ["xmlId", <a href="#">{topFeature.properties.xmlId}</a>]
          ];
        }
      }
    }
  });

export default PaLayer;
