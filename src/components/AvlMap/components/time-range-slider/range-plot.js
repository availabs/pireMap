import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {scaleLinear} from 'd3-scale';
import moment from 'moment';
import {max} from 'd3-array';
import {createSelector} from 'reselect';
import {LineSeries, XYPlot, CustomSVGSeries, Hint, MarkSeries} from 'react-vis';
import styled from 'styled-components';
import RangeBrush from './range-brush';
import {getTimeWidgetHintFormatter} from './utils';

const chartMargin = {top: 18, bottom: 0, left: 0, right: 0};
const chartH = 52;
const containerH = 78;
const histogramStyle = {
  highlightW: 1,
  unHighlightedW: 0.4
};

const Rect = styled.rect`
  fill: ${ props => props.inRange ? props.theme.activeColor : props.theme.sliderBarColor };
`

export default class RangePlot extends Component {
  static propTypes = {
    value: PropTypes.arrayOf(PropTypes.number).isRequired,
    histogram: PropTypes.arrayOf(
      PropTypes.shape({
        x0: PropTypes.number,
        x1: PropTypes.number
      })
    ),
    lineChart: PropTypes.object,
    plotType: PropTypes.string,
    isEnlarged: PropTypes.bool,
    onBlur: PropTypes.func,
    width: PropTypes.number.isRequired
  };

  state = {
    hoveredDP: null
  };

  domainSelector = props => props.lineChart && props.lineChart.xDomain;
  hintFormatter = createSelector(this.domainSelector, domain =>
    getTimeWidgetHintFormatter(domain)
  );

  onMouseMove = hoveredDP => {
    this.setState({hoveredDP});
  };

  render() {
    const {
      onBrush,
      range,
      value,
      width,
      plotType,
      lineChart,
      histogram
    } = this.props;
    const domain = [histogram[0].x0, histogram[histogram.length - 1].x1];

    const brushComponent = (
      <RangeBrush
        domain={domain}
        onBrush={onBrush}
        range={range}
        value={value}
        width={width}
      />
    );

    return (
      <div
        style={{
          height: `${containerH}px`,
          position: 'relative'
        }}
      >
        {plotType === 'lineChart' ? (
          <LineChart
            hoveredDP={this.state.hoveredDP}
            width={width}
            height={containerH}
            margin={chartMargin}
            children={brushComponent}
            onMouseMove={this.onMouseMove}
            yDomain={lineChart.yDomain}
            hintFormat={this.hintFormatter(this.props)}
            data={lineChart.series}
          />
        ) : (
          <Histogram
            width={width}
            height={chartH}
            value={value}
            margin={chartMargin}
            histogram={histogram}
            brushComponent={brushComponent}
          />
        )}
      </div>
    );
  }
}

const Histogram = ({
  width,
  height,
  margin,
  histogram,
  value,
  brushComponent
}) => {
  const domain = [histogram[0].x0, histogram[histogram.length - 1].x1];
  const barWidth = width / histogram.length;

  const x = scaleLinear()
    .domain(domain)
    .range([0, width]);

  const y = scaleLinear()
    .domain([0, max(histogram, d => d.count)])
    .range([0, height]);

  return (
    <svg width={width} height={height} style={{marginTop: `${margin.top}px`}}>
      <g className="histogram-bars">
        {histogram.map(bar => {
          const inRange = bar.x0 >= value[0] && bar.x1 <= value[1];
          const wRatio = inRange ? histogramStyle.highlightW : histogramStyle.unHighlightedW;

          return (
            <Rect inRange={ inRange }
              key={bar.x0}
              height={y(bar.count)}
              width={barWidth * wRatio}
              x={x(bar.x0) + barWidth * (1 - wRatio) / 2}
              rx={1}
              ry={1}
              y={height - y(bar.count)}
            />
          );
        })}
      </g>
      {brushComponent}
    </svg>
  );
};

const LineChartWrapper = styled.div`
  .rv-xy-plot__inner path {
    fill: none;
    stroke-width: 1.5;
  }
`;

const LineChart = ({
  width,
  height,
  yDomain,
  hintFormat,
  hoveredDP,
  margin,
  color,
  data,
  onMouseMove,
  children
}) => {
  const brushData = [
    {x: data[0].x, y: yDomain[1], customComponent: () => children}
  ];

  return (
    <LineChartWrapper>
      <XYPlot width={width} height={height} margin={{...margin, bottom: 12}}>
        <LineSeries
          strokeWidth={2}
          color={color}
          data={data}
          onNearestX={onMouseMove}
        />
        <MarkSeries
          data={hoveredDP ? [hoveredDP] : []}
          color={color}
          size={3}
        />
        <CustomSVGSeries data={brushData} />
        {hoveredDP ? (
          <Hint value={hoveredDP}>
            <HintContent
              {...hoveredDP}
              format={val => moment.utc(val).format(hintFormat)}
            />
          </Hint>
        ) : null}
      </XYPlot>
    </LineChartWrapper>
  );
};

const StyledHint = styled.div`
  background-color: #d3d8e0;
  border-radius: 2px;
  color: ${props => props.theme.textColorLT};
  font-size: 9px;
  margin: 4px;
  padding: 3px 6px;
  pointer-events: none;
  user-select: none;
`;
const HintContent = ({x, y, format}) => (
  <StyledHint>
    <div className="hint--x">{format(x)}</div>
    <div className="row">{y}</div>
  </StyledHint>
);
