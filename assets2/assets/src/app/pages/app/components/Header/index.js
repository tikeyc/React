import React from 'react';
import './style';

export default () => (
  <div className="page-header">
    <div className="logo" />
    <div className="user-menu">
      <span className="user-name">您好，tikeyc</span>
      {/* <a href="http://web.thinktanksgmmd.com/dashBoard?goBack=true">返回主页</a> */}
      <a className="mr10" href={`${window.$ctx}/common/logout.jsp`}>退出系统</a>
    </div>
  </div>
);
