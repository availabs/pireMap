module.exports = [
    {
        type:'events', // type is same as the route path for now
        list_attributes:['county','applicant','local_estimate','fema_validated'], // to list the attributes on the main page
        money_attributes:['local_estimate','fema_validated'],
        list_attributes_order:[{attribute:'county', order:'0'},{attribute: 'applicant',order:'1'},
            {attribute:'local_estimate',order:'2'},{attribute:'fema_validated',order:'3'}],
        sub_type:'',
        // if wizard
        sections: [],
        attributes: {
            county:{
                label:'County', // Which you would like to see on the form
                prompt:'',
                sub_type:'',
                edit_type:'dropdown',
                display_type:'text',
                area:'true',
                meta: 'true',
                section: ''
            },
            site_number:{
                label:'Site Number', // Which you would like to see on the form
                prompt:'',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                area:'false',
                meta: 'false',
                section: ''
            },
            date_visited:{
                label:'Date Visited', // Which you would like to see on the form
                prompt:'',
                sub_type:'',
                edit_type:'date',
                display_type:'text',
                area:'false',
                meta: 'false',
                section: ''
            },
            applicant:{
                label:'Applicant', // Which you would like to see on the form
                prompt:'',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                area:'false',
                meta: 'false',
                section: ''
            },
            damage_centroid:{
                label:'Damage Centroid', // Which you would like to see on the form
                prompt:'',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                area:'false',
                meta: 'false',
                section: ''
            },
            damage_location:{
                label:'Damage Location', // Which you would like to see on the form
                prompt:'',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                area:'false',
                meta: 'false',
                section: ''
            },
            location_description:{
                label:'Location Description', // Which you would like to see on the form
                prompt:'',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                area:'false',
                meta: 'false',
                section: ''
            },
            damage_description:{
                label:'Damage Description', // Which you would like to see on the form
                prompt:'',
                sub_type:'',
                edit_type:'textarea',
                display_type:'text',
                area:'false',
                meta: 'false',
                section: ''
            },
            local_estimate:{
                label:'Local Estimate', // Which you would like to see on the form
                prompt:'',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                area:'false',
                meta: 'false',
                section: '',

            },
            fema_validated:{
                label:'FEMA Validated', // Which you would like to see on the form
                prompt:'',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                area:'false',
                meta: 'false',
                section: '',

            },
            change_notes:{
                label:'Change Notes', // Which you would like to see on the form
                prompt:'',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                area:'false',
                meta: 'false',
                section: ''
            },
            unvalidated:{
                label:'Unvalidated', // Which you would like to see on the form
                prompt:'',
                sub_type:'',
                edit_type:'text',
                display_type:'text',
                area:'false',
                meta: 'false',
                section: ''
            }

        }
    }
];
