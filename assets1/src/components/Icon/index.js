import React, { PropTypes } from 'react';
import classnames from 'classnames';

// import './fontawesome/css/all.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

import './style.less';

library.add(fas, fab, far);

const Icon = ({
  style,
  className: propClassName,
  name,
  disabled,
  fitted,
  size,
  link,
  circular,
  bordered,
}) => {
  const className = classnames(
    'icon',
    disabled ? 'disabled' : '',
    fitted ? 'fitted' : '',
    size,
    link ? 'link' : '',
    circular ? 'circular' : '',
    bordered ? 'bordered' : '',
    propClassName
  );

  return (
    <i className={className} style={style}><FontAwesomeIcon icon={name} /></i>
  );
};

Icon.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  fitted: PropTypes.bool,
  size: PropTypes.oneOf(['mini', 'tiny', 'small', 'large', 'big', 'huge', 'massive']),
  link: PropTypes.bool,
  circular: PropTypes.bool,
  bordered: PropTypes.bool,
};

Icon.defaultProps = {
  style: {},
};

export default Icon;
