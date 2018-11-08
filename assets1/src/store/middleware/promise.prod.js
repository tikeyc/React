import * as api from './api';

function createThunkMiddleware() {
  return ({ dispatch, getState }) => next => action => {
    const { type, endpoint } = action;

    if (endpoint) {
      const ajaxAction = { ...action };
      if (!Array.isArray(type)) {
        ajaxAction.type = [type];
      }

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
