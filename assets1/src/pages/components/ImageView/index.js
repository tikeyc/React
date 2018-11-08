import React, { Component, PropTypes } from 'react';
import errorImage from './no-image-bg.png';

export default class ImageView extends Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
  }

  imgLoadError = e => {
    e.target.src = errorImage;
  }

  render() {
    const {
      src,
    } = this.props;

    return (
      <img
        src={src}
        alt=""
        onError={this.imgLoadError}
      />
    );
  }
}
