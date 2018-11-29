import React, { PropTypes } from 'react';

import './style';

const Form = ({ children, style = {}, className = '', inline, horizontal }) => (
  <form style={style} className={`${className} ${inline ? 'form-inline' : ''} ${horizontal ? 'form-horizontal' : ''}`}>
    {children}
  </form>
);

Form.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
  className: PropTypes.string,
  inline: PropTypes.bool,
  horizontal: PropTypes.bool,
};

export default Form;
