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
/*import summary from "./summary";*/


import Charts from "../components/Charts";
/*import Charts from "../components/svg";*/
/*import Charts from "../components/test";*/

class PAEventsLayer extends MapLayer {
  onAdd(map) {
    map.addSource("events_source", EventSource.source);
    // console.log('events_source', EventSource.source.data.features.forEach(d => console.log(d, d.properties['local_estimate'])))

    map.addLayer({
      id: "events_layer",
      type: "circle",
      source: "events_source", // lat long for each study site by xmlid
      paint: {
        "circle-radius": 5,
        "circle-opacity": 0.8,
        "circle-color": "rgb(171, 72, 33)"
      }
    });
  }
}

const PaLayer = (options = {}) =>

  new PAEventsLayer("TreeRing Width", 

    {
   
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
            domain: [],
            mytest: {}
              },

      activeSite: "Not Defined Yet",

      popover: {
        layers: ["events_layer"],
        dataFunc: function(topFeature, features) {
          //const { id } = topFeature.properties;
          /*console.log("mouseover", topFeature.properties);*/

          if (this.studyData[topFeature.properties.xmlId]) {
            return [
              [this.studyData[topFeature.properties.xmlId].studyName],
              [
                "xmlId",
                <div
                  onClick={() => {
                    this.activeSite = topFeature.properties.xmlId;
                    this.doAction(["toggleModal", "RingModal"]);
                  }}
                >
                  {topFeature.properties.xmlId}
                </div>
              ],

              [this.studyData[topFeature.properties.xmlId].studyNotes]
            ];
          } else {
            let studyUrl = `https://www.ncdc.noaa.gov/paleo-search/study/search.json?xmlId=${topFeature.properties.xmlId}`;  // to get json metadata
            fetch(studyUrl)
              .then(res => res.json())
              .then(studyData => {
                console.log("setting study data", studyData);
                this.studyData[topFeature.properties.xmlId] = studyData.study[0];
              });
            return [
              "Loading...",
              [
                "xmlId",
                <div
                  onClick={() => {
                    this.activeSite = topFeature.properties.xmlId;
                    this.doAction(["toggleModal", "RingModal"]);
                  }}
                >
                  {topFeature.properties.xmlId}
                </div>
              ]
            ];
          }
        }
      },

      modals: {
        RingModal: {
          title: "Tree Ring Widths",
          comp: ({ layer }) => <Charts site={layer.activeSite} />,
          show: false
        }
      }


  });

export default PaLayer;
