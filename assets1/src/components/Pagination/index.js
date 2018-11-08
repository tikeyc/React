import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

import DropdownMenu from '../DropdownMenu';

import './style.less';

/**
 * 分页组件
 * @type {React Component}
 */
export default class Pagination extends Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    // 当前页数
    current: PropTypes.number,
    // 默认的当前页数
    defaultCurrent: PropTypes.number,
    // 默认的每页条数
    defaultPageSize: PropTypes.number,
    // 只有一页时是否隐藏分页器
    hideOnSinglePage: PropTypes.bool,
    // 每页条数
    pageSize: PropTypes.number,
    // 指定每页可以显示多少条
    pageSizeOptions: PropTypes.array,
    // 是否可以快速跳转至某页
    showQuickJumper: PropTypes.bool,
    // 是否可以改变 pageSize
    showSizeChanger: PropTypes.bool,
    // 用于显示数据总量和当前数据顺序，Function(total, range)
    showTotal: PropTypes.func,
    // 当添加该属性时，显示为简单分页
    simple: PropTypes.bool,
    // 当为「small」时，是小尺寸分页
    size: PropTypes.string,
    // 数据总数
    total: PropTypes.number,
    // 页码改变的回调，参数是改变后的页码及每页条数，Function(page, pageSize)
    onChange: PropTypes.func,
    // pageSize 变化的回调，Function(current, size)
    onShowSizeChange: PropTypes.func,
    // tips 是否出现提示
    tips: PropTypes.bool,
    // 数据改变还原第一页
    dataSource: PropTypes.array,
  }

  static defaultProps = {
    prefixCls: 'ways-pagination',
    className: '',
    defaultCurrent: 1,
    pageSize: undefined,
    defaultPageSize: 10,
    hideOnSinglePage: false,
    pageSizeOptions: ['10', '20', '30', '40'],
    showQuickJumper: false,
    showSizeChanger: false,
    size: '',
    total: 0,
    // onChange: Function.prototype,
    // onShowSizeChange: Function.prototype,
  }

  constructor(props) {
    super(props);

    const {
      current,
      onChange,
      pageSize,
      onShowSizeChange,
    } = props;
    if (current && !onChange) {
      throw new Error('Pagination 组件：提供 current 参数的同时必须配套提供用于改变 current 参数值的 onChange(current, pageSize) 函数');
    }
    if (pageSize && !onShowSizeChange) {
      throw new Error('Pagination 组件：提供 pageSize 参数的同时必须配套提供用于改变 pageSize 参数值的 onShowSizeChange(current, pageSize) 函数');
    }

    const currentPage = this.getDefaultCurrent();
    this.state = {
      currentPage,
      pageSize: this.getDefaultPageSize(),
      pageSizeOptions: this.getPageSizeOptions(props.pageSizeOptions),
      quickJumpPage: '',
      simplePage: currentPage,
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      current,
      pageSize,
      pageSizeOptions,
      dataSource,
    } = nextProps;

    if (current !== this.props.current) {
      this.setState({
        currentPage: current,
        simplePage: current,
      });
    }

    if (pageSize !== this.props.pageSize) {
      this.setState({ pageSize });
    }

    if (pageSizeOptions !== this.props.pageSizeOptions) {
      this.setState({
        pageSizeOptions: this.getPageSizeOptions(pageSizeOptions),
        pageSize: pageSizeOptions[0] - 0,
      });
    }

    if (dataSource !== this.props.dataSource) this.setState({ currentPage: 1 });
  }

  componentDidUpdate({ onChange }, prevState) {
    const { currentPage, pageSize } = this.state;

    // 页数变更时，触发 onChange 回调函数
    if (currentPage !== prevState.currentPage) {
      onChange(currentPage, pageSize);
    }
  }

  /**
   * 获取 pageSize 下拉菜单配置
   * @param  {Array} options 配置数组
   * @return {Array}         下拉菜单配置数组
   */
  getPageSizeOptions = options => options.map((option, index) => ({
    value: option - 0,
    text: `每页${option}条`,
    selected: index === 0,
  }))

  getDefaultCurrent = () => {
    const { current, defaultCurrent } = this.props;
    return current || defaultCurrent;
  }

  /**
   * [getCurrent description]
   * @return {[type]} [description]
   */
  getCurrent = () => this.props.current || this.state.currentPage

  getDefaultPageSize = () => {
    const {
      pageSize,
      defaultPageSize,
      pageSizeOptions,
      showSizeChanger,
    } = this.props;
    if (showSizeChanger) {
      return pageSizeOptions[0] - 0;
    }
    return pageSize || defaultPageSize;
  }

  getPageSize = () => this.props.pageSize || this.state.pageSize

  getMaxPage = (pageSize = this.getPageSize()) => Math.ceil(this.props.total / pageSize)

  getTotal = () => {
    const { total } = this.props;
    const pageSize = this.getPageSize();
    const end = this.getCurrent() * pageSize;
    const range = [(end - pageSize) + 1, end];
    return this.props.showTotal(total, range);
  }

  getEnterPage = currentPage => {
    const maxPage = this.getMaxPage();
    let enterPage = currentPage - 0;
    if (enterPage < 1) {
      enterPage = Math.max(enterPage, this.minPage);
    } else {
      enterPage = Math.min(enterPage, maxPage);
    }
    return enterPage;
  }

  getTips = () => {
    const { total } = this.props;
    const { currentPage, pageSize } = this.state;
    let start = ((currentPage - 1) * pageSize) + 1;
    let end = (currentPage * pageSize);
    if (start > total) {
      start = total;
      end = total;
    } else if (end > total) {
      end = total;
    }
    return <span className="pagination-tips va-m ml-10">显示{start}至{end}条，共{total}条记录</span>;
  }

  minPage = 1

  handleChangePage = currentPage => {
    this.setState({ currentPage });
  }

  handleJumpPrevPage = () => {
    const currentPage = this.getCurrent() - 5;
    this.setState({ currentPage: Math.max(currentPage, this.minPage) });
  }

  handleJumpNextPage = () => {
    const maxPage = this.getMaxPage();
    const currentPage = this.getCurrent() + 5;
    this.setState({ currentPage: Math.min(currentPage, maxPage) });
  }

  handlePrevPage = () => {
    const currentPage = this.getCurrent();
    if (currentPage === this.minPage) return;
    const simplePage = currentPage - 1;
    this.setState({ currentPage: simplePage, simplePage });
  }

  handleNextPage = () => {
    const maxPage = this.getMaxPage();
    const currentPage = this.getCurrent();
    if (currentPage === maxPage) return;
    const simplePage = currentPage + 1;
    this.setState({ currentPage: simplePage, simplePage });
  }

  handleChangeQuickJumpPage = event => {
    this.setState({
      quickJumpPage: event.target.value,
    });
  }

  handleQuickJumpPage = event => {
    // 回车跳转
    if (event.keyCode === 13) {
      this.setState({
        currentPage: this.getEnterPage(event.target.value),
        quickJumpPage: '',
      });
    }
  }

  handleChangeSimplePage = event => {
    this.setState({
      simplePage: event.target.value,
    });
  }

  handleSimplePage = event => {
    // 回车跳转
    if (event.keyCode === 13) {
      const currentPage = this.getEnterPage(event.target.value);
      this.setState({
        currentPage,
        simplePage: currentPage,
      });
    }
  }

  /**
   * 改变每页显示条数
   * @param  {number} nextPageSize 要变成的条数
   * @return {undefined}           undefined
   */
  handleChangePageSize = nextPageSize => {
    const pageSize = nextPageSize || this.state.pageSize;
    const currentPage = this.getCurrent();
    const maxPage = this.getMaxPage(pageSize);
    this.setState({
      currentPage: Math.min(currentPage, maxPage),
      pageSize,
    });
    this.props.onShowSizeChange(currentPage, nextPageSize);
  }

  renderItems = () => {
    const { prefixCls, total } = this.props;
    const currentPage = this.getCurrent();

    if (total === 0) return null;

    const { minPage } = this;
    const maxPage = this.getMaxPage();
    const items = [];

    let startPage = currentPage - 2;
    let endPage = currentPage + 2;
    if (startPage < minPage) {
      startPage = minPage;
      endPage = minPage + 4;
    }
    if (endPage > maxPage) {
      startPage = maxPage - 4;
      endPage = maxPage;
    }
    if (startPage < minPage) {
      startPage = minPage;
    }
    if (endPage > maxPage) {
      endPage = maxPage;
    }

    if (startPage > minPage) {
      const className = classnames(
        `${prefixCls}-item`,
        `${prefixCls}-item-${minPage}`
      );
      items.push(
        <li
          key={minPage}
          title={minPage}
          className={className}
          onClick={() => this.handleChangePage(minPage)}
        >
          <a>{minPage}</a>
        </li>
      );
    }
    if (startPage > minPage + 1) {
      items.push(
        <li
          key="prev"
          title="前 5 页"
          className={`${prefixCls}-jump-prev`}
          onClick={this.handleJumpPrevPage}
        >
          <a className={`${prefixCls}-item-link`}>···</a>
        </li>
      );
    }
    for (let i = startPage; i <= endPage; i += 1) {
      const page = i;
      const className = classnames(
        `${prefixCls}-item`,
        `${prefixCls}-item-${page}`,
        currentPage === page ? `${prefixCls}-item-active` : ''
      );
      items.push(
        <li
          key={page}
          title={page}
          className={className}
          onClick={() => this.handleChangePage(page)}
        >
          <a>{page}</a>
        </li>
      );
    }
    if (endPage < maxPage - 1) {
      items.push(
        <li
          key="next"
          title="后 5 页"
          className={`${prefixCls}-jump-next`}
          onClick={this.handleJumpNextPage}
        >
          <a className={`${prefixCls}-item-link`}>···</a>
        </li>
      );
    }
    if (endPage < maxPage) {
      const className = classnames(
        `${prefixCls}-item`,
        `${prefixCls}-item-${maxPage}`
      );
      items.push(
        <li
          key={maxPage}
          title={maxPage}
          className={className}
          onClick={() => this.handleChangePage(maxPage)}
        >
          <a>{maxPage}</a>
        </li>
      );
    }

    return items;
  }

  render() {
    const {
      prefixCls,
      className,
      hideOnSinglePage,
      showQuickJumper,
      showSizeChanger,
      showTotal,
      size,
      simple,
      tips,
    } = this.props;
    const {
      pageSizeOptions,
      quickJumpPage,
      simplePage,
    } = this.state;
    // console.log(this.props, this.state);
    const currentPage = this.getCurrent();
    const maxPage = this.getMaxPage();

    if (hideOnSinglePage && maxPage === 1) return null;

    const classNames = classnames(
      prefixCls,
      size === 'small' ? 'mini' : '',
      simple ? `${prefixCls}-simple` : '',
      className,
    );

    const prevClassName = classnames(
      currentPage === this.minPage ? `${prefixCls}-disabled` : '',
      `${prefixCls}-prev`
    );
    const nextClassName = classnames(
      currentPage === maxPage ? `${prefixCls}-disabled` : '',
      `${prefixCls}-next`
    );

    return (
      <ul className={classNames} unselectable="unselectable">
        {!simple && showTotal &&
          <li className={`${prefixCls}-total-text`}>
            {this.getTotal()}
          </li>
        }
        <li title="上一页" className={prevClassName} onClick={this.handlePrevPage}>
          <a className={`${prefixCls}-item-link`}>&lt;</a>
        </li>
        {!simple && this.renderItems()}
        {simple &&
          <li title="2/5" className={`${prefixCls}-simple-pager`}>
            <input
              type="text"
              value={simplePage}
              size="3"
              onChange={this.handleChangeSimplePage}
              onKeyUp={this.handleSimplePage}
            />
            <span className={`${prefixCls}-slash`}>／</span>
            {maxPage}
          </li>
        }
        <li title="下一页" className={nextClassName} onClick={this.handleNextPage}>
          <a className={`${prefixCls}-item-link`}>&gt;</a>
        </li>
        {!simple &&
          <li className={`${prefixCls}-options`}>
            {showSizeChanger &&
              <DropdownMenu
                options={pageSizeOptions}
                onSelect={this.handleChangePageSize}
              />
            }
            {showQuickJumper &&
              <div className={`${prefixCls}-options-quick-jumper`}>
                跳转到第
                <input
                  type="text"
                  value={quickJumpPage}
                  onChange={this.handleChangeQuickJumpPage}
                  onKeyUp={this.handleQuickJumpPage}
                />
                页
              </div>
            }
            {tips && this.getTips()}
          </li>
        }
      </ul>
    );
  }
}
