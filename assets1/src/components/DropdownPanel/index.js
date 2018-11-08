import React, { PropTypes } from 'react';
import Button from '../Button';
import Panel from '../Panel';
import './style.less';

const DropdownPanel = ({
  children,
  title,
  onSubmit,
  footerTips,
  resetBtnText,
  onReset,
  multiple,
  className = '',
  submitDisabled,
}) => {
  const header = title ? (
    <div>
      <h2 className="panel-title">{title}</h2>
    </div>
  ) : (
    ''
  );
  const footer = multiple ? (
    <div>
      {footerTips && <span className="footer-tips">{footerTips}</span>}
      {!onReset &&
        <Button
          className="mr-10"
          data-dismiss="dropdown"
        >
          取消
        </Button>
      }
      {onReset &&
        <Button
          className="mr-10"
          onClick={() => onReset(this)}
        >
          {resetBtnText}
        </Button>
      }
      <Button
        className="btn-primary"
        onClick={() => onSubmit(this)}
        disabled={submitDisabled}
      >
        确定
      </Button>
    </div>
  ) : '';

  return (
    <Panel
      header={header}
      footer={footer}
      className={`dropdown-panel ${className}`}
    >
      {children}
    </Panel>
  );
};

DropdownPanel.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  resetBtnText: PropTypes.string,
  onReset: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  footerTips: PropTypes.string,
  multiple: PropTypes.bool,
  submitDisabled: PropTypes.bool,
};

DropdownPanel.defaultProps = {
  className: '',
  title: '',
  resetBtnText: '重置',
  onReset: undefined,
  footerTips: '',
  multiple: false,
  submitDisabled: false,
};

export default DropdownPanel;
