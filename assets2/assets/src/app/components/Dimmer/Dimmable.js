import React, { PropTypes } from 'react';
import classnames from 'classnames';

const Dimmable = ({
  className: klassName,
  children,
  as: AsComponent,
  blurring,
  dimmed,
  ...rest,
}) => {
  const className = classnames(
    'ways-dimmable',
    blurring ? 'blurring' : '',
    dimmed ? 'dimmed' : '',
    klassName,
  );

  if (AsComponent) {
    return (
      <AsComponent
        className={className}
        {...rest}
      >
        {children}
      </AsComponent>
    );
  }
  return <div className={className} {...rest}>{children}</div>;
};

Dimmable.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  as: PropTypes.func,
  blurring: PropTypes.bool,
  dimmed: PropTypes.bool,
};

export default Dimmable;
