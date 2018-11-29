import React, { Component, PropTypes } from 'react';

import './style';

import Tooltip from '../Tooltip';

export default class DataRange extends Component {
  static propTypes = {
    defaultValue: PropTypes.shape({
      min: PropTypes.oneOfType([
        PropTypes.string.isRequired,
        PropTypes.number.isRequired,
      ]),
      max: PropTypes.oneOfType([
        PropTypes.string.isRequired,
        PropTypes.number.isRequired,
      ]),
    }),
    value: PropTypes.shape({
      min: PropTypes.oneOfType([
        PropTypes.string.isRequired,
        PropTypes.number.isRequired,
      ]),
      max: PropTypes.oneOfType([
        PropTypes.string.isRequired,
        PropTypes.number.isRequired,
      ]),
    }),
    onChange: PropTypes.func.isRequired,
    dataType: PropTypes.string,
    onValidate: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    const { min, max } = props.defaultValue;
    this.state = {
      min,
      max,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { defaultValue } = nextProps;

    if (this.props.defaultValue !== defaultValue) {
      this.setState(defaultValue);
    }
  }

  shouldComponentUpdate(nextProps) {
    return (
      this.props.defaultValue !== nextProps.defaultValue ||
      this.props.value !== nextProps.value ||
      this.onChange !== nextProps.onChange ||
      this.dataType !== nextProps.dataType
    );
  }

  refTooltipTarget = target => {
    if (target) {
      this.tooltip = new Tooltip({ target });
    }
  }

  changeMin = event => {
    const nextMin = event.target.value;
    const { max } = this.state;

    const validation = this.validate(nextMin, nextMin, max, 'min');
    if (validation === false) return;

    let nextMax = '';
    if (validation === true) {
      nextMax = max;
    } else {
      nextMax = validation.max;
    }

    this.change(nextMin, nextMax);
  }

  changeMax = event => {
    const nextMax = event.target.value;
    const { min } = this.state;

    const validation = this.validate(nextMax, min, nextMax, 'max');
    if (validation === false) return;

    let nextMin = '';
    if (validation === true) {
      nextMin = min;
    } else {
      nextMin = validation.min;
    }

    this.change(nextMin, nextMax);
  }

  change(min, max) {
    this.setState({ min, max });
    this.props.onChange(min, max);
  }

  validate = (value, min, max) => {
    const { dataType } = this.props;

    switch (dataType) {
      // 整数
      case 'int':
        if (/^-?[1-9][0-9]*$/.test(value)) {
          return true;
        }
        break;
      // 正整数
      case 'pInt':
        if (min === '' || max === '') {
          if (min === '') {
            this.tooltip.show('最小值不能为空');
            this.props.onValidate(false);
          } else {
            this.tooltip.show('最大值不能为空');
            this.props.onValidate(false);
          }
          return true;
        } else if (/^[1-9][0-9]*$/.test(value)) {
          if (min - 0 > max - 0) {
            this.tooltip.show('最小值不能大于最大值');
            this.props.onValidate(false);
            // if (type === 'min') {
            //   return { min, max: min };
            // }
            // return { min: max, max };
          } else {
            this.tooltip.hide();
            this.props.onValidate(true);
          }
          return true;
        }
        break;
      // 数字（整数或小数）
      case 'number':
        if (/^\d+(\.\d+)?$/.test(value)) {
          return true;
        }
        break;
      default:
        break;
    }

    return false;
  }

  render() {
    const { min, max } = this.state;
    const { value = {} } = this.props;

    return (
      <div className="inline-block data-range" ref={this.refTooltipTarget}>
        <input
          type="text"
          value={value.min || min}
          onChange={this.changeMin}
          className="text-field"
        />
        <span className="to">至</span>
        <input
          type="text"
          value={value.max || max}
          onChange={this.changeMax}
          className="text-field"
        />
      </div>
    );
  }
}
