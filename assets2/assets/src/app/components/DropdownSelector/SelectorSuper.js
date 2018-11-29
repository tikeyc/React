import { PropTypes, Component } from 'react';

import './style';

export default class SelectorSuper extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    required: PropTypes.bool,
    onSelect: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    const { options } = props;

    this.state = {
      submited: false,

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

  /**
   * 获取已确定选择项个数
   * @return {number} 已确定选择项个数
   */
  getSelectedOriginalOptionsCount() {
    const { originalOptions } = this.state;
    const ids = this.getSelectedIds(originalOptions);
    return ids ? ids.split(',').length : 0;
  }

  /**
   * 获取当前弹框的已选项（已选但未被确定的选项）个数
   * @return {number} 当前弹框的已选项（已选但未被确定的选项）个数
   */
  getSelectedOptionsCount() {
    const { options } = this.state;
    const ids = this.getSelectedIds(options);
    return ids ? ids.split(',').length : 0;
  }

  getSelectedTexts = options => (
    this.getSelectedOptions(options).map(option => option.text).join(',')
  )

  getSelectedIds = options => (
    this.getSelectedOptions(options).map(option => option.id).join(',')
  )

  getSelectedLevel = options => {
    const selectedOptions = this.getSelectedOptions(options);
    return selectedOptions.length > 0 ? selectedOptions[0].level : undefined;
  }

  getToggleText(selectedCount) {
    if (selectedCount === 1) {
      const { originalOptions } = this.state;
      return this.getSelectedTexts(originalOptions);
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

  select = options => {
    this.setState({ options });
  }

  /**
   * 用于改变选项但没有点击确定就关闭弹出框时，
   * 还原之前已被确定的选项状态
   */
  restore = () => {
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

  submit = () => {
    const { options } = this.state;
    const { required } = this.props;
    const ids = this.getSelectedIds(options);

    if (required && !ids) return;

    // 提交时，将已选但未确定的状态更新为实际选择状态
    this.setState({
      originalOptions: options,
      submited: true,
    });
    const texts = this.getSelectedTexts(options);
    this.props.onSelect(
      {
        ids,
        texts,
      },
      this.getSelectedOptions(options),
      options,
    );
    this.refElm.close();
  }

  // render() {
  //   const {
  //     className = '',
  //     multiple,
  //   } = this.props;
  //   const { options } = this.state;

  //   const selectedCount = this.getSelectedOriginalOptionsCount();
  //   const toggleText = this.getToggleText(selectedCount);

  //   return (
  //     <DropdownSelector
  //       placeholder={this.placeholder}
  //       multiple={multiple}
  //       className={className}
  //       width={500}
  //       onSubmit={this.submit}
  //       onRestore={this.restore}
  //       toggleText={toggleText}
  //       ref={ref => { this.refElm = ref; }}
  //     >
  //       <GroupList
  //         options={options}
  //         multiple={multiple}
  //         onSelect={this.select}
  //       />
  //     </DropdownSelector>
  //   );
  // }
}
