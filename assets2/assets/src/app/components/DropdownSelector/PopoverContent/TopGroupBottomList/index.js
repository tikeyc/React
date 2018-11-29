import _ from 'lodash';
import React, { PropTypes } from 'react';

import SelectorTable from '../SelectorTable';
import PopoverContent from '../PopoverContent.js';

export default class TopGroupBottomListPopoverContent extends PopoverContent {
  static propTypes = {
    ...PopoverContent.propTypes,
    className: PropTypes.string,
    options: PropTypes.array.isRequired,
  }

  static getCheckedAll(options) {
    return _.flatten(options.map(group => group.list)).every(model => model.checked);
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
    const { options } = this.props;

    return (
      <div>
        {options.map((group, index) => (
          group.hide !== true &&
          <div key={group.id || index}>
            <div className="group-title-bar" data-fast-go={group.text}>{group.text}</div>
            <SelectorTable>
              <tbody>
                <tr>
                  <td>
                    {group.list.map(item => this.getOption(item))}
                  </td>
                </tr>
              </tbody>
            </SelectorTable>
          </div>
        ))}
      </div>
    );
  }
}
