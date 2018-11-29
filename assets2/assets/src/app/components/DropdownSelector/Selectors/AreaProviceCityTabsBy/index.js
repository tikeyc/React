import React, { PropTypes } from 'react';

import AreaProvinceCityPopoverContent from '../../PopoverContent/AreaProvinceCity';
import ProvinceCityPopoverContent from '../../PopoverContent/AreaProvinceCity/ProvinceCity';
import TierContent from '../../PopoverContent/AreaProvinceCity/Tier';
import SelectorTabsBySuper from '../../SelectorTabsBySuper';

export default class AreaProvinceCitySelector extends SelectorTabsBySuper {
  static propTypes = {
    className: PropTypes.string,
    multiple: PropTypes.bool,
    onSelect: PropTypes.func.isRequired,
  }

  getContent(index) {
    const { multiple } = this.props;
    const { options } = this.state;

    if (index === 3) {
      return (
        <div className="scroller">
          <ProvinceCityPopoverContent
            ref={ref => { this.refPopoverContent = ref; }}
            options={options[index] || []}
            multiple={multiple}
            onSelect={options => this.select(index, options)}
          />
        </div>
      );
    } else if (index === 4) {
      return (
        <div className="scroller">
          <TierContent
            ref={ref => { this.refPopoverContent = ref; }}
            options={options[index] || []}
            multiple={multiple}
            onSelect={options => this.select(index, options)}
          />
        </div>
      );
    }
    return (
      <div className="scroller">
        <AreaProvinceCityPopoverContent
          ref={ref => { this.refPopoverContent = ref; }}
          options={options[index] || []}
          multiple={multiple}
          onSelect={options => this.select(index, options)}
        />
      </div>
    );
  }

  getSelectedLevel = (options, tabActiveKey) => {
    const selectedOptions = this.getSelectedOptions(options, tabActiveKey);
    return selectedOptions.length > 0 ? selectedOptions[0].level : undefined;
  }
}
