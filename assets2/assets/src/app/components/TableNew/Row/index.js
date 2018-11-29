import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

import Td from '../Td';

export default class Row extends Component {
  static propTypes = {
    keyValue: PropTypes.any.isRequired,
    className: PropTypes.string.isRequired,
    record: PropTypes.object.isRequired,
    cells: PropTypes.array.isRequired,
    rowIndex: PropTypes.number.isRequired,
    columns: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired,
    onMouseOver: PropTypes.func.isRequired,
    onMouseOut: PropTypes.func.isRequired,
    expandable: PropTypes.bool,
    expanded: PropTypes.bool.isRequired,
    onExpand: PropTypes.func.isRequired,
    indentSize: PropTypes.number,
    onRow: PropTypes.func,
    expandedDepth: PropTypes.number,
  }

  static defaultProps = {
    indentSize: undefined,
    onRow: undefined,
    expandable: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      rowProps: this.getRowProps(),
    };
  }

  getRowProps = () => {
    const { onRow, record, rowIndex } = this.props;
    return (onRow && onRow(record, rowIndex)) || {};
  }

  runOn = onKey => {
    if (this.state.rowProps[onKey]) {
      this.state.rowProps[onKey]();
    }
  }

  handleClick = () => {
    const { expanded, record, expandedDepth } = this.props;
    this.props.onClick(this.props.keyValue, !expanded, record, expandedDepth);
    this.runOn('onClick');
  }

  handleMouseOver = () => {
    this.props.onMouseOver(this.props.keyValue);
    this.runOn('onMouseOver');
  }

  handleMouseOut = () => {
    this.props.onMouseOut('');
    this.runOn('onMouseOut');
  }

  handleExpand = (expanded, expandedDepth) => {
    const { keyValue, record, onExpand } = this.props;
    onExpand(keyValue, expanded, record, expandedDepth);
  }

  render() {
    const {
      className,
      cells,
      rowIndex,
      columns,
      expandable,
      expanded,
      onExpand,
      indentSize,
      record,
      expandedDepth,
    } = this.props;
    const { rowProps } = this.state;
    const hasExpandableColumn = columns.some(column => column.expandable);

    return (
      <tr
        {...rowProps}
        className={classnames(className, rowProps.className)}
        onClick={this.handleClick}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
      >
        {cells.map((td, colIndex) => (
          <Td
            {...td}
            key={colIndex}
            column={columns[colIndex]}
            rowIndex={rowIndex}
            colIndex={colIndex}
            expandable={expandable && onExpand &&
              (hasExpandableColumn ? columns[colIndex].expandable : colIndex === 0)}
            expanded={expanded}
            indentSize={indentSize}
            onExpand={this.handleExpand}
            record={record}
            expandedDepth={expandedDepth}
          />
        ))}
      </tr>
    );
  }
}
