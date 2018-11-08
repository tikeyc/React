import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import echarts from 'echarts';

export default class Chart extends Component {
  static propTypes = {
    options: PropTypes.object.isRequired,
    style: PropTypes.object,
    height: PropTypes.number,
    width: PropTypes.number,
    onReady: PropTypes.func,
    onClick: PropTypes.func,
    onMouseover: PropTypes.func,
    onMouseout: PropTypes.func,
  }

  static defaultProps = {
    height: 400,
  };

  componentDidMount() {
    this.draw();
    $(window).on('resize', this.listenResize);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.options !== nextProps.options;
  }

  componentDidUpdate({ options }) {
    if (this.props.options && (options !== this.props.options)) {
      this.draw();
    }
  }

  componentWillUnmount() {
    this.chart.dispose();
    this.chart = null;
    $(window).off('resize', this.listenResize);
  }

  getOptions() {
    return this.props.options;
  }

  listenResize = () => {
    this.draw();
  }

  draw() {
    const options = this.getOptions();
    this.drawChart(options);
  }

  drawChart(options) {
    const {
      onReady,
      onClick,
      onMouseover,
      onMouseout,
    } = this.props;

    if (!this.chart) {
      this.chart = echarts.init(this.refChart);
      if (onClick) {
        this.chart.on('click', onClick);
      }
      if (onMouseover) {
        this.chart.on('mouseover', onMouseover);
      }
      if (onMouseout) {
        this.chart.on('mouseout', onMouseout);
      }
    }
    this.chart.clear();
    this.chart.resize();
    this.chart.setOption(options);

    if (onReady) {
      onReady(this.chart);
    }
  }

  render() {
    const { width, height, style } = this.props;

    return (
      <div
        ref={ref => { this.refChart = ref; }}
        style={{
          height,
          width,
          ...style,
        }}
      />
    );
  }
}
