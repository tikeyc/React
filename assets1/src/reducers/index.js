import { combineReducers } from 'redux';

import appState from './app';
import { reducer as home } from '../pages/Home';
import { reducer as date } from '../pages/date';

export default combineReducers({
  appState,
  home,
  dateFilters: date,
});
