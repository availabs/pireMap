import React, { Component } from "react";
import AvlMap from "components/AvlMap";

import LayerFactory from "./layers/ForestStress.layer"

class ForestStress extends Component {
  ForestStressLayer = LayerFactory({ active: true });
  render() {
    return (
      <div style={ { width: "100vw", height: "calc(100vh - 51px)" } }>
        <AvlMap
          layers={ [this.ForestStressLayer] }
          center={ [-100.546875, 37.43997405227057] }
          zoom={ 3 }
          sidebarPages={ ["layers"] }
          sidebar={ false }
          mapStyle="mapbox://styles/am3081/ck55pjv7a06p61cp7xvyngyu8"/>
      </div>
    );
  }
}

export default {
  path: "/forest-stress",
  name: "Forest Stress",
  exact: true,
  auth: false,
  mainNav: true,
  menuSettings: {
    image: "none",
    display: "none",
    scheme: "color-scheme-dark",
    position: "menu-position-top",
    layout: "menu-layout-compact",
    style: "color-style-default"
  },
  component: ForestStress
}
