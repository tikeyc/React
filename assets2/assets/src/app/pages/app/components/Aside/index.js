import $ from 'jquery';
import React, { Component, PropTypes } from 'react';
import './style';

export default class Aside extends Component {
  static propTypes = {
    pathname: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    onToggle: PropTypes.func.isRequired,
  }

  componentDidMount() {
    // 兼容旧版左侧菜单栏
    if ($('#aside').length) {
      const { addClassActive } = this;
      addClassActive(`[moduleid='#${this.props.pathname}']`);
      const jspAside = $('#aside').html();
      $(this.refNav).prepend(jspAside);

      $(document).on('click', '.page-aside [moduleid^="#"]', function fn() {
        $('.page-aside li').removeClass('active');
        const index = addClassActive(this).index();
        const $activeLi = $(`#iconMenu li:eq(${index})`);
        $activeLi.find('a').addClass('active');
        $activeLi.siblings().find('a').removeClass('active');
      });
      $(document).on('click', '.page-aside [moduleid^="#"]', function fn() {
        $('.page-aside li').removeClass('active');
        const index = addClassActive(this).index();
        const $activeLi = $(`#iconMenu li:eq(${index})`);
        $activeLi.find('a').addClass('active');
        $activeLi.siblings().find('a').removeClass('active');
      });
      $(document).on('mouseenter', '#iconMenu li', function fn() {
        const index = $(this).index();
        $(`.page-aside .nav > ul > li:eq(${index})`)
          .addClass('active')
          .siblings()
          .removeClass('active');
      });
    }
  }

  addClassActive(selector) {
    const $lv2 = $(selector)
      .addClass('active')
      .closest('li:not(.active)')
      .addClass('active');
    const $lv1 = $lv2
      .closest('li:not(.active)')
      .addClass('active');
    if ($lv1.length) {
      const index = $lv1.index();
      const $activeLi = $(`#iconMenu li:eq(${index})`);
      $activeLi.find('a').addClass('active');
      $activeLi.siblings().find('a').removeClass('active');
      return $lv1;
    }
    const index = $lv2.index();
    const $activeLi = $(`#iconMenu li:eq(${index})`);
    $activeLi.find('a').addClass('active');
    $activeLi.siblings().find('a').removeClass('active');
    return $lv2;
  }

  render() {
    const { pathname, onToggle, options } = this.props;
    return (
      <div className="page-aside">
        <nav className="nav" ref={ref => (this.refNav = ref)}>
          {false && options.map(({ title, list }, gIndex) => (
            <li key={gIndex}>
              <a className="title">{title}</a>
              <ul className="list">
                {list.map(({ path, text }, index) => {
                  const className = path === `#${pathname}` ? 'active' : '';
                  return (
                    <li key={index} className={className}>
                      <a href={path}>{text}</a>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </nav>
        <div className="btn-close" onClick={() => onToggle()}><div className="icon" /></div>
      </div>
    );
  }
}
