import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import Calendar from './index';

export default class DateRange extends Component {
  static propTypes = {
    start: PropTypes.object.isRequired,
    end: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  static compareDate(dateA, dateB) {
    return new Date(dateA.replace(/-/g, '/')) > new Date(dateB.replace(/-/g, '/'));
  }

  state = {
    start: '',
    end: '',
    error: false,
  };

  componentWillReceiveProps({ start: { current: start }, end: { current: end } }) {
    const error = Boolean(end && DateRange.compareDate(start, end));
    if (start !== undefined && start !== this.state.start) {
      this.setState({ start, error });
    }
    if (end !== undefined && end !== this.state.end) {
      this.setState({ end, error });
    }
  }

  shouldComponentUpdate({ start, end }, { error }) {
    if (
      start !== this.props.start ||
      end !== this.props.end ||
      error !== this.state.error
    ) {
      return true;
    }
    return false;
  }

  handleChangeStart = start => {
    const { end } = this.state;
    const error = Boolean(end && DateRange.compareDate(start, end));
    this.setState({ start, error });
    this.props.onChange(start, end, error);
  }

  handleChangeEnd = end => {
    const { start } = this.state;
    if (start && new Date(start) > new Date(end)) {
      this.setState({ error: true });
    }
    const error = Boolean(start && DateRange.compareDate(start, end));
    this.setState({ end, error });
    this.props.onChange(start, end, error);
  }

  render() {
    const { start, end } = this.props;
    const { error } = this.state;

    return (
      <div className={classnames('datepicker-range', error ? 'error' : '')}>
        <Calendar {...start} onChange={this.handleChangeStart} />
        <Calendar {...end} onChange={this.handleChangeEnd} />
        <span className="tips" style={{ display: error ? '' : 'none' }}>起始时间大于结束时间</span>
      </div>
    );
  }
}
