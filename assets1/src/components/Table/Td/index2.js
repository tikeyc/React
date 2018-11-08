import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

import './style.less';

export default class Td extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    data: PropTypes.any,
    render: PropTypes.func,
    record: PropTypes.object.isRequired,
    rowIndex: PropTypes.number.isRequired,
    colIndex: PropTypes.number.isRequired,
    expandable: PropTypes.bool,
    onExpand: PropTypes.func,
    expanded: PropTypes.bool,
    expandedDepth: PropTypes.number,
    column: PropTypes.object.isRequired,
    indentSize: PropTypes.number,
    tdStyle: PropTypes.object,
  }

  static defaultProps = {
    className: '',
    style: {},
    data: '',
    indentSize: 15,
    tdStyle: {},

    render: undefined,
    onExpand: undefined,
    expandable: undefined,
    expanded: undefined,
    expandedDepth: undefined,
  }

  getDrillClassName() {
    const {
      record: { children },
      expanded,
    } = this.props;

    if (children) {
      return expanded ? 'ways-table-row-expanded' : '';
    }
    return 'ways-table-row-spaced';
  }

  refTd = ref => {
    if (ref) this.elmTd = ref;
  }

  handleExpand = () => {
    const { expanded, onExpand, expandedDepth } = this.props;
    if (onExpand) onExpand(!expanded, expandedDepth);
  }

  render() {
    const {
      className,
      style,
      render,
      record,
      rowIndex,
      colIndex,
      expandable,
      expandedDepth,
      column,
      indentSize,
      tdStyle,
    } = this.props;
    let { data } = this.props;

    const {
      style: cellStyle,
      className: cellClassName,
      ...onCellProps
    } = column.onCell ? column.onCell(record, column) : {};
    let tdProps = {
      style: { ...style, ...tdStyle, ...cellStyle },
      className: classnames(className, cellClassName),
      ...onCellProps,
    };

    if (typeof data === 'object') {
      const { rowSpan, colSpan } = data;

      tdProps = {
        ...tdProps,
        rowSpan,
        colSpan,
        style: { ...tdProps.style, ...data.style || {} },
        className: classnames(tdProps.className, data.className),
      };

      if (data.data) ({ data } = data);
    }

    return (
      <td
        ref={this.refTd}
        {...tdProps}
      >
        {expandable &&
          <div
            className={classnames('ways-table-row-expand-icon', this.getDrillClassName())}
            style={{ marginLeft: expandedDepth * indentSize }}
            onClick={this.handleExpand}
          />
        }
        {!render ? data : render(data, {
          type: 'display',
          record,
          coordinate: {
            row: rowIndex,
            col: colIndex,
          },
          ref: this,
          column,
        })}
      </td>
    );
  }
}
