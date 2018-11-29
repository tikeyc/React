import React, { PropTypes, Component } from 'react';
import { highlightMinus } from 'formats';

export default class Td extends Component {
  static propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    data: PropTypes.any.isRequired,
    render: PropTypes.func,
    rowData: PropTypes.any.isRequired,
    coordinate: PropTypes.object.isRequired,
    drillPoint: PropTypes.bool,
    autoExpand: PropTypes.bool,
    onDrill: PropTypes.func.isRequired,
    expanded: PropTypes.bool,
    drillLevel: PropTypes.number,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  getVisibleData = (render, visibleData, rowData, coordinate) => {
    let dom = !render ? visibleData : render(visibleData, 'display', rowData, coordinate, this.refTd);
    if (Array.isArray(visibleData)) {
      dom = visibleData.map((v, i) => (<div key={i} className="ta-l h-16" style={{ width: '300px' }}>
        <span className="d-ib h-10 mr-10" style={{ width: `${200 * v.percent}px`, background: i === 0 ? '#376193' : '#BEBFBE' }} />
        {highlightMinus(v.text)}
      </div>));
    } else if (typeof visibleData === 'string' && visibleData.includes('@percent')) {
      const num = Number(visibleData.split('%')[0]);
      dom = (<div style={{ width: '300px' }}>
        <div className="d-ib ta-r h-16 va-m" style={{ width: '150px', borderRight: '1px solid #fff' }}>
          {/^-/.test(visibleData) && <span>{highlightMinus(visibleData.replace('@percent', ''))}</span>}
          {/^-/.test(visibleData) && <span className="d-ib h-10 ml-10" style={{ width: `${-num}px`, background: '#B62627' }} />}
        </div>
        <div className="d-ib ta-l va-m" style={{ width: '150px' }}>
          {!/^-/.test(visibleData) && <span key="1" className="d-ib h-10 mr-10" style={{ width: `${num}px`, background: '#376193' }} />}
          {!/^-/.test(visibleData) && <span key="2">{highlightMinus(visibleData.replace('@percent', ''))}</span>}
        </div>
      </div>);
    } else if (typeof visibleData === 'string' && visibleData.includes('@')) {
      const arr = visibleData.split('@');
      dom = arr.map((v, i) => <div key={i} style={{ width: '100%', padding: '2px 0', borderBottom: i === (arr.length - 1) ? '' : '1px solid #ddd' }}>{v}</div>);
    } else {
      dom = highlightMinus(visibleData);
    }

    return dom;
  }

  render() {
    const { className = '', style = {}, data, render, rowData, coordinate, drillPoint, autoExpand, onDrill, expanded, drillLevel } = this.props;

    let visibleData = typeof data === 'object' && data.data ? data.data : data;
    visibleData = visibleData || data;

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
        style={{ ...style, padding: typeof visibleData === 'object' ? '0' : '' }}
        className={`${className} ${data.className || ''}`}
        ref={ref => { this.refTd = ref; }}
        rowSpan={data.rowSpan}
        colSpan={data.colSpan}
        onClick={data.onClick}
      >
        {drill}
        {this.getVisibleData(render, visibleData, rowData, coordinate)}
      </td>
    );
  }
}
