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
                    <h2>Welcome to the PA Map Page</h2>
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
    path: '/public',
    exact: true,
    name: 'Public',
    auth: true,
    mainNav: true,
    breadcrumbs: [
        {name: 'Home', path: '/public'},
        {param: 'geoid', path: '/public/'}
    ],
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-dark',
        position: 'menu-position-top',
        layout: 'menu-layout-full',
        style: 'color-style-default'
    },
    component: connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Public))
}];

