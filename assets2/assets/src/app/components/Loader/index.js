import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import './style.less';

/**
 * 加载器
 * 用于加载数据等待期间展示加载动画，减缓用户的焦虑感
 */
export default class Loader extends Component {
  static propTypes = {
    // 内嵌文本内容
    children: PropTypes.node,
    // 属性文本内容
    content: PropTypes.string,
    // 慢速反向转动，用于加载时间不确定或比较长的情况
    indeterminate: PropTypes.bool,
    // 是否显示
    active: PropTypes.bool,
    // 是否禁用，禁用时加载器不可见
    disabled: PropTypes.bool,
    // 行内排列
    inline: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string,
    ]),
    // 尺寸，分为八种，默认为 medium：
    // mini(14px), tiny(16px), small(24px), medium(32px),
    // large(48px), big(52px), huge(58px), massive(64px)
    size: PropTypes.string,
    // 主题颜色反转，默认为黑色 false，反转为白色 true
    inverted: PropTypes.bool,
  }

  static defaultProps = {
    inverted: false,
    indeterminate: false,
    active: false,
    disabled: false,
    inline: false,
  }

  render() {
    const {
      children,
      inverted,
      content,
      indeterminate,
      active,
      disabled,
      size,
    } = this.props;
    let {
      inline,
    } = this.props;

    if (inline && typeof inline === 'string') {
      inline = inline ? `${inline} inline` : '';
    } else {
      inline = inline ? 'inline' : '';
    }

    const className = classnames(
      'ways-loader',
      content || children ? 'text' : '',
      inverted ? 'inverted' : '',
      indeterminate ? 'indeterminate' : '',
      active ? 'active' : '',
      disabled ? 'disabled' : '',
      inline,
      size,
    );

    return (
      <div className={className}>{content || children}</div>
    );
  }
}
