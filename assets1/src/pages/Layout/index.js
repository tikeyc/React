import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Aside from './Aside';
import './style.less';

const Layout = ({ children, activedPath }) => (
  <div className="app-layout">
    <Aside activedPath={activedPath} />
    <div styleName="app-body">{children}</div>
  </div>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  activedPath: PropTypes.string.isRequired,
};

export default connect(state => ({ activedPath: state.appState.location.pathname }))(Layout);
