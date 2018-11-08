import React, { Component, PropTypes } from 'react';
import Grid from './Grid';
import SelectedOptionsBar from '../SelectedOptionsBar';
import './style.less';

export default class DropdownMenuTree extends Component {
  static propTypes = {
    HOCOptions: PropTypes.object,
    multiple: PropTypes.bool.isRequired,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    HOCOptions: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      options: props.options,
      keyword: '',
    };
  }

  componentWillReceiveProps({ options }) {
    if (options !== this.props.options) {
      this.setState({ options });
    }
  }

  getSelectedOptions = (options = this.state.options) => {
    const { multiple } = this.props;
    // console.log(options, 5959);

    // 多选
    if (multiple) {
      return options.reduce((arr, option) => {
        if (option.checked) {
          arr.push(option);
        }
        if (option.children) {
          arr = [...arr, ...this.getSelectedOptions(option.children)];
        }
        return arr;
      }, []);
    }

    // 单选
    return options.reduce((arr, option) => {
      if (option.checked) {
        arr.push(option);
      }
      if (option.children) {
        arr = [...arr, ...this.getSelectedOptions(option.children)];
      }
      return arr;
    }, []);
  }

  getNextOptions = (sdOption, options = this.state.options, parents = []) => {
    // console.log('s6');
    const { multiple } = this.props;
    // const selectedOption = sdOption; // 原来的
    const selectedOption = Array.isArray(sdOption) ? sdOption[0] : sdOption; // 修改后
    // 多选
    if (multiple) {
      return options.map(option => {
        if (option === selectedOption) {
          const nextChecked = !option.checked;
          const nextOption = {
            ...option,
            checked: nextChecked,
          };
          if (!nextChecked) {
            // console.log('进来了');
            return nextOption;
          }
          if (parents.length) {
            parents.forEach(parent => {
              const p = parent;
              p.checked = false;
            });
          }
          if (option.children) {
            nextOption.children = this.uncheckChildren(option.children);
          }
          return nextOption;
        }
        const nextOption = { ...option };
        if (option.children) {
          nextOption.children = this.getNextOptions(
            selectedOption,
            option.children,
            [...parents, nextOption],
          );
        }
        return nextOption;
      });
    }

    // 单选
    return options.map(option => {
      let { children } = option;
      if (children) {
        children = this.getNextOptions(
          sdOption,
          children,
        );

        return {
          ...option,
          checked: option === selectedOption,
          children,
        };
      }
      return {
        ...option,
        checked: option === selectedOption,
      };
    });
  }

  uncheckChildren = options => options.map(option => {
    const nextOption = {
      ...option,
      checked: false,
    };
    if (option.children) {
      nextOption.children = this.uncheckChildren(option.children);
    }
    return nextOption;
  });

  search = (options, keyword) => {
    const nextOptions = options.map(option => {
      if (option.children) {
        const children = this.search(option.children, keyword);
        return { ...option, children, show: children.filter(opt => opt.show).length > 0 };
      }
      return { ...option, show: option.text.indexOf(keyword) > -1 };
    });

    return nextOptions;
  }

  handleChangeKeyword = event => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    const keyword = event.target.value;
    this.setState({ keyword });
    this.timeout = setTimeout(() => {
      const options = this.search(this.props.options, keyword);
      this.setState({ options });
    }, 250);
  }

  render() {
    const { onChange, HOCOptions } = this.props;
    const { options, keyword } = this.state;
    return (
      <div styleName="dropdown-menu-tree">
        <SelectedOptionsBar
          options={this.getSelectedOptions()}
          onClick={onChange}
        />
        {HOCOptions.title && HOCOptions.search &&
          <input
            type="text"
            styleName="input-search"
            placeholder={HOCOptions.placeholderKeyword || '请输入查询关键字'}
            onChange={this.handleChangeKeyword}
          />
        }
        <div styleName="scrollbar">
          {options.filter(option => option.show !== false).length ?
            options.map(option => (
              <Grid
                key={option.value}
                isRoot
                option={option}
                onChange={onChange}
              />
            )) : <div styleName="no-result">关键字“<span styleName="keyword">{keyword}</span>”，查无结果...</div>
          }
        </div>
      </div>
    );
  }
}
