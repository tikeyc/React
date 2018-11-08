import React, { PropTypes } from 'react';
import ArticleContent from './ArticleContent';
import ExplanationList from './ExplanationList';
import './style.less';

const Article = ({
  explanations,
  article,
}) => (
  <div styleName="article-content">
    <div styleName="article-content-right">
      <ExplanationList id={article.policyId || article.id} list={explanations} />
    </div>
    <div styleName="article-content-left">
      <ArticleContent article={article} />
    </div>
  </div>
);

Article.propTypes = {
  explanations: PropTypes.array.isRequired,
  article: PropTypes.object.isRequired,
};

export default Article;
