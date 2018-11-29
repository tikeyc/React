import React, { PropTypes } from 'react';
import './style';

const Toolbar = ({ style = {}, className = '', children, color = '' }) => (
  <div className={`toolbar ${className} ${color}`} style={style}>
    {children}
  </div>
);

Toolbar.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  color: PropTypes.string,
};

export default Toolbar;
