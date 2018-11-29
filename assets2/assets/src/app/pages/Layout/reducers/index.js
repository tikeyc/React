import createReducer from 'createReducer';
import { TOGGLE_ASIDE } from '../actions';

export default createReducer({
  CONSTRUCT() {
    return true;
  },

  [TOGGLE_ASIDE](state) {
    return !state;
  },
});
