import React, { Component, PropTypes } from 'react';
import './style';

const options = [
  {
    title: '新能源',
    list: [
      {
        text: '首页',
        path: '#/home',
      },
      {
        text: '充电桩查询',
        path: '#/ChargingPointsSearch',
      },
    ],
  },
];

export default class Aside extends Component {
  static propTypes = {
    pathname: PropTypes.string.isRequired,
    onToggle: PropTypes.func.isRequired,
  }

  componentWillMount() {}

  render() {
    const { pathname, onToggle } = this.props;

    return (
      <div className="page-aside">
        <nav className="nav">
          {options.map(({ title, list }, gIndex) => (
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
        <button
          className="btn-close"
          onClick={onToggle}
        >
          <div className="icon" />
        </button>
      </div>
    );
  }
}

