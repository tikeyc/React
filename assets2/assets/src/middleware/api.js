import $ from 'jquery';
import _ from 'lodash';

$.ajaxSetup({ cache: false });

export function getDataFromServer(dispatch, api) {
  const { type: types, endpoint, callback, action, ...rest } = api;

  const typesSize = types.length;
  const REQUEST = typesSize > 1 && types[0];
  const SUCCESS = types[typesSize > 1 ? 1 : 0];
  const FAILURE = typesSize === 3 && types[2];

  if (REQUEST) {
    dispatch({ ...rest, type: REQUEST });
  }

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
        return $.getJSON(url, data);
      }
      return getDataFromServer(dispatch, actionCreator());
    });
    $.when.apply(null, promises)
      .done((...values) => {
        const responses = values.map(value => value[0]);
        dispatch(Object.assign({}, action || {}, {
          ...rest,
          type: SUCCESS,
          responses,
        }));
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
    url = endpoint;
  } else {
    url = endpoint.url;
    data = endpoint.data;
  }
  const promise = $.getJSON(
    `${window.$ctx}/${url}`,
    data,
    response => {
      console.log('success');
      dispatch(Object.assign({}, action || {}, {
        ...rest,
        type: SUCCESS,
        response,
      }));
      if (callback) callback(response);
    }
  );

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
    dispatch({ ...rest, type: REQUEST });
  }

  if (_.isArray(endpoint)) {
    const promises = endpoint.map(actionCreator =>
      postDataToServer(dispatch, _.isFunction(actionCreator) ? actionCreator() : actionCreator)
    );
    $.when.apply(null, promises)
      .done((...values) => {
        const responses = values.map(value => value[0]);
        dispatch(Object.assign({}, action || {}, {
          ...rest,
          type: SUCCESS,
          responses,
        }));
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
    url = endpoint;
  } else {
    url = endpoint.url;
    data = endpoint.data;
  }
  const promise = $.post(
    url,
    data,
    response => {
      if (SUCCESS) {
        dispatch({
          ...rest,
          type: SUCCESS,
          response,
        });
      }
      if (callback) callback(response);
    },
    'json'
  );

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
