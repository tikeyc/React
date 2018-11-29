import $ from 'jquery';
import React, { Component, PropTypes } from 'react';
import './table.coffee';

export default class WaysTable extends Component {
  static propTypes = {
    options: PropTypes.object.isRequired,
  }

  componentDidMount() {
    const { options } = this.props;
    if (options && options.data.length > 0) {
      $(this.refTable).waysGrid(options);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { options } = nextProps;
    if (this.props.options !== options && options.data.length > 0) {
      $(this.refTable).waysGrid(options);
    }
  }

  render() {
    return <table ref={ref => { this.refTable = ref; }} />;
  }
}
