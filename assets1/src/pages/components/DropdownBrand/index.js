// import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import '../../../helpers/mloading';
import HOCDropdownMenu from '../../components/HOCDropdownMenu';
import Option from '../../components/HOCDropdownMenu/Option';
import Tabs from '../../../components/Tabs';
import Tab from '../../../components/Tab';

import './style.less';

class DropDownMenuBrand extends Component {
  static propTypes = {
    headerSelectedOptions: PropTypes.array,
    multiple: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    titles: PropTypes.array.isRequired,
    isGrouping: PropTypes.bool, // 当弹框存在本品及竞品的时候有分组
    isSelectSub: PropTypes.bool, // 只能选择最后一层的车型
    showModelLoading: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    // const currentOptions = this.getTableOptions(1);
    this.state = {
      showType: 0, // 0:本品及竞品 1:细分市场 2:品牌
      isSearch: false,
      headerSwirchIndex: 0,
      keyword: '',
      currentOptions: [],
      // options: [],
      headerSelectedOptions: props.headerSelectedOptions || [],
      oldHeaderSelectedOptions: props.headerSelectedOptions || [],
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      showType,
      keyword,
    } = this.state;
    const {
      options,
      // multiple,
      headerSelectedOptions,
      showModelLoading,
    } = nextProps;
    // console.log('componentWillReceiveProps', options, headerSelectedOptions);
    // (headerSelectedOptions && this.state.headerSelectedOptions.length === 0) ||
    if (headerSelectedOptions !== this.props.headerSelectedOptions) {
      this.setState({
        headerSelectedOptions,
        oldHeaderSelectedOptions: headerSelectedOptions.map(option => ({
          ...option,
        })),
      });
    }
    // this.setState({ options: options[showType] });
    this.setSearchResult(options[showType], keyword);

    if (showModelLoading !== this.props.showModelLoading) {
      if (showModelLoading) {
        $(this.domContainer).mLoading('show');
      } else $(this.domContainer).mLoading('hide');
    }
  }

