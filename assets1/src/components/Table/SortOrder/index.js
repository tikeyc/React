import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

import './style.less';

export default class SortOrder extends Component {
  static propTypes = {
    defaultSortOrder: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    sortOrder: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    onSort: PropTypes.func.isRequired,
    columnKey: PropTypes.string.isRequired,
  }

  static defaultProps = {
    defaultSortOrder: false,
    sortOrder: undefined,
  }

  constructor(props) {
    super(props);

    this.state = {
      sortOrder: this.getSortOrder(),
    };
  }

  componentWillReceiveProps({ sortOrder }) {
    if (sortOrder !== this.state.sortOrder) {
      this.setState({ sortOrder });
    }
  }

  getSortOrder() {
    let sortOrder = this.props.defaultSortOrder;
    if ('sortOrder' in this.props) {
      ({ sortOrder } = this.props);
    }
    return sortOrder;
  }

  changeOrder = toSortOrder => {
    const { columnKey, onSort } = this.props;
    const { sortOrder } = this.state;
    const nextSortOrder = sortOrder === toSortOrder ? false : toSortOrder;
    this.setState({ sortOrder: nextSortOrder });
    onSort(nextSortOrder, columnKey);
  }

  handleChangeOrderToUp = event => {
    event.stopPropagation();
    this.changeOrder('ascend');
  }

  handleChangeOrderToDown = event => {
    event.stopPropagation();
    this.changeOrder('descend');
  }

  render() {
    const { sortOrder } = this.state;

    return (
      <div className="ways-table-column-sorter">
        <span
          className={classnames(
            'ways-table-column-sorter-up',
            sortOrder === 'ascend' ? 'on' : 'off',
          )}
          title="↑"
          onClick={this.handleChangeOrderToUp}
        >
          <i className="ways-table-caret-up" />
        </span>
        <span
          className={classnames(
            'ways-table-column-sorter-down',
            sortOrder === 'descend' ? 'on' : 'off',
          )}
          title="↓"
          onClick={this.handleChangeOrderToDown}
        >
          <i className="ways-table-caret-down" />
        </span>
      </div>
    );
  }
}
