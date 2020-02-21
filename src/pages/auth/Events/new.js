import {connect} from "react-redux";
import { reduxFalcor } from 'utils/redux-falcor'
import {sendSystemMessage} from 'store/modules/messages';
import Element from 'components/light-admin/containers/Element'
import React from 'react';
import config from 'pages/auth/Events/config.js'
import AvlFormsNewData from 'components/AvlForms/editComponents/newData.js'
import get from "lodash.get";

class EventsFormsNew extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        console.log('this',this.props.match.params.id)
        return(
            <Element>
                <h6 className="element-header">
                    {this.props.match.params.id ? 'Edit Events' : 'New Events'}
                </h6>
                <AvlFormsNewData
                    json = {config}
                    id = {[this.props.match.params.id]}
                />
            </Element>
        )
    }
}

const mapDispatchToProps = {
    sendSystemMessage
};

const mapStateToProps = state => {
    return {
        activePlan: state.user.activePlan,
        isAuthenticated: !!state.user.authed,
        attempts: state.user.attempts, // so componentWillReceiveProps will get called.
        capabilitiesMeta : get(state.graph,'capabilitiesLHMP.meta',{}),
        countyData: get(state.graph,'geo',{})

    };
};

export default [
    {
        icon: 'os-icon',
        path: '/events/new',
        exact: true,
        mainNav: false,
        breadcrumbs: [
            { name: 'Events', path: '/events/' },
            { name: 'New Event', path: '/events/new' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        name: 'Create Event',
        auth: false,
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(EventsFormsNew))
    },
    {
        path: '/events/edit/:id',
        name: 'Edit Events',
        mainNav: false,
        auth: true,
        exact: true,
        breadcrumbs: [
            { name: 'Events', path: '/events/' },
            { param: 'id', path: '/events/edit/' }
        ],
        menuSettings: {
            image: 'none',
            scheme: 'color-scheme-light',
            position: 'menu-position-left',
            layout: 'menu-layout-compact',
            style: 'color-style-default'
        },
        component: connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(EventsFormsNew))
    }

]