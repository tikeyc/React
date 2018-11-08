import React, { Component, PropTypes } from 'react';
import './style.less';

export default class SelectedOptionsBar extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired,
  }

  shouldComponentUpdate(nextProps) {
    return (
      this.props.options !== nextProps.options ||
      this.props.onClick !== nextProps.onClick
    );
  }

  render() {
    const { options, onClick } = this.props;

    if (options.length > 0) {
      return (
        <div
          styleName="selected-options-bar"
          style={{ overflowY: 'auto' }}
          ref={ref => { this.refScrollbar = ref; }}
        >
          <div
            styleName="selected-options-bar-wrapper"
            ref={ref => { this.refContent = ref; }}
          >
            已选：
            {options.map((option, index) => (
              <div
                styleName="selected-option"
                key={index}
                onClick={() => onClick(option)}
              >
                {option.text} ×
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  }
}
