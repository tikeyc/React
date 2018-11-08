import React, { Component, PropTypes } from 'react';

import Colgroup from '../Colgroup';
import Thead from '../Thead';

import './style.less';

export default class Header extends Component {
  static propTypes = {
    columns: PropTypes.array.isRequired,
    headers: PropTypes.array.isRequired,
    widths: PropTypes.array.isRequired,
    sortOrder: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    sortColumnKey: PropTypes.string,
    onSort: PropTypes.func,
    onHeaderRow: PropTypes.func,
    onHeaderCell: PropTypes.func,
  };

  static defaultProps = {
    sortOrder: undefined,
    sortColumnKey: undefined,
    onSort: undefined,
    onHeaderRow: undefined,
    onHeaderCell: undefined,
  };

  refOuter = ref => {
    if (ref) {
      this.elmOuter = ref;
    }
  }

  refContent = ref => {
    if (ref) {
      this.elmContent = ref;
    }
  }

  render() {
    const {
      headers,
      columns,
      widths,
      sortOrder,
      sortColumnKey,
      onSort,
      onHeaderRow,
      onHeaderCell,
    } = this.props;

    return (
      <div
        className="ways-table-header"
        ref={this.refOuter}
      >
        <table ref={this.refContent}>
          <Colgroup
            columns={columns}
            widths={widths}
          />
          <Thead
            columns={columns}
            headers={headers}
            sortOrder={sortOrder}
            sortColumnKey={sortColumnKey}
            onSort={onSort}
            onHeaderRow={onHeaderRow}
            onHeaderCell={onHeaderCell}
          />
        </table>
      </div>
    );
  }
}
