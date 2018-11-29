import React, { Component, PropTypes } from 'react';
import Button from '../Button';
import './style';

// const ButtonGroup = ({ className = '', options, onClick }) => (
//   <div className={`btn-group ${className}`}>
//     {options.map(option => (
//       <Button
//         key={option.value}
//         {...option}
//         className={option.checked ? 'active' : ''}
//         onClick={() => onClick(option.value)}
//       >
//         {option.text}
//       </Button>
//     ))}
//   </div>
// );

// ButtonGroup.propTypes = {
//   className: PropTypes.string,
//   options: PropTypes.array.isRequired,
//   onClick: PropTypes.func.isRequired,
// };

// export default ButtonGroup;

export default class ButtonGroup extends Component {
  static propTypes = {
    className: PropTypes.string,
    options: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    type: PropTypes.string,
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

  // handleSelect(value) {
  //   const { options } = this.state;
  //   const { onSelect, type } = this.props;

  //   // 只要当选择选项与上次选择不同时才进行后续操作
  //   const selectedOption = options.find(option => option.checked);
  //   if (selectedOption && selectedOption.value === value) return;

  //   const nextOptions = options.map(option => ({
  //     ...option,
  //     checked: option.value === value,
  //   }));
  //   this.setState({
  //     options: nextOptions,
  //   });

  //   const nextSelectedOption = nextOptions.find(option => option.checked);

  //   onSelect(value, nextSelectedOption.text, nextSelectedOption);
  // }

  handleSelect(value) {
    const { type } = this.props;

    if (type === 'radio') {
      this.handleSelectRadio(value);
    } else {
      this.handleSelectCheckbox(value);
    }
  }

  handleSelectRadio(value) {
    const { onSelect } = this.props;

    const options = this.state.options.map(option => ({
      ...option,
      checked: option.value === value,
    }));
    this.setState({ options });

    const selectedOption = options.filter(option => option.checked);
    onSelect(value, selectedOption.text, selectedOption);
  }

  handleSelectCheckbox(value) {
    const { options } = this.state;
    const { onSelect, required, maxOptionalNumber } = this.props;
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
    onSelect(values, texts, selectedOptions, nextOptions, value);
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
