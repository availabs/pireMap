// import { globeClick } from 'store/modules/gridData'
import { connect } from 'react-redux'
import './globe.scss'

var React = require('react'),
  d3 = require('d3v3'),
  globe = require('./globe')

class GlobeDemo extends React.Component {

  constructor (props )  {
    super(props)
    this.state = {
      width:0,
      height:0
    }
  }

  componentDidMount () {
    var scope = this
    this.initGlobe(this.props)
  }

  initGlobe (props) {
    var container = props.container || 'globeDiv'
    if (props.leftOffset) {
      globe.leftOffset = props.leftOffset
    }
    globe.init('#' + container, { projection: props.projection }) // onGlobeClick: this.props.globeClick
    if (this.props.scale) {
      globe.setScale(this.props.scale)
    }
    if (props.canvasData) {
      console.log(this.props.bounds, this.props.colors)
       globe.drawCanvas(props.canvasData, { bounds: this.props.bounds, colors: this.props.colors })
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.projection !== nextProps.projection) {
      var container = this.props.container || 'globeDiv'
      d3.selectAll('#' + container + ' .display').remove()
      this.initGlobe(nextProps)
    }
    var current_date = this.props.canvasData ? this.props.canvasData.header.date : null
    var next_date = nextProps.canvasData ? nextProps.canvasData.header.date : null
    if (nextProps.canvasData) {
      globe.drawCanvas(nextProps.canvasData, { bounds: nextProps.bounds, colors: nextProps.colors })
    }
  }

  render () {
    var container = this.props.container || 'globeDiv'
    return (
      <div id={container} style={{ width: '100%', height: this.props.height || '600px' }} />
    )
  }

}

export default connect(null, { })(GlobeDemo)
