import $ from 'jquery';
import React, { PropTypes, Component } from 'react';
import Button from '../Button';
import './style';

export default class Popups extends Component {
  static propTypes = {
    className: PropTypes.string,
    headText: PropTypes.string,
    headClick: PropTypes.func,
    children: PropTypes.any,
    onOk: PropTypes.func,
    onReset: PropTypes.func,
    onCancel: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    // const H = $('html');
    // const w1 = $(window).width();
    // H.addClass('fancybox-lock-test');
    // const w2 = $(window).width();
    // H.removeClass('fancybox-lock-test');
    // const width = w2 - w1;
    // $('html body').css({ overflowY: 'hidden', paddingRight: `${width}px` });
  }

  componentWillUnmount() {
    $('html body').css({ overflowY: '', paddingRight: '' });
  }

  render() {
    const { className, headText, headClick, children, onOk, onReset, onCancel } = this.props;
    return (
      <div className={`pop-ups ${className || ''}`}>
        <div className="pop-ups-bg" />
        <div className="pop-ups-box" >
          {(headText || headClick) &&
            <div className="pop-ups-header">
              {headText}
              {headClick && <span className="close" onClick={headClick} />}
            </div>
          }
          <div className="pop-ups-body">
            {children}
          </div>
          {(onOk || onReset || onCancel) &&
            <div className="pop-ups-footer">
              {onCancel && !onReset &&
                <Button
                  className="ml-10 mr-10"
                  data-dismiss="dropdown"
                  onClick={() => onCancel(this)}
                >
                  取消
                </Button>
              }
              {onReset &&
                <Button
                  className="ml-10 mr-10"
                  onClick={() => onReset(this)}
                >
                  重置
                </Button>
              }
              {onOk &&
                <Button
                  className="btn-primary ml-10 mr-10"
                  onClick={() => onOk(this)}
                >
                  确定
                </Button>
              }
            </div>
          }
        </div>
      </div>
    );
  }
}
