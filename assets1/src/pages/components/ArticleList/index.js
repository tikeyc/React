import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import OrderBy from './OrderBy';
import Pagination from '../../../components/Pagination';
import './style.less';

const ArticleList = ({
  link,
  title: headerTitle,
  list,
  total,
  onSort,
  page,
  onPagination,
}) => (
  <div styleName="articles">
    <div styleName="header">
      {headerTitle}
      {onSort &&
        <div styleName="header-right">
          <OrderBy onChange={onSort} />
        </div>
      }
    </div>
    <ul>
      {list.map(({
        id,
        title,
        description,
        date,
        type,
      }) => (
        <li key={id} className="clearfix" styleName="article">
          <Link to={typeof link === 'string' ? `${link}/${id}` : link(id)} styleName="title" target="_blank">{title}</Link>
          <div styleName="description">{description}</div>
          <div styleName="date">发布时间：{date}</div>
          {type && <div styleName="type">政策类型：{type}</div>}
        </li>
      ))}
    </ul>
    <div styleName="pagination">
      <Pagination
        current={page}
        total={total}
        onChange={onPagination}
      />
    </div>
  </div>
);

ArticleList.propTypes = {
  link: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  title: PropTypes.node.isRequired,
  list: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  onSort: PropTypes.func,
  onPagination: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
};

ArticleList.defaultProps = {
  onSort: undefined,
};

export default ArticleList;
