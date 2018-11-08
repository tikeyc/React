import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import $ from 'jquery';
import AuthLinkTips from './AuthLinkTips';

export default class AuthLink extends Component {
  static propTypes = {
    href: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  }

  showAuthLinkTips = message => {
    let $containers = $('#authLinkTips');
    if ($containers.length && !message) {
      $containers.hide();
      return;
    }
    $containers.show();
    if (!$containers.length) {
      $containers = $('<div id="authLinkTips"></div>');
      $('body').append($containers);
    }
    ReactDom.render(
      (
        <AuthLinkTips onClose={this.handleCloseTips}>
          {message}
        </AuthLinkTips>
      ),
      $containers[0],
    );
  }

  handleClick = event => {
    const { href } = this.props;
    $.ajax({
      url: href,
      async: false,
      complete: ((xhr, ts) => {
        if (ts === 'success') {
          if (xhr.responseJSON) {
            this.showAuthLinkTips('很抱歉，您没有该文件的访问权限！');
            event.preventDefault();
          }
        } else {
          this.showAuthLinkTips('接口访问出错，请尝试刷新页面再进行访问！');
          event.preventDefault();
        }
      }),
    });
  }

  handleCloseTips = () => {
    this.showAuthLinkTips('');
  }

  render() {
    const { children, ...restProps } = this.props;

    return (
      <a {...restProps} onClick={this.handleClick}>{children}</a>
    );
  }
}
