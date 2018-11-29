import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import createPortal from './createPortal';

export default class Dimmer extends Component {
  static propTypes = {
    active: PropTypes.bool,
    page: PropTypes.bool,
    onClick: PropTypes.func,
    children: PropTypes.node,
    inverted: PropTypes.bool,
    verticalAlign: PropTypes.string,
  }

  static defaultProps = {
    active: false,
    page: false,
    inverted: false,
  }

  constructor(props) {
    super(props);
    this.container = document.createElement('div');
  }

  componentDidMount() {
    document.body.appendChild(this.container);
  }

  componentDidUpdate() {
    if (this.props.page) {
      createPortal(this.getHtml(), this.container);
    }
  }

  componentWillUnmount() {
    document.body.removeChild(this.container);
  }

  getHtml() {
    const {
      page,
      active,
      onClick,
      children,
      inverted,
      verticalAlign,
    } = this.props;

    const className = classnames(
      'ways-dimmer',
      active ? 'active' : '',
      page ? 'page' : '',
      inverted ? 'inverted' : '',
      verticalAlign,
    );

    return (
      <div
        className={className}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }

  render() {
    const { page } = this.props;

    if (page) {
      return <span style={{ display: 'none' }} />;
    }

    return this.getHtml();
  }
}
