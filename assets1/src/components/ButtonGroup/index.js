import React, { Component, PropTypes } from 'react';
import Button from '../Button';
import './style.less';

export default class ButtonGroup extends Component {
  static propTypes = {
    className: PropTypes.string,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    multiple: PropTypes.bool,
    required: PropTypes.bool,
    maxOptionalNumber: PropTypes.number,
  }

  constructor(props) {
    super(props);
    this.state = {
      options: props.options,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.options !== nextProps.options) {
      this.setState({ options: nextProps.options });
    }
  }

  handleSelect(value) {
    const { multiple } = this.props;

    if (multiple) {
      this.handleSelectCheckbox(value);
    } else {
      this.handleSelectRadio(value);
    }
  }

  handleSelectRadio(value) {
    const { onChange } = this.props;

    const options = this.state.options.map(option => ({
      ...option,
      checked: option.value === value,
    }));
    this.setState({ options });

    const selectedOption = options.filter(option => option.checked);
    onChange(value, selectedOption.text, selectedOption);
  }

  handleSelectCheckbox(value) {
    const { options } = this.state;
    const { onChange, required, maxOptionalNumber } = this.props;
    const selectedOptions = [];
    const selectedOptionsLength = options.filter(option => option.checked).length;

    if (
      (
        required && selectedOptionsLength === 1 &&
        options.find(option => option.value === value).checked
      ) ||
      (
        maxOptionalNumber === selectedOptionsLength &&
        !options.find(option => option.value === value).checked
      )
    ) {
      return;
    }

    const nextOptions = options.map(option => {
      if (option.value !== value) {
        if (option.checked) selectedOptions.push(option);
        return option;
      }
      const nextOption = {
        ...option,
        checked: !option.checked,
      };
      if (!option.checked) selectedOptions.push(nextOption);
      return nextOption;
    });

    this.setState({
      options: nextOptions,
    });

    const values = selectedOptions.map(option => option.value).join(',');
    const texts = selectedOptions.map(option => option.text).join(',');
    onChange(values, texts, selectedOptions, nextOptions, value);
  }

  render() {
    const { options } = this.state;
    const { className = '' } = this.props;

    return (
      <div className={`btn-group ${className} ${this.className || ''}`}>
        {options.map(option => (
          <Button
            key={option.value}
            {...option}
            className={option.checked ? 'active' : ''}
            onClick={() => this.handleSelect(option.value)}
          >
            {option.text}
          </Button>
        ))}
      </div>
    );
  }
}
