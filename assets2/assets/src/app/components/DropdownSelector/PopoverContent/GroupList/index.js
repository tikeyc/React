import _ from 'lodash';
import React, { PropTypes } from 'react';

import SelectorTable from '../SelectorTable';
import PopoverContent from '../PopoverContent.js';

export default class GroupListPopoverContent extends PopoverContent {
  static propTypes = {
    ...PopoverContent.propTypes,
    className: PropTypes.string,
    options: PropTypes.array.isRequired,
  }

  static getCheckedAll(options) {
    return _.flatten(options.map(group => group.list))
      .filter(option => option.hide !== true)
      .every(option => option.checked);
  }

  static checkAllOptions = (options, checked) => {
    if (!options) return options;

    return options.map(group => ({
      ...group,
      checked,
      list: group.list.map(model => ({
        ...model,
        checked,
      })),
    }));
  }

  static getSelectedOptions = options => {
    if (!options) return [];

    return _.flatten(options.map(group => group.list)).filter(item => item.checked);
  }

  checkGroup = value => this.props.options.map(group => {
    if (group.id === value) {
      const checked = !group.checked;
      return {
        ...group,
        checked,
        list: group.list.map(item => ({
          ...item,
          checked,
        })),
      };
    }
    return group;
  })

  checkOption = value => {
    const { multiple } = this.props;
    return this.props.options.map(group => {
      const list = group.list.map(item => {
        if (multiple) {
          if (item.id === value) {
            return {
              ...item,
              checked: !item.checked,
            };
          }
          return item;
        }
        return {
          ...item,
          checked: item.id === value,
        };
      });
      return {
        ...group,
        checked: list.every(item => item.checked),
        list,
      };
    });
  }

  render() {
    const { className, options, multiple } = this.props;

    return (
      <SelectorTable className={className}>
        <tbody>
          {options.map((group, index) => (
            group.hide !== true &&
            <tr key={group.id || index}>
              <td style={{ width: 120 }}>
                {
                  multiple && group.id
                  ? this.getOption(group, this.checkGroup)
                  : <div className="text-center">{group.text}</div>
                }
              </td>
              <td>
                {group.list.map(item => this.getOption(item))}
              </td>
            </tr>
          ))}
        </tbody>
      </SelectorTable>
    );
  }
}
