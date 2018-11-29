import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import 'loading';
import 'mloading';
import './styles';
import './components/Header/style';
import Header from './components/Header';
import Aside from './containers/Aside';
import Footer from './components/Footer';
import PageBody from './components/PageBody';

const App = ({ aside, children }) => {
  const cnAside = aside ? '' : 'aside-closed';
  const cnNoAside = children.props.route.noAside ? 'no-aside' : '';
  return (
    <div className="ways-think-tank-framework">
      <div className={`page-cdo-tool page-wrapper ${cnAside} ${cnNoAside}`}>
        <Header />
        {!children.props.route.noAside && <Aside />}
        <PageBody>
          {children}
        </PageBody>
        <Footer />
      </div>
    </div>
  );
};

App.propTypes = {
  aside: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

function mapStateToProps({ aside }) {
  return { aside };
}

export default connect(mapStateToProps)(App);
