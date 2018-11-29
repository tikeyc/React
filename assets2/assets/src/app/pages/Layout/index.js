import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import Header from './components/Header';
import Aside from './components/Aside';
import Footer from './components/Footer';
import PageBody from './components/PageBody';

import './style';
import './components/Header/style';

import { toggleAside } from './actions';

const Layout = ({
  asideToggle,
  children,
  pathname,
  toggleAside,
}) => {
  const classNameAside = asideToggle ? '' : 'aside-closed';
  const classNamenNoAside = children.props.route.noAside ? 'no-aside' : '';

  return (
    <div className="ways-think-tank-framework">
      <div className={classnames('page-cdo-tool page-wrapper', classNameAside, classNamenNoAside)}>
        <Header />
        {!children.props.route.noAside &&
          <Aside
            pathname={pathname}
            onToggle={toggleAside}
          />
        }
        <PageBody>
          {children}
        </PageBody>
        <Footer />
      </div>
    </div>
  );
};

Layout.propTypes = {
  asideToggle: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  pathname: PropTypes.string.isRequired,
  toggleAside: PropTypes.func.isRequired,
};

function mapStateToProps({ routing, aside }) {
  return {
    pathname: routing.location.pathname,
    asideToggle: aside,
  };
}

export default connect(mapStateToProps, { toggleAside })(Layout);

