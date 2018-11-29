import React, { Component, PropTypes } from 'react';
import TabContent from '../TabContent';
import './style.less';

class Tabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultActiveKey: props.defaultActiveKey,
    };
  }

  componentWillReceiveProps({ defaultActiveKey }) {
    if (this.props.defaultActiveKey !== defaultActiveKey) {
      this.setState({ defaultActiveKey });
    }
  }

  getDefaultActiveKey(children) {
    let defaultActiveKey;

    let c = children;
    const cSize = c.length;
    if (cSize === undefined) {
      c = [c];
    } else if (cSize === 0) {
      return -1;
    }

    c.filter(v => v).forEach(child => {
      if (defaultActiveKey == null) {
        defaultActiveKey = child.props.eventKey;
      }
    });

    return defaultActiveKey;
  }

  render() {
    const {
      title,
      children,
      className,
      style,
      activeKey,
      onSelect,
    } = this.props;
    const { defaultActiveKey } = this.state;
    const hasDefaultActiveKey = typeof defaultActiveKey !== 'undefined';
    const actKey = hasDefaultActiveKey ?
      defaultActiveKey :
      activeKey || this.getDefaultActiveKey(children);

    let c = children;
    if (c.length === undefined) c = [c];
    c = c.filter(v => v);
    return (
      <div
        className={`tabs ${className || ''}`}
        style={style}
      >
        <ul className="nav">
          {title && <h3 className="d-ib ml-10 mr-10" style={{ color: '#333', fontSize: '16px' }}>{title}</h3>}
          {c.map(({ props: { eventKey, title } }) => (
            <li
              key={eventKey}
              style={{ display: title === '' ? 'none' : 'inline-block' }}
              className={actKey === eventKey ? 'active' : ''}
              onClick={() => {
                if (hasDefaultActiveKey) {
                  this.setState({ defaultActiveKey: eventKey });
                }
                if (onSelect) {
                  onSelect(eventKey);
                }
              }}
            >
              <a>{title}</a>
            </li>
          ))}
        </ul>
        <TabContent activeKey={actKey}>
          {children.filter(v => v)}
        </TabContent>
      </div>
    );
  }
}

Tabs.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  defaultActiveKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelect: PropTypes.func,
};

export default Tabs;
