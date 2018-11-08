import 'babel-polyfill';
import 'console-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import Router from './router';

// 创建 store
const store = configureStore(window.AppInitData);

ReactDOM.render(
  <Provider store={store}>
    <Router />
  </Provider>,
  document.getElementById('app'),
);
