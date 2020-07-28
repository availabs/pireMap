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
import ChronCharts from "../components/ChronCharts";
/*import Charts from "../components/svg";*/
/*import Charts from "../components/test";*/

import { iPromise } from "components/AvlStuff/iPromise"

import Dropdown from "../components/dropdown/Dropdown";



class PAEventsLayer extends MapLayer {

  onAdd(map) {
   
    let firstYear =[];
    let xmlIds =[];

    map.addSource("events_source", EventSource.source);
    
    map.addLayer({
      id: "events_layer",
      type: "circle",
      source: "events_source", // lat long for each study site by xmlid
      paint: {
        "circle-radius": 5, //['/', ['-', 2020, ['number', ['get', 'firstYear'], 0]],200],
        "circle-opacity": 0.8,
        "circle-color": "rgb(171, 72, 33)",
        "circle-color": ["step",["get","firstYear"],
          "#fef0d9",
          500,
          "#fdd49e",
          1000,
          "#fdbb84",
          1200,
          "#fc8d59",
          1400,
          "#ef6548",
          1600,
          "#d7301f",
          1800,
          "#990000"
        ]
      },

    });
  }
  render(map) {
    
    if(this.species === 'All species'){
      map.setFilter('events_layer',['has', 'species']);
    } else { 
      map.setFilter('events_layer',['==', ['get', 'species'], this.species]);
    }
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
            title: "Tree Ring Study Site (First Year of the study)",
            type: "ordinal",
            types: ["ordinal"],
            vertical: false,
            range: [ "#fef0d9","#fdd49e","#fdbb84","#fc8d59", "#ef6548","#d7301f", "#990000"],
            active: true,
            domain: [500, 1000, 1200, 1400, 1600, 1800, 2000]
          
      },
      updateData: function (k,v) { 
        this[k] = v
        this.render(this.map)
      },
      activeSite: "Not Defined Yet",
 
      authors:"Not Defined Yet",
      species:"All species",
      meta:"Not Defined Yet",

      onClick: {
        layers: ['events_layer'],
        dataFunc: function(features) {
          if (features && features.length) {
            this.activeSite = features[0].properties.xmlId;
            this.doAction(["toggleModal", "RingModal"]);          }
        }
      },  
     
      popover: {
        layers: ["events_layer"],
        noSticky: true,
        dataFunc: function(topFeature, features) {
          //const { id } = topFeature.properties;
         // console.log("mouseover", topFeature.properties, topFeature.properties.authors,  topFeature.properties.species);
           //console.log('test----',[this.studyData[topFeature.properties.xmlId].authors] ) 
               this.authors=  topFeature.properties.authors
               this.species = topFeature.properties.species

           //console.log("mouseover", topFeature.properties, topFeature.properties.xmlId, topFeature.properties.authors,  topFeature.properties.species );

            let studyUrl = `https://www.ncdc.noaa.gov/paleo-search/study/search.json?xmlId=${topFeature.properties.xmlId}`;  // to get json metadata
            const promise = fetch(studyUrl)
              .then(res => res.json())
              .then(studyData => {
                //console.log("setting study data", studyData);

                this.studyData[topFeature.properties.xmlId] = studyData.study[0];
               
                this.meta = {
                  'studyName':studyData.study[0].studyName,
                  'studyId':studyData.study[0].NOAAStudyId,
                  'studyCode':studyData.study[0].studyCode,
                  'doi':studyData.study[0].doi,
                  'onlineResourceLink':studyData.study[0].onlineResourceLink,
                  'studyNotes':studyData.study[0].studyNotes
              
                 }


   /*             console.log('this.studyData---', this.studyData)*/
                  //console.log('this.meta---', this.meta)
              });
            return [
                      
                      [iPromise(promise.then(() => this.studyData[topFeature.properties.xmlId].studyName))],

                      [ "XMLId",
                        <div>
                          {topFeature.properties.xmlId}
                        </div>
                      ],

                      [iPromise(promise.then(() => this.studyData[topFeature.properties.xmlId].studyNotes))],
                      [topFeature.properties.authors],
                      [topFeature.properties.species],
                      [topFeature.properties.firstYear]
                  ];
    
        }
      },


      modals: {
        RingModal: {
          title: "Tree Ring Widths",
          comp: ({ layer }) => 
        {
              return (
              <div>
                   <div style={{ display: "flex", flexWrap: "wrap",   padding: 5, justifyContent: 'center'}}>
                  <ChronCharts site={layer.activeSite} authors={layer.authors} species={layer.species} meta={layer.meta} />
                     </div>

              <Charts site={layer.activeSite} authors={layer.authors} species={layer.species} meta={layer.meta} />
              </div>
            )},


          show: false
        }
      },

      
      infoBoxes:{

          Overview: {
            title: "",
            comp: ({layer}) =>{
              return (
              <div>
                 <Dropdown layer={layer}/>
              </div>
            )},
            show: true
          }
    }


  });

export default PaLayer;
