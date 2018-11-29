import React, { PropTypes } from 'react';

const SelectorTable = ({ className = '', style, children }) => (
  <table className={`dropdown-menu-selector-list ${className}`} style={style}>
    {children}
  </table>
);

SelectorTable.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
};

export default SelectorTable;
