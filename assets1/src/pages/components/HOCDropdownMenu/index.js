import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import $ from 'jquery';
import classnames from 'classnames';
import DropdownMenu from '../../../components/DropdownMenu';
import DropdownPanel from '../../../components/DropdownPanel';
import './style.less';

export default (WrappedComponent, HOCOptions = {}) => (
  class HOCDropdownMenu extends Component {
    static propTypes = {
      className: PropTypes.string,
      label: PropTypes.string,
      placeholder: PropTypes.string,
      multiple: PropTypes.bool,
      headerSelectedOptions: PropTypes.array,
      options: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
      ]).isRequired,
      onChange: PropTypes.func,
      disabled: PropTypes.bool,
      direction: PropTypes.string,
      button: PropTypes.node,
      isManfBrand: PropTypes.bool,
      showModelLoading: PropTypes.bool,
    };

    static defaultProps = {
      className: '',
      label: '',
      placeholder: '',
      multiple: false,
      onChange: undefined,
      disabled: false,
    };

    constructor(props) {
      super(props);

      this.willSubmitedOptions = props.options;
      this.closeBySubmit = false;

      this.state = {
        options: props.options,
        selectedText: '',
        shown: false,
        hasSelected: false,
        direction: props.direction || '',
      };
    }

    componentWillReceiveProps({ options, headerSelectedOptions, direction }) {
      if (options !== this.props.options) {
        this.setState({ options, selectedText: this.getSelectedText(options) });
      }


      if (headerSelectedOptions !== this.props.headerSelectedOptions) {
        // console.log('headerSelectedOptions', headerSelectedOptions);
        if (headerSelectedOptions.length === 0) {
          this.setState({ selectedText: '' });
        }
      }

      if (direction !== this.props.direction) {
        this.setState({ direction });
      }
    }

    componentWillUpdate(nextProps, { shown }) {
      if (shown !== this.state.shown) {
        const $trigger = $(findDOMNode(this.elmDropdown));
        const menuWidth = HOCOptions.popupWidth || $trigger.find('.dropdown-menu').outerWidth();
        const diffrence = ($trigger.offset().left + menuWidth) - $(window).outerWidth();
        if (diffrence > 0) {
          this.setDirection({ direction: 'right' });
        } else {
          this.setDirection({ direction: '' });
        }
        if (!shown) {
          $trigger.find('.dropdown-menu').css({ visibility: 'hidden' });
        } else {
          $trigger.find('.dropdown-menu').css({ visibility: 'visible' });
        }
      }
    }

    setDirection = state => this.setState(state);

    getSelectedText = options => {
      if (!this.wrappedComponent.getSelectedOptions) {
        return [];
      }
      const selectedOptions = this.wrappedComponent.getSelectedOptions(options);
      this.setState({ hasSelected: selectedOptions.length > 0 });
      let { selectedText } = this.state;
      const { isManfBrand } = this.props;
      if (selectedOptions.length > 1) {
        selectedText = `已选${this.props.label}(${selectedOptions.length})`;
      } else if (isManfBrand) {
        selectedText = selectedOptions.map(option => option.manf_brand_name || option.text).join(',');
      } else {
        selectedText = selectedOptions.map(option => option.text).join(',');
      }
      return selectedText;
    }

    refDropdown = ref => {
      if (ref) { this.elmDropdown = ref; }
    }

    refWrappedComponent = ref => {
      if (ref) { this.wrappedComponent = ref; }
    }

    handleChange = (selectedOptions, nextOptions) => {
      let checked;
      let options;
      if (typeof nextOptions === 'boolean') {
        checked = nextOptions;
      } else {
        options = nextOptions;
      }
      if (!options) {
        const sOptions = Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions];
        options = this.wrappedComponent.getNextOptions(sOptions, checked);
      }
      this.setState({ options });
      if (!this.props.multiple) this.handleSubmit(options);
    }

    handleSubmit = (options = this.state.options) => {
      const selectedOptions = this.wrappedComponent.getSelectedOptions(options);
      this.setState({ selectedText: this.getSelectedText(options), shown: false });
      this.closeBySubmit = true;
      if (this.props.onChange) this.props.onChange(selectedOptions, options);
      this.elmDropdown.close();
    }

    handleReset = () => {
      let { options } = this.props;
      if (this.wrappedComponent.getResetOptions) {
        options = this.wrappedComponent.getResetOptions();
      }
      this.setState({ options });
    }

    handleOpen = () => {
      this.setState({ shown: true });
      this.willSubmitedOptions = this.state.options;
    }

    handleClose = () => {
      if (this.closeBySubmit) {
        this.closeBySubmit = false;
        return;
      }
      if (this.wrappedComponent.handleClose) {
        this.wrappedComponent.handleClose();
      }
      this.setState({ options: this.willSubmitedOptions, shown: false });
    }

    handleCloseDropdownMenu = () => this.elmDropdown.close()

    render() {
      const {
        className,
        placeholder,
        multiple,
        label,
        disabled,
        button,
        headerSelectedOptions,
        showModelLoading,
      } = this.props;
      const {
        options,
        selectedText,
        shown,
        hasSelected,
        direction,
      } = this.state;

      return (
        <DropdownMenu
          ref={this.refDropdown}
          className={classnames('custom-dropdown-menu', HOCOptions.className, className)}
          placeholder={placeholder || `选择${label}`}
          text={selectedText}
          onOpen={this.handleOpen}
          onClose={this.handleClose}
          popoverWidth={HOCOptions.popupWidth}
          disabled={disabled}
          hasSelected={hasSelected}
          dropdownDirection={direction}
          button={button}
        >
          <DropdownPanel
            title={HOCOptions.title}
            multiple={multiple}
            onSubmit={this.handleSubmit}
            resetBtnText={HOCOptions.resetBtnText}
            onReset={this.handleReset}
          >
            <WrappedComponent
              {...this.props}
              HOCOptions={HOCOptions}
              ref={this.refWrappedComponent}
              multiple={multiple}
              options={options}
              onChange={this.handleChange}
              shown={shown}
              closeDropdownMenu={this.handleCloseDropdownMenu}
              headerSelectedOptions={headerSelectedOptions}
              showModelLoading={showModelLoading}
            />
          </DropdownPanel>
        </DropdownMenu>
      );
    }
  }
);
