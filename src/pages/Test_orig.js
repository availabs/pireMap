import React, { Component } from "react";
/*import Chart from "pages/PAMap/components/svg.js";*/
/*import StudySite from "pages/PAMap/components/StudySite.js";
*/
import Charts from "pages/PAMap/components/Charts.js";


class Home extends Component {
  render() {
    return (
      <div style={{ width: "100vw", minHeight: "100vh", backgroundColor: '#2e2e2e' }}>
        <Charts
          site="13320
        "
        />
      </div>
    );
  }
}

export default {
  path: "/test",
  exact: true,
  mainNav: true,
  menuSettings: {
    image: "none",
    display: "none",
    scheme: "color-scheme-dark",
    position: "menu-position-left",
    layout: "menu-layout-mini",
    style: "color-style-default"
  },
  name: "Test",
  auth: false,
  component: Home
};