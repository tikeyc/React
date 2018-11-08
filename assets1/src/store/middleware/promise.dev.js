import Mock from 'mockjs';
import * as api from './api';

Mock.Random.extend({
  dateRange() {
    let start = Mock.Random.date('yyyy.MM');
    let end = Mock.Random.date('yyyy.MM');
    if (start > end) {
      const temp = start;
      start = end;
      end = temp;
    }
    return `${start}-${end}`;
  },

  stringRange(start, stop, step) {
    const data = Mock.Random.range(start, stop, step);
    return data.map(item => `${item}`);
  }
});

const getMockData = endpoint => {
  let url = endpoint;
  let params = {};
  if (typeof url !== 'string') {
    url = endpoint.url;
    params = endpoint.data;
  }
  if (/^data:/.test(url)) {
    const urls = url.split(':');
    let template = require(`../../mocks/${urls[1]}`);
    template = template.default || template;
    template = typeof template === 'function' ? template(params) : template;
    Mock.mock(new RegExp(`${url}\\?`, 'ig'), () => {
      const mockdata = Mock.mock(template);
      // 开发环境下加载 Mock 数据
      console.log('load mock', url, params);
      console.log('     data', mockdata);
      return mockdata;
    });
  }
};

function createThunkMiddleware() {
  return ({ dispatch, getState }) => next => action => {
    const { type, endpoint } = action;

    if (endpoint) {
      const ajaxAction = { ...action };
      if (!Array.isArray(type)) {
        ajaxAction.type = [type];
      }

      getMockData(endpoint);

      api[endpoint.type !== 'POST' ? 'getDataFromServer' : 'postDataToServer'](dispatch, ajaxAction);

      return undefined;
    }

    return next(typeof action === 'function' ? action : {
      ...action,
      user: getState().user
    });
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
