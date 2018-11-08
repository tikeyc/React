import createReducer from '../helpers/createReducer';

import { UPDATE_APP_STATE } from '../App';

export default createReducer({
  CONSTRUCT() {
    return {};
  },

  [UPDATE_APP_STATE](state, { appState }) {
    return { ...state, ...appState };
  },
});
