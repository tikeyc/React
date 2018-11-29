import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import './style';

const Crumbs = ({ options }) => (
  <ul className="crumbs mr-50">
    {options.map(({ text, title, active, path, onClick }, index) => (
      <li key={index} className={active ? 'active' : ''}>
        {path ?
          (
            <Link
              to={path}
              title={title}
              onClick={() => {
                if (onClick) onClick();
              }}
            >
              {text}
            </Link>
          ) : (
            <a
              onClick={() => {
                if (onClick) onClick();
              }}
            >
              {text}
            </a>
          )
        }
      </li>
    ))}
  </ul>
);

Crumbs.propTypes = {
  options: PropTypes.array.isRequired,
};

export default Crumbs;
