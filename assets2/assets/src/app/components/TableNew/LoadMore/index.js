import React, { Component, PropTypes } from 'react';

import './style.less';

export default class More extends Component {
  static propTypes = {
    dataSource: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired,
    current: PropTypes.number,
    defaultCurrent: PropTypes.number,
    pageSize: PropTypes.number,
    defaultPageSize: PropTypes.number,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    defaultCurrent: 1,
    defaultPageSize: 10,
    current: undefined,
    pageSize: undefined,
    onChange: undefined,
  }

  constructor(props) {
    super(props);

    this.state = {
      current: this.getDefaultCurrent(),
      pageSize: this.getDefaultPageSize(),
      hasMore: true,
    };
  }

  componentWillReceiveProps({
    dataSource,
    rows,
    current,
    pageSize,
  }) {
    if (current !== this.props.current) {
      this.setState({ current });
    }

    if (pageSize !== this.props.pageSize) {
      this.setState({ pageSize });
    }

    const prevRows = this.props.rows;
    const total = rows.length;

    if (
      dataSource !== this.props.dataSource ||
      rows.length !== prevRows.length
    ) {
      let currentPage = this.getCurrent(current);
      const currentPageSize = this.getPageSize(pageSize);
      const prevTotal = prevRows.length;
      const totalDiff = total - prevTotal;

      // 重新填数，分页变量重置为第一页。
      if (
        // 新数据比旧数据长度要短
        totalDiff < 0 ||
        // 新数据比旧数据长度要长，且当前纪录条数小于每页最大纪录数，且非第一次加载数据
        (totalDiff > 0 && total <= currentPageSize && prevTotal > 0)
      ) {
        currentPage = 1;
      }

      // 判断是否有下一页
      const hasMore = currentPageSize === (currentPage === 1 ? total : totalDiff);

      this.setState({ current: currentPage, hasMore });
    }
  }

  componentDidUpdate({ onChange }, prevState) {
    const { current, pageSize } = this.state;

    // 页数变更时，触发 onChange 回调函数
    if (current !== prevState.current) {
      onChange(current, pageSize);
    }
  }

  getDefaultCurrent = () => {
    const { current, defaultCurrent } = this.props;
    if (current !== undefined) {
      return current;
    }
    return defaultCurrent;
  }

  getCurrent = (current = this.props.current) => current || this.state.current

  getDefaultPageSize = () => {
    if ('pageSize' in this.props) {
      return this.props.pageSize;
    }
    return this.props.defaultPageSize;
  }

  getPageSize = (pageSize = this.props.pageSize) => pageSize || this.state.pageSize

  refLoadMore = ref => {
    if (ref) this.elmLoadMore = ref;
  }

  handleClickMore = () => {
    this.setState({ current: this.state.current + 1 });
  }

  render() {
    const { hasMore } = this.state;

    const props = {
      className: `ways-table-load-more ${hasMore ? '' : 'disabled'}`,
      onClick: hasMore ? this.handleClickMore : null,
    };

    return (
      <div
        ref={this.refLoadMore}
        {...props}
      >
        <div>
          {hasMore ? '加载更多...' : '暂无更多数据'}
        </div>
      </div>
    );
  }
}
