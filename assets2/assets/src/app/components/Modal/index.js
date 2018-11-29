import React, { Component, PropTypes } from 'react';
import './style';

export default class Modal extends Component {
  static propTypes = {
    style: PropTypes.object,
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    showModal: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    className: PropTypes.string,
    disabledSubmit: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
  }

  render() {
    const {
      style = {},
      className = '',
      title,
      children,
      showModal,
      onHide,
      onSubmit,
      disabledSubmit,
    } = this.props;
    const width = style.width;

    return (
      <div className={`modal ${className}`} style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-backdrop" onClick={onHide} />
        <div className="modal-dialog" style={{ width }}>
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={onHide}
              >
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 className="modal-title">{title}</h4>
            </div>
            <div className="modal-body">
              {children}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal" onClick={onHide}>取消</button>
              <button type="button" className="btn btn-primary" onClick={onSubmit} disabled={disabledSubmit}>确定</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
