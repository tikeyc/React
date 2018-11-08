import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import './style.less';

const ExplanationList = ({ id, list }) => (
  <div>
    <div styleName="header">
      相关解读
      {id && list.length > 0 &&
        <Link
          styleName="more"
          to={`/explanations?id=${id}`}
          target="_blank"
        >
          更多
        </Link>
      }
    </div>
    <ul>
      {list.map((article, index) => (
        <li key={article.id} styleName={classnames('article', index === 0 ? 'first-article' : '')}>
          <div styleName={classnames(index === 0 ? 'first-article-mask' : '')}>{index === 0 ? article.title : ''}</div>
          <Link to={`/explanations/${article.id}`} styleName="title" target="_blank">{article.title}</Link>
          {index > 0 && <div styleName="description">{article.description}</div>}
        </li>
      ))}
      {list.length === 0 &&
        <li styleName="article first-article">
          <div styleName="first-article-mask" />
          <div styleName="no-articles">暂无相关解读</div>
        </li>
      }
    </ul>
  </div>
);

ExplanationList.propTypes = {
  id: PropTypes.string,
  list: PropTypes.array.isRequired,
};

ExplanationList.defaultProps = {
  id: '',
};

export default ExplanationList;
