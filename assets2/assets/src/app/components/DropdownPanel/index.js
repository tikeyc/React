import React, { PropTypes } from 'react';
import Button from '../Button';
import Panel from '../Panel';
import './style.less';

const DropdownPanel = ({
  children,
  title,
  onSubmit,
  footerTips,
  onReset,
  multiple,
  disabled,
}) => {
  const header = title && title !== 'none' ? <h3 className="panel-title">{title}</h3> : '';
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
          重置
        </Button>
      }
      <Button
        disabled={disabled}
        className="btn-primary"
        onClick={() => onSubmit(this)}
      >
        确定
      </Button>
    </div>
  ) : '';

  return (
    <Panel
      header={header}
      footer={footer}
      className="dropdown-panel"
    >
      {children}
    </Panel>
  );
};

DropdownPanel.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  onReset: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  footerTips: PropTypes.string,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default DropdownPanel;
