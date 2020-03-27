
import React from 'react'
import Globe from 'pages/PAMap/components/globe/globe.react'


//import DataReadout from './DataReadout'
import { connect } from 'react-redux'
import './HomeView.scss'
const tempData = require('./data.json')


class MapPage extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      elemWidth: 800,
      screenHeight: 600
    }
  }

  componentWillMount () {
    this.setState({ screenHeight: window.innerHeight })
  }

  componentDidMount () {
    let newDate = this.state.date
    this.props.initialLoad()
  }

  render () {
    const { date, format, mode, inputFormat } = this.state
    console.log('temp data??', tempData.data.length)

    return (

      <div className='map-content'>
      
  
    /*    <DataReadout />*/
        <Globe
          canvasData={tempData}
          projection={this.props.projection}
          bounds={false}
          colors={this.props.currentScale}
          height={this.state.screenHeight}
          leftOffset={20}
        />
      </div>

    )
  }

}

const mapStateToProps = (state) => {
  return {
    loading: state.gridData.loading,
    canvasData: state.gridData.canvasData,
    projection: state.gridData.projection,
    bounds: state.gridData.bounds,
    colors: state.gridData.colors,
    scales: state.gridData.scales,
    currentScale: state.gridData.currentScale
  }
}
export default connect(mapStateToProps, { initialLoad })(MapPage)
