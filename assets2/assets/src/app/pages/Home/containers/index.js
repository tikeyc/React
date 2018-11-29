import { connect } from 'react-redux';
import Home from '../components';
import * as actions from '../actions';

export default connect(state => state.dashboard, actions)(Home);
