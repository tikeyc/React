import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import './style.less';
import Button from '../Button';

export default class DropdownButton extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    style: {},
    onClick: undefined,
  };

  shouldComponentUpdate(nextProps) {
    return (
      !_.isEqual(this.props.style, nextProps.style) ||
      this.props.className !== nextProps.className ||
      this.props.onClick !== nextProps.onClick ||
      this.props.children !== nextProps.children
    );
  }

  render() {
    const {
      children,
      className = '',
      style,
      onClick,
    } = this.props;

    return (
      <Button
        className={`btn-dropdown ${className}`}
        style={style}
        onClick={onClick}
      >
        {children}
      </Button>
    );
  }
}
