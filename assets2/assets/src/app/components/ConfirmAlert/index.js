import React, { Component } from 'react';
import Modal from '../Modal';

export default class ConfirmAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      title: '温馨提示',
      content: '',
      onSubmit: null,
    };
  }

  confirm = ({ title, content, onSubmit }) => {
    this.setState({
      title,
      content,
      onSubmit,
    });
    this.open();
  }

  open = () => {
    this.setState({ showModal: true });
  }

  close = () => {
    this.setState({ showModal: false });
  }

  handleSubmit = () => {
    const { onSubmit } = this.state;
    if (onSubmit) onSubmit();
    this.close();
  }

  render() {
    const { title, content } = this.state;

    return (
      <Modal
        title={title || '温馨提示'}
        showModal={this.state.showModal}
        onHide={this.close}
        onSubmit={() => this.handleSubmit()}
      >
        <p>{content}</p>
      </Modal>
    );
  }
}
