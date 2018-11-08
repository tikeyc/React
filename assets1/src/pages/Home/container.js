import { connect } from 'react-redux';
import Components from './components';
import * as actions from './actions';
import { resetDate } from '../date/actions';

export default connect(({ home, dateFilters }, { params: { type } }) => ({
  ...home,
  dateFiltersEnd: dateFilters,
  type,
}), {
  ...actions,
  resetDate,
})(Components);
