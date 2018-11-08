import React, { Component, PropTypes } from 'react';
import './style.less';

export default class DownloadExcel extends Component {
  static propTypes = {
    className: PropTypes.string,
    href: PropTypes.string.isRequired,
    type: PropTypes.string,
    data: PropTypes.object,
  }

  render() {
    const {
      className = '',
      href,
      type = 'get',
      data,
    } = this.props;

    if (type === 'post') {
      // 生成一个临时id
      const id = String(Math.random()).substring(2);

      return (
        <a styleName={`download-excel ${className}`} onClick={() => this.refForm.submit()}>
          <div style={{ display: 'none' }}>
            <iframe src="about:blank" id={`__hidden_iframe_${id}__`} name={`__hidden_iframe_${id}__`} title="a" />
            <form ref={ref => { this.refForm = ref; }} action={href} method={type} target={`__hidden_iframe_${id}__`}>
              {Object.keys(data).map(key => {
                const value = data[key];
                return <input key={key} type="hidden" name={key} value={value} />;
              })}
            </form>
          </div>
        </a>
      );
    }
    return (
      <a className={`download-excel ${className}`} href={href} >
        下载
      </a>
    );
  }
}
