import React from 'react';
import {connect} from 'react-redux';
import {reduxFalcor} from 'utils/redux-falcor'
import {createMatchSelector} from 'react-router-redux'
import Element from 'components/light-admin/containers/Element'
import ElementBox from "../../../components/light-admin/containers/ElementBox";


class Public extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activePlan: this.props.user.activePlan
        }
    }

    render() {
        return (
            <div>
                <ElementBox>
                    <h2>Welcome to the Page</h2>
                </ElementBox>

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

