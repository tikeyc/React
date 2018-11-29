import React, { Component, PropTypes } from 'react';

export default class Colgroup extends Component {
  static propTypes = {
    columns: PropTypes.array.isRequired,
    widths: PropTypes.array.isRequired,
  }

  getCols = columns => (
    columns.reduce((cols, { children }) => {
      if (children) {
        return [...cols, ...this.getCols(children)];
      }

      return [...cols, true];
    }, [])
  )

  render() {
    const { columns, widths } = this.props;

    return (
      <colgroup key={0}>
        {this.getCols(columns).map((col, index) => (
          <col
            key={index}
            style={{ width: widths[index] }}
          />
        ))}
      </colgroup>
    );
  }
}
