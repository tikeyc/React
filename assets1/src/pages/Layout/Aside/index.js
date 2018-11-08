import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import './style.less';

export default class Aside extends Component {
  static propTypes = {
    activedPath: PropTypes.string.isRequired,
  }

  static activePath(activedPath) {
    try {
      // 同步父窗口hash
      const { hash, href } = window.parent.location;
      if (href !== window.location.href) {
        const hrefs = href.split('#');
        const routes = hash.split('/');
        const paths = activedPath.substr(1).split('/');
        paths.reverse().forEach((path, index) => {
          routes[routes.length - 1 - index] = path;
        });
        // hrefs[1] = routes.join('/');
        hrefs[1] = `#/zhiku/enterprise${activedPath}`;
        window.parent.location.href = hrefs.join('');
      }

      // 同步父窗口菜单栏样式
      const parent = window.parent.document;
      $('[href^="#/zhiku/enterprise/"]', parent).removeClass();
      const $link = $(`[href="#/zhiku/enterprise${activedPath}"]`, parent);
      if ($link.length) {
        $link.addClass('router-link-exact-active router-link-active');
      }
    } catch (e) {
      console.log('无法跨域操作！');
    }

    return [
      {
        path: '/home',
        text: '政策首页',
      },
      {
        path: '/policies',
        match: ['/policies', '/explanations'],
        text: '政策列表',
      },
      {
        path: '/search',
        text: '政策搜索',
      },
      {
        path: '/reports',
        text: '报告下载',
      },
    ].map(item => ({
      ...item,
      // active: (item.match || [item.path])
      //   .some(path => new RegExp(`^${path}`, 'ig').test(activedPath)),
      active: item.path === activedPath,
    }));
  }

  constructor(props) {
    super(props);
    this.state = { list: Aside.activePath(props.activedPath) };
  }

  componentWillReceiveProps({ activedPath }) {
    if (activedPath !== this.props.activedPath) {
      this.setState({ list: Aside.activePath(activedPath) });
    }
  }

  handleActiveMenu = activedItem => {
    const list = this.state.list.map(item => ({
      ...item,
      active: item === activedItem,
    }));
    this.setState({ list });
  }

  render() {
    const { list } = this.state;

    return (
      <div styleName="app-aside">
        <div styleName="app-name">企业动态分析系统</div>
        <ul>
          <li>
            <div styleName="menu-name">WAYS行业政策库</div>
            <ul styleName="menu">
              {list.map(item => (
                <li key={item.path} styleName={item.active ? 'active' : ''}>
                  <Link to={item.path} onClick={() => this.handleActiveMenu(item)}>
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    );
  }
}
