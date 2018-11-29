import React, { Component, PropTypes } from 'react';

import DatePicker from './DatePicker';

export default class QuarterDateRange extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      start: '',
      end: '',
      options: props.options,
    };
  }

  componentWillMount() {
    const { options } = this.props;
    if (options) {
      this.setState({
        start: options[0].select,
        end: options[1].select,
      });
      this.props.onSelect(options[0].select, options[1].select);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { options } = nextProps;
    if (this.props.options !== options) {
      this.setState({
        options,
        start: options[0].select,
        end: options[1].select,
      });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const { start, end, options } = nextState;
    const { onSelect } = this.props;
    if (!start || !end) return;
    const sTime = new Date(start.replace('Q', '')).getTime();
    const eTime = new Date(end.replace('Q', '')).getTime();

    if (sTime > eTime) {
      if (this.state.start !== start) {
        this.setState({
          end: start,
          options: [
            options[0],
            { ...options[1], select: start },
          ],
        });
        onSelect(start, start);
      } else if (this.state.end !== end) {
        this.setState({
          start: end,
          options: [
            { ...options[0], select: end },
            options[1],
          ],
        });
        onSelect(end, end);
      }
    } else if (this.state.start !== start || this.state.end !== end) {
      onSelect(start, end);
    }
  }

  render() {
    const { options } = this.state;
    return (
      <div className="date-frame">
        <DatePicker
          type="month"
          options={options[0]}
          onSelect={start => {
            this.setState({ start });
          }}
        />
        <span className="ml-10 mr-10" style={{ verticalAlign: 'middle' }}>至</span>
        <DatePicker
          type="month"
          options={options[1]}
          onSelect={end => {
            this.setState({ end });
          }}
        />
      </div>
    );
  }
}
