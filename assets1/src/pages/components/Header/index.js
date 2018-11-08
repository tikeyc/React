import React, { PropTypes } from 'react';

import Crumbs from '../../../components/Crumbs';

import './style.less';

const Header = ({ title, crumbs }) => (
  <div styleName="header">
    <div styleName="left">
      <i styleName="icon" />
      <h1 styleName="title">{title}</h1>
      <span styleName="sub-title">专业的企业动态分析系统</span>
    </div>
    <div styleName="right">
      <Crumbs options={crumbs} />
    </div>
  </div>
);

Header.propTypes = {
  title: PropTypes.string.isRequired,
  crumbs: PropTypes.array.isRequired,
};

export default Header;