  getTable = (group, index) => {
    const {
      // onChange,
      isGrouping,
      isSelectSub,
    } = this.props;
    const {
      showType,
    } = this.state;
    if (showType === 0 && isGrouping) {
      return (
        group.show &&
        group.children.map((group2, index2) => (
          group2.show &&
          <table key={index2}>
            <tbody>
              <tr>
                <td styleName="left-super" rowSpan={group2.children.length + 1}>
                  {
                    isSelectSub ?
                      group2.text : <Option option={group2} onChange={this.optionClick} />
                  }
                </td>
              </tr>
              {
                <tr key={index2}>
                  <td>
                    {
                      group2.children.map((option, index3) => (
                        option.show && <Option
                          key={index3}
                          option={option}
                          onChange={this.optionClick}
                        />
                      ))
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        ))
      );
    }
    return (
      group.show &&
      <table key={index}>
        <tbody>
          <tr>
            <td styleName="left-super" rowSpan={group.children.length + 1}>
              {
                isSelectSub ?
                  group.text : <Option option={group} onChange={this.optionClick} />
              }
            </td>
          </tr>
          {
            group.children.map((group2, index2) => (
              group2.show &&
              <tr key={index2}>
                <td styleName="left-item">
                  {
                    isSelectSub ? group2.text
                      : <Option option={group2} onChange={this.optionClick} />
                  }
                </td>
                <td>
                  {
                    group2.children.map((option, index3) => (
                      option.show && <Option
                        key={index3}
                        option={option}
                        onChange={this.optionClick}
                      />
                    ))
                  }
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  }

  // getSelectedOptions = (options = this.state.options) => {
  //   // console.log('111', options);
  //   const option = options[this.state.showType];
  //   const models3 = option.filter(item => item.checked);
  //   const models1 = _.flatten(option.map(item => item.children));
  //   const models2 = _.flatten(models1.map(item => item.children));
  //   let selectedOptions = models2.filter(item => item.checked);
  //   const models1Checked = models1.filter(item => item.checked);
  //   if (models3 && models3.length > 0) {
  //     selectedOptions = selectedOptions.concat(models3);
  //   }
  //   if (models1Checked && models1Checked.length > 0) {
  //     selectedOptions = selectedOptions.concat(models1Checked);
  //   }
  //   return selectedOptions;
  // }

  // getNextOptions = (selectedOption, options = this.props.options) => {
  //   const { multiple } = this.props;
  //   // console.log('111', options);
  //   if (!multiple) {
  //     const selectedOptionValue = selectedOption[0].value;
  //     const newOptions = options.map(tab => tab.map(group => ({
  //       ...group,
  //       checked: group.value === selectedOptionValue,
  //       children: group.children.map(group2 => ({
  //         ...group2,
  //         checked: group2.value === selectedOptionValue,
  //         children: group2.children.map(model => ({
  //           ...model,
  //           checked: model.value === selectedOptionValue,
  //         })),
  //       })),
  //     })));
  //     // console.log('222', newOptions);
  //     return newOptions;
  //   }
  //   const selectedOptionValue = selectedOption.map(option => option.value);
  //   // console.log('selectedOptionValue', selectedOptionValue);
  //   const nextOptions = options.map(tab => tab.map(group => ({
  //     ...group,
  //     checked: this.setModelCheched({}, {}, group, selectedOptionValue),
  //     children: group.children.map(group2 => ({
  //       ...group2,
  //       checked: this.setModelCheched({}, group, group2, selectedOptionValue),
  //       children: group2.children.map(model => ({
  //         ...model,
  //         checked: this.setModelCheched(group, group2, model, selectedOptionValue),
  //       })),
  //     })),
  //   })));
  //   // console.log('getNextOptions', nextOptions);
  //   return nextOptions;
  // }

  getResetOptions = (options = this.props.options) => {
    const newOptions = options.map(tab => tab.map(group => ({
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
    })));
    this.setState({ headerSelectedOptions: [] });
    return newOptions;
  }

  getSelectedOptions = () => {
    /* options = this.props.options */
    // const { multiple } = this.props;
    // console.log('getSelectedOptions', options);
    // const selectedOptions = this.test2(multiple, options[this.state.showType]);
    // console.log('selectedOptions', selectedOptions);
    // return selectedOptions;

    const {
      headerSelectedOptions,
    } = this.state;
    // console.log('getSelectedOptions', headerSelectedOptions);

    this.setState({
      oldHeaderSelectedOptions: headerSelectedOptions.map(option => ({
        ...option,
      })),
    });
    // const hasChildren = headerSelectedOptions.filter(option => option.children);
    // const hasChildrenValues = hasChildren.map(option => option.value);

    // let noChildren = headerSelectedOptions.filter(option => !option.children);
    // // console.log('noChildren1', noChildren);
    // noChildren = noChildren.filter(option => {
    //   const a = hasChildrenValues.find(values => values.indexOf(option.value) > -1);
    //   return !a;
    // });
    // // console.log('hasChildren', hasChildren);
    // // console.log('hasChildrenValues', hasChildrenValues);
    // // console.log('noChildren2', noChildren);

    // return hasChildren.concat(noChildren);
    return headerSelectedOptions;
  }

  getNextOptions = (sdOption, options = this.props.options, parents = []) => {
    // console.log('getNextOptions', options);
    const nextOption = this.test(sdOption, options[this.state.showType], parents);
    options[this.state.showType] = nextOption;
    return options;
  }

  getTableOptions = showType => {
    const {
      options,
    } = this.props;
    return options[showType];
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
            // if (i === 0) {
            //   console.log('handleHeaderSwirch');
            //   this.setState({ headerSwirchIndex: i });
            // }
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
    if (currentOptions.length > 0) {
      this.setState({ currentOptions });
    } else {
      this.setState({ currentOptions: null });
    }
  }

  setModelCheched = (group1, group2, model, selectedOptionValue) => {
    const isIncludes = selectedOptionValue.includes(model.value);
    let isChecked = isIncludes;
    if (model.checked) {
      if (isIncludes) {
        isChecked = false;
      } else {
        isChecked = true;
      }
    }
    if (isChecked) {
      if (model.children) {
        model.children.forEach(element => {
          element.checked = false;
        });
      }
      if (group1) group1.checked = false;
      if (group2) group2.checked = false;
    }
    return isChecked;
  }

  test2(multiple, options) {
    // 多选
    if (multiple) {
      const selectedOptions = options.reduce((arr, option) => {
        if (option.checked) {
          arr.push(option);
        }
        if (option.children) {
          arr = [...arr, ...this.test2(multiple, option.children)];
        }
        return arr;
      }, []);

      return selectedOptions;
    }

    // 单选
    return options.reduce((arr, option) => {
      if (option.checked) {
        arr.push(option);
      }
      if (option.children) {
        arr = [...arr, ...this.test2(multiple, option.children)];
      }
      return arr;
    }, []);
  }

  test = (sdOption, options, parents) => {
    const { multiple } = this.props;
    // const selectedOption = sdOption; // 原来的
    const selectedOption = Array.isArray(sdOption) ? sdOption[0] : sdOption; // 修改后
    // 多选
    if (multiple) {
      return options.map(option => {
        if (option === selectedOption) {
          // console.log('进来了1');
          const nextChecked = !option.checked;
          const nextOption = {
            ...option,
            checked: nextChecked,
          };
          if (!nextChecked) {
            // console.log('进来了2');
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
          nextOption.children = this.test(
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
        children = this.test(
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

  hadnleSearchInput = event => {
    const {
      showType,
    } = this.state;
    const keyword = event.target.value;
    if (keyword && keyword.length > 0) {
      this.setState({ isSearch: true });
    } else {
      this.setState({ isSearch: false });
    }
    this.setState({ keyword });
    const options = this.getTableOptions(showType);
    this.setSearchResult(options, keyword);
    // const currentOptions = options.filter(item1 => {
    //   let isExist = false;
    //   item1.children.forEach(item2 => {
    //     item2.children.forEach(item3 => {
    //       if (item3.text.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
    //         isExist = true;
    //       }
    //     });
    //   });
    //   return isExist;
    // });
    // // console.log('currentOption', currentOption);
    // if (currentOptions.length > 0) {
    //   this.setState({ currentOptions });
    // }
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

  handleClickTitle = showType => {
    this.setState({ showType });
    const currentOptions = this.getTableOptions(showType);
    this.setState({ keyword: '' });
    this.setSearchResult(currentOptions, '');
  }

  handleHeaderSwirch = headerSwirchIndex => {
    this.setState({ headerSwirchIndex });
  }

  tesdd = options => {
    if (!options) {
      return [];
    }
    const {
      headerSelectedOptions,
    } = this.state;
    let currentOptions = options;
    const headerValues = headerSelectedOptions.map(option => option.value);
    currentOptions = currentOptions.map(group => ({
      ...group,
      checked: headerValues.includes(group.value),
      children: group.children.map(group2 => ({
        ...group2,
        checked: headerValues.includes(group2.value),
        children: group2.children.map(model => ({
          ...model,
          checked: headerValues.includes(model.value),
        })),
      })),
    }));
    return currentOptions;
  }

  optionClick = (option, isHeader) => {
    // console.log('optionClick', option, isHeader);
    const {
      multiple,
    } = this.props;
    let {
      headerSelectedOptions,
    } = this.state;
    if (multiple) {
      const headerValues = headerSelectedOptions.map(option1 => option1.value);
      // console.log('headerValues', headerValues);
      if (option.checked || isHeader) {
        if (headerValues.includes(option.value)) {
          headerSelectedOptions = headerSelectedOptions.filter(option1 =>
            option.value !== option1.value);
        }
      } else if (!headerValues.includes(option.value)) {
        headerSelectedOptions.push(option);
      }
    } else {
      headerSelectedOptions = [option];
    }
    // console.log('headerSelectedOptions', headerSelectedOptions);

    this.setState({
      headerSelectedOptions,
    }, () => {
      this.props.onChange(option);
    });
  }

  handleClose = () => {
    const {
      oldHeaderSelectedOptions,
    } = this.state;
    // console.log('handleClose11111', oldHeaderSelectedOptions);
    this.setState({ headerSelectedOptions: [...oldHeaderSelectedOptions] });
  }

  handleDomContainer = ref => {
    this.domContainer = ref;
  }

  renderContent = () => {
    const {
      keyword,
      isSearch,
      showType,
      headerSwirchIndex,
      // currentOptions,
      headerSelectedOptions,
    } = this.state;
    const {
      isGrouping,
      titles,
      // onChange,
    } = this.props;
    let {
      currentOptions,
    } = this.state;
    currentOptions = this.tesdd(currentOptions);
    // console.log('renderContent headerSelectedOptions', headerSelectedOptions);
    return (
      <div styleName="content">
        {headerSelectedOptions.length > 0 &&
          <div
            styleName="selected-options-bar"
            style={{ overflowY: 'auto' }}
            ref={ref => { this.refScrollbar = ref; }}
          >
            <div
              styleName="selected-options-bar-wrapper"
              ref={ref => { this.refContent = ref; }}
            >
              已选：
              {headerSelectedOptions.map((option, index) => (
                <div
                  styleName="selected-option"
                  key={index}
                  onClick={() => this.optionClick(option, true)}
                >
                  {option.text} ×
                </div>
              ))}
            </div>
          </div>
        }
        {titles.length > 0 &&
          <div styleName="search-head">
            {
              (showType === 0 && isGrouping && !isSearch) && currentOptions &&
              currentOptions.map((group, index) => (
                <div key={index} styleName={headerSwirchIndex === index ? 'header-switch click-switch' : 'header-switch'} onClick={() => this.handleHeaderSwirch(index)}>{group.text}</div>
              ))
            }
            <input styleName="search-input" type="search" placeholder="请输入关键字" value={keyword} onInput={this.hadnleSearchInput} onFocus={() => this.handleInputControl('onFocus')} onBlur={() => this.handleInputControl('onBlur')} />
          </div>
        }
        <div styleName="table">
          {
            currentOptions ? currentOptions.map((group, index) => (
              (showType === 0 && isGrouping && !isSearch) ?
                (headerSwirchIndex === index && this.getTable(group, index)) :
                this.getTable(group, index)
            )) : <div styleName="no-result">关键字“<span styleName="keyword">{keyword}</span>”，查无结果...</div>
          }
        </div>
      </div>
    );
  }

  render() {
    const {
      titles,
    } = this.props;
    return (
      <div styleName="filter-container" ref={this.handleDomContainer}>
        <div styleName="head-title">
          {
            titles.length === 1 &&
            <div styleName="left-title">{titles[0]}</div>
          }
          <div styleName="right-tag">
            <div styleName="title">车型国别：</div>
            <div styleName="joint-tag">合资&自主</div>
            <div styleName="import-tag">进口</div>
          </div>
        </div>
        {
          titles.length > 1 ?
            <Tabs defaultActiveKey={0} onSelect={this.handleClickTitle}>
              {
                titles.map((title, index) => (
                  <Tab key={index} title={title} eventKey={index}>
                    {this.renderContent()}
                  </Tab>
                ))
              }
            </Tabs> :
            this.renderContent()
        }
        {/* <Tab title="本品及竞品" eventKey={1}>
          {this.renderContent()}
        </Tab>
        <Tab title="细分市场" eventKey={2}>
          {this.renderContent()}
        </Tab>
        <Tab title="品牌" eventKey={3}>
          {this.renderContent()}
        </Tab> */}
      </div>
    );
  }
}

export default HOCDropdownMenu(DropDownMenuBrand, { popupWidth: 600 });
