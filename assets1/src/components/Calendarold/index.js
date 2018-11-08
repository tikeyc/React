import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
// import './DCalendar/dcalendar.picker.css';
// import './DCalendar/dcalendar.picker';
import './DCalendar/dcalendar.css';
import './DCalendar/dcalendar';
import './style.less';

export default class Calendar extends Component {
  static propTypes = {
    placeholder: PropTypes.string.isRequired,
    current: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    format: PropTypes.oneOf(['yyyy-mm-dd', 'yyyy-mm']),
    viewMode: PropTypes.oneOf(['days', 'months']),
  }

  static defaultProps = {
    current: undefined,
    format: 'yyyy-mm-dd',
  }

  constructor(props) {
    super(props);

    this.state = {
      current: 'current' in props ? props.current : '',
    };
  }

  componentDidMount() {
    const { format, viewMode } = this.props;
    $(this.elmInput).dcalendarpicker({
      format,
      viewMode: viewMode || (format === 'yyyy-mm-dd' ? 'days' : 'months'),
    }).on('dateselected', ({ date }) => {
      this.props.onChange(date);
    });
  }

  componentWillReceiveProps({ current }) {
    if (current !== undefined && current !== this.props.current) {
      this.setState({ current });
    }
  }

  shouldComponentUpdate(nextProps, { current }) {
    return current !== this.state.current;
  }

  componentWillUnmount() {
    $(this.elmInput).off('dateselected');
  }

  refInput = ref => {
    if (ref) {
      this.elmInput = ref;
    }
  }

  render() {
    const { placeholder } = this.props;
    const { current } = this.state;

    return (
      <input
        ref={this.refInput}
        type="text"
        placeholder={placeholder}
        value={current}
      />
    );
  }
}
