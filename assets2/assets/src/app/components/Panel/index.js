import React, { PropTypes } from 'react';
import './style.less';

const Panel = ({
  className = '',
  children,
  header,
  footer,
}) => (
  <div className={`panel panel-default ${className}`}>
    {header &&
      <div className="panel-heading">
        {header}
      </div>
    }
    <div className="panel-body">
      {children}
    </div>
    {footer &&
      <div className="panel-footer">
        {footer}
      </div>
    }
  </div>
);

Panel.propTypes = {
  children: PropTypes.node.isRequired,
  header: PropTypes.node.isRequired,
  footer: PropTypes.node,
  className: PropTypes.string,
};

export default Panel;
