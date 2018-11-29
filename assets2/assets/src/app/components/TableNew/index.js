import _ from 'lodash';
import $ from 'jquery';
import 'jquery.scrollbar';
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import Pagination from '../Pagination';
import Body from './Body';
import TableTips from './TableTips';
import FixedColumns from './FixedColumns';
import Header from './Header';
import { getRowKey } from './helper';

import './style.less';

class Table extends Component {
  static propTypes = {
    // 样式
    style: PropTypes.object,
    // 样式类
    className: PropTypes.string,
    // 是否展示外边框和列边框，默认为 false 不展示
    bordered: PropTypes.bool,
    // 页面是否加载中
    loading: PropTypes.bool,
    // 表格列的配置描述，具体项见下表
    columns: PropTypes.array.isRequired,
    // 数据数组
    dataSource: PropTypes.array.isRequired,
    // 分页器，配置详见 Pagination 组件，设为 false 时不展示和进行分页
    pagination: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    // 横向或纵向支持滚动，也可用于指定滚动区域的宽高度：{{ x: true, y: 300 }}
    scroll: PropTypes.shape({
      x: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
      y: PropTypes.number,
    }),
    // 是否显示表头
    showHeader: PropTypes.bool,
    // 表格行的类名，Function(record, index):string
    rowClassName: PropTypes.func,
    // string|Function(record):string
    rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    // 列表项是否可选择
    rowSelection: PropTypes.shape({
      // 把选择框列固定在左边
      fixed: PropTypes.bool,
      // 选择框的默认属性配置，Function(record)
      getCheckboxProps: PropTypes.func,
      // 去掉『全选』『反选』两个默认选项，默认为 false
      hideDefaultSelections: PropTypes.bool,
      // 指定选中项的 key 数组，需要和 onChange 进行配合，默认为 []
      selectedRowKeys: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.arrayOf(PropTypes.number),
      ]).isRequired,
      // 自定义列表选择框宽度
      columnWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      // 自定义选择项 配置项, 设为 true 时使用默认选择项，默认为 true
      selections: PropTypes.oneOfType([
        PropTypes.shape({
          // React 需要的 key，建议设置
          key: PropTypes.string,
          // 选择项显示的文字
          text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
          // 选择项点击回调，Function(changeableRowKeys)
          onSelect: PropTypes.func,
        }),
        PropTypes.bool,
      ]),
      // 多选/单选，checkbox or radio，默认为 checkbox
      type: PropTypes.string,
      // 选中项发生变化的时的回调
      onChange: PropTypes.func.isRequired,
      // 用户手动选择/取消选择某列的回调
      onSelect: PropTypes.func,
      // 用户手动选择/取消选择所有列的回调
      onSelectAll: PropTypes.func,
      // 用户手动选择反选的回调
      onSelectInvert: PropTypes.func,
    }),
    // 展示树形数据时，每层缩进的宽度，以 px 为单位
    indentSize: PropTypes.number,
    // 初始时，是否展开所有行
    defaultExpandAllRows: PropTypes.bool,
    // 默认展开的行
    defaultExpandedRowKeys: PropTypes.array,
    // 展开的行，控制属性
    expandedRowKeys: PropTypes.array,
    // 通过点击行来展开子行
    expandRowByClick: PropTypes.bool,
    // 是否只能同时展开一个子行
    onlyOneRowExpanded: PropTypes.bool,
    //
    onExpandRowKeysChange: PropTypes.func,
    // 点击展开图标时触发，Function(expanded, record)
    onExpand: PropTypes.func,
    // 设置头部行属性，Function(column, index)
    onHeaderRow: PropTypes.func,
    // 设置行属性，Function(record, index)
    onRow: PropTypes.func,
    // 默认隐藏的列
    defaultVisibleColumnKeys: PropTypes.array,
    // 隐藏的列，控制属性
    visibleColumnKeys: PropTypes.array,
    // 尺寸变化时执行钩子
    onResize: PropTypes.func,
  }

  static defaultProps = {
    bordered: false,
    style: undefined,
    className: undefined,
    rowClassName: undefined,
    rowKey: 'key',
    rowSelection: null,
    indentSize: undefined,
    defaultExpandAllRows: undefined,
    defaultExpandedRowKeys: undefined,
    expandedRowKeys: undefined,
    expandRowByClick: undefined,
    onExpand: undefined,
    onHeaderRow: undefined,
    onRow: undefined,
    defaultVisibleColumnKeys: undefined,
    visibleColumnKeys: undefined,

    loading: false,
    pagination: {},
    scroll: {},
    showHeader: true,
  }

  static getHasChildrenItem(rowKey, list, arr = []) {
    return list.reduce((arr2, item) => {
      if (item.children) {
        arr2.push(item[getRowKey(item, rowKey)]);
        Table.getHasChildrenItem(rowKey, item.children, arr2);
      }
      return arr2;
    }, arr);
  }

  static getExpandedRowKeys({
    rowKey,
    dataSource,
    expandedRowKeys,
    defaultExpandedRowKeys,
    defaultExpandAllRows,
  }) {
    let nextExpandedRowKeys = expandedRowKeys || defaultExpandedRowKeys;
    if (defaultExpandAllRows) {
      nextExpandedRowKeys = Table.getHasChildrenItem(rowKey, dataSource);
    }
    return nextExpandedRowKeys;
  }

  constructor(props) {
    super(props);

    const expandedRowKeys = Table.getExpandedRowKeys(props);

    const sortOrderProps = this.getSortOrderProps();

    const {
      dataSource,
      pagination: { current, pageSize, defaultPageSize, showSizeChanger, pageSizeOptions },
      visibleColumnKeys,
      defaultVisibleColumnKeys,
    } = props;

    const page = current || 1;
    const statePageSize = showSizeChanger && pageSizeOptions ?
      pageSizeOptions[0] - 0 : (pageSize || defaultPageSize || 10);

    const columns = this.getColumnsWithRowSelection({
      columns: props.columns,
      dataSource: props.dataSource,
      rowSelection: props.rowSelection,
      ...sortOrderProps,
      page,
      pageSize: statePageSize,
    });

    this.state = {
      visibleScrollX: false,
      visibleScrollY: false,
      scrollPosition: 'left',
      hoverRowIndex: '',

      data: dataSource,
      page,
      pageSize: statePageSize,
      widths: [],
      fixedBodyOuterHeight: 0,
      columns: this.getColumns(columns),
      headers: this.getHeaders(columns),
      expandedRowKeys,
      visibleColumnKeys: visibleColumnKeys || defaultVisibleColumnKeys,
      ...sortOrderProps,
    };
  }

  componentDidMount() {
    const { x } = this.props.scroll;
    const { columns } = this.state;

    let width = '100%';
    if (typeof x === 'number') {
      width = x;
    }

    // 初始化可见窗口（滚动窗口）宽度
    this.visibleWidth = width;

    // 初始化内容表格宽度
    this.tableWidth = width;

    // 初始化列宽度
    this.resetWidths(columns);

    // 初始化冻结列框高度
    if (this.hasFixedColumns(columns)) {
      this.resetFixedBoxHeights();
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      columns,
      dataSource,
      pagination,
      scroll: { x, y },
      expandedRowKeys,
      visibleColumnKeys,
      defaultExpandAllRows,
      rowSelection,
    } = nextProps;
    const prevDataSource = this.props.dataSource;
    const { current, pageSize } = pagination;

    if (
      columns !== this.props.columns ||
      rowSelection !== this.props.rowSelection ||
      dataSource !== prevDataSource
    ) {
      const { page, pageSize } = this.state;
      const sortOrderProps = this.getSortOrderProps(columns);
      const cols = this.getColumnsWithRowSelection({
        columns,
        dataSource,
        rowSelection,
        ...sortOrderProps,
        page,
        pageSize,
      });
      this.setState({
        columns: this.getColumns(cols),
        headers: this.getHeaders(cols),
        ...sortOrderProps,
      });
      if (x || y) this.resetScrollLeft();
    }

    if (dataSource !== prevDataSource) {
      this.setState({
        data: dataSource,
        expandedRowKeys: Table.getExpandedRowKeys(nextProps),
      });
      if (x || y) this.resetScrollLeft();
    }

    if (pagination !== this.props.pagination) {
      if (current && current !== this.props.pagination.current) {
        this.setState({ page: current });
      }
      if (pageSize && pageSize !== this.props.pagination.pageSize) {
        this.setState({ pageSize });
      }
    }

    if (expandedRowKeys !== this.props.expandedRowKeys) {
      this.setState({ expandedRowKeys });
    }

    if (visibleColumnKeys !== this.props.visibleColumnKeys) {
      this.setState({ visibleColumnKeys });
    }

    if (defaultExpandAllRows !== this.props.defaultExpandAllRows) {
      this.setState({ expandedRowKeys: Table.getExpandedRowKeys(nextProps) });
    }
  }

  shouldComponentUpdate(nextProps, {
    scrollPosition,
    columns,
    data,
    page,
    pageSize,
    sortOrder,
    sortColumnKey,
    widths,
    fixedBodyOuterHeight,
    expandedRowKeys,
    hoverRowIndex,
    visibleColumnKeys,
    visibleScrollX,
  }) {
    const { state } = this;
    return (
      state.scrollPosition !== scrollPosition ||
      state.data !== data ||
      state.page !== page ||
      state.pageSize !== pageSize ||
      state.sortOrder !== sortOrder ||
      state.sortColumnKey !== sortColumnKey ||
      state.widths !== widths ||
      state.fixedBodyOuterHeight !== fixedBodyOuterHeight ||
      state.columns !== columns ||
      state.expandedRowKeys !== expandedRowKeys ||
      state.hoverRowIndex !== hoverRowIndex ||
      state.visibleColumnKeys !== visibleColumnKeys ||
      state.visibleScrollX !== visibleScrollX
    );
  }

  componentWillUpdate(nextProps, { expandedRowKeys }) {
    if (expandedRowKeys !== this.state.expandedRowKeys) {
      this.props.onExpandRowKeysChange(expandedRowKeys);
    }
  }

  componentDidUpdate(prevProps, {
    columns,
    data,
    page,
    pageSize,
    expandedRowKeys,
  }) {
    if (
      columns !== this.state.columns ||
      data !== this.state.data ||
      page !== this.state.page ||
      pageSize !== this.state.pageSize ||
      expandedRowKeys !== this.state.expandedRowKeys
    ) {
      this.resetWidths();
    }
  }

  getRowSelection = (rowSelection = this.props.rowSelection) => ({
    hideDefaultSelections: false,
    selectedRowKeys: [],
    selections: true,
    type: 'checkbox',
    ...rowSelection,
  })

  getSortOrderProps(columns = this.props.columns) {
    let key = '';
    let sortOrder = false;
    let sortOrderColumn = columns.find(col => col.sortOrder);
    if (sortOrderColumn) {
      ({ key, sortOrder } = sortOrderColumn);
    } else {
      sortOrderColumn = columns.find(col => col.defaultSortOrder);
      if (sortOrderColumn) {
        ({ key, defaultSortOrder: sortOrder } = sortOrderColumn);
      }
    }
    return { sortColumnKey: key, sortOrder };
  }

  getColumnsWithRowSelection = state => {
    const {
      columns,
      dataSource,
      rowSelection,
    } = state;

    if (!rowSelection) {
      return columns;
    }

    const { rowKey } = this.props;

    if (this.props.rowSelection) {
      const {
        fixed,
        getCheckboxProps,
        hideDefaultSelections,
        columnWidth,
        selectedRowKeys,
      } = this.getRowSelection(rowSelection);
      const currentPageRows = this.getRows({ ...state, data: dataSource });

      return [
        {
          key: '__rowSelection',
          title: hideDefaultSelections ? '' : (
            <input
              type="checkbox"
              checked={currentPageRows.length && currentPageRows.every(row => (
                selectedRowKeys.includes(row[getRowKey(row, rowKey)])
              ))}
              onChange={this.handleChangeAllChecked}
            />
          ),
          render: (data, { record }) => {
            const checkboxProps = getCheckboxProps ? getCheckboxProps(record) : {};
            const rowValue = record[getRowKey(record, rowKey)];

            return (
              <input
                type="checkbox"
                {...checkboxProps}
                checked={selectedRowKeys.includes(rowValue)}
                onChange={event => this.handleChangeRowChecked(event, rowValue)}
              />
            );
          },
          titleClassName: 'ways-table-selection-column',
          className: 'ways-table-selection-column',
          fixed,
          width: columnWidth,
        },
        ...columns,
      ];
    }
    return columns;
  }

  getHeaders = columns => {
    let headers = [];

    const getHeader = (cols, rowIndex) => {
      const header = [];
      cols.forEach(column => {
        if (column.children) {
          getHeader(column.children, rowIndex + 1);
        }
        header.push(column);
      });
      if (headers[rowIndex]) {
        headers[rowIndex] = [...headers[rowIndex], ...header];
      } else {
        headers[rowIndex] = [...header];
      }
      return headers;
    };
    getHeader(columns, 0);

    let prevHeader;
    headers = headers.reverse().map(header => {
      const nextHeader = this.getColSpan(header, prevHeader);
      prevHeader = nextHeader;
      return nextHeader;
    });

    return headers.reverse().map((header, index) => header.map(column => ({
      ...column,
      rowSpan: column.children ? 1 : headers.length - index,
    })));
  };

  getColSpan = (columns, prevHeader) => {
    let index = 0;
    return columns.map(column => {
      let colSpan = 1;
      if (column.children) {
        colSpan = column.children.reduce((sum, child) => {
          const result = sum + (prevHeader ? prevHeader[index].colSpan : child.colSpan || 1);
          index += 1;
          return result;
        }, 0);
      }
      return {
        ...column,
        colSpan,
      };
    });
  }

  // TODO: 复合表头的 visible 逻辑未实现
  getColumns(columns) {
    const { visibleColumnKeys } = this.props;

    return columns.reduce((arr, column, index) => {
      const { children, visible } = column;
      if (!children) {
        if (
          visible !== false ||
          (visibleColumnKeys && visibleColumnKeys.includes(index))
        ) {
          return [...arr, column];
        }
        return arr;
      }
      return [...arr, ...this.getColumns(children)];
    }, []);
  }

  getRows = state => {
    const data = this.getSortedData(state);
    return this.getPaginatedRows(data, state);
  }

  getPaginationOptions = () => {
    const { dataSource, pagination } = this.props;

    if (!pagination) return false;

    const { current, pageSize: pSize } = pagination;
    let { onChange, onShowSizeChange } = pagination;

    const rowSelection = this.getRowSelection(this.props.rowSelection);

    onChange = (page, pageSize) => {
      if (!current) {
        if (!pageSize) this.setState({ pageSize });
        this.setState({ page });
      }
      if (pagination.onChange) pagination.onChange(page, pageSize);
      if (rowSelection.onChange) rowSelection.onChange([], []);
    };
    onShowSizeChange = (page, pageSize) => {
      if (!pSize) {
        if (!current) this.setState({ page });
        this.setState({ pageSize });
      }
      if (pagination.onShowSizeChange) pagination.onShowSizeChange(page, pageSize);
      if (rowSelection.onChange) rowSelection.onChange([], []);
    };

    return {
      total: dataSource.length,
      ...pagination,
      className: 'ways-table-pagination',
      onChange,
      onShowSizeChange,
    };
  }

  getSortedData = (state = this.state) => {
    const {
      columns,
      data,
      sortOrder,
      sortColumnKey,
    } = state;

    const { sorter } = columns.find(col => col.key === sortColumnKey) || {};

    if (!sorter) return data;

    const nextData = [...data];

    if (sortOrder === 'ascend') {
      nextData.sort(sorter);
    } else if (sortOrder === 'descend') {
      nextData.sort((...args) => 0 - sorter(...args));
    }

    return nextData;
  }

  getPaginatedRows = (data, state = this.state) => {
    const { pagination } = this.props;
    const { page, pageSize } = state;
    let vData = [];

    if (!pagination) return data;

    if (page && pageSize) {
      if (pagination.type === 'more') {
        vData = data.slice(0, page * pageSize);
      } else {
        for (let i = 0; i < data.length; i += 1) {
          if (i >= (page - 1) * pageSize && i < page * pageSize) {
            vData.push(data[i]);
          }
          if (i === page * pageSize) break;
        }
      }
    }

    return vData;
  }

  setScrollPosition = scrollLeft => {
    const { visibleScrollY } = this.state;
    const bodyTableWidth = $(this.componentBody.elmTable).outerWidth();
    const scrollbarSize = visibleScrollY ? this.scrollbarSize : 0;
    const maxScrollLeft = (bodyTableWidth - $(this.elmWrapper).outerWidth()) + scrollbarSize;
    let scrollPosition = 'middle';
    if (scrollLeft === 0) {
      scrollPosition = 'left';
    } else if (scrollLeft === maxScrollLeft) {
      scrollPosition = 'right';
    }
    this.setState({ scrollPosition });
  }

  scrollbarSize = 12;

  refWrapper = ref => {
    if (ref) {
      this.elmWrapper = ref;
    }
  }

  refBody = ref => {
    if (ref) {
      this.componentBody = ref;
    }
  }

  refFixedHeader = ref => {
    if (ref) {
      this.componentFixedHeader = ref;
    }
  }

  refLeftFixed = ref => {
    if (ref) {
      this.componentLeftFixed = ref;
    }
  }

  refRightFixed = ref => {
    if (ref) {
      this.componentRightFixed = ref;
    }
  }

  handleChangeRowChecked = (event, rowValue) => {
    const { rowKey } = this.props;
    const {
      selectedRowKeys,
      onChange,
      onSelect,
    } = this.getRowSelection(this.props.rowSelection);
    const selected = !selectedRowKeys.includes(rowValue);
    let nextSelectedRowKeys = selected ?
      [...selectedRowKeys, rowValue] : selectedRowKeys.filter(item => item !== rowValue);

    const selectedRows = this.props.dataSource
      .filter(row => nextSelectedRowKeys.includes(row[getRowKey(row, rowKey)]));

    if (onChange) {
      nextSelectedRowKeys = selectedRows.map(row => row[getRowKey(row, rowKey)]);
      onChange(nextSelectedRowKeys, selectedRows);
    }
    if (onSelect) {
      const record = this.props.dataSource.find(row => row[getRowKey(row, rowKey)] === rowValue);
      onSelect(record, selected, selectedRows, event);
    }
  }

  handleChangeAllChecked = () => {
    const { rowKey } = this.props;
    const {
      selectedRowKeys,
      onChange,
      onSelectAll,
    } = this.getRowSelection(this.props.rowSelection);

    const currentPageRows = this.getRows();

    const selected = !currentPageRows.every(row => (
      selectedRowKeys.includes(row[getRowKey(row, rowKey)])
    ));

    const selectedRows = selected ? currentPageRows : [];

    if (onSelectAll) {
      const changeRows = selected ?
        currentPageRows.filter(row => !selectedRowKeys.includes(row[getRowKey(row, rowKey)])) :
        currentPageRows.filter(row => selectedRowKeys.includes(row[getRowKey(row, rowKey)]));
      onSelectAll(selected, selectedRows, changeRows);
    }

    if (onChange) {
      const nextSelectedRowKeys = selectedRows.map(row => row[getRowKey(row, rowKey)]);
      onChange(nextSelectedRowKeys, selectedRows);
    }
  }

  hasFixedColumns = columns => Boolean(columns.find(({ fixed }) => fixed))

  hasLeftFixedColumns = columns => (
    Boolean(columns.find(({ fixed }) => fixed === true || fixed === 'left'))
  )

  hasRightFixedColumns = columns => (
    Boolean(columns.find(({ fixed }) => fixed === 'right'))
  )

  handleSortOrder = (sortOrder, sortColumnKey) => {
    this.setState({ sortOrder, sortColumnKey });
  }

  /**
   * 新配置表格宽度小于原配置表格宽度时，
   * 滚动条无法自动重置，导致滚动位置超过可滚动最大限制，
   * 会出现内容错位，下面这段代码是用来手动强制重置的。
   */
  resetScrollLeft() {
    setTimeout(() => {
      const { elmScroller, elmTable } = this.componentBody;
      const $scroller = $(elmScroller);
      const maxScrollLeft = $(elmTable).outerWidth() - $(this.elmWrapper).outerWidth();
      if ($scroller.scrollLeft() > maxScrollLeft) {
        $scroller.scrollLeft(maxScrollLeft);
      }
    }, 0);
  }

  /**
   * 手动强制重置可见窗口宽度
   */
  resize = () => {
    this.resetWidths();
  }

  resetFixedBoxHeights = () => {
    const $scroller = $(this.componentBody.elmScroller);
    const mb = parseInt($scroller.css('marginBottom'), 10);
    const fixedBodyOuterHeight = $scroller.outerHeight() + mb;
    this.setState({ fixedBodyOuterHeight });
  }

  resetWidths = (columns = this.state.columns) => {
    const {
      scroll: { x, y },
      showHeader,
      onResize,
    } = this.props;

    // const noWidths = !columns.some(column => column.width);

    // if (!columns.length || (!y && !hasFixedColumns)) return;
    // if (!columns.length || noWidths) return;
    if (!columns.length) {
      if (onResize) onResize();
      return;
    }

    // 有 1px 偏差
    let tableWidth = 0;
    const widths = [];
    const $wrapper = $(this.elmWrapper);
    const $bodyTable = $(this.componentBody.elmTable);
    const cols = 'colgroup col';
    const $tds = $bodyTable.find('tbody tr:first td');
    const $cols = $bodyTable.find(cols);

    // 还原表格原始宽度
    $bodyTable.outerWidth('100%');

    // 设置每列 col 宽度
    // 如果有固定宽度就设置该宽度，无固定宽度不设宽度（自适应）
    // $tds.each(function callback(index) {
    //   const colWidth = columns[index].width;
    //   let width = colWidth || $(this).outerWidth();
    //   if (colWidth) {
    //     width = Math.max(colWidth, $(this).outerWidth());
    //     $cols.eq(index).outerWidth(width);
    //   }
    //   widths.push(width);
    //   tableWidth += width;
    // });

    // 如果 column 有 width 属性就设置该宽度，否则设置为 auto
    $tds.each(index => {
      const colWidth = columns[index].width;
      if (colWidth) {
        $cols.eq(index).outerWidth(colWidth);
        widths.push(colWidth);
        tableWidth += colWidth;
      } else {
        $cols.eq(index).outerWidth('auto');
        widths.push('auto');
      }
    });

    // 这里延迟执行，等待上面宽度设置生效
    setTimeout(() => {
      // 给上面设置为 auto 的列设置真实宽度
      $tds.each(function (index) {
        let colWidth = columns[index].width;
        if (!colWidth) {
          colWidth = $(this).outerWidth();
          widths[index] = colWidth;
          tableWidth += colWidth;
        }
      });

      this.setState({ widths });

      // 给 table 元素设置实际的总宽度
      if (tableWidth > $wrapper.outerWidth()) {
        $bodyTable.outerWidth(tableWidth);

        // 如果横向不滚动
        if (!x) this.tableWidth = tableWidth;
      }

      // 如果出现 x, Y 轴滚动条，调整关联数据
      const visibleScrollX = $bodyTable.outerWidth() > $wrapper.outerWidth();
      const visibleScrollY = $bodyTable.outerHeight() > $wrapper.outerHeight();
      this.setState({ visibleScrollX, visibleScrollY });

      // 如果存在 x 轴滚动条
      if (x) {
        // 如果存在左侧列冻结，显示左侧冻结列，否则隐藏
        const hasLeftFixedColumns = this.hasLeftFixedColumns(columns);
        if (hasLeftFixedColumns) {
          $(this.componentLeftFixed.elmRoot).toggle(visibleScrollX);
        }
        // 如果存在右侧列冻结，显示右侧冻结列，否则隐藏
        const hasRightFixedColumns = this.hasRightFixedColumns(columns);
        if (hasRightFixedColumns) {
          $(this.componentRightFixed.elmRoot).toggle(visibleScrollX);
        }
      }

      // 设置冻结表头宽度、列宽度、滚动位置
      if (showHeader && y) {
        const $fixedHeader = $(this.componentFixedHeader.elmContent);
        const $headerCols = $fixedHeader.find(cols);

        // 设置冻结表头宽度，内容宽度如果不能铺满可见窗口就设置内容宽度为 100% 填满可见窗口
        $fixedHeader.outerWidth(tableWidth > $wrapper.outerWidth() ? tableWidth : '100%');

        // 设置冻结表头列宽度
        widths.forEach((width, index) => {
          $headerCols.eq(index).outerWidth(width);
        });

        // 还原固定头部滚动位置到最后位置
        const $headerScroller = $(this.componentFixedHeader.elmOuter);
        const scrollLeft = $(this.componentBody.elmScroller).scrollLeft();
        $($headerScroller).scrollLeft(scrollLeft);
      }

      if (onResize) onResize();
    }, 0);
  }

  findExpandedChildrenRowKeys(expandedRowKeys, rows, expandedChildrenRowKeys, rowKey) {
    // 已被展开行
    const expandedChildrenRow = rows.find(row => expandedRowKeys.includes(row[rowKey]));
    if (expandedChildrenRow) {
      const { [rowKey]: key, children } = expandedChildrenRow;
      if (children) {
        return [
          key,
          ...this.findExpandedChildrenRowKeys(
            expandedRowKeys, children, expandedChildrenRowKeys, rowKey),
        ];
      }
    }

    return expandedChildrenRowKeys;
  }

  // 每次只能有一个同级点展开，展开一个时必须关闭上一个同级点
  filterOnlyOneExpandedRow(expandedRowKeys, expanded, record, expandedDepth) {
    const rowKey = getRowKey(record, this.props.rowKey);
    const key = record[rowKey];
    const { dataSource } = this.props;

    // 展开
    if (expanded) {
      const sameLevelExpandedRows = [
        ...dataSource.map(row => ({ ...row, expandedDepth: 0 })),
        ..._.flatten(dataSource.filter(row => row.children).map(row => row.children))
          .map(row => ({ ...row, expandedDepth: 1 })),
      ]
      .filter(row =>
        row.expandedDepth === expandedDepth &&
        row[rowKey] !== key && expandedRowKeys.includes(row[rowKey]));

      let willUnexpandRowKeys = sameLevelExpandedRows.map(row => row[rowKey]);
      if (sameLevelExpandedRows.length) {
        willUnexpandRowKeys = [
          ...willUnexpandRowKeys,
          ...this.findExpandedChildrenRowKeys(
            expandedRowKeys, sameLevelExpandedRows[0].children, [], rowKey),
        ];
      }

      return [
        ...expandedRowKeys.filter(row => !willUnexpandRowKeys.includes(row)),
        key,
      ];
    }

    // 收起
    // 查找已被展开的子级
    const { children } = record;
    const willUnexpandRowKeys = this.findExpandedChildrenRowKeys(
      expandedRowKeys, children, [], rowKey);

    return expandedRowKeys
      .filter(row => !willUnexpandRowKeys.includes(row) && row !== key);
  }

  handleExpand = (expandedRowKeys, expanded, record, expandedDepth) => {
    let nextExpandedRowKeys = expandedRowKeys;
    if (this.props.onlyOneRowExpanded) {
      nextExpandedRowKeys = this.filterOnlyOneExpandedRow(
        expandedRowKeys, expanded, record, expandedDepth);
    }
    this.setState({ expandedRowKeys: nextExpandedRowKeys });

    const { onExpand } = this.props;
    if (onExpand) onExpand(expanded, record, expandedDepth);
  }

  handleScroll = event => {
    const { scrollLeft, scrollTop } = event.target;
    const {
      showHeader,
      scroll: { x, y },
    } = this.props;
    const { columns } = this.state;
    const hasLeftFixedColumns = this.hasLeftFixedColumns(columns);
    const hasRightFixedColumns = this.hasRightFixedColumns(columns);

    this.setScrollPosition(scrollLeft);

    if (showHeader && y) {
      this.componentFixedHeader.elmOuter.scrollLeft = scrollLeft;
    }
    if (x && hasLeftFixedColumns) {
      if (hasLeftFixedColumns) {
        this.componentLeftFixed.elmOuter.scrollTop = scrollTop;
      }
      if (hasRightFixedColumns) {
        this.componentRightFixed.elmOuter.scrollTop = scrollTop;
      }
    }
  }

  handlewheelFixedColumns = event => {
    this.componentBody.elmScroller.scrollTop += event.deltaY;
  }

  handleHoverRow = hoverRowIndex => {
    this.setState({ hoverRowIndex });
  }

  hasMore() {
    const { pagination } = this.props;
    return pagination && pagination.type === 'more';
  }

  findProps() {
    const {
      dataSource,
      bordered,
      showHeader,
      className,
      style = {},
      scroll: { x, y },
      // defaultExpandAllRows,
      defaultExpandedRowKeys,
      expandRowByClick,
      rowClassName,
      rowKey,
      indentSize,
      onHeaderRow,
      onRow,
    } = this.props;
    const {
      visibleScrollX,
      visibleScrollY,
      scrollPosition,
      hoverRowIndex,
      columns,
      headers,
      widths,
      fixedBodyOuterHeight,
      sortOrder,
      sortColumnKey,
      expandedRowKeys,
    } = this.state;

    const hasMore = this.hasMore();

    const rows = this.getRows();

    const rootStyle = {
      ...style,
      width: this.visibleWidth,
      maxHeight: y ? `${y}px` : undefined,
    };

    const classNames = classnames(
      'ways-table',
      bordered ? 'ways-table-bordered' : '',
      visibleScrollX ? 'ways-table-visible-scroll-x' : '',
      visibleScrollY ? 'ways-table-visible-scroll-y' : '',
      x ? `ways-table-scroll-position-${scrollPosition}` : '',
      className,
    );

    const paginationOptions = this.getPaginationOptions();

    const props = {
      columns,
      widths,
      sortOrder,
      sortColumnKey,
      onSort: this.handleSortOrder,
      onHeaderRow,
      onRow,
    };
    const rightExpandFixedProps = {
      // defaultExpandAllRows,
      defaultExpandedRowKeys,
      expandedRowKeys,
      expandRowByClick,
    };
    if (dataSource.find(row => row.children)) {
      rightExpandFixedProps.onExpand = this.handleExpand;
    }
    const expandProps = {
      ...rightExpandFixedProps,
      indentSize,
    };
    const fixedProps = {
      rows,
      hasMore,
      showHeader,
      bodyOuterHeight: fixedBodyOuterHeight,
      rowKey,
      onWheel: this.handlewheelFixedColumns,
    };
    const rowProps = {
      rowClassName,
      hoverRowIndex,
      onHoverRow: this.handleHoverRow,
      headers,
    };

    return {
      hasMore,
      rows,
      rootStyle,
      classNames,
      paginationOptions,
      props,
      rightExpandFixedProps,
      expandProps,
      fixedProps,
      rowProps,
    };
  }

  render() {
    const {
      dataSource,
      loading,
      showHeader,
      scroll: { x, y },
      pagination,
      rowKey,
    } = this.props;
    const {
      columns,
      headers,
    } = this.state;

    const {
      hasMore,
      rows,
      rootStyle,
      classNames,
      paginationOptions,
      props,
      rightExpandFixedProps,
      expandProps,
      fixedProps,
      rowProps,
    } = this.findProps();

    return (
      <div
        ref={this.refWrapper}
        style={rootStyle}
        className={classNames}
      >
        <Body
          ref={this.refBody}
          dataSource={dataSource}
          rows={rows}
          hasMore={hasMore}
          pagination={paginationOptions}
          showHeader={showHeader}
          hasScroller={Boolean(x || y)}
          rowKey={rowKey}
          onScroll={this.handleScroll}
          {...rowProps}
          {...props}
          {...expandProps}
        />

        {/* TODO: 下面的 headers 未实现 */}

        {showHeader && y &&
          <Header
            ref={this.refFixedHeader}
            headers={headers}
            {...props}
          />
        }

        {x && this.hasLeftFixedColumns(columns) &&
          <FixedColumns
            ref={this.refLeftFixed}
            type="left"
            {...rowProps}
            {...props}
            {...fixedProps}
            {...expandProps}
          />
        }

        {x && this.hasRightFixedColumns(columns) &&
          <FixedColumns
            ref={this.refRightFixed}
            type="right"
            {...rowProps}
            {...props}
            {...fixedProps}
            {...rightExpandFixedProps}
          />
        }

        {pagination && pagination.type !== 'more' &&
          <Pagination {...paginationOptions} />
        }

        {(loading || !rows.length) &&
          <TableTips loading={loading} data={rows} />
        }
      </div>
    );
  }
}

export default Table;
