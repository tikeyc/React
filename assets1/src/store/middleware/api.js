import $ from 'jquery';
import 'jquery.cookie';
import _ from 'lodash';
import { $ctx } from '../../../config';
import './style.less';

$.ajaxSetup({ cache: false });

const refreshTokenUrl = 'http://dss.ways.cn/ajax/auth/refresh';
const loginUrl = 'http://i.ways.cn/login/';

const getUser = () => {
  const user = $.cookie('user') || '{}';
  return JSON.parse(user);
};

const validateToken = (response, ajaxOptions) => {
  return new Promise(function(resolve, reject) {
    const { result_code, result_msg } = response;
    let isRefrest = false;
    if (result_msg) {
      isRefrest = result_msg.toLowerCase().includes('token'); //  && result_msg.toLowerCase().includes('invalid')
    }
    if (result_code === '400' && isRefrest) {
      const user = getUser();
      const { refresh_token } = user;
      if (refresh_token) {
        $.ajax({
          url: refreshTokenUrl,
          data: { refresh_token },
          dataType: 'json',
          success({ code, data }) {
            if (code === 200 && data && data.token) {
              user.token = data.token;
              $.cookie('user', JSON.stringify(user), { expires: 0.8333333333333333, path: '/' });
              $.ajax({
                ...ajaxOptions,
                headers: {
                  'token': getUser().token
                },
                success(response) {
                  resolve(response);
                }
              });
            } else {
              if (window.parent.location.href !== window.location.href) {
                window.parent.location.href = loginUrl;
              }

              // reject();
            }
          },
        });
      } else {
        if (window.parent.location.href !== window.location.href) {
          window.parent.location.href = loginUrl;
        }
        // reject();
      }
    } else if (result_code === '200') {
      resolve(response);
    } else {
      reject();
    }
  });
}

export function getDataFromServer(dispatch, api) {
  const { type: types, endpoint, callback, action, ...rest } = api;

  const typesSize = types.length;
  const REQUEST = typesSize > 1 && types[0];
  const SUCCESS = types[typesSize > 1 ? 1 : 0];
  const FAILURE = typesSize === 3 && types[2];

  if (REQUEST) {
    dispatch({ type: REQUEST });
  }

  // TODO 未做 token 校验
  if (_.isArray(endpoint)) {
    const promises = endpoint.map(actionCreator => {
      if (!_.isFunction(actionCreator)) {
        if (_.isObject(actionCreator) && actionCreator.type && actionCreator.endpoint) {
          return getDataFromServer(dispatch, actionCreator);
        }

        let url = '';
        let data = {};
        if (_.isString(actionCreator)) {
          url = actionCreator;
        } else {
          url = actionCreator.url;
          data = actionCreator.data;
        }
        return $.ajax({
          url: url,
          data: data,
          dataType: 'json',
          headers: {
            'token': getUser().token
          },
        });
      }
      return getDataFromServer(dispatch, actionCreator());
    });
    $.when.apply(null, promises)
      .done((...values) => {
        const responses = values.map(value => value[0]);
        dispatch({
          ...(action || {}),
          ...rest,
          type: SUCCESS,
          responses,
        });
        if (callback) callback(responses);
      })
      .fail((...args) => {
        dispatch({
          type: FAILURE,
          error: args,
        });
      });
    return promises;
  }

  let url = '';
  let data = {};
  if (_.isString(endpoint)) {
    url = `${window.$ctx || $ctx  || ''}${endpoint}`;
  } else {
    url = `${window.$ctx || $ctx  || ''}${endpoint.url}`;
    data = endpoint.data;
  }
  const success = response => {
    dispatch({
      ...(action || {}),
      ...rest,
      type: SUCCESS,
      response,
    });
    if (callback) callback(response);
  };
  const ajaxOptions = {
    url: url,
    data: data,
    dataType: 'json',
    headers: {
      'token': getUser().token
    },
  };
  const promise = $.ajax({
    ...ajaxOptions,
    success(response) {
      validateToken(response, ajaxOptions)
        .then(response => {
          if (response.result_code !== '200' && response.result_code !== 200) {
            // $.toast({
            //   heading: 'Error',
            //   text: `result_code: ${response.result_code}<br/>result_msg: ${response.result_msg}`,
            //   showHideTransition: 'plain',
            //   icon: 'error',
            //   position: 'top-right',
            //   stack: 6,
            // });
          }
          success(response);
        })
        .catch(e => {
          // if (window.parent.location.href !== window.location.href) {
          //   window.parent.location.href = loginUrl;
          // }
          // $.toast({
          //   heading: 'Error',
          //   text: `result_code: ${response.result_code}<br/>result_msg: ${response.result_msg}`,
          //   showHideTransition: 'fade',
          //   icon: 'error',
          //   position: 'top-right',
          //   stack: 6,
          // });
          console.log('error', response.result_code);
          success({
            result_code: (response && response.result_code) ? response.result_code : '500',
          });
        });
    },
  });

  if (FAILURE) {
    promise.fail((...args) => {
      dispatch({
        type: FAILURE,
        error: args,
      });
    });
  }

  return promise;
}

