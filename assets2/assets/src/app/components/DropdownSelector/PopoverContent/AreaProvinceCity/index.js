import _ from 'lodash';
import React, { PropTypes } from 'react';

import SelectorTable from '../SelectorTable';
import PopoverContent from '../PopoverContent.js';
import RadioGroup from '../../../../../components/RadioGroup';

export default class AreaProvinceCityPopoverContent extends PopoverContent {
  static propTypes = {
    ...PopoverContent.propTypes,
    className: PropTypes.string,
    options: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      overAll: [{ id: '-1', value: '-1', text: '全国', checked: true }],
    };
  }

  setOverall = checked => {
    const { overAll } = this.state;
    this.setState({ overAll: [{ ...overAll[0], checked }] });
  }

  checkArea = value => {
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

  checkProvince = value => {
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

  /**
   * 选择城市
   * @param  {string} value 当前选择城市的 id
   * @return {object}       新的选项集
   */
  checkOption = value => {
    const { multiple } = this.props;
    const options = this.props.options.map(area => {
      const provinces = area.list.map(province => {
        const cities = province.list.map(city => {
          if (multiple && city.id === value) {
            return {
              ...city,
              checked: !city.checked,
            };
          }
          return city;
        });
        return {
          ...province,
          checked: false,
          list: cities,
        };
      });
      return {
        ...area,
        checked: false,
        list: provinces,
      };
    });

    const provinces = _.flatten(options.map(area => area.list));
    const checked = _.flatten(provinces.map(province => province.list))
      .every(province => !province.checked);
    this.setOverall(checked);

    return options;
  }

  checkOverallHelper(options) {
    return options.map(option => {
      const nextOption = {
        ...option,
        checked: false,
      };
      if (option.list) {
        nextOption.list = this.checkOverallHelper(option.list);
        return nextOption;
      }
      return nextOption;
    });
  }

  checkOverall = () => {
    const { overAll } = this.state;
    const { checked } = overAll[0];
    if (checked) return;
    this.setState({ overAll: [{ ...overAll[0], checked: !checked }] });
    this.props.onSelect(this.checkOverallHelper(this.props.options));
  }

  render() {
    const { overAll } = this.state;
    const { className = '', options, multiple } = this.props;
    // const provinces = _.flatten(options.filter(area => area.checked).map(area => area.list));
    // const cities = _.flatten(provinces.filter(province => province.checked)
    //   .map(province => province.list));

    return (
      <SelectorTable className={`popover-content-area-province-city ${className}`}>
        <thead>
          <tr>
            <th style={{ width: 120 }}>
              <RadioGroup
                options={overAll}
                onSelect={this.checkOverall}
              />
            </th>
            <th className="no-padding">
              <table className="dropdown-menu-selector-list">
                <thead>
                  <tr>
                    <th style={{ width: 100 }} className="text-sell">省份</th>
                    <th className="text-sell">城市</th>
                  </tr>
                </thead>
              </table>
            </th>
          </tr>
        </thead>
        <tbody>
          {options && options.map(area => (
            <tr key={area.id}>
              <td style={{ width: 100 }}>{this.getOption(area, this.checkArea)}</td>
              <td className="no-padding">
                <table className="dropdown-menu-selector-list">
                  <tbody>
                    {area.list.map(province => (
                      <tr key={province.id}>
                        <td style={{ width: 100 }}>
                          {this.getOption(province, this.checkProvince)}
                        </td>
                        <td>
                          {province.list.map(city => (
                            multiple ? this.getOption(city) : city.text
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
          ))}
        </tbody>
      </SelectorTable>
    );
  }
}
