import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux/lib/reducer';
import images from './images';
import aside from '../app/pages/app/containers/Aside/reducers';
import { reducer as dashboard } from '../app/pages/Home';

export default combineReducers({
  routing,
  images,
  aside,
  dashboard,
});
