import React from "react";

import MapLayer from "../../../components/AvlMap/MapLayer";
import {
  register,
  unregister
} from "../../../components/AvlMap/ReduxMiddleware";
import { getColorRange } from "constants/color-ranges";
import { EventSource } from "./eventSource";

class PAEventsLayer extends MapLayer {
  // onAdd(map) {
  //   fetch('/data/PA_locations.geojson')
  //   .then((response) => response.json())
  //     .then(data => {
  //       console.log('data---', data)
  //       map.addSource('pa-events', {
  //         type: 'geojson',
  //         data: data
  //       })
  //       //map.addLayer()
  //     })
  // }
}

const PaLayer = (options = {}) =>
  new PAEventsLayer("PIRE Map", {
    active: true,
    sources: [EventSource],
    layers: [
      {
        id: "events_layer",
        type: "circle",
        source: "pa-events",
        paint: {
          "circle-radius": 5,
          "circle-opacity": 0.8,
          "circle-color": "rgb(171, 72, 33)"
        }
      }
    ],
    legend: {
      title: "",
      type: "quantile",
      types: ["quantile", "quantize"],
      vertical: false,
      range: [],
      active: true,
      domain: []
    },
    popover: {
      layers: ["events_layer"],
      dataFunc: function(topFeature, features) {
        //const { id } = topFeature.properties;
        console.log("mouseover", topFeature.properties);

        return [
          ["xmlId", topFeature.properties.xmlId]
          /*,
          ["Damage Estimate", Object.values(topFeature.properties)[6]],
          ["FEMA Validated", Object.values(topFeature.properties)[7]],
          ["Description",null],
          [topFeature.properties['DAMAGE DESCRIPTION']]*/
        ];
      }
    }
  });

export default PaLayer;
