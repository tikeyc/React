import createReducer from '../../helpers/createReducer';
import { LOAD_DATE_FILTER } from './actions';

function transferDate(date) { // 20180102 => 2018-1
  const year = date.substring(0, 4);
  let month = date.substring(4, 6).substring(0, 2);
  if (month.substring(0, 1) === '0') {
    month = month.substring(1, 2);
  }
  return `${year}-${month}`;
}

export default createReducer({
  CONSTRUCT() {
    return {
      dateFilters: {},
    };
  },

  [LOAD_DATE_FILTER](state, { response }) {
    if (response.result_code !== '200') {
      return state;
    }
    const dateFilters = {
      min: transferDate(response.data.min),
      max: transferDate(response.data.max),
      select: transferDate(response.data.select),
    };
    return {
      ...state,
      dateFilters,
    };
  },
});
