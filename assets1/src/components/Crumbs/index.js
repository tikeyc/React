import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import './style.less';

const Crumbs = ({ options }) => (
  <div className="ways-crumbs">
    当前位置：
    <ul>
      {options.map(({ href, text }, index) => (
        <li key={index}>
          {index > 0 ? <span className="separator">/</span> : '' }
          {href ? <Link to={href}>{text}</Link> : text}
        </li>
      ))}
    </ul>
  </div>
);

Crumbs.propTypes = {
  options: PropTypes.array.isRequired,
};

export default Crumbs;
