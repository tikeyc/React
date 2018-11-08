import React, { Component, PropTypes } from 'react';
import './style.less';

export default class OrderBy extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
  };

  state = {
    options: [
      {
        value: 'time',
        text: '按时间排序',
        checked: true,
      },
      {
        value: 'hot',
        text: '按热度排序',
      },
    ],
  };

  handleChange = value => {
    this.props.onChange(value);
    this.setState({
      options: this.state.options.map(option => ({
        ...option,
        checked: option.value === value,
      })),
    });
  }

  render() {
    const { options } = this.state;
    // <span> | </span>
    return (
      <div styleName="header-right">
        排序：
        {options.map(option => (
          <a key={option.value} styleName={option.checked ? 'selected' : ''} onClick={() => this.handleChange(option.value)}>{option.text}</a>
        ))}
      </div>
    );
  }
}
