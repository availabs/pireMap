import React from 'react';
import {Link} from 'react-router-dom'



class Public extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activePlan: this.props.user.activePlan
        }
    }

    render() {
        return (
            <div style={{
                width: "100vw",
                backgroundColor: '#2e2e2e',
                position: "relative",
                color: '#efefef',
                // display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Link to='/treeringviewer' style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '25px' }}>
                    <div style={{height: 250, width: '75%', background: 'url(/img/treering.png)', backgroundPosition: 'center', margin: 'auto' }}>
                        <div className='container' style={{height:'75%'}}>
                            <div className='row' style={{height:'100%'}}>
                                <div className='col-12 col-md-6' style={{backgroundColor: 'rgba(0,0,0,0.35)', height: '90%', margin: 10}}>
                                    <h1 style={{color:'#cfcfcf'}}>Tree Ring Viewer</h1>
                                    <p style={{color:'#efefef'}}>
                                    Tree Ring Viewer: The PIRE CREATE visualization tool provides unique access to NOAA's tree-ring and speleothem archives, as well as an unrivaled number of new, unpublished records, via an interactive mapping and visualization platform for the scientific community, policy-makers and public at large. The visualization platform incorporates PIRE’s collection of paleoclimate research to generate powerful insights for government and public officials of the future risks associated with climate change around the world.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
                <Link to='/forest-stress' style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '25px'}}>
                    <div style={{height: 250, width: '75%', background: 'url(/img/foreststress5.png)', backgroundPosition: 'center right',  }}>
                        <div className='container' style={{height:'75%'}}>
                            <div className='row' style={{height:'100%'}}>
                                <div className='col-12 col-md-6' style={{backgroundColor: 'rgba(0,0,0,0.75)', height: '90%', margin: 10}}>
                                    <h1 style={{color:'#cfcfcf'}}>Forest Stress</h1>
                                    <p style={{color:'#efefef', textDecoration: 'none'}}>
                                    Researchers at the University at Albany Department of Atmospheric and Environmental Sciences (DAES) have turned to more than a century’s worth of data (from 1901 to 2012) through NOAA’s International Tree Ring Data Bank to analyze historical tree growth at 3,579 forests around the world and create a model for future projections (from 2045 to 2060). The Forest Stress visualization platform depicts this data on an unprecedented, global scale.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
                <Link to='/phyda' style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '25px'}}>
                    <div style={{height: 250, width: '75%', background: 'url(/img/phyda2.png)', backgroundPosition: 'center',  }}>
                        <div className='container' style={{height:'75%'}}>
                            <div className='row' style={{height:'100%'}}>
                                <div className='col-12 col-md-6' style={{backgroundColor: 'rgba(0,0,0,0.35)', height: '90%', margin: 10}}>
                                    <h1 style={{color:'#cfcfcf'}}>PHYDA</h1>
                                    <p style={{color:'#efefef', textDecoration: 'none'}}>
                                    This Paleo Hydrodynamics Data Assimilation product (PHYDA) visualization tool maps 2,000 years of reconstructed hydroclimate and associated climate dynamical variables onto a global interface. Using annually or seasonally resolved global reconstructions, two spatiotemporal drought indices, near-surface air temperature, This innovative transformation optimizes exploration of an expansive database into an approachable web-based visualization platform for streamlined presentation and collaboration.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        graph: state.graph.plans || {},
        router: state.router
    };
};

const mapDispatchToProps = {};
export default [{
    icon: 'os-icon-home',
    path: '/',
    exact: true,
    name: 'Home',
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
    component: Public
}];
