import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import AuthLink from '../../../components/AuthLink';
import './style.less';

const ArticleContent = ({
  article: {
    title,
    date,
    type,
    author,
    source,
    pdfPreview,
    pdfDownload,
    description,
    policyId,
  },
}) => (
  <div>
    <div styleName="title">{title}</div>
    <div styleName="properties">
      发布时间：<span styleName="date">{date}</span>
      {type && <span>政策类型：<span styleName="type">{type}</span></span>}
      {source && <span>文章来源：<span styleName="source">{source}</span></span>}
      {policyId && <span>政策原文：<Link styleName="source-article" to={`/policies/${policyId}`} target="_blank">查看原文</Link></span>}
    </div>
    {author &&
      <div styleName="properties">
        发布部门：<span styleName="author">{author}</span>
      </div>
    }
    <div styleName="properties">
      我要存档：<span styleName="pdf">将文件以PDF形式<AuthLink href={pdfPreview} target="_blank">打开</AuthLink>|<AuthLink href={pdfDownload}>下载</AuthLink></span>
    </div>
    <div styleName="description" dangerouslySetInnerHTML={{ __html: description }} />
  </div>
);

ArticleContent.propTypes = {
  article: PropTypes.object.isRequired,
};

export default ArticleContent;
