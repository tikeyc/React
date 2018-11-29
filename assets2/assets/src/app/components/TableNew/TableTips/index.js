import React, { PropTypes } from 'react';

import './style.less';

const TableTips = ({ loading, data }) => {
  let tips;
  if (loading) {
    tips = <div className="ways-table-tips-loading">加载中 ...</div>;
  } else if (data.length === 0) {
    tips = '暂无数据 ...';
  }

  if (!tips) return <span />;

  return (
    <div className="ways-table-tips">
      <div className="ways-table-tips-mask" />
      <div className="ways-table-tips-content">
        {tips}
      </div>
    </div>
  );
};

TableTips.propTypes = {
  loading: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
};

export default TableTips;
