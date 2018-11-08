// import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import $ from 'jquery';

import { getFixed } from '../helper';
import SortOrder from '../SortOrder';

export default class Thead extends Component {
  static propTypes = {
    type: PropTypes.string,
    headers: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    sortOrder: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]),
    sortColumnKey: PropTypes.string,
    onSort: PropTypes.func,
    onHeaderRow: PropTypes.func,
    onHeaderCell: PropTypes.func,
  }

  static defaultProps = {
    type: '',
    sortOrder: undefined,
    sortColumnKey: undefined,
    onSort: undefined,
    onHeaderRow: undefined,
    onHeaderCell: undefined,
  }

  componentDidMount() {
    this.resetRowsHeight();
  }

  componentWillUpdate({ headers }) {
    if (headers !== this.props.headers) {
      setTimeout(() => {
        this.resetRowsHeight();
      }, 0);
    }
  }

  // static getNextRowColumns(columns) {
  //   return _.flatten(columns.filter(column => column.children)
  //     .map(column => column.children));
  // }

  getHeaderRowProps = rowIndex => {
    const { onHeaderRow, columns } = this.props;
    return (onHeaderRow && onHeaderRow(columns, rowIndex)) || {};
  }

  // getHeaderRows = (columns) => {
  //   const { type } = this.props;
  //
  //   // 普通头部
  //   let headerRows = [columns];
  //   // 冻结列头部
  //   if (type) {
  //     headerRows = [columns.filter(({ fixed }) => fixed && getFixed(fixed) === type)];
  //   }
  //
  //   const nextRowColumns = Thead.getNextRowColumns(headerRows[0]);
  //   if (nextRowColumns.length > 0) {
  //     return [...headerRows, ...this.getHeaderRows(nextRowColumns)];
  //   }
  //   return headerRows;
  // }

  getHeaderRows = headers => {
    const { type } = this.props;

    // 普通头部
    let headerRows = headers;
    // 冻结列头部
    if (type) {
      headerRows = headers.map(header => (
        header.filter(({ fixed }) => fixed && getFixed(fixed) === type)
      )).filter(header => header.length > 0);
    }

    return headerRows;
  }

  refThead = ref => {
    if (ref) this.elmThead = ref;
  }

  /**
   * 同步冻结头部列行高
   * 由于表头在冻结列时可能会出现缺行的情况，
   * 必须将高度与内容表格头部高度进行匹配设置
   */
  resetRowsHeight = () => {
    if (this.props.type) {
      const rowsHeight = $(this.elmThead)
        .closest('.ways-table')
        .find('.ways-table-body thead tr th:nth-child(1)')
        .map(function cb() {
          return $(this).outerHeight();
        })
        .get();
      $(this.elmThead).find('tr').each(function cb(index) {
        $(this).outerHeight(rowsHeight[index]);
      });
    }
  }

  render() {
    const {
      headers: cols,
      // columns: cols,
      sortOrder,
      sortColumnKey,
      onSort,
      onHeaderCell,
    } = this.props;

    const headerRows = this.getHeaderRows(cols);

    return (
      <thead ref={this.refThead}>
        {headerRows.map((row, index) => (
          <tr
            key={index}
            {...this.getHeaderRowProps(index)}
          >
            {row.map((column, rowIndex) => {
              const {
                key,
                title,
                titleRender,
                rowSpan,
                colSpan,
                titleStyle = {},
                titleClassName = '',
                sorter,
              } = column;
              const headerCell = column.onHeaderCell || onHeaderCell;

              return (
                <th
                  key={rowIndex}
                  style={titleStyle}
                  className={titleClassName}
                  {...rowSpan > 1 ? { rowSpan } : {}}
                  {...colSpan > 1 ? { colSpan } : {}}
                  {...(headerCell ? headerCell(column) : {})}
                >
                  {!titleRender ? title : titleRender(title, column)}
                  {sorter &&
                    <SortOrder
                      sortOrder={sortColumnKey === key ? sortOrder : false}
                      onSort={onSort}
                      columnKey={key}
                    />
                  }
                </th>
              );
            })}
          </tr>
        ))}
      </thead>
    );
  }
}
