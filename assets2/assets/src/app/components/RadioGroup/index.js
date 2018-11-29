import ButtonGroup from '../ButtonGroup';

import './style';

export default class RadioGroup extends ButtonGroup {
  className = 'radio-group'

  handleSelect(value) {
    this.handleSelectRadio(value);
  }
}

// const { options } = this.state;
// const { onSelect, required } = this.props;

// // 只要当选择选项与上次选择不同时才进行后续操作
// const selectedOption = options.find(option => option.checked);
// if (required && selectedOption && selectedOption.value === value) return;

// this.setState({
//   options: options.map(option => {
//     if (option.value === value) {
//       return {
//         ...option,
//         checked: required || !option.checked,
//       };
//     }
//     return {
//       ...option,
//       checked: false,
//     };
//   }),
// });
