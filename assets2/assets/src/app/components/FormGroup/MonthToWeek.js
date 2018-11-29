import React, { Component, PropTypes } from 'react';

import Monthpicker from '../Calendar/Monthpicker';
import Weekpicker from '../Calendar/Weekpicker';

export default class MonthToWeek extends Component {
  static propTypes = {
    monthOptions: PropTypes.object.isRequired,
    weekOptions: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      start: '',
      end: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.monthOptions !== nextProps.monthOptions) {
      this.setState({ start: nextProps.monthOptions.select });
    }
    if (this.props.weekOptions !== nextProps.weekOptions) {
      this.setState({ end: nextProps.weekOptions.select });
    }
  }

  render() {
    const { monthOptions, weekOptions, onSelect } = this.props;

    return (
      <div className="date-frame">
        <Monthpicker
          options={monthOptions}
          onSelect={start => {
            this.setState({ start });
            onSelect(start, this.state.end);
          }}
        />
        <span>至</span>
        <Weekpicker
          options={weekOptions}
          onSelect={end => {
            this.setState({ end });
            onSelect(this.state.start, end);
          }}
        />
      </div>
    );
  }
}
