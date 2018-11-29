import React, { Component, PropTypes } from 'react';

export default class Option extends Component {
  static propTypes = {
    id: PropTypes.string,
    text: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
  }

  shouldComponentUpdate(nextProps) {
    return this.props.checked !== nextProps.checked;
  }

  render() {
    const {
      id,
      text,
      checked,
      className = '',
      onClick,
    } = this.props;

    return id ? (
      <a
        data-dropdown-option
        onClick={() => onClick(id)}
        className={`${className} dropdown-menu-selector-option checkbox-controller ${checked ? 'checked' : ''}`}
      >
        <span className="glyphicon tt-ok-sign" /> {text}
      </a>
    ) : text;
  }
}
