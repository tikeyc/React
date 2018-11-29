import $ from 'jquery';
import React, { Component, PropTypes } from 'react';
import { capitalized } from 'formats';

import './calendar.coffee';
import './style';

export default class DatePicker extends Component {
  static propTypes = {
    className: PropTypes.string,
    options: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
  }

  static defaultProps = {
    type: 'Month',
  }

  componentDidMount() {
    const { options } = this.props;

    this.initCalendar(options);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.options !== nextProps.options;
  }

  componentDidUpdate(prevProps) {
    const { options } = this.props;

    if (options !== prevProps.options) {
      this.initCalendar(options);
    }
  }

  componentWillUnmount() {
    $(this.refElm).off('change');
  }

  initCalendar(options) {
    if (!options.select) return;

    const { onSelect } = this.props;
    let { type } = this.props;

    type = capitalized(type);

    const calendar = type === 'Week' ? 'edaCalendar' : 'monthCalendar';

    $(this.refElm)[calendar]($.extend(true, { type: type === 'Week' ? 'Month' : type }, options))
    .off('change')
    .on('change', (event, value) => {
      onSelect(value);
    });
  }

  render() {
    const { className = '' } = this.props;

    return (
      <div className={className} ref={ref => { this.refElm = ref; }} />
    );
  }
}
