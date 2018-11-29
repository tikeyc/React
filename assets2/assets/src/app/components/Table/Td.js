import React, { PropTypes, Component } from 'react';
import { toThousand, highlightMinus } from 'formats';

export default class Td extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    data: PropTypes.any.isRequired,
    render: PropTypes.func,
    rowData: PropTypes.object.isRequired,
    coordinate: PropTypes.object.isRequired,
    drillPoint: PropTypes.bool,
    autoExpand: PropTypes.bool,
    onDrill: PropTypes.func.isRequired,
    expanded: PropTypes.bool,
    drillLevel: PropTypes.number,
    rowIndex: PropTypes.number,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { className = '', style = {}, data, render, rowData, coordinate, drillPoint, autoExpand, onDrill, expanded, drillLevel, rowIndex } = this.props;

    let visibleData;
    if (typeof data === 'object') {
      visibleData = data.data !== undefined ? data.data : data;
    } else {
      visibleData = data;
    }

    let drill;
    if (drillPoint) {
      let drillClassName = '';
      if (rowData.children) {
        drillClassName = (autoExpand && expanded === undefined) || expanded ? 'drilled' : '';
      } else {
        drillClassName = 'no-chidlren';
      }
      drill = (
        <div
          className={`drill-point ${drillClassName}`}
          style={{ marginLeft: drillLevel * 20 }}
          onClick={() => onDrill(rowData.id)}
        />
      );
    }

    return (
      <td
        style={style}
        className={`${className} ${data.className || ''}`}
        ref={ref => { this.refTd = ref; }}
        rowSpan={data.rowSpan}
        colSpan={data.colSpan}
        onClick={data.onClick}
      >
        {drill}
        {!render ?
          highlightMinus(toThousand(visibleData)) :
          render(visibleData, 'display', rowData, coordinate, this, rowIndex)
        }
      </td>
    );
  }
}
