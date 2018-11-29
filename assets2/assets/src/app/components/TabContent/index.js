import React, { PropTypes } from 'react';
import TabPane from '../TabPane';

const TabContent = ({ children, activeKey }) => {
  let c = children;
  if (c.length === undefined) c = [c];

  return (
    <div className="tab-content">
      {c.map(child => {
        const { eventKey } = child.props;
        return (
          <TabPane key={eventKey} activeKey={activeKey} eventKey={eventKey}>
            {child}
          </TabPane>
        );
      })}
    </div>
  );
};

TabContent.propTypes = {
  children: PropTypes.node.isRequired,
  activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default TabContent;
