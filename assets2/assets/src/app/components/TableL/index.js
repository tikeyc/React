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
    onBack: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: Boolean(props.loading),
      colsWidth: [],
      options: props.options || [],
    };
  }

  componentDidMount() {
    const {
      freezeHeader,
      freezeColumn,
      scrollY,
      style,
    } = this.props;

    const $dataTableScroller = $(this.refDataTableScroller);

    if (freezeHeader || freezeColumn) {
      const $fixedTableHeaderScroller = $(this.refFixedTableHeaderScroller);

      $dataTableScroller.on('scroll', () => {
        $fixedTableHeaderScroller.scrollLeft($dataTableScroller.scrollLeft());
      });

      this.tableWidth = $dataTableScroller.width();
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

    if (scrollY || (style && style.height)) {
      $dataTableScroller.scrollbar();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { options } = nextProps;
    if (this.props.options !== options) {
      this.setState({ options, loading: false });
      this.freeze(options);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.options !== nextState.options ||
      this.props.visibleColumns !== nextProps.visibleColumns
    );
  }

  // componentDidUpdate() {
  //   this.freeze();
  // }

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

    return data.map(row => {
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
            const data = row[arrayMode ? colIndex : key] || '';
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

  getDefaultHeaderText = text => (text.includes('@') ? <span onClick={() => this.props.onBack(text)}>{text.split('@')[0]}</span> : text)

  getDefaultHeader(columns) {
    const trs = [
      <tr key={0}>
        {columns.map((column, index) => {
          const { title, titleRender, rowSpan, colSpan, titleStyle = {}, titleClassName = '', click = '' } = column;
          return (
            <th
              onClick={() => { if (click) this.props.onBack(click); }}
              key={index}
              rowSpan={rowSpan}
              colSpan={colSpan}
              style={titleStyle}
              className={`${titleClassName} ${click ? 'on-back' : ''}`}
            >
              {!titleRender ?
                title.split('@')[0] :
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

  getTableHeader(columns) {
    const { children } = this.props;
    const hasCustomHeader = children && children.type === 'thead';

    if (hasCustomHeader) {
      const c = children.props.children;
      (c.length ? c : [c]).push(
        <tr className="calculate-width-row">
          {columns.map((column, index) => (
            <th key={index} />
          ))}
        </tr>
      );
      return children;
    }

    return (
      <thead>
        {this.getDefaultHeader(columns)}
        <tr className="calculate-width-row">
          {this.getCalculateColumns(columns, true)}
        </tr>
      </thead>
    );
  }

  getFreezeHeaderAside(columns) {
    const { fixedTableAside, freezeColumn } = this.props;

    if (fixedTableAside) {
      fixedTableAside.props.children.push(
        <tr className="calculate-width-row">
          {columns.slice(0, freezeColumn).map((column, index) => (
            <th key={index} />
          ))}
        </tr>
      );
    }

    return (
      fixedTableAside ||
        <thead>
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
        </thead>
    );
  }

  freeze(options) {
    const { columns } = options;
    const { freezeHeader, freezeColumn } = this.props;

    if (!columns || (!freezeHeader && !freezeColumn)) return;

    const visibleColumns = this.getVisibleTbodyColumns(columns);

    if (visibleColumns.length === 0) return;

    setTimeout(() => {
      let tableWidth = 0;
      const ths = 'thead tr.calculate-width-row th';
      const $table = $(this.refDataTable);
      const $ths = $table.find(ths);
      const $fixedTableHeader = $(this.refFixedTableHeader);
      const $fixedHeaderThs = $fixedTableHeader.find(ths);
      const $fixedAsideThs = $(this.refFixedTableAside).find(ths);
      const $fixedHeaderAsideThs = $(this.refFixedTableHeaderAside).find(ths);

      // 第一步
      // 如果列设置了宽度以列宽为准，否则以实际宽度为准
      $ths.each(function (index) {
        const width = visibleColumns[index].width || $(this).outerWidth();
        $(this).outerWidth(width);
        tableWidth += width;
      });

      // 设置表格宽度，如果表格宽度小于表格可见区域宽度，
      // 以可见区域宽度为准
      if (tableWidth < this.tableWidth) tableWidth = this.tableWidth;
      // $table.outerWidth(tableWidth);
      // $fixedTableHeader.outerWidth(tableWidth);

      // 重新插入渲染队列，使表格按上面宽度设置渲染
      setTimeout(() => {
        let tableWidth = 0;
        const widths = [];

        // 收集重新渲染后的实际列宽度
        $ths.each(function () {
          const width = $(this).outerWidth();
          widths.push(width);
          tableWidth += width;
        });

        // 设置表格宽度，如果表格宽度小于表格可见区域宽度，
        // 以可见区域宽度为准
        if (tableWidth < this.tableWidth) tableWidth = this.tableWidth;
        $table.outerWidth(tableWidth);
        $fixedTableHeader.outerWidth(tableWidth);

        // 由于上面第一步设置的列宽度在渲染后会出现细微偏差，
        // 所以在这里用新收集的实际宽度给列设置最终实际宽度
        widths.forEach((width, index) => {
          $ths.eq(index).outerWidth(width);
          $fixedHeaderThs.eq(index).outerWidth(width);
          if (freezeColumn) {
            $fixedAsideThs.eq(index).outerWidth(width);
            $fixedHeaderAsideThs.eq(index).outerWidth(width);
          }
        });

        this.widths = widths;
      }, 0);
    }, 0);
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
    const { options, loading } = this.state;
    const {
      className,
      style = {},
      freezeHeader,
      freezeColumn,
      scrollY,
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

    return (
      <div
        className={`table-wrapper ${className || ''} ${scrollY ? 'scroll-y' : ''}`}
        style={{
          ...style,
          height: !_.isBoolean(scrollY) ? scrollY : '',
        }}
      >
        <div
          className="table-scroller scrollbar-inner"
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
