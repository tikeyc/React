import React, { Component, PropTypes } from 'react';
import './style.less';

export default class ArticleFilterLine extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    parentIds: PropTypes.string,
    children: PropTypes.node,
  };

  static defaultProps = {
    parentIds: '',
    children: null,
  }

  constructor(props) {
    super(props);

    this.state = {
      options: props.options,
    };
  }

  componentWillReceiveProps({ parentIds, options }) {
    if (options !== this.props.options) {
      this.setState({ options });
    }
    // 如果选择了非不限的大类
    if (parentIds && parentIds !== '0' && parentIds !== this.props.parentIds) {
      const pIds = parentIds.split(',');
      const nextOptions = this.state.options.map(option => ({
        ...option,
        checked: !pIds.includes(option.parentId) ? false : option.checked,
      }));
      if (nextOptions.every(option => !option.checked)) {
        nextOptions[0] = { ...nextOptions[0], checked: true };
      }
      this.setState({ options: nextOptions });
      this.props.onChange(this.props.name, nextOptions.map(item => item.checked).value);
    }
  }

  handleChangeFilter = value => {
    const options = this.state.options.map(option => ({
      ...option,
      checked: value === option.value,
    }));

    this.setState({ options });
    this.props.onChange(this.props.name, value);
  }

  // handleChangeFilterForMultiple = (value) => {
  //   const { options } = this.state;
  //   const all = options[0];
  //   let nextOptions;
  //
  //   // 不限
  //   if (value === all.value) {
  //     nextOptions = options.map((option, index) => {
  //       if (index === 0) {
  //         return { ...option, checked: true };
  //       }
  //       return { ...option, checked: false };
  //     });
  //   } else {
  //     nextOptions = options.map((option, index) => {
  //       if (index === 0) {
  //         return { ...option, checked: false };
  //       }
  //       return { ...option, checked: value === option.value ? !option.checked : option.checked };
  //     });
  //   }
  //   if (nextOptions.every(option => !option.checked)) {
  //     nextOptions[0] = { ...nextOptions[0], checked: true };
  //   }
  //   this.setState({ options: nextOptions });
  //
  //   this.props.onChange(this.props.name, nextOptions
  //     .filter(option => option.checked).map(option => option.value).join(','));
  // }

  render() {
    const { label, parentIds, children } = this.props;
    const { options } = this.state;
    const pIds = parentIds.split(',');

    return (
      <div styleName="article-filter-line">
        <label styleName="label">{label}：</label>
        <div style={{ marginLeft: 100 }}>
          {options.map(({
            value, text, checked, parentId,
          }) => {
            if (value !== '0' && parentIds && parentIds !== '0' && !pIds.includes(parentId)) return null;
            return (
              <button
                key={value}
                value={value}
                styleName={checked ? 'checked' : ''}
                onClick={() => this.handleChangeFilter(value)}
              >
                {text}
              </button>
            );
          })}
          {children}
        </div>
      </div>
    );
  }
}
