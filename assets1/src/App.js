import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Layout from './pages/Layout';
import createActions from './helpers/createActions';
import './styles/style.less';

export const {
  UPDATE_APP_STATE,
  updateAppState,
} = createActions({
  UPDATE_APP_STATE: appState => ({ appState }),
}, 'APP_STATE');

class App extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    updateAppState: PropTypes.func.isRequired,
    routes: PropTypes.array.isRequired,
  };

  componentWillMount() {
    const { children, updateAppState: update, ...rest } = this.props;
    this.props.updateAppState(rest);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.routes !== this.props.routes) {
      const { children, updateAppState: update, ...rest } = nextProps;
      this.props.updateAppState(rest);
    }
  }

  render() {
    const { children } = this.props;

    return <Layout>{children}</Layout>;
  }
}

export default connect(null, { updateAppState })(App);
