import React, { Component } from "react";
import AvlMap from "components/AvlMap";
import PaEventsLayer from "./layers/PaEventsLayer";
import styled from "styled-components";

const MapWrapper = styled.div`
  width: 100vw;
  height: calc(100vh - 41px);
`;

let eventsLayer = PaEventsLayer();
class PAMap extends Component {
  render() {
    return (
      <MapWrapper>
        <AvlMap
          layers={[eventsLayer]}
          sidebar={false}
          zoom={1}
          center={[-100.546875, 37.43997405227057]}
          boxZoom={true}
          styles={[
            {
              name: "Dark Streets",
              style: "mapbox://styles/am3081/ck55pjv7a06p61cp7xvyngyu8"
            },
            {
              name: "Light Streets",
              style: "mapbox://styles/am3081/ck3t1g9a91vuy1crzp79ffuac"
            }
          ]}
        />
      </MapWrapper>
    );
  }
}

export default {
  path: "/",
  name: "Event Map",
  icon: "os-icon os-icon-map",
  exact: true,
  auth: false,
  mainNav: false,
  menuSettings: {
    image: "none",
    display: "none",
    scheme: "color-scheme-dark",
    position: "menu-position-top",
    layout: "menu-layout-compact",
    style: "color-style-default"
  },
  component: PAMap
};
