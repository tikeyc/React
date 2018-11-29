import $ from 'jquery';
import ReactDom from 'react-dom';
import React, { Component, PropTypes } from 'react';

import './style';

class PopconfirmContent extends Component {
  static propTypes = {
    content: PropTypes.node.isRequired,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    targetWidth: PropTypes.number.isRequired,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }

  static defaultProps = {
    width: 200,
  }

  constructor(props) {
    super(props);

    this.state = {
      left: props.left || 0,
    };
  }

  componentDidMount() {
    let left = (this.props.targetWidth - $(this.refPopconfirm).outerWidth()) / 2;
    left += this.props.left;
    let right = 'auto';
    if (this.props.left + $(this.refPopconfirm).outerWidth() > $(window).width()) {
      left = 'auto';
      right = '0';
    }
    $(this.refPopconfirm).css({ left, right });
  }

  handleCancel = () => {
    this.props.onCancel();
  }

  handleSubmit = () => {
    this.props.onSubmit();
  }

  render() {
    const { content, top, width } = this.props;
    const { left } = this.state;

    return (
      <div
        className="popconfirm bottom"
        style={{ left, top, width }}
        ref={ref => { if (ref) this.refPopconfirm = ref; }}
      >
        <div className="popconfirm-arrow popconfirm-arrow-border" />
        <div className="popconfirm-arrow" />
        <div className="popconfirm-inner">
          {content}
          <div className="footer">
            <a onClick={this.handleCancel}>取消</a>
            <a className="btn-submit" onClick={this.handleSubmit}>确定</a>
          </div>
        </div>
      </div>
    );
  }
}

export default class Popconfirm {
  static opening = false;

  constructor({ target, content = '', onSubmit }) {
    this.$target = $(target);
    this.content = content;
    this.onSubmit = onSubmit;
  }

  handleSubmit = () => {
    this.onSubmit();
    this.hide();
  }

  show = content => {
    if (Popconfirm.prevPopconfirm) Popconfirm.prevPopconfirm.hide();
    Popconfirm.prevPopconfirm = this;

    Popconfirm.opening = true;

    let { top, left } = this.$target.offset();

    top += this.$target.outerHeight();
    left += 0;

    let container = document.createElement('div');
    document.body.appendChild(container);

    $(document).on('click.popconfirm.close', () => {
      if (Popconfirm.opening) {
        Popconfirm.opening = false;
        return;
      }
      this.hide();
    })
    .on('click', '.popconfirm', event => {
      event.stopPropagation();
    });

    this.hide = () => {
      $(document)
      .off('click.popconfirm.close')
      .off('click', '.popconfirm');

      if (container) {
        ReactDom.unmountComponentAtNode(container);
        container.parentNode.removeChild(container);
        container = null;
      }
    };

    ReactDom.render(
      <PopconfirmContent
        targetWidth={this.$target.outerWidth()}
        content={content || this.content}
        left={left}
        top={top}
        onSubmit={this.handleSubmit}
        onCancel={this.hide}
      />,
      container
    );
  }
}
