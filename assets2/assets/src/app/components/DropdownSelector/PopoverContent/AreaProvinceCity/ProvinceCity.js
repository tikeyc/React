import _ from 'lodash';
import React, { PropTypes } from 'react';

import SelectorTable from '../SelectorTable';
import RadioGroup from '../../../../../components/RadioGroup';
import AreaProvinceCity from './index';

export default class ProvinceCityPopoverContent extends AreaProvinceCity {
  static propTypes = {
    ...AreaProvinceCity.propTypes,
    className: PropTypes.string,
    options: PropTypes.array.isRequired,
  }

  checkProvince = value => {
    const options = this.props.options.map(area => {
      const nextArea = {
        ...area,
        list: area.list.map(province => ({
          ...province,
          checked: false,
          list: province.list.map(city => ({
            ...city,
            checked: false,
          })),
        })),
      };
      if (area.id === value) {
        nextArea.checked = !area.checked;
        return nextArea;
      }
      return nextArea;
    });

    const checked = options.every(area => !area.checked);
    this.setOverall(checked);

    return options;
  }

  checkOption = value => {
    const options = this.props.options.map(area => ({
      ...area,
      checked: false,
      list: area.list.map(province => {
        const nextProvince = {
          ...province,
          list: province.list.map(city => ({
            ...city,
            checked: false,
          })),
        };
        if (province.id === value) {
          nextProvince.checked = !province.checked;
          return nextProvince;
        }
        return nextProvince;
      }),
    }));

    const checked = _.flatten(options.map(area => area.list)).every(province => !province.checked);
    this.setOverall(checked);

    return options;
  }

  render() {
    const { overAll } = this.state;
    const { className = '', options, multiple } = this.props;

    return (
      <SelectorTable className={`popover-content-area-province-city ${className}`}>
        <thead>
          <tr>
            <th style={{ width: 100 }}>
              <RadioGroup
                options={overAll}
                onSelect={this.checkOverall}
              />
            </th>
            <th className="no-padding">
              <table className="dropdown-menu-selector-list">
                <thead>
                  <tr>
                    <th className="text-sell">城市</th>
                  </tr>
                </thead>
              </table>
            </th>
          </tr>
        </thead>
        <tbody>
          {options && options.map(province => (
            <tr key={province.id}>
              <td style={{ width: 100 }}>{this.getOption(province, this.checkProvince)}</td>
              <td className="no-padding">
                {province.list.map(city => (
                  multiple ? this.getOption(city) : city.text
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </SelectorTable>
    );
  }
}
