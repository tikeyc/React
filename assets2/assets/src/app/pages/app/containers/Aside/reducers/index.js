import $ from 'jquery';
import createReducer from 'createReducer';
import { TOGGLE_PAGE_ASIDE } from '../actions';

export default createReducer({
  CONSTRUCT() {
    return true;
  },

  [TOGGLE_PAGE_ASIDE](state) {
    if (state) {
      $('#iconMenu').hide();
    } else {
      $('#iconMenu').show();
    }
    return !state;
  },
});
