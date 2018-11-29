import React, { PropTypes } from 'react';

import './style';
import Step from './Step';

const Steps = ({ style, className = '', children, children: { length } }) => (
  <div className={`steps ${className}`} style={style}>
    {(children.length ? children : [children]).map((child, index) => (
      <Step
        key={index}
        title={child.props.title}
        stepNumber={index + 1}
        className={`${index === length - 1 ? 'last-child' : ''} ${index > 0 && !child.props.prevStepIsFinished ? 'prev-step-isnt-finished' : ''}`}
        disabled={index > 0 && !child.props.prevStepIsFinished}
      >
        {child}
      </Step>
    ))}
  </div>
);

Steps.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Steps;
