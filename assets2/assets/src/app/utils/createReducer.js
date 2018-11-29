// import { createReducer } from 'redux-immutablejs';

export function createFSAReducer(initialState, handlers) {
  return function reducer(state = initialState, action) {
    if (Object.hasOwnProperty.call(handlers, action.type)) {
      return handlers[action.type](state, action);
    }
    return state;
  };
}

export default function (handlers) {
  const { CONSTRUCT: construct } = handlers;
  const initialState = construct ? construct() : {};

  return function reducer(state = initialState, action) {
    if (Object.hasOwnProperty.call(handlers, action.type)) {
      return handlers[action.type](state, action);
    }
    return state;
  };
}

// export function createImmutableReducer(handlers) {
//   const { CONSTRUCT: construct } = handlers;
//   const initialState = construct ? construct() : {};

//   return createReducer(initialState, handlers);
// }
