import React from 'react'
import AvlFormsEditComponents from 'components/AvlForms/editComponents/index.js'
import TrackVisibility from 'react-on-screen';

export default ({ graph, ...rest }) => {
    const graphType = graph.type,
        Graph = AvlFormsEditComponents[graphType] || AvlFormsEditComponents['NA'];
    return (
        <TrackVisibility offset={100} style={{height: '100%'}}>
            <ElementHider Graph={Graph} { ...rest } graph ={graph}/>
        </TrackVisibility>
    )
}

class ElementHider extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            show: props.isVisible
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.isVisible && !this.state.show) {
            this.setState({show:true})
        }
    }

    render () {
        let {isVisible, Graph, graph, ...rest} = this.props
        return this.state.show ?
            <Graph {...rest} {...graph} {...this.props.rest}/> :
            <div>Loading...</div>
    }
}