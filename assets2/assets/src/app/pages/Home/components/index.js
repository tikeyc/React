import React, { Component, PropTypes } from 'react';

import './index.less';


export default class Home extends Component {
  static propTypes = {
    getTotalDatas: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isShowMobileReport: false,
    };
  }

  componentWillMount() {
    const {
      getTotalDatas,
    } = this.props;
    getTotalDatas();
  }

  componentWillReceiveProps() {
  }

  render() {
    return (
      <div>
        tikeyc
      </div>
    );
  }
}
