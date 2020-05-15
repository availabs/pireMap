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
                color: '#efefef'
              }}>
                <Link style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{height: 300, width: '100%', background: 'url(/img/treering.png)', backgroundPosition: 'center',  }}>
                        <div className='container' style={{height:'100%'}}>
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
                <Link to='/forest-stress' style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{height: 300, width: '100%', background: 'url(/img/foreststress.png)', backgroundPosition: 'center right',  }}>
                        <div className='container' style={{height:'100%'}}>
                            <div className='row' style={{height:'100%'}}>
                                <div className='col-12 col-md-6' style={{backgroundColor: 'rgba(0,0,0,0.35)', height: '90%', margin: 10}}>
                                    <h1 style={{color:'#cfcfcf'}}>Forest Stress</h1>
                                    <p style={{color:'#efefef', textDecoration: 'none'}}>
                                    Tree Ring Viewer: The PIRE CREATE visualization tool provides unique access to NOAA's tree-ring and speleothem archives, as well as an unrivaled number of new, unpublished records, via an interactive mapping and visualization platform for the scientific community, policy-makers and public at large. The visualization platform incorporates PIRE’s collection of paleoclimate research to generate powerful insights for government and public officials of the future risks associated with climate change around the world.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
                <Link to='/phyda' style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{height: 300, width: '100%', background: 'url(/img/phyda.png)', backgroundPosition: 'center right',  }}>
                        <div className='container' style={{height:'100%'}}>
                            <div className='row' style={{height:'100%'}}>
                                <div className='col-12 col-md-6' style={{backgroundColor: 'rgba(0,0,0,0.35)', height: '90%', margin: 10}}>
                                    <h1 style={{color:'#cfcfcf'}}>PHYDA</h1>
                                    <p style={{color:'#efefef', textDecoration: 'none'}}>
                                    Tree Ring Viewer: The PIRE CREATE visualization tool provides unique access to NOAA's tree-ring and speleothem archives, as well as an unrivaled number of new, unpublished records, via an interactive mapping and visualization platform for the scientific community, policy-makers and public at large. The visualization platform incorporates PIRE’s collection of paleoclimate research to generate powerful insights for government and public officials of the future risks associated with climate change around the world.
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
