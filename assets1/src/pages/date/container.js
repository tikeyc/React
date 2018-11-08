import { connect } from 'react-redux';
import Components from './components';
import * as actions from './actions';

export default connect(({ dateFilters }) => ({ dateFilters }), actions)(Components);
