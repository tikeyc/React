import React, { Component, PropTypes } from 'react';
import './style.less';

export default class AuthLinkTips extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  stopPropagation = event => {
    event.stopPropagation();
  }

  render() {
    const { children, onClose } = this.props;

    return (
      <div>
        <div styleName="policy-auth-tips-mask" />
        <div styleName="policy-auth-box" onClick={onClose}>
          <div styleName="policy-auth-content" onClick={this.stopPropagation}>
            <div styleName="policy-auth-box-header">提示</div>
            <div styleName="policy-auth-message">{children}</div>
            <div styleName="policy-auth-footer">
              {/* <button>取消</button> */}
              <button styleName="btn-submit" onClick={onClose}>确定</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
