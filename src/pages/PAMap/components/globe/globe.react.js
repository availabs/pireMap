// import { globeClick } from 'store/modules/gridData'
import { connect } from 'react-redux'
import './globe.scss'

var React = require('react'),
  d3 = require('d3v3'),
  globe = require('./globe')

class GlobeDemo extends React.Component {

  static defaultProps = {
    container: "globeDiv",
    onGlobeClick: () => {},
    onPointRemove: () => {},
    scaleDomain: [-25, -15, -10, -6, -3, 0, 10, 20, 26, 27, 28],
    useQuantiles: false
  }

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
    if (props.leftOffset) {
      globe.leftOffset = props.leftOffset;
    }
    globe.init('#' + props.container, {
      projection: props.projection,
      onGlobeClick: props.onGlobeClick,
      onPointRemove: props.onPointRemove
    })
    if (this.props.scale) {
      globe.setScale(this.props.scale);
    }
    if (props.canvasData) {
      this.drawGlobe(props);
    }
  }

  drawGlobe(props) {
    globe.drawCanvas(props.canvasData,
      { bounds: props.scaleDomain,
        useQuantiles: props.useQuantiles
      }
    );
  }

  componentDidUpdate(oldProps, oldState) {
    if (oldProps.projection !== this.props.projection) {
      d3.selectAll(`#${ oldProps.container } .display`).remove();
      this.initGlobe(this.props);
    }
    if (this.props.canvasData) {
      this.drawGlobe(this.props);
    }
  }

  // componentWillReceiveProps (nextProps) {
  //   if (this.props.projection !== nextProps.projection) {
  //     d3.selectAll('#' + this.props.container + ' .display').remove()
  //     this.initGlobe(nextProps)
  //   }
  //   var current_date = this.props.canvasData ? this.props.canvasData.header.date : null
  //   var next_date = nextProps.canvasData ? nextProps.canvasData.header.date : null
  //   if (nextProps.canvasData) {
  //     globe.drawCanvas(nextProps.canvasData, { bounds: nextProps.bounds, colors: nextProps.colors })
  //   }
  // }

  render () {
    return (
      <div id={ this.props.container }
        style={ {
          width: '100%',
          height: this.props.height || '600px'
        } }/>
    )
  }

}

export default connect(null, { })(GlobeDemo)
