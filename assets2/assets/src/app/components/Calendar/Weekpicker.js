import $ from 'jquery';
import React, { Component, PropTypes } from 'react';
import './calendar.coffee';
import './style';

export default class Weekpicker extends Component {
  static propTypes = {
    className: PropTypes.string,
    options: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
  }

  componentDidMount() {
    if (this.props.options.week) {
      $(this.refElm).edaCalendar($.extend(true, {}, this.props.options)).on('change', (event, value) => {
        this.props.onSelect(value);
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.options !== nextProps.options &&
      // !this.props.options.select &&
      nextProps.options.select
    ) {
      $(this.refElm).edaCalendar($.extend(true, {}, nextProps.options)).on('change', (event, value) => {
        this.props.onSelect(value);
      });
    }
  }

  componentWillUnmount() {
    $(this.refElm).off('change');
  }

  render() {
    const { className = '' } = this.props;
    return (
      <div className={`ways-popup-calendar eda-popup-calendar ${className}`} ref={ref => { this.refElm = ref; }} />
    );
  }
}
