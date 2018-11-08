// import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import HOCDropdownMenu from '../../components/HOCDropdownMenu';
import Option from '../../components/HOCDropdownMenu/Option';
import SelectedOptionsBar from '../SelectedOptionsBar';
// import Tabs from '../../../components/Tabs';
// import Tab from '../../../components/Tab';

import './style.less';

class DropDownMenuManf extends Component {
  static propTypes = {
    tag: PropTypes.string,
    filterContainerStyle: PropTypes.object,
    multiple: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      isSearch: false,
      currentOptions: props.options,
      options: props.options,
      keyword: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      options,
    } = nextProps;
    const {
      keyword,
    } = this.state;
    this.setState({ options });
    this.setSearchResult(options, keyword);
  }

  // getSelectedOptions = (options = this.state.options) => {
  //   const models1 = _.flatten(options.map(item => item.children));
  //   const models2 = _.flatten(models1.map(item => item.children));
  //   let selectedOptions = models2.filter(item => item.checked);
  //   const models1Checked = models1.filter(item => item.checked);
  //   if (models1Checked && models1Checked.length > 0) {
  //     selectedOptions = selectedOptions.concat(models1Checked);
  //   }
  //   console.log('getSelectedOptions', selectedOptions);
  //   return selectedOptions;
  // }

  // getNextOptions = (selectedOption, options = this.props.options) => {
  //   const { multiple } = this.props;

  //   if (!multiple) {
  //     const selectedOptionValue = selectedOption[0].value;
  //     const newOptions = options.map(group => ({
  //       ...group,
  //       children: group.children.map(group2 => ({
  //         ...group2,
  //         checked: group2.value === selectedOptionValue,
  //         children: group2.children.map(model => ({
  //           ...model,
  //           checked: model.value === selectedOptionValue,
  //         })),
  //       })),
  //     }));
  //     return newOptions;
  //   }

  //   const selectedOptionValue = selectedOption.map(option => option.value);
  //   console.log('selectedOptionValue', selectedOptionValue);
  //   const nextOptions = options.map(group => ({
  //     ...group,
  //     children: group.children.map(group2 => ({
  //       ...group2,
  //       checked: this.setModelCheched(group, group2, selectedOptionValue),
  //       children: group2.children.map(model => ({
  //         ...model,
  //         checked: this.setModelCheched(group2, model, selectedOptionValue),
  //       })),
  //     })),
  //   }));
  //   console.log('getNextOptions', nextOptions);
  //   return nextOptions;
  // }

  getResetOptions = (options = this.state.options) => {
    const newOptions = options.map(group => ({
      ...group,
      checked: false,
      children: group.children.map(group2 => ({
        ...group2,
        checked: false,
        children: group2.children.map(model => ({
          ...model,
          checked: false,
        })),
      })),
    }));
    return newOptions;
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

  setSearchResult = (options, keyword) => {
    const newOptions = options;
    for (let i = 0; i < newOptions.length; i += 1) {
      const option1 = newOptions[i];
      let isExist = false;
      for (let j = 0; j < option1.children.length; j += 1) {
        const option2 = option1.children[j].children;
        let isShow = false;
        let isExist1 = false;
        for (let k = 0; k < option2.length; k += 1) {
          const brand = option2[k];
          isShow = brand.text.toLowerCase().indexOf(keyword.toLowerCase()) > -1;
          brand.show = isShow;
          if (!isExist) {
            isExist = isShow;
          }
          if (!isExist1) {
            isExist1 = isShow;
          }
          option2[k] = brand; // 3
        }
        option1.children[j].show = isExist1;
        option1.children[j].children = option2; // 2
      }
      option1.show = isExist;
      newOptions[i] = option1; // 1
    }
    //
    const currentOptions = newOptions.filter(item1 => item1.show);
    // console.log('currentOptions', currentOptions);
    // console.log('newOptions', newOptions);
    // console.log('this.props.options', this.props.options);
    if (currentOptions.length > 0) {
      this.setState({ currentOptions });
    } else {
      this.setState({ currentOptions: null });
    }
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

  // setModelCheched = (group, model, selectedOptionValue) => {
  //   const isIncludes = selectedOptionValue.includes(model.value);
  //   let isChecked = isIncludes;
  //   if (model.checked) {
  //     if (isIncludes) {
  //       isChecked = false;
  //     } else {
  //       isChecked = true;
  //     }
  //   }
  //   if (isChecked) {
  //     if (model.children) {
  //       model.children.forEach(element => {
  //         element.checked = false;
  //       });
  //     }
  //     console.log('isChecked', group);
  //     group.checked = false;
  //   }
  //   return isChecked;
  // }

  hadnleSearchInput = event => {
    const keyword = event.target.value;
    if (keyword && keyword.length > 0) {
      this.setState({ isSearch: true });
    } else {
      this.setState({ isSearch: false });
    }
    this.setState({ keyword });
    const {
      options,
    } = this.props;
    this.setSearchResult(options, keyword);
  }

  handleInputControl = type => {
    // console.log(type);
    if (type === 'onBlur') {
      this.setState({ isSearch: false });
    }
    // else {
    //   this.setState({ isSearch: true });
    // }
  }

  handleClickWords = key => {
    const {
      tag,
    } = this.props;
    const container = $(`#DropDownMenuManfTableT${tag}`);
    const scrollTo = $(`#DropDownMenuManfTableT${key}${tag}`);
    // console.log('container', container);
    // console.log('scrollTo', scrollTo);

    let scrollTop = scrollTo.offset().top - container.offset().top;
    scrollTop += container.scrollTop();
    // console.log('scrollTop', scrollTop);
    // container.scrollTop(scrollTop);
    container.animate({ scrollTop });
  }

  render() {
    const {
      isSearch,
      keyword,
      currentOptions,
    } = this.state;
    const {
      tag,
      filterContainerStyle,
      onChange,
    } = this.props;
    // console.log(isSearch);

    return (
      <div styleName="filter-container" style={filterContainerStyle}>
        <div styleName="content">
          <SelectedOptionsBar
            options={this.getSelectedOptions()}
            onClick={onChange}
          />
          <div styleName="search-head">
            <div styleName="words">
              {
                currentOptions && !isSearch && currentOptions.map((group, index) => (
                  <sapn key={index} styleName="words-span" onClick={() => this.handleClickWords(group.text)} >{group.text}</sapn>
                ))
              }
            </div>
            <input styleName="search-input" type="text" placeholder="请输入关键字" onInput={this.hadnleSearchInput} onFocus={() => this.handleInputControl('onFocus')} onBlur={() => this.handleInputControl('onBlur')} />
          </div>
          <div id={`DropDownMenuManfTableT${tag}`} styleName="table">
            {
              currentOptions ? currentOptions.map((group1, index1) => (
                group1.show &&
                <table key={index1}>
                  <tbody>
                    <tr>
                      <th id={`DropDownMenuManfTableT${group1.text}${tag}`} styleName="tr-th" colSpan="2">{group1.text}</th>
                    </tr>
                    {
                      group1.children.map((group2, index2) => (
                        group2.show &&
                        <tr key={index2}>
                          <td styleName="left-item">
                            <Option
                              option={group2}
                              onChange={onChange}
                            />
                            {/* {group2.text} */}
                          </td>
                          <td>
                            {
                              group2.children.map((option, index3) => (
                                option.show && <Option
                                  key={index3}
                                  option={option}
                                  onChange={onChange}
                                />
                              ))
                            }
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              )) : <div styleName="no-result">关键字“<span styleName="keyword">{keyword}</span>”，查无结果...</div>
            }
          </div>
        </div>
        {/* <Tabs defaultActiveKey={1}>
          <Tab title="生产厂商品牌" eventKey={1}>
          </Tab>
        </Tabs> */}
      </div>
    );
  }
}

export default HOCDropdownMenu(DropDownMenuManf, { title: '生产厂商品牌', popupWidth: 600 });
