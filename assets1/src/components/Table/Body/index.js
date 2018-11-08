import $ from 'jquery';
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

import Colgroup from '../Colgroup';
import LoadMore from '../LoadMore';
import Thead from '../Thead';
import Tbody from '../Tbody';

const theme = 'scrollbar-outer';

export default class Body extends Component {
  static propTypes = {
    dataSource: PropTypes.array.isRequired,
    headers: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    widths: PropTypes.array.isRequired,
    hasMore: PropTypes.bool.isRequired,
    pagination: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    rows: PropTypes.array.isRequired,
    showHeader: PropTypes.bool.isRequired,
    sortOrder: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    sortColumnKey: PropTypes.string,
    onSort: PropTypes.func,
    defaultExpandAllRows: PropTypes.bool,
    defaultExpandedRowKeys: PropTypes.array,
    expandedRowKeys: PropTypes.array,
    expandRowByClick: PropTypes.bool,
    onExpand: PropTypes.func,
    hasScroller: PropTypes.bool.isRequired,
    rowClassName: PropTypes.func,
    rowKey: PropTypes.string.isRequired,
    indentSize: PropTypes.number,
    onScroll: PropTypes.func.isRequired,
    hoverRowIndex: PropTypes.any.isRequired,
    onHoverRow: PropTypes.func.isRequired,
    onHeaderRow: PropTypes.func,
    onHeaderCell: PropTypes.func,
    onRow: PropTypes.func,
  };

  static defaultProps = {
    pagination: undefined,
    sortOrder: undefined,
    sortColumnKey: undefined,
    onSort: undefined,
    defaultExpandAllRows: undefined,
    defaultExpandedRowKeys: undefined,
    expandedRowKeys: undefined,
    expandRowByClick: undefined,
    onExpand: undefined,
    rowClassName: undefined,
    indentSize: undefined,
    onHeaderRow: undefined,
    onHeaderCell: undefined,
    onRow: undefined,
  };

  componentDidMount() {
    const {
      hasMore,
      hasScroller,
      pagination,
    } = this.props;
    const $scroller = $(this.elmScroller);
    let $loadMore;
    if (hasMore) $loadMore = $(this.elmLoadMore.elmLoadMore);
    if (hasScroller) {
      $scroller.scrollbar({
        onScroll: (yBar, xBar) => {
          if (pagination.type === 'more') {
            if (hasMore) $loadMore.css({ marginLeft: xBar.scroll });
          }
        },
      });
    }
  }

  refScroller = ref => {
    if (ref) {
      this.elmScroller = ref;
    }
  }

  refTable = ref => {
    if (ref) {
      this.elmTable = ref;
    }
  }

  refLoadMore = ref => {
    if (ref) {
      this.elmLoadMore = ref;
    }
  }

  render() {
    const {
      dataSource,
      headers,
      columns,
      widths,
      hasMore,
      pagination,
      rows,
      showHeader,
      sortOrder,
      sortColumnKey,
      onSort,
      defaultExpandAllRows,
      defaultExpandedRowKeys,
      expandedRowKeys,
      expandRowByClick,
      onExpand,
      rowClassName,
      rowKey,
      indentSize,
      onScroll,
      hoverRowIndex,
      onHoverRow,
      onHeaderRow,
      onHeaderCell,
      onRow,
    } = this.props;

    return (
      <div
        className={classnames('ways-table-body', theme)}
        ref={this.refScroller}
        onScroll={onScroll}
      >
        <table ref={this.refTable}>
          <Colgroup columns={columns} widths={widths} />
          {showHeader &&
            <Thead
              headers={headers}
              columns={columns}
              sortOrder={sortOrder}
              sortColumnKey={sortColumnKey}
              onSort={onSort}
              onHeaderRow={onHeaderRow}
              onHeaderCell={onHeaderCell}
            />
          }
          <Tbody
            columns={columns}
            rows={rows}
            expandable
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
          <LoadMore
            ref={this.refLoadMore}
            rows={rows}
            dataSource={dataSource}
            {...pagination}
          />
        }
      </div>
    );
  }
}
