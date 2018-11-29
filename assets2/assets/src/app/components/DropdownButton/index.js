import React, { PropTypes } from 'react';
import './style';
import Button from '../Button';

const DropdownButton = ({ children, className = '', style, onClick }) => (
  <Button
    className={`btn-dropdown ${className}`}
    style={style}
    onClick={onClick}
  >
    {children}
  </Button>
);

DropdownButton.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
};

export default DropdownButton;
