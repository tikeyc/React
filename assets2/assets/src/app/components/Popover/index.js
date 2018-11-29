import React from 'react';
import './style';
import DropdownPanel from '../DropdownPanel';
import DropdownMenu from '../DropdownMenu';

export default class Popover extends DropdownMenu {
  render() {
    const {
      children,
      className = '',
      style,
      menuStyle,
      button,
      disabled,
      multiple,
      // onClick,
      loading,
    } = this.props;

    return (
      <div
        className={`dropdown popover ${className} ${disabled ? 'disabled' : ''}`}
        style={style}
        ref={ref => { this.refDropdown = ref; }}
        onMouseEnter={this.handleOpen}
        onMouseLeave={this.handleClose}
      >
        {button && <div onClick={this.handleOpen}>{button}</div>}
        <div className={`dropdown-menu ${multiple ? 'multiple' : 'no-multiple'}`} style={menuStyle}>
          {loading &&
            <div className="loading-box">
              <div className="loading-icon" />
            </div>
          }
          {(() => {
            if (children) {
              return children;
            } else if (multiple) {
              return (
                <DropdownPanel
                  onSubmit={this.handleMultipleSubmit}
                >
                  {this.renderDropdownMenu()}
                </DropdownPanel>
              );
            }
            return this.renderDropdownMenu();
          })()}
        </div>
      </div>
    );
  }
}
