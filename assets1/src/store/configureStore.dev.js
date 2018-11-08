import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import promise from './middleware/promise.dev';
import reducers from '../reducers';

export default function configureStore(preloadedState = {}) {
  const store = createStore(
    reducers,
    preloadedState,
    compose(applyMiddleware(promise, thunk, createLogger()))
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducers = require('../reducers');
      store.replaceReducer(nextReducers);
    });
  }

  return store;
}
