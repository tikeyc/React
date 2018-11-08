import React, { Component, PropTypes } from 'react';
import $ from 'jquery';

import Colgroup from '../Colgroup';
import Thead from '../Thead';
import Tbody from '../Tbody';

import './style.less';

export default class FixedColumns extends Component {
  static propTypes = {
    hasMore: PropTypes.bool.isRequired,
    showHeader: PropTypes.bool.isRequired,
    bodyOuterHeight: PropTypes.number.isRequired,
    columns: PropTypes.array.isRequired,
    headers: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired,
    defaultExpandAllRows: PropTypes.bool,
    defaultExpandedRowKeys: PropTypes.array,
    expandedRowKeys: PropTypes.array,
    expandRowByClick: PropTypes.bool,
    onExpand: PropTypes.func,
    type: PropTypes.string.isRequired,
    widths: PropTypes.array.isRequired,
    rowClassName: PropTypes.func,
    rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    sortOrder: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]),
    sortColumnKey: PropTypes.string,
    onSort: PropTypes.func,
    indentSize: PropTypes.number,
    onWheel: PropTypes.func,
    hoverRowIndex: PropTypes.any.isRequired,
    onHoverRow: PropTypes.func.isRequired,
    onHeaderRow: PropTypes.func,
    onHeaderCell: PropTypes.func,
    onRow: PropTypes.func,
  }

  static defaultProps = {
    defaultExpandAllRows: undefined,
    defaultExpandedRowKeys: undefined,
    expandedRowKeys: undefined,
    expandRowByClick: undefined,
    onExpand: undefined,
    rowClassName: undefined,
    rowKey: undefined,
    sortOrder: undefined,
    sortColumnKey: undefined,
    onSort: undefined,
    indentSize: undefined,
    onWheel: undefined,
    onHeaderRow: undefined,
    onRow: undefined,
  };

  componentDidMount() {
    this.resetRowsHeight();
  }

  componentWillUpdate({ rows }) {
    if (rows !== this.props.rows) {
      setTimeout(() => {
        this.resetRowsHeight();
      }, 0);
    }
  }

  getFixed = fixed => (fixed === true ? 'left' : fixed)

  getColgroupOptions() {
    const { type, columns, widths } = this.props;

    let nextWidths = [];
    const cols = columns.filter(({ fixed }, index) => {
      const result = this.getFixed(fixed) === type;
      if (widths.length && result) {
        nextWidths.push(widths[index]);
      }
      return result;
    });
    if (type === 'right') {
      const index = columns.findIndex(({ fixed }) => fixed === 'right');
      nextWidths = widths.slice(index);
    }

    return { cols, widths: nextWidths };
  }

  refRoot = ref => {
    if (ref) this.elmRoot = ref;
  }

  refOuter = ref => {
    if (ref) this.elmOuter = ref;
  }

  resetRowsHeight = () => {
    const $trs = $(this.elmOuter).find('tbody tr');
    $(this.elmOuter).closest('.ways-table').find('.ways-table-body tbody tr').each(function cb(index) {
      $trs.eq(index).height($(this).height());
    });
  }

  render() {
    const {
      hasMore,
      showHeader,
      bodyOuterHeight,
      columns,
      headers,
      rows,
      defaultExpandAllRows,
      defaultExpandedRowKeys,
      expandedRowKeys,
      expandRowByClick,
      onExpand,
      type,
      rowClassName,
      rowKey,
      sortOrder,
      sortColumnKey,
      onSort,
      indentSize,
      onWheel,
      hoverRowIndex,
      onHoverRow,
      onHeaderRow,
      onHeaderCell,
      onRow,
    } = this.props;
    const {
      cols,
      widths,
    } = this.getColgroupOptions();

    const tableWidth = widths.reduce((sum, width) => sum + width, 0) + (type === 'right' ? 1 : 0);

    const colgroup = <Colgroup columns={cols} widths={widths} />;
    const header = (
      <Thead
        type={type}
        headers={headers}
        columns={columns}
        sortOrder={sortOrder}
        sortColumnKey={sortColumnKey}
        onSort={onSort}
        onHeaderRow={onHeaderRow}
        onHeaderCell={onHeaderCell}
      />
    );

    return (
      <div
        ref={this.refRoot}
        className={`ways-table-fixed-${type}`}
      >
        <div
          className="ways-table-body-outer"
          style={{ height: bodyOuterHeight }}
          ref={this.refOuter}
          onWheel={onWheel}
        >
          <table style={{ width: tableWidth }}>
            {colgroup}
            {showHeader && header}
            <Tbody
              columns={columns}
              rows={rows}
              fixedType={type}
              expandable={type === 'left'}
              defaultExpandAllRows={defaultExpandAllRows}
              defaultExpandedRowKeys={defaultExpandedRowKeys}
              expandedRowKeys={expandedRowKeys}
              expandRowByClick={expandRowByClick}
              onExpand={onExpand}
              rowClassName={rowClassName}
              rowKey={rowKey}
              indentSize={indentSize}
              hoverRowIndex={hoverRowIndex}
              onHoverRow={onHoverRow}
              onRow={onRow}
            />
          </table>
          {hasMore &&
            <div className="ways-table-load-more-placeholder" />
          }
        </div>
        {showHeader &&
          <div className="ways-table-fixed">
            <table>
              {colgroup}
              {header}
            </table>
          </div>
        }
      </div>
    );
  }
}
