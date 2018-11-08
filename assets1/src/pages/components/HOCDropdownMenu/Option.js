import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

export default class Option extends Component {
  static propTypes = {
    option: PropTypes.shape({
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]).isRequired,
      text: PropTypes.string.isRequired,
      checked: PropTypes.bool,
      import: PropTypes.bool,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
  };

  handleChange = () => {
    this.props.onChange(this.props.option);
  }

  render() {
    const { handleChange } = this;
    const { text, checked, import: isImport } = this.props.option;

    return (
      <a
        className={classnames(checked ? 'checked' : '', isImport ? 'is-import' : '')}
        onClick={handleChange}
      >
        {text}
      </a>
    );
  }
}
