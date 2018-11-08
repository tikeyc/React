import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default (mapStateToProps, mapDispatchToProps = {}) => function (WrappedComponent) {
  return class extends Component {
    static propTypes = {
      store: PropTypes.object.isRequired,
      router: PropTypes.object
    }

    static defaultProps = {
      router: {}
    }

    constructor(props) {
      super(props);

      this.state = this.mapToProps(props.store);
    }

    state = {}

    componentDidMount() {
      const { store } = this.props;

      this.unsubscrib = store.subscribe(() => {
        this.setState(this.mapToProps(store));
      });
    }

    shouldComponentUpdate(nextProps, nextState) {
      let hasChanged = false;
      const keys = Object.keys(nextState);
      for (let i = 0, l = keys.length; i < l; i += 1) {
        const key = keys[i];
        if (this.state[key] !== nextState[key]) {
          hasChanged = true;
          break;
        }
      }
      return hasChanged;
    }

    componentWillUnmount() {
      if (this.unsubscrib) this.unsubscrib();
    }

    mapToProps = store => {
      const nextState = mapStateToProps(store.getState());
      Object.keys(mapDispatchToProps).forEach(key => {
        const action = mapDispatchToProps[key];
        nextState[key] = function (...args) { store.dispatch(action(...args)); };
      });
      return nextState;
    }

    render() {
      const { history } = this.props.router;

      return (
        <WrappedComponent {...this.props} {...this.state} history={history} />
      );
    }
  };
};
