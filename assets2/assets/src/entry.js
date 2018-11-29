import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
// import { hashHistory, createMemoryHistory, Router } from 'react-router';
import { hashHistory, Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './store/configureStore.prod';
import routes from './routes';

// 创建 store
const store = configureStore(window.AppInitData);

// IE8 不支持内存 history 模式，屏蔽以下代码

// // 创建 history
// let history;

// if (process.env.NODE_ENV === 'production') {
//   // 生产环境使用内存 history
//   history = createMemoryHistory(location);
// } else {
//   // 开发环境使用 hash history（直接显示于URL中，便于调试）
//   history = hashHistory;
// }

// history = syncHistoryWithStore(history, store);

const history = syncHistoryWithStore(hashHistory, store);

// 渲染程序根节点
render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);
