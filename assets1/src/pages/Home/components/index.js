import React, { Component, PropTypes } from 'react';
import './style.less';

export default class Home extends Component {
  static propTypes = {
    loadDateFilter: PropTypes.func.isRequired,
    dateFilters: PropTypes.object.isRequired,
  }

  componentWillMount() {
    const {
      loadDateFilter,
    } = this.props;
    loadDateFilter();
  }

  render() {
    const {
      dateFilters,
    } = this.props;
    console.log(dateFilters);
    return (
      <div>home</div>
    );
  }
}