export function postDataToServer(dispatch, api) {
  const { type: types, endpoint, callback, action, ...rest } = api;
  const typesSize = types.length;
  const REQUEST = typesSize > 1 && types[0];
  const SUCCESS = types[typesSize > 1 ? 1 : 0];
  const FAILURE = typesSize === 3 && types[2];

  if (REQUEST) {
    dispatch({ type: REQUEST });
  }

  if (_.isArray(endpoint)) {
    const promises = endpoint.map(actionCreator =>
      postDataToServer(dispatch, _.isFunction(actionCreator) ? actionCreator() : actionCreator)
    );
    $.when.apply(null, promises)
      .done((...values) => {
        const responses = values.map(value => value[0]);
        dispatch({
          ...(action || {}),
          ...rest,
          type: SUCCESS,
          responses,
        });
        // dispatch(Object.assign({}, action || {}, {
        //   ...rest,
        //   type: SUCCESS,
        //   responses,
        // }));
        if (callback) callback(responses);
      })
      .fail((...args) => {
        dispatch({
          type: FAILURE,
          error: args,
        });
      });
    return promises;
  }

  let url = '';
  let data = {};
  if (_.isString(endpoint)) {
    url = `${window.$ctx || $ctx  || ''}${endpoint}`;
  } else {
    url = `${window.$ctx || $ctx  || ''}${endpoint.url}`;
    data = endpoint.data;
  }
  const success = response => {
    if (SUCCESS) {
      dispatch({
        ...rest,
        type: SUCCESS,
        response,
      });
    }
    if (callback) callback(response);
  };
  const ajaxOptions = {
    url: url,
    data: data,
    dataType: 'json',
    type: 'POST',
    headers: {
      'token': getUser().token
    },
  };
  const promise = $.ajax({
    ...ajaxOptions,
    success(response) {
      validateToken(response, ajaxOptions)
        .then(response => {
          if (response.result_code !== '200') {
            // $.toast({
            //   heading: 'Error',
            //   text: `result_code: ${response.result_code}<br/>result_msg: ${response.result_msg}`,
            //   showHideTransition: 'plain',
            //   icon: 'error',
            //   position: 'top-right',
            //   stack: 6,
            // });
          }
          success(response);
        })
        .catch(e => {
          // if (window.parent.location.href !== window.location.href) {
          //   window.parent.location.href = loginUrl;
          // }
          // $.toast({
          //   heading: 'Error',
          //   text: `result_code: ${response.result_code}<br/>result_msg: ${response.result_msg}`,
          //   showHideTransition: 'plain',
          //   icon: 'error',
          //   position: 'top-right',
          //   stack: 6,
          // });
          console.log('error', response.result_code);
          success({
            result_code: (response && response.result_code) ? response.result_code : '500',
          });
        });
    },
  });

  if (FAILURE) {
    promise.fail((...args) => {
      dispatch({
        type: FAILURE,
        error: args,
      });
    });
  }

  return promise;
}
