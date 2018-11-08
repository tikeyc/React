import React, { Component, PropTypes } from 'react';
import './style.less';
import noDataImage from '../../images/sorry.png';

export default class NoData extends Component {
  static propTypes = {
    message: PropTypes.string,
  }

  test = () => {

  }

  render() {
    const {
      message,
    } = this.props;
    // if (!message) {
    //   message = '暂无数据';
    // }
    return (
      <div styleName="no-data-container">
        <div styleName="image">
          <img src={noDataImage} alt="" />
        </div>
        <div styleName="message">{message}</div>
      </div>
    );
  }
}
