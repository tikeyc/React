import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

import Row from '../Row';
import { getRowKey, getFixed } from '../helper';

import './style.less';

export default class Tbody extends Component {
  static propTypes = {
    columns: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired,
    fixedType: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    expandable: PropTypes.bool,
    // defaultExpandAllRows: PropTypes.bool,
    defaultExpandedRowKeys: PropTypes.array,
    expandedRowKeys: PropTypes.array,
    expandRowByClick: PropTypes.bool,
    onExpand: PropTypes.func,
    rowClassName: PropTypes.func,
    rowKey: PropTypes.string.isRequired,
    indentSize: PropTypes.number,
    hoverRowIndex: PropTypes.any.isRequired,
    onHoverRow: PropTypes.func.isRequired,
    onRow: PropTypes.func,
  }

  static defaultProps = {
    fixedType: false,
    // defaultExpandAllRows: false,
    expandRowByClick: false,

    expandable: undefined,
    defaultExpandedRowKeys: undefined,
    expandedRowKeys: undefined,
    onExpand: undefined,
    rowClassName: undefined,
    indentSize: undefined,
    onRow: undefined,
  }

  getRows({
    rows,
    columns,
    fixedType,
    expandedDepth = 0,
  }) {
    const {
      rowKey,
      // defaultExpandAllRows,
      defaultExpandedRowKeys,
      expandedRowKeys,
    } = this.props;

    const erKeys = expandedRowKeys || defaultExpandedRowKeys;
    return rows.reduce((a, record) => {
      let arrRows = a;
      const { children, ...restRecord } = record;
      const keyValue = record[getRowKey(record, rowKey)];
      // const expanded = defaultExpandAllRows || Boolean(erKeys && erKeys.includes(keyValue));
      const expanded = Boolean(erKeys && erKeys.includes(keyValue));

      const tds = columns.reduce((arr, column) => {
        const {
          key,
          render,
          className,
          style,
          fixed: pFixed,
        } = column;
        const fixed = getFixed(pFixed);
        if (fixedType && (!fixed || fixed !== fixedType)) return arr;

        const data = record[key];

        if (
          (key !== '__rowSelection' && data === undefined) ||
          (typeof data === 'object' && _.isEmpty(data))
        ) return arr;

        arr.push({
          className,
          style,
          data,
          render,
        });

        return arr;
      }, []);

      arrRows = [
        ...arrRows,
        {
          ...restRecord,
          ...(children && children.length > 0 ? { children } : {}),
          __tds: tds,
          __expanded: expanded,
          expandedDepth,
        },
      ];

      if (children && children.length > 0 && expanded) {
        arrRows = [
          ...arrRows,
          ...this.getRows({
            rows: children,
            columns,
            fixedType,
            expandedDepth: expandedDepth + 1,
          }),
        ];
      }

      return arrRows;
    }, []);
  }

  getExpandedRowKeys(keyValue) {
    const { expandedRowKeys } = this.props;

    if (expandedRowKeys.includes(keyValue)) {
      return expandedRowKeys.filter(key => key !== keyValue);
    }
    return [...expandedRowKeys, keyValue];
  }

  handleExpand = (keyValue, expanded, record, expandedDepth) => {
    const expandedRowKeys = this.getExpandedRowKeys(keyValue);
    this.props.onExpand(expandedRowKeys, expanded, record, expandedDepth);
  }

  handleClickRow = (keyValue, expanded, record, expandedDepth) => {
    if (this.props.expandRowByClick) {
      this.handleExpand(keyValue, expanded, record, expandedDepth);
    }
  }

  handleMouseOverRow = keyValue => {
    this.props.onHoverRow(keyValue);
  }

  handleMouseOutRow = () => {
    this.props.onHoverRow('');
  }

  render() {
    const {
      columns,
      fixedType,
      rowClassName,
      rowKey,
      indentSize,
      hoverRowIndex,
      expandable,
      expandedRowKeys,
      onRow,
    } = this.props;
    const rows = this.getRows({
      rows: this.props.rows,
      columns,
      fixedType,
    });

    return (
      <tbody className="ways-table-tbody">
        {rows.map((row, rowIndex) => {
          const { __expanded, __tds, expandedDepth, ...record } = row;
          const { className } = row;
          const keyValue = row[getRowKey(row, rowKey)];
          const trClassName = classnames(
            className,
            `ways-table-row-${rowIndex % 2 === 0 ? 'odd' : 'even'}`,
            hoverRowIndex === keyValue ? 'ways-table-row-hover' : '',
            rowClassName ? rowClassName(row, rowIndex) : '',
          );
          const fixedColumns = columns.filter(({ fixed: pFixed }) => {
            const fixed = getFixed(pFixed);
            return fixed && fixed === fixedType;
          });

          return (
            <Row
              key={keyValue}
              keyValue={keyValue}
              className={trClassName}
              onClick={this.handleClickRow}
              onMouseOver={this.handleMouseOverRow}
              onMouseOut={this.handleMouseOutRow}
              cells={__tds}
              expandedDepth={expandedDepth}
              columns={!fixedType ? columns : fixedColumns}
              rowIndex={rowIndex}
              expandable={expandedRowKeys && expandable}
              expanded={__expanded}
              indentSize={indentSize}
              onExpand={this.handleExpand}
              onRow={onRow}
              record={record}
            />
          );
        })}
      </tbody>
    );
  }
}
