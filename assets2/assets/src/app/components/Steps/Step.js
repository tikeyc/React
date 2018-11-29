import React, { Component, PropTypes } from 'react';

import Toolbar from '../Toolbar';

export default class Step extends Component {
  static propTypes = {
    className: PropTypes.string,
    stepNumber: PropTypes.number,
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
    disabled: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      display: true,
    };
  }

  render() {
    const { display } = this.state;
    const { className = '', stepNumber, children, title, disabled } = this.props;

    return (
      <div
        className={`step ${className}`}
      >
        {disabled && <div className="prev-step-isnt-finished-before" />}
        {disabled && <div className="prev-step-isnt-finished-after">请先完成上一步操作</div>}
        <div className="step-number" onClick={() => this.setState({ display: !this.state.display })}>{stepNumber}</div>
        <div className="step-content" style={{ display: display ? '' : 'none' }}>
          {title &&
            <Toolbar color="white">
              <h2>{title}</h2>
            </Toolbar>
          }
          {title ?
            <div className="p-10">
              {children}
            </div> : children
          }
        </div>
      </div>
    );
  }
}
