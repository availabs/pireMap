import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import Element from 'components/light-admin/containers/Element'
import {sendSystemMessage} from 'store/modules/messages';
import NY_csv from 'components/AvlForms/exportCSV/index.js'
import * as d3 from 'd3';
import get from "lodash.get";
import {falcorGraph} from "../../../store/falcorGraph";

let ATTRIBUTES = [];

class AvlFormsExportCSV extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            data : []
        }
        this.confirmUpload = this.confirmUpload.bind(this)
        this.handleFiles = this.handleFiles.bind(this)
        this.validateBool = this.validateBool.bind(this)
        this.handleArray = this.handleArray.bind(this)

    }



    fetchFalcorDeps(){
        return this.props.falcor.get(['geo','36',['counties']])
            .then(response =>{
                let counties = response.json.geo['36'].counties
                this.props.falcor.get(['geo',counties,['name']])
                    .then(response =>{
                        return response
                    })
            })
    }
    confirmUpload() {
        console.log('confirm', this.state.data)
        let a = this.state.data.reduce( (previousPromise, nextID) => {
            return previousPromise.then(() => {
                return this.props.falcor.call(
                    ['actions', 'project', 'insert'], nextID, [], []
                );
            });
        }, Promise.resolve());
        a.then(response => {
            this.props.sendSystemMessage(`Action project was successfully created.`, {type: "success"});
        })
    }
    validateBool(value){
        console.log('BoolCheck', value, value.toLowerCase().includes('yes') || value.toLowerCase().includes('true') ? 'TRUE' :
            value.toLowerCase().includes('no') || value.toLowerCase().includes('false') ? 'FALSE' : null)
        return value.toLowerCase().includes('yes') || value.toLowerCase().includes('true') ? 'TRUE' :
            value.toLowerCase().includes('no') || value.toLowerCase().includes('false') ? 'FALSE' : null
    }
    handleArray(value){
        //return typeof value === 'object' ?'{' + value.join(',') + '}' : value;
        return typeof value === 'object' ? '{' + value.join(',') + '}' : '{' + value + '}';
    }

    processGeoData(){
        if(this.props.geoData){
            let geo_data = {};
            Object.keys(this.props.geoData).forEach(item =>{
                geo_data['county'] = item
                geo_data['name']  = this.props.geoData[item].name || ''
            })
            return geo_data
        }
    }
    handleFiles() {
        let result = {};
        let geoData = this.processGeoData();
        let args = [];
        //geoData.forEach(geo =>{
            d3.csv(NY_csv['NY_csv'],function(rows,i){
                if(rows['COUNTY'] === 'Non-Declared'){
                    //if(rows['COUNTY'] === geoData['name'].split(' ')[0].toUpperCase()){
                        result['county'] = ''
                        result['site_number'] = rows['SITE NUMBER']
                        result['date_visited'] = rows['DATE VISITED']
                        result['applicant'] = rows['APPLICANT']
                        result['damage_centroid'] = ''
                        result['damage_location'] = rows['DAMAGE LOCATION']
                        result['damage_description'] = rows['DAMAGE DESCRIPTION']
                        result['local_estimate'] = rows['LOCAL ESTIMATE'].toString().replace(/,/g, '').substring(1) || "0"
                        result['fema_validated'] = rows['FEMA VALIDATED'].toString().replace(/,/g, '').substring(1) || "0"
                        result['change_notes'] = rows['CHANGE NOTES']
                        result['unvalidated'] = rows['Unvalidated']
                    //}
                    return falcorGraph.call(['forms','insert'],['events',63,result], [], [])
                        .then(response => {
                            console.log('inserted')
                            //this.props.sendSystemMessage(`event was successfully created.`, {type: "success"});
                        })


                }

            });

        //})






    }


    render() {

        return(
            <div className='container'>
                <Element>
                    <div className='col-sm-12' style={{'overflow': 'auto', 'maxHeight': '70vh', 'max-width': '80vw', 'display': 'block'}}>
                        <table className='table table lightBorder'>
                            <thead>
                            <tr>
                                {Object.keys(this.props.config[0].attributes).map(f => <th style={{minWidth: '100%', position: 'sticky', top: '0', backgroundColor: '#CCC'}}> {f.split('_').join(' ')} </th>)}
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.data.map( row =>
                                <tr> {row.map(cell => <td> {cell} </td>)} </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                    <div className='row'>
                        <div className="col-sm-6">
                            <button className="btn btn-primary step-trigger-btn" style={{height: '100%'}} onClick={this.handleFiles}> Upload </button>
                        </div>
                    </div>
                </Element>
            </div>
        )

    }
}

const mapStateToProps = (state,ownProps) => ({
    isAuthenticated: !!state.user.authed,
    attempts: state.user.attempts, // so componentWillReceiveProps will get called.
    activePlan: state.user.activePlan,
    activeGeoid: state.user.activeGeoid,
    config: ownProps.json,
    geoData : get(state.graph,['geo'])
});

const mapDispatchToProps = {
    sendSystemMessage
};

export default connect(mapStateToProps,mapDispatchToProps)(reduxFalcor(AvlFormsExportCSV))