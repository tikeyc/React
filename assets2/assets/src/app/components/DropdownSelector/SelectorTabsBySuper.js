import React, { Component, PropTypes } from 'react';

import './style';
import DropdownMenu from '../../../components/DropdownMenu';
import DropdownPanel from '../../../components/DropdownPanel';
import Tabs from '../../../components/Tabs';
import Tab from '../../../components/Tab';

export default class SelectorTabsBySuper extends Component {
  static propTypes = {
    className: PropTypes.string,
    options: PropTypes.array.isRequired,
    required: PropTypes.bool,
    multiple: PropTypes.bool,
    tabs: PropTypes.array,
  }

  constructor(props) {
    super(props);

    const { options } = props;

    this.state = {
      submited: false,

      tabActiveKey: 0,

      // 原始活动 tabActiveKey，用于标记最后确定选择的 Tab 页
      originalTabActiveKey: 0,

      // 被操作的选项数据
      options,

      // 原始选项数据，
      // 用于不点确定就关闭弹出框时，还原之前状态。
      originalOptions: options,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.onComponentWillReceiveProps(nextProps);
  }

  onComponentWillReceiveProps(nextProps) {
    const { options } = nextProps;

    // 外部 options 变更时更新本地 options 与 originalOptions
    if (this.props.options !== options) {
      this.setState({ originalOptions: options, options });
    }
  }

  getActiveOptions() {
    const { tabActiveKey, options } = this.state;
    return options[tabActiveKey];
  }

  getActiveOriginalOptions() {
    const { tabActiveKey, originalOptions } = this.state;
    return originalOptions[tabActiveKey];
  }

  getOriginalActiveOriginalOptions() {
    const { originalTabActiveKey, originalOptions } = this.state;
    return originalOptions[originalTabActiveKey];
  }

  /**
   * 获取已确定选择项个数
   * @return {number} 已确定选择项个数
   */
  getSelectedOriginalOptionsCount() {
    const options = this.getOriginalActiveOriginalOptions();
    const ids = this.getSelectedIds(options, this.state.originalTabActiveKey);
    return ids ? ids.split(',').length : 0;
  }

  /**
   * 获取当前弹框的已选项（已选但未被确定的选项）个数
   * @return {number} 当前弹框的已选项（已选但未被确定的选项）个数
   */
  getSelectedOptionsCount() {
    const options = this.getActiveOptions();
    const ids = this.getSelectedIds(options, this.state.tabActiveKey);
    return ids ? ids.split(',').length : 0;
  }

  getSelectedTexts = (options, tabActiveKey) => (
    this.getSelectedOptions(options, tabActiveKey).map(option => option.text).join(',')
  )

  getSelectedIds = (options, tabActiveKey) => (
    this.getSelectedOptions(options, tabActiveKey).map(option => option.id).join(',')
  )

  getSelectedLevel = (options, tabActiveKey) => {
    const selectedOptions = this.getSelectedOptions(options, tabActiveKey);
    return selectedOptions.length > 0 ? selectedOptions[0].level : undefined;
  }

  getToggleText(selectedCount) {
    if (selectedCount === 1) {
      const options = this.getActiveOriginalOptions();
      return this.getSelectedTexts(options, this.state.tabActiveKey);
    } else if (selectedCount > 1) {
      return `${this.selectedText}(${selectedCount})`;
    }
    return '';
  }

  /**
   * 获取当前 Tab 提示内容
   */
  getTips() {
    if (this.props.required && !this.getSelectedOptionsCount()) {
      return '请至少选择一个有效选项';
    }
    return '';
  }

  /**
   * 用于改变选项但没有点击确定就关闭弹出框时，
   * 还原之前已被确定的选项状态
   */
  restoreOptions = () => {
    const { submited, originalOptions } = this.state;

    // 如果上次操作没有提交，还原选择状态
    if (!submited) {
      this.setState({
        options: originalOptions,
      });
    } else {
      this.setState({ submited: false });
    }
  }

  select(i, nextOptions) {
    const options = this.state.options.map((options, index) => (
      index === i ? nextOptions : options
    ));
    this.setState({ options });
  }

  render() {
    const { tabs } = this;
    const { tabActiveKey } = this.state;
    const { className = '', multiple, tabs: tabsOptions } = this.props;
    const selectedCount = this.getSelectedOriginalOptionsCount();
    const toggleText = this.getToggleText(selectedCount);
    const footerTips = this.getTips();

    return (
      <DropdownMenu
        multiple={multiple}
        className={`dropdown-menu-selector ${this.className || ''} ${className} ${selectedCount > 0 ? 'has-selected' : ''}`}
        placeholder={this.placeholder}
        text={toggleText}
        menuStyle={{ width: this.popoverWidth || 600 }}
        ref={ref => { this.refElm = ref; }}
        onOpen={this.restoreOptions}
      >
        <DropdownPanel
          onSubmit={this.submit}
          onReset={() => this.resetOptions(tabActiveKey)}
          footerTips={footerTips}
          multiple={multiple}
        >
          <Tabs
            activeKey={tabActiveKey}
            onSelect={tabActiveKey => this.setState({ tabActiveKey })}
          >
            { (tabsOptions || tabs).map(({ title }, index) => (
              <Tab key={index} title={title} eventKey={index}>
                {tabActiveKey === index && this.getContent(tabActiveKey)}
              </Tab>
            ))}
          </Tabs>
        </DropdownPanel>
      </DropdownMenu>
    );
  }
}
