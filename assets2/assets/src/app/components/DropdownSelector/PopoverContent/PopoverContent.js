import React, { Component, PropTypes } from 'react';

import SelectorTable from './SelectorTable';
import Option from './Option';

export default class PopoverContent extends Component {
  static propTypes = {
    className: PropTypes.string,
    multiple: PropTypes.bool,
    options: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
  }

  static getCheckedAll(options) {
    return options.every(model => model.checked);
  }

  getOption = (props, onClick) => (
    props.hide !== true && <Option
      {...props}
      key={props.id}
      onClick={value => {
        let options;
        if (onClick) {
          options = onClick(value);
        } else {
          options = this.checkOption(value);
        }
        this.props.onSelect(options);
      }}
    />
  )

  checkOption = value => {
    const { multiple, options } = this.props;

    return options.map(option => {
      if (multiple) {
        if (option.id === value) {
          return {
            ...option,
            checked: !option.checked,
          };
        }
        return option;
      }
      return {
        ...option,
        checked: option.id === value,
      };
    });
  }

  render() {
    const { className = '', options } = this.props;

    return (
      <SelectorTable className={className}>
        <tbody>
          <tr>
            <td>
              {options.map(item => this.getOption(item))}
            </td>
          </tr>
        </tbody>
      </SelectorTable>
    );
  }
}
