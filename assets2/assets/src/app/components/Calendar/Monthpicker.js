import $ from 'jquery';
import React, { Component, PropTypes } from 'react';
import './calendar.coffee';
import './style';

export default class Monthpicker extends Component {
  static propTypes = {
    className: PropTypes.string,
    options: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { options, onSelect } = this.props;

    $(this.refElm).monthCalendar($.extend(true, {}, options)).on('change', (event, value) => {
      onSelect(value);
    });
  }

  componentWillReceiveProps(nextProps) {
    const { options, onSelect } = this.props;
    const nextOptions = nextProps.options;

    if (options !== nextOptions) {
      $(this.refElm)
        .monthCalendar($.extend(true, {}, nextOptions))
        .on('change', (event, value) => {
          onSelect(value);
        });
    }
  }

  componentWillUnmount() {
    $(this.refElm).off('change');
  }

  render() {
    const { className = '' } = this.props;

    return (
      <div className={className} ref={ref => { this.refElm = ref; }} />
    );
  }
}
