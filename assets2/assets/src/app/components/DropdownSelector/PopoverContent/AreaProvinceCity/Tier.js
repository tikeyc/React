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

  checkOption = value => {
    const options = this.props.options.map(tier => {
      if (tier.id === value) {
        return {
          ...tier,
          checked: !tier.checked,
        };
      }
      return tier;
    });

    const checked = options.every(tier => !tier.checked);
    this.setOverall(checked);

    return options;
  }

  render() {
    const { overAll } = this.state;
    const { className = '', options, multiple } = this.props;

    return (
      <SelectorTable className={`popover-content-area-province-city ${className}`} style={{ borderBottom: '1px solid #E8E8E8' }}>
        <tbody>
          <tr>
            <td style={{ width: 100 }}>
              <RadioGroup
                options={overAll}
                onSelect={this.checkOverall}
              />
            </td>
            <td className="no-padding">
              {options.map(city => (
                multiple ? this.getOption(city) : city.text
              ))}
            </td>
          </tr>
        </tbody>
      </SelectorTable>
    );
  }
}
