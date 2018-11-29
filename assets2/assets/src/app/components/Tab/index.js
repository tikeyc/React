import React, { PropTypes } from 'react';
import './style';

const Tabs = ({ children, className, style }) => (
  <div className={className || ''} style={style}>
    {children}
  </div>
);

Tabs.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Tabs;
