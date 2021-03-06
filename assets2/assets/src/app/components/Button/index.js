import React, { PropTypes } from 'react';
import './style';

const Button = ({ children, className, style, onClick, type, elType = 'a', disabled = false, ...rest }) => (
  elType === 'a' ?
    <a
      {...rest}
      className={`btn ${className} ${disabled ? 'disabled' : ''}`}
      style={style}
      onClick={() => !disabled && onClick && onClick()}
      disabled={disabled}
    >
      {children}
    </a>
    : <button
      type={type}
      className={`btn ${className} ${disabled ? 'disabled' : ''}`}
      style={style}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
);

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
  type: PropTypes.string,
  elType: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Button;
