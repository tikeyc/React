import React, { Component, PropTypes } from 'react';

import './style';
import RadioGroup from '../RadioGroup';
import CheckboxGroup from '../CheckboxGroup';
import ButtonGroup from '../ButtonGroup';
import DropdownMenu from '../DropdownMenu';
import DataRange from '../DataRange';

import DatePicker from '../Calendar/DatePicker';
import DateRange from '../Calendar/DateRange';

import DatePickerQ from '../CalendarQ/DatePicker';
import DateRangeQ from '../CalendarQ/DateRange';

const controllerByType = args => {
  const {
    type,
    options,
    placeholder,
    selectedPlaceholder,
    dataType,
    defaultValue,
    value,
    id,
    disabled,
    autoFocus,
    multiple,
    required,
    onChange,
    onBlur,
    onSelect,
    onValidate,
  } = args;

  switch (type) {
    case 'text':
      return (
        <input
          type="text"
          className="form-control"
          id={id}
          disabled={disabled}
          autoFocus={autoFocus}
          defaultValue={defaultValue}
          value={value}
          onChange={event => onChange(event.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
        />
      );
    case 'year':
      return <DatePicker type="year" options={options} onSelect={onSelect} />;
    case 'month':
      return <DatePicker options={options} onSelect={onSelect} />;
    case 'week':
      return <DatePicker type="week" options={options} onSelect={onSelect} />;
    case 'day':
      return <DatePicker type="day" options={options} onSelect={onSelect} />;
    case 'quarterly':
      return <DatePickerQ type="day" options={options} onSelect={onSelect} />;
    case 'quarterlyRange':
      return <DateRangeQ type="day" options={options} onSelect={onSelect} />;
    case 'monthRange':
      return <DateRange options={options} onSelect={onSelect} />;
    case 'monthToWeek':
      return <DateRange endType="week" options={options} onSelect={onSelect} />;
    case 'radio':
      return <RadioGroup options={options} onSelect={onSelect} required={required} />;
    case 'checkbox':
      return <CheckboxGroup options={options} onSelect={onSelect} required={required} />;
    case 'buttonRadio':
      return <ButtonGroup options={options} onSelect={onSelect} type="radio" required={required} />;
    case 'buttonCheckbox':
      return <ButtonGroup options={options} onSelect={onSelect} required={required} />;
    case 'select':
      return (
        <DropdownMenu
          options={options}
          onSelect={onSelect}
          multiple={multiple}
          selectedPlaceholder={selectedPlaceholder}
          placeholder={placeholder}
        />
      );
    case 'dataRange':
      return (
        <DataRange
          onChange={onChange}
          defaultValue={defaultValue}
          value={value}
          dataType={dataType}
          onValidate={onValidate}
        />
      );
    default:
      return undefined;
  }
};

class FormGroup extends Component {
  static propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node,
    label: PropTypes.string,
    unit: PropTypes.string,
    type: PropTypes.string,
    options: PropTypes.any,
    placeholder: PropTypes.string,
    selectedPlaceholder: PropTypes.string,
    dataType: PropTypes.string,
    defaultValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.object,
    ]),
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.object,
    ]),
    id: PropTypes.string,
    disabled: PropTypes.bool,
    autoFocus: PropTypes.bool,
    multiple: PropTypes.bool,
    required: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onSelect: PropTypes.func,
    onValidate: PropTypes.func,
  }

  static defaultProps = {
    className: '',
  }

  shouldComponentUpdate(nextProps) {
    return (
      this.props.style !== nextProps.style ||
      this.props.className !== nextProps.className ||
      this.props.children !== nextProps.children ||
      this.props.label !== nextProps.label ||
      this.props.unit !== nextProps.unit ||
      this.props.type !== nextProps.type ||
      this.props.options !== nextProps.options ||
      this.props.placeholder !== nextProps.placeholder ||
      this.props.selectedPlaceholder !== nextProps.selectedPlaceholder ||
      this.props.dataType !== nextProps.dataType ||
      this.props.defaultValue !== nextProps.defaultValue ||
      this.props.value !== nextProps.value ||
      this.props.id !== nextProps.id ||
      this.props.disabled !== nextProps.disabled ||
      this.props.autoFocus !== nextProps.autoFocus ||
      this.props.multiple !== nextProps.multiple ||
      this.props.required !== nextProps.required ||
      this.props.onChange !== nextProps.onChange ||
      this.props.onBlur !== nextProps.onBlur ||
      this.props.onSelect !== nextProps.onSelect ||
      this.props.onValidate !== nextProps.onValidate
    );
  }

  render() {
    const {
      style,
      className,
      children,
      label,
      unit,
      type,
      options,
      placeholder,
      selectedPlaceholder,
      dataType,
      defaultValue,
      value,
      id,
      disabled,
      autoFocus,
      multiple,
      required,
      onChange,
      onBlur,
      onSelect,
      onValidate,
    } = this.props;

    const props = {
      type,
      options,
      placeholder,
      selectedPlaceholder,
      dataType,
      defaultValue,
      value,
      id,
      disabled,
      autoFocus,
      multiple,
      required,
      onChange,
      onBlur,
      onSelect,
      onValidate,
    };

    return (
      <div
        className={`form-group ${className} ${unit && !type.includes('Range') ? 'has-unit' : ''}`}
        style={style}
        ref={ref => { if (ref) this.refFormGroup = ref; }}
      >
        {label && <label htmlFor={id}>{label}</label>}
        {type ? controllerByType(props) : children}
        {unit && !type.includes('Range') && <div className="input-unit">{unit}</div>}
        {unit && type.includes('Range') && <span className="unit">{unit}</span>}
      </div>
    );
  }
}

export default FormGroup;
