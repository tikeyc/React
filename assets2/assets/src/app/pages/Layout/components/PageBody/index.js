import React, { PropTypes } from 'react';
import './style';

const PageBody = ({ children }) => (
  <div className="page-content">
    {children}
  </div>
);

PageBody.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PageBody;
