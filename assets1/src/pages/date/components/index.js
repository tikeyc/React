import React, { Component, PropTypes } from 'react';
import Calendar from '../../../components/Calendar/Monthpicker';

export default class TerminalExcitionSearch extends Component {
  static propTypes = {
    resetDate: PropTypes.func.isRequired,
    dateFilters: PropTypes.object.isRequired,
    loadDateFilter: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    updateDate: PropTypes.func.isRequired,
  }

  state = {
    select: null,
  }

  componentWillMount() {
    // console.log(8888, this.props);
    const {
      dateFilters,
      loadDateFilter,
    } = this.props;
    if (!dateFilters.select) {
      loadDateFilter();
    }
  }

  componentWillUnmount() {
    const {
      select,
    } = this.state;
    if (select) {
      this.props.updateDate(select);
    }
  }

  handleChange = select => {
    this.props.onChange(select);
    this.setState({ select });
  }

  render() {
    // const {
    //   dateFiltersStart,
    //   dateFiltersEnd,
    // } = this.state;
    // console.log('marketFilters', marketFilters);
    const {
      dateFilters,
    } = this.props;
    // console.log(999999, dateFilters);
    return (
      <Calendar
        {...this.props}
        options={dateFilters}
        onChange={this.handleChange}
      />
    );
  }
}
