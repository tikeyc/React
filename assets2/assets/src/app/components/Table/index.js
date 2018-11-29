import _ from 'lodash';
import $ from 'jquery';
import React, { Component, PropTypes } from 'react';
import 'jquery.scrollbar';
import './style';
import Td from './Td';

const TableTips = ({ children, style }) => (
  <div className="table-tips" style={style}>
    <div className="table-tips-content">
      {children}
    </div>
  </div>
);

TableTips.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object.isRequired,
};

class Table extends Component {
  static propTypes = {
    className: PropTypes.string,
    options: PropTypes.object.isRequired,
    style: PropTypes.object,
    children: PropTypes.node,
    loading: PropTypes.bool,
    fixedTableAside: PropTypes.node,
    freezeHeader: PropTypes.bool,
    freezeColumn: PropTypes.number,
    scrollY: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    visibleColumns: PropTypes.array,
    autoExpand: PropTypes.bool,
    pagination: PropTypes.func,
    ppNumber: PropTypes.number,
    ifRenderMore: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: Boolean(props.loading),
      colsWidth: [],
      options: props.options || [],
      page: 1,
      hasMorePage: true,
      tableWidth: 0,
    };
  }

  componentDidMount() {
    const {
      freezeHeader,
      freezeColumn,
      // scrollY,
      // style,
    } = this.props;

    const $refTableWrapper = $(this.refTableWrapper);
    const $dataTableScroller = $(this.refDataTableScroller);

    if (freezeHeader || freezeColumn) {
      const $fixedTableHeaderScroller = $(this.refFixedTableHeaderScroller);

      $dataTableScroller.on('scroll', () => {
        $fixedTableHeaderScroller.scrollLeft($dataTableScroller.scrollLeft());
      });

      this.tableWidth = $refTableWrapper.width();
    }

    if (freezeColumn) {
      const $fixedTableAsideScroller = $(this.refFixedTableAsideScroller);

      $dataTableScroller.on('scroll', () => {
        $fixedTableAsideScroller.scrollTop($dataTableScroller.scrollTop());
      });

      $fixedTableAsideScroller.on('mousewheel', event => {
        const { deltaY, wheelDelta } = event.originalEvent;
        const y = deltaY || -wheelDelta;
        $dataTableScroller.scrollTop($dataTableScroller.scrollTop() + y);
      });
    }

    const $hasMoreButton = $(this.refHasMoreButton);
    $dataTableScroller.scrollbar({
      onScroll: (yBar, xBar) => {
        $hasMoreButton.css({ 'margin-left': xBar.scroll });
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    const prevOptions = this.props.options;
    const { options, pagination, ppNumber = 10, ifRenderMore } = nextProps;
    if (prevOptions !== options) {
      let { page, hasMorePage } = this.state;

      if (pagination) {
        const currRowsLength = options.data.length;
        const prevRowsLength = prevOptions.data.length;
        const currPageDataNumber = currRowsLength - prevRowsLength;

        // 重新填数，分页变量重置为第一页。
        if (
          // 新数据比旧数据长度要短
          currPageDataNumber < 0 ||
          // 新数据比旧数据长度要长，且当前纪录条数小于每页最大纪录数，且非第一次加载数据
          (currPageDataNumber > 0 && currRowsLength <= ppNumber && prevRowsLength > 0)
        ) {
          page = 1;
        }

        // 判断是否有下一页
        if (page === 1) {
          hasMorePage = currRowsLength >= ppNumber;
        } else {
          hasMorePage = currPageDataNumber >= ppNumber;
        }

        if (ifRenderMore && ifRenderMore !== undefined) {
          hasMorePage = ifRenderMore;
        }
      }

      this.setState({ options, loading: false, page, hasMorePage });

      // 新配置表格宽度小于原配置表格宽度时，
      // 滚动条无法自动重置，导致滚动位置超过可滚动最大限制，
      // 会出现内容错位，下面这段代码是用来手动强制重置的。
      setTimeout(() => {
        // 配置变更时，重置滚动位置
        const $dataTableScroller = $(this.refDataTableScroller);
        const maxScrollLeft = $(this.refDataTable).outerWidth() - this.tableWidth;
        if ($dataTableScroller.scrollLeft() > maxScrollLeft) {
          $dataTableScroller.scrollLeft(maxScrollLeft);
        }
      }, 0);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.tableWidth !== nextState.tableWidth ||
      this.state.options !== nextState.options ||
      this.props.visibleColumns !== nextProps.visibleColumns
    );
  }

  componentDidUpdate(prevProps) {
    const { options } = this.props;
    if (options !== prevProps.options) {
      setTimeout(() => {
        this.freeze(options);
      }, 500);
    }
  }

  getVisibleChildrenColumns(columns) {
    return _.flatten(columns.filter(column => column.children)
      .map(column => column.children));
  }

  getVisibleColumns(columns) {
    if (!columns) return [];

    const { visibleColumns } = this.props;
    const children = this.getVisibleChildrenColumns(columns);
    let childrenColumns = [];
    if (children.length > 0) {
      childrenColumns = this.getVisibleColumns(children);
    }
    return columns.filter((column, index) => (
      !column.children &&
      (column.visible === undefined ||
      (column.visible !== undefined && visibleColumns.includes(index)))
    )).concat(childrenColumns);
  }

  getVisibleTbodyColumns(columns) {
    if (!columns) return [];

    const { visibleColumns } = this.props;
    let nextColumns = [];

    columns.forEach((column, index) => {
      const { children, visible } = column;
      if (!children) {
        if (
          visible === undefined ||
          (visible !== undefined && visibleColumns.includes(index))
        ) {
          nextColumns.push(column);
        }
      } else {
        nextColumns = nextColumns.concat(this.getVisibleTbodyColumns(children));
      }
    });

    return nextColumns;
  }

  getVisibleHeads() {
    const { options: { columns = [] } } = this.state;
    const { visibleColumns } = this.props;
    return columns.filter((column, index) => (
      column.visible === undefined ||
      (column.visible !== undefined && visibleColumns.includes(index))
    ));
  }

  getTbody(data, columns, arrayMode, freezeColumn, drillLevel, isRoot) {
    const { autoExpand } = this.props;
    if (isRoot) this.rowIndex = -1;

    return data.map((row, rowIndex) => {
      const { expanded } = row;
      this.rowIndex += 1;
      let result = [
        <tr
          key={row.id}
          onClick={row.onClick && (() => row.onClick(row.id))}
          className={`${row.className || ''} ${this.rowIndex % 2 === 0 ? 'odd' : 'even'}`}
        >
          {columns.map(({ key, render, className, style, drillPoint }, colIndex) => {
            if (freezeColumn && colIndex > freezeColumn - 1) return undefined;
            const data = row[arrayMode ? colIndex : key];
            const coordinate = {
              row: this.rowIndex,
              col: colIndex,
            };

            const isObject = typeof data === 'object';
            if ((!isObject && data !== undefined) || (isObject && !_.isEmpty(data))) {
              return (
                <Td
                  key={colIndex}
                  className={className}
                  style={style}
                  data={data}
                  render={render}
                  rowData={row}
                  coordinate={coordinate}
                  drillPoint={drillPoint}
                  drillLevel={drillLevel}
                  autoExpand={autoExpand}
                  onDrill={this.drill}
                  expanded={expanded}
                  rowIndex={rowIndex}
                />
              );
            }
            return undefined;
          })}
        </tr>,
      ];
      if (row.children && row.children.length > 0) {
        if (((autoExpand && expanded === undefined) || expanded)) {
          result = [...result, this.getTbody(
            row.children, columns, arrayMode, freezeColumn, drillLevel + 1
          )];
        } else {
          this.rowIndex += row.children.length;
        }
      }
      return result;
    });
  }

  getDefaultHeader(columns) {
    const trs = [
      <tr key={0}>
        {columns.map((column, index) => {
          const { title, titleRender, rowSpan, colSpan, titleStyle = {}, titleClassName = '' } = column;
          return (
            <th
              key={index}
              rowSpan={rowSpan}
              colSpan={colSpan}
              style={titleStyle}
              className={titleClassName}
            >
              {!titleRender ?
                title :
                titleRender(title, column)
              }
            </th>
          );
        })}
      </tr>,
    ];

    const childrenColumns = this.getVisibleChildrenColumns(columns);
    if (childrenColumns.length > 0) {
      trs.push(this.getDefaultHeader(childrenColumns));
    }

    return trs;
  }

  getCalculateColumns(columns, isRoot) {
    let ccols = [];
    if (isRoot) this.ccolCount = -1;
    columns.forEach(column => {
      if (column.children) {
        ccols = ccols.concat(this.getCalculateColumns(column.children));
      } else {
        this.ccolCount += 1;
        if (this.widths) {
          ccols.push(
            <th key={this.ccolCount} style={{ width: this.widths[this.ccolCount] }} />
          );
        } else {
          ccols.push(<th key={this.ccolCount} />);
        }
      }
    });
    return ccols;
  }

  getCalculateCol(columns, isRoot) {
    let ccols = [];
    if (isRoot) this.ccolCount = -1;
    columns.forEach(column => {
      if (column.children) {
        ccols = ccols.concat(this.getCalculateCol(column.children));
      } else {
        this.ccolCount += 1;
        if (this.widths) {
          ccols.push(
            <col key={this.ccolCount} style={{ width: this.widths[this.ccolCount] }} />
          );
        } else {
          ccols.push(<col key={this.ccolCount} />);
        }
      }
    });
    return ccols;
  }

  getTableHeader(columns) {
    const { children } = this.props;
    const hasCustomHeader = children && children.type === 'thead';

    if (hasCustomHeader) {
      const c = children.props.children;
      (c.length ? c : [c]).push(
        <colgroup>
          {columns.map((column, index) => (
            <col key={index} />
          ))}
        </colgroup>
      );
      return children;
    }

    return ([
      <colgroup key={0}>
        {this.getCalculateCol(columns, true)}
      </colgroup>,
      <thead key={1}>
        {this.getDefaultHeader(columns)}
      </thead>,
    ]);
  }

  getFreezeHeaderAside(columns) {
    const { fixedTableAside, freezeColumn } = this.props;

    const calculateWidthRow = (
      <colgroup key={0}>
        {columns.slice(0, freezeColumn).map((column, index) => (
          <col key={index} />
        ))}
      </colgroup>
    );

    // ...TODO 该问题待修改
    // 这里的 calculateWidthRow 会被插入 thead，
    // 实际上应该要与 thead 平级
    if (fixedTableAside) {
      fixedTableAside.props.children.push(calculateWidthRow);
    }

    return (
      fixedTableAside || [
        calculateWidthRow,
        <thead key={1}>
          <tr>
            {columns.map(({ title, rowSpan, colSpan, titleStyle = {}, titleClassName = '' }, index) => {
              if (index > freezeColumn - 1) return undefined;
              return (
                <th
                  key={index}
                  rowSpan={rowSpan}
                  colSpan={colSpan}
                  style={titleStyle}
                  className={titleClassName}
                >
                  {title}
                </th>
              );
            })}
          </tr>
        </thead>,
      ]
    );
  }

  freeze = options => {
    const { columns } = options;
    const { freezeHeader, freezeColumn } = this.props;

    if (!columns || (!freezeHeader && !freezeColumn)) return;

    const visibleColumns = this.getVisibleTbodyColumns(columns);
    if (visibleColumns.length === 0) return;

    let tableWidth = 0;
    const widths = [];
    // const ths = 'thead tr:last th';
    const $table = $(this.refDataTable);
    // const $ths = $table.find(ths);
    const cols = 'colgroup col';
    const $tds = $table.find('tbody tr:first td');
    const $cols = $table.find(cols);
    const $fixedTableHeader = $(this.refFixedTableHeader);
    const $fixedHeaderThs = $fixedTableHeader.find(cols);
    const $fixedAsideThs = $(this.refFixedTableAside).find(cols);
    const $fixedHeaderAsideThs = $(this.refFixedTableHeaderAside).find(cols);
    const scrollbarWidth = $(this.refTableWrapper).find('.scroll-y').outerWidth();

    // 还原表格原始宽度
    $table.outerWidth('100%');
    $fixedTableHeader.outerWidth('100%');

    // 如果出现 Y 轴滚动条，冻结头部的表格宽度减少与滚动条等宽的尺寸
    const hasScrollY = $table.outerHeight() > $(this.refTableWrapper).outerHeight();
    $fixedTableHeader.parent().css({ 'margin-right': hasScrollY ? scrollbarWidth : 0 });

    // 设置每列 col 宽度
    // 如果有固定宽度就设置该宽度，无固定宽度不设宽度（自适应）
    $tds.each(function (index) {
      const colWidth = visibleColumns[index].width;
      const width = colWidth || $(this).outerWidth();
      if (colWidth) $cols.eq(index).outerWidth(colWidth);
      widths.push(width);
      tableWidth += width;
    });

    // 给 table 元素设置实际的总宽度
    if (tableWidth > this.tableWidth) {
      $table.outerWidth(tableWidth);
      $fixedTableHeader.outerWidth(tableWidth);
    }

    // 给冻结表头和冻结列设置宽度
    let $lastNoWidthCol = null;
    let lastNoWidthWidth = 0;
    widths.forEach((width, index) => {
      // 设置冻结表头宽度
      const $col = $fixedHeaderThs.eq(index).outerWidth(width);

      // 设置冻结列宽度
      if (freezeColumn) {
        $fixedAsideThs.eq(index).outerWidth(width);
        $fixedHeaderAsideThs.eq(index).outerWidth(width);
      }

      // 取得最后无固定宽度的列与宽度
      if (!hasScrollY && !visibleColumns[index].width) {
        $lastNoWidthCol = $col;
        lastNoWidthWidth = width;
      }
    });

    // 如果没有出现 Y 轴滚动条，就给最后没有固定宽度的列补上与 Y 轴滚动条
    // 等宽的宽度增量，以填补 Y 轴消失后右边多出的 12px 空白
    if ($lastNoWidthCol) {
      $lastNoWidthCol.outerWidth(lastNoWidthWidth + scrollbarWidth);
    }
  }

  ccolCount = -1;

  rowIndex = -1;

  drill = id => {
    const { options } = this.state;
    this.setState({
      options: {
        ...options,
        data: this.drillHelper(options.data, id),
      },
    });
  }

  drillHelper(data, id) {
    const { autoExpand } = this.props;
    return data.map(row => {
      if (row.id !== id) {
        if (row.children) {
          return {
            ...row,
            children: this.drillHelper(row.children, id),
          };
        }
        return row;
      }
      return {
        ...row,
        expanded: (autoExpand && row.expanded === undefined) ? false : !row.expanded,
      };
    });
  }

  render() {
    const {
      options,
      loading,
      page,
      hasMorePage,
      tableWidth,
    } = this.state;
    const {
      className,
      style = {},
      freezeHeader,
      freezeColumn,
      scrollY,
      pagination,
    } = this.props;
    const { height } = style;
    const { columns, data = [] } = options;
    const visibleColumns = this.getVisibleTbodyColumns(columns);
    const arrayMode = visibleColumns.length > 0 && !visibleColumns[0].key;
    let tips;
    if (loading) {
      tips = <div className="table-loading">加载中...</div>;
    } else if (data.length === 0) {
      tips = '暂无数据...';
    }

    const header = this.getTableHeader(this.getVisibleHeads());
    const fixedHeaderAside = this.getFreezeHeaderAside(this.getVisibleHeads());

    let otherStyle = {};
    const maxHeight = !_.isBoolean(scrollY) && scrollY > 0 ? `${scrollY}px !important` : '';
    if (maxHeight) {
      otherStyle = { maxHeight };
    }

    return (
      <div
        className={`table-wrapper ${className || ''}`}
        style={{
          ...style,
          ...otherStyle,
        }}
        ref={ref => { this.refTableWrapper = ref; }}
      >
        <div
          className="table-scroller scrollbar-outer"
          ref={ref => { this.refDataTableScroller = ref; }}
        >
          <table
            className="table"
            ref={ref => { this.refDataTable = ref; }}
          >
            {header}
            <tbody>
              {this.getTbody(data, visibleColumns, arrayMode, null, 0, true)}
            </tbody>
          </table>
          {/* 以下添加了hasMorePage条件，加载全部“更多”数据之后不给暂无数据的div */}
          {pagination && hasMorePage &&
            <div
              style={{ width: tableWidth - 12 }}
              className={`pagination ${hasMorePage ? 'has-more-page' : ''}`}
              onClick={() => {
                if (!hasMorePage) return;
                const p = page + 1;
                pagination(p);
                this.setState({ page: p });
              }}
            >
              <div style={{ width: '100%' }} ref={ref => { this.refHasMoreButton = ref; }}>
                {hasMorePage ? '加载更多...' : '暂无更多数据'}
              </div>
            </div>
          }
        </div>
        {freezeHeader &&
          <div
            className="fixed-table-header-scroller"
            ref={ref => { this.refFixedTableHeaderScroller = ref; }}
          >
            <table
              className="table"
              ref={ref => { this.refFixedTableHeader = ref; }}
            >
              {header}
            </table>
          </div>
        }
        {freezeColumn &&
          [<div
            key={1}
            className="fixed-table-aside-scroller"
            ref={ref => { this.refFixedTableAsideScroller = ref; }}
          >
            <table
              className="table"
              ref={ref => { this.refFixedTableAside = ref; }}
            >
              {fixedHeaderAside}
              <tbody>
                {this.getTbody(data, visibleColumns, arrayMode, freezeColumn, 0, true)}
              </tbody>
            </table>
            {pagination && <div className="pagination-placeholder" />}
          </div>,
          <div
            key={2}
            className="fixed-table-header-aside-scroller"
          >
            <table
              className="table"
              ref={ref => { this.refFixedTableHeaderAside = ref; }}
            >
              {fixedHeaderAside}
            </table>
          </div>]
        }
        {tips && <TableTips style={{ height }}>{tips}</TableTips>}
      </div>
    );
  }
}

export default Table;
