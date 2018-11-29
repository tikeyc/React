import React, { Component, PropTypes } from 'react';

import Monthpicker from '../Calendar/Monthpicker';

export default class DateFrame extends Component {
  static propTypes = {
    options: PropTypes.object.isRequired,
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
    if (this.props.options !== nextProps.options) {
      this.setState({
        start: nextProps.options.select,
        end: nextProps.options.select,
      });
    }
  }

  render() {
    const { options, onSelect } = this.props;

    return (
      <div className="date-frame">
        <Monthpicker
          options={options}
          onSelect={start => {
            this.setState({ start });
            onSelect(start, this.state.end);
          }}
        />
        <span>至</span>
        <Monthpicker
          options={options}
          onSelect={end => {
            this.setState({ end });
            onSelect(this.state.start, end);
          }}
        />
      </div>
    );
  }
}
