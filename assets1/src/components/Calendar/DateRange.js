import React, { Component, PropTypes } from 'react';

import DatePicker from '../Calendar/DatePicker';

export default class DateRange extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    startType: PropTypes.string,
    endType: PropTypes.string,
  }

  static defaultProps = {
    startType: 'month',
    endType: 'month',
  }

  constructor(props) {
    super(props);
    this.state = {
      start: '',
      end: '',
      options: [{}, {}],
    };
  }

  componentWillMount() {
    const { options, onSelect } = this.props;
    let start = '';
    let end = '';
    if (options[0] && options[1]) {
      start = options[0].select;
      end = options[1].select;
      this.setState({ start, end, options });
      onSelect(start, end, true); // 初始化改变
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

  shouldComponentUpdate(nextProps, nextState) {
    this.select(nextState);
    return (
      this.state.options !== nextState.options ||
      this.props.startType !== nextProps.startType ||
      this.props.endType !== nextProps.endType
    );
  }

  select(nextState) {
    const { onSelect, startType, endType } = this.props;
    const { start, end, options } = nextState;

    if (!start || !end) return;

    const [sYear, sMonth, sDay] = start.split('-');
    const [eYear, eMonth, eDay] = end.split('-');
    const sTime = new Date(sYear - 0, sMonth - 1, sDay || 1).getTime();
    const eTime = new Date(eYear - 0, eMonth - 1, eDay || 1).getTime();
    if (sTime > eTime) {
      if (this.state.start !== start) {
        const nextEnd = startType === 'month' && endType === 'week' ? `${sYear}-${sMonth}-W1` : start;
        this.setState({
          end: nextEnd,
          options: [
            options[0],
            { ...options[1], select: nextEnd },
          ],
        });
        onSelect(start, nextEnd);
      } else if (this.state.end !== end) {
        const nextStart = startType === 'month' && endType === 'week' ? `${eYear}-${eMonth}` : end;
        this.setState({
          start: nextStart,
          options: [
            { ...options[0], select: nextStart },
            options[1],
          ],
        });
        onSelect(nextStart, end);
      }
    } else if (
      this.state.start !== start ||
      this.state.end !== end
    ) {
      onSelect(start, end);
    }
  }

  render() {
    const { options } = this.state;
    const { startType, endType } = this.props;
    return (
      <div className="date-frame">
        <DatePicker
          type={startType}
          options={options[0]}
          onSelect={start => {
            this.setState({ start });
          }}
        />
        <span>至</span>
        <DatePicker
          type={endType}
          options={options[1]}
          onSelect={end => {
            this.setState({ end });
          }}
        />
      </div>
    );
  }
}
