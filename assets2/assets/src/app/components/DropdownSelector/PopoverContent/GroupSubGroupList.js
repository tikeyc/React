import _ from 'lodash';
import React, { PropTypes } from 'react';

import SelectorTable from './SelectorTable';
import PopoverContent from './PopoverContent.js';

export default class GroupSubGroupListPopoverContent extends PopoverContent {
  static propTypes = {
    ...PopoverContent.propTypes,
    className: PropTypes.string,
    options: PropTypes.array.isRequired,
  }

  static getCheckedAll(options) {
    const nextOptions = _.flatten(options.map(group => group.list));
    return _.flatten(nextOptions.map(group => group.list)).every(model => model.checked);
  }

  static checkAllOptions = (options, checked) => {
    if (!options) return options;

    return options.map(group => ({
      ...group,
      checked,
      list: group.list.map(subGroup => ({
        ...subGroup,
        checked,
        list: subGroup.list.map(model => ({
          ...model,
          checked,
        })),
      })),
    }));
  }

  static getSelectedOptions = options => {
    if (!options) return [];

    let nextOptions = _.flatten(options.map(group => group.list));
    nextOptions = _.flatten(nextOptions.map(group => group.list));
    return nextOptions.filter(option => option.checked);
  }

  checkGroup = value => this.props.options.map(group => {
    if (group.id === value) {
      const checked = !group.checked;
      return {
        ...group,
        checked,
        list: group.list.map(subGroup => ({
          ...subGroup,
          checked,
          list: subGroup.list.map(option => ({
            ...option,
            checked,
          })),
        })),
      };
    }
    return group;
  })

  checkSubGroup = value => this.props.options.map(group => {
    const list = group.list.map(subGroup => {
      if (subGroup.id === value) {
        const checked = !subGroup.checked;
        return {
          ...subGroup,
          checked,
          list: subGroup.list.map(option => ({
            ...option,
            checked,
          })),
        };
      }
      return subGroup;
    });

    return {
      ...group,
      checked: list.every(subGroup => subGroup.checked),
      list,
    };
  })

  checkOption = value => {
    const { multiple, options } = this.props;
    return options.map(group => {
      const list = group.list.map(subGroup => {
        const list = subGroup.list.map(option => {
          if (multiple) {
            if (option.id === value) {
              return { ...option, checked: !option.checked };
            }
            return option;
          }
          return { ...option, checked: option.id === value };
        });
        return {
          ...subGroup,
          checked: list.every(option => option.checked),
          list,
        };
      });
      return {
        ...group,
        checked: list.every(subGroup => subGroup.checked),
        list,
      };
    });
  }

  render() {
    const { className, options, multiple } = this.props;

    return (
      <div>
        {options.map((group, index) => (
          <div key={group.id || index}>
            <div className="group-title-bar">{this.getOption(group, this.checkGroup)}</div>
            <SelectorTable className={className}>
              <tbody>
                {group.list.map((subGroup, subGroupIndex) => (
                  <tr key={subGroup.id || subGroupIndex}>
                    <td style={{ width: 120 }}>
                      {multiple && subGroup.id ? this.getOption(subGroup, this.checkSubGroup) : <div className="text-center">{subGroup.text}</div>}
                    </td>
                    <td>
                      {subGroup.list.map(item => this.getOption(item))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </SelectorTable>
          </div>
        ))}
      </div>
    );
  }
}
