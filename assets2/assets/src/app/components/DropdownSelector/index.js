import React, { Component, PropTypes } from 'react';

import DropdownMenu from '../DropdownMenu';
import DropdownPanel from '../DropdownPanel';

export default class DropdownSelector extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    onSubmit: PropTypes.func.isRequired,
    width: PropTypes.number,
    multiple: PropTypes.bool,
    onRestore: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    toggleText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    title: PropTypes.string,
    tips: PropTypes.string,
    disabled: PropTypes.bool,
  }

  close() {
    this.refElm.handleClose();
  }

  render() {
    const {
      className = '',
      children,
      onSubmit,
      width = 600,
      multiple,
      onRestore,
      placeholder,
      toggleText,
      title,
      tips,
      disabled,
    } = this.props;

    return (
      <DropdownMenu
        multiple={multiple}
        className={`dropdown-menu-selector ${className}`}
        popoverWidth={width}
        onOpen={onRestore}
        text={toggleText}
        ref={ref => { this.refElm = ref; }}
        placeholder={placeholder}
      >
        <DropdownPanel
          title={title || '城市选择'}
          onSubmit={onSubmit}
          multiple={multiple}
          footerTips={tips}
          disabled={disabled}
        >
          {children}
        </DropdownPanel>
      </DropdownMenu>
    );
  }
}
