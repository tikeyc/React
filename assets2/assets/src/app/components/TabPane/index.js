import React, { PropTypes } from 'react';
import classnames from 'classnames';
import './style.less';

const TabPane = ({
  children,
  className,
  style,
  eventKey,
  activeKey,
}) => (
  <div
    className={classnames('tab-pane', eventKey === activeKey ? 'active' : '', className)}
    style={style}
  >
    {children}
  </div>
);

TabPane.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  eventKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default TabPane;
