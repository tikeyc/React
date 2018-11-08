import _ from 'lodash';
import $ from 'jquery';
import React, { Component, PropTypes } from 'react';
import './style.less';
import DropdownButton from '../DropdownButton';
import DropdownPanel from '../DropdownPanel';

export default class DropdownMenu extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    style: PropTypes.object,
    buttonStyle: PropTypes.object,
    menuStyle: PropTypes.object,
    options: PropTypes.array,
    onSelect: PropTypes.func,
    text: PropTypes.string,
    button: PropTypes.node,
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    selectedPlaceholder: PropTypes.string,
    placeholder: PropTypes.string,
    onClick: PropTypes.func,
    loading: PropTypes.bool,
    optionRender: PropTypes.func,
    ellipsis: PropTypes.bool,
    hasSelected: PropTypes.bool,
    popoverWidth: PropTypes.number,
    dropdownDirection: PropTypes.string,
    hiddenText: PropTypes.bool,

    left: PropTypes.string,
    top: PropTypes.string,
  };

  static defaultProps = {
    children: null,
    className: '',
    style: {},
    buttonStyle: {},
    menuStyle: {},
    options: [],
    onSelect: undefined,
    text: '',
    button: null,
    disabled: false,
    multiple: false,
    selectedPlaceholder: '',
    placeholder: '',
    onOpen: undefined,
    onClose: undefined,
    onClick: undefined,
    loading: false,
    optionRender: undefined,
    ellipsis: false,
    hasSelected: false,
    popoverWidth: undefined,
    dropdownDirection: '',
    hiddenText: false,
    left: '',
    top: '',
  };

  static defaultProps = {
    className: '',
    onOpen: () => {},
    onClose: () => {},
  }

  constructor(props) {
    super(props);
    this.state = {
      options: props.options,
      trueOptions: props.options,
      open: false,
    };
  }

  componentDidMount() {
    this.mounted = true;

    // 点击下拉菜单以外的部分关闭下拉菜单
    this.listenedCloseDropdownCallback = () => {
      // 模拟 stopImmediatePropagation 效果，兼容IE8
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        if (this.stopOpen) {
          this.stopOpen = false;
          return;
        }
        if (this.mounted && this.state.open) this.handleClose();
        DropdownMenu.prevOpenDropdown = null;
      }, 0);

      // IE8 不支持
      // if (this.state.open) this.handleClose();
      // DropdownMenu.prevOpenDropdown = null;
    };
    $(document)
      .on('click.close-dropdown', this.listenedCloseDropdownCallback);

    const $parentDropdown = $(this.refDropdown).parents('.dropdown');
    $parentDropdown
      .on('click.close-chilren-dropdown', () => {
        if (this.state.open) {
          this.handleClose();
          DropdownMenu.prevOpenDropdown = this.parentDropdown || null;
        }
      });
    // 如果有父弹出框，给子弹出框一个父弹出框的引用
    if ($parentDropdown.length && DropdownMenu.prevOpenDropdown) {
      this.parentDropdown = DropdownMenu.prevOpenDropdown;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.options !== nextProps.options) {
      this.setState({
        options: nextProps.options,
        trueOptions: nextProps.options,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.children !== nextProps.children ||
      this.props.className !== nextProps.className ||
      !_.isEqual(this.props.style, nextProps.style) ||
      !_.isEqual(this.props.menuStyle, nextProps.menuStyle) ||
      this.props.onSelect !== nextProps.onSelect ||
      this.props.text !== nextProps.text ||
      this.props.button !== nextProps.button ||
      this.props.disabled !== nextProps.disabled ||
      this.props.multiple !== nextProps.multiple ||
      this.props.onOpen !== nextProps.onOpen ||
      this.props.onClose !== nextProps.onClose ||
      this.props.selectedPlaceholder !== nextProps.selectedPlaceholder ||
      this.props.placeholder !== nextProps.placeholder ||
      this.props.onClick !== nextProps.onClick ||
      this.props.loading !== nextProps.loading ||
      this.props.optionRender !== nextProps.optionRender ||
      this.props.ellipsis !== nextProps.ellipsis ||
      this.props.hasSelected !== nextProps.hasSelected ||
      this.props.popoverWidth !== nextProps.popoverWidth ||
      this.props.dropdownDirection !== nextProps.dropdownDirection ||
      this.props.hiddenText !== nextProps.hiddenText ||

      this.state.options !== nextState.options ||
      this.state.trueOptions !== nextState.trueOptions ||
      this.state.open !== nextState.open
    );
  }

  componentWillUnmount() {
    $(document).off('click.close-dropdown', this.listenedCloseDropdownCallback);
    $(this.refDropdown).parents('.dropdown').off('click.close-chilren-dropdown');

    this.mounted = false;
  }

  getText() {
    const { trueOptions } = this.state;
    const {
      children,
      text,
      multiple,
      selectedPlaceholder,
      placeholder,
    } = this.props;
    let sText = '';
    if (!children) {
      if (multiple) {
        const selectedCount = this.getSelectedCount();
        if (selectedCount === 1) {
          sText = this.getMultipleTexts(trueOptions);
        } else if (selectedCount > 1) {
          sText = `${selectedPlaceholder || '已选'}(${selectedCount})`;
        }
      } else {
        const selectedOption = trueOptions.find(({ selected }) => selected);
        if (selectedOption) sText = selectedOption.text;
      }
    }
    return text || sText || placeholder || '请选择';
  }

  getSelectedCount() {
    const { hasSelected } = this.props;
    if (_.isBoolean(hasSelected)) return hasSelected;

    const { trueOptions } = this.state;
    const selectedValues = this.getSelectedValues(trueOptions);
    return selectedValues ? selectedValues.split(',').length : 0;
  }

  getSelectedValues(options = []) {
    const values = [];
    options.forEach(({ value, selected, children }) => {
      if (!children) {
        if (selected) values.push(value);
      } else {
        const childrenValus = this.getSelectedValues(children);
        if (childrenValus) values.push(childrenValus);
      }
    });
    return values.join(',');
  }

  getSelectedTexts(options = []) {
    const texts = [];
    options.forEach(({ text, selected, children }) => {
      if (!children) {
        if (selected) texts.push(text);
      } else {
        const childrenTexts = this.getSelectedTexts(children);
        if (childrenTexts) texts.push(childrenTexts);
      }
    });
    return texts.join(',');
  }

  getMultipleTexts(options = []) {
    const texts = [];
    options.forEach(({ text, selected, children }) => {
      if (!children) {
        if (selected) texts.push(text);
      } else {
        const childrenTexts = this.getMultipleTexts(children);
        if (childrenTexts) texts.push(childrenTexts);
      }
    });
    return texts.join(',');
  }

  getHasSelectedClassName() {
    const { hasSelected } = this.props;

    if (!this.props.children) {
      return this.getSelectedCount() > 0 ? 'has-selected' : '';
    }

    return hasSelected ? 'has-selected' : '';
  }

  selectMultipleOption(options, indexs, parent) {
    const theParent = parent;
    const [index, ...restIndex] = indexs;
    const option = options[index];
    // 如果未到达目标层级，继续递归处理
    if (restIndex.length > 0) {
      this.selectMultipleOption(option.children, restIndex, option);
    // 如果到达目标层级，执行选择操作
    } else {
      this.selectOption(option, !option.selected);
    }
    // 如果目标层级有父层，根据相邻兄弟层级选择状态更新父层选择状态
    if (theParent) {
      theParent.selected = options.every(({ selected }) => selected);
    }
  }

  handleToggle = toggle => {
    if (this.refDropdown !== null) {
      this.setState({ open: toggle });
    }
  }

  handleOpen = () => {
    this.handleToggle(true);
    this.setState({ options: this.state.trueOptions });

    // 打开新弹出框时关闭上次打开的弹出框
    this.closePrevOpenDropdown();

    setTimeout(() => {
      this.props.onOpen();
    }, 0);
  }

  handleClose = () => {
    this.handleToggle(false);
    this.props.onClose();
  }

  close = () => {
    this.handleClose();
  }

  closeParentsDropdown(parentDropdown) {
    if (parentDropdown) {
      parentDropdown.handleClose();
      this.closeParentsDropdown(parentDropdown.parentDropdown);
    }
  }

  closePrevOpenDropdown() {
    // 如果当前与上个打开的弹出框不是同一个弹出框
    if (DropdownMenu.prevOpenDropdown !== this) {
      // 如果上个弹出框没有关闭，且上个弹出框不是当前弹出框的父弹出框
      if (DropdownMenu.prevOpenDropdown && !this.parentDropdown) {
        // 关闭上个弹出框
        DropdownMenu.prevOpenDropdown.handleClose();
        // 关闭上个弹出框的所有祖先弹出框
        this.closeParentsDropdown(DropdownMenu.prevOpenDropdown);
      }

      // 上个弹出框操作完成后，当前弹出框置为上个弹出框
      DropdownMenu.prevOpenDropdown = this;
    }
  }

  selectOption(opt, selected) {
    const option = opt;
    option.selected = selected;
    // 选项下的子层一并全选
    if (option.children) {
      option.children.map(child => this.selectOption(child, selected));
    }
  }

  handleSelect(value, text, indexs) {
    const { options } = this.state;
    const { multiple } = this.props;
    let nextOptions;
    if (multiple) {
      nextOptions = $.extend(true, [], options);
      this.selectMultipleOption(nextOptions, indexs);
      this.setState({ options: nextOptions });
    } else {
      nextOptions = options.map(option => ({
        ...option,
        selected: option.value === value,
      }));
      this.setState({ options: nextOptions, trueOptions: nextOptions });
      this.handleSubmit(value, text, nextOptions);
      this.handleClose();
    }
  }

  handleMultipleSubmit = () => {
    const { options } = this.state;
    const { onSelect } = this.props;
    this.setState({ trueOptions: options });
    this.handleClose();
    if (onSelect) {
      onSelect(this.getSelectedValues(options), this.getSelectedTexts(options), options);
    }
  }

  handleSubmit = (value, text, options) => {
    const { onSelect } = this.props;
    this.handleClose();
    if (onSelect) onSelect(value, text, options);
  }

  // 阻止下拉菜单内部点击事件冒泡
  stopPropagation = event => {
    // 模拟 stopImmediatePropagation 效果，兼容IE8
    this.stopOpen = true;

    // IE8 不支持
    // event.nativeEvent.stopImmediatePropagation();

    if ($(event.target).closest('[data-dismiss="dropdown"]').length > 0) {
      this.handleClose();
    }
  }

  dropdown = () => {
    const { disabled, onClick } = this.props;
    if (disabled) return;
    if (onClick) onClick();
    this.handleOpen();
  }

  renderLi(option, indexs) {
    const {
      value,
      text,
      selected,
      children,
    } = option;
    const { multiple, optionRender } = this.props;
    let childrenList;
    if (multiple && children) {
      childrenList = children.map((child, childIndex) => (
        this.renderLi(child, [...indexs, childIndex])
      ));
    }
    const indent = (indexs.length - 1) * 15;

    let style = {};
    if (multiple) {
      style = {
        paddingLeft: indent + 30,
        backgroundPositionX: indent + 10,
      };
    }

    return [
      value != null ? (
        <li
          className={`dropdown-menu-option ${selected ? 'selected' : ''}`}
          data-dropdown-option
        >
          <a
            style={style}
            onClick={() => {
              if (multiple || !selected) this.handleSelect(value, text, indexs);
            }}
          >
            {!optionRender ? text : optionRender(option)}
          </a>
        </li>
      ) : (
        <li
          className="dropdown-menu-text"
          data-dropdown-option
        >
          {!optionRender ? text : optionRender(option)}
        </li>
      ),
      childrenList,
    ];
  }

  renderDropdownMenu() {
    const { options } = this.state;

    return (
      <div className="dropdown-menu-scroller">
        {this.props.hiddenText &&
          <div className="dropdown-menu-scroller-top">数据标签</div>
        }
        <ul>
          {options.map((option, index) => this.renderLi(option, [index]))}
        </ul>
      </div>
    );
  }

  render() {
    const { open } = this.state;
    const {
      children,
      className,
      style,
      buttonStyle,
      menuStyle,
      button,
      disabled,
      multiple,
      loading,
      ellipsis,
      popoverWidth,
      dropdownDirection,
      hiddenText,
      left,
      top,
    } = this.props;

    const hasSelectedClass = this.getHasSelectedClassName();

    return (
      <div
        className={[
          'dropdown',
          open ? 'open' : '',
          className,
          disabled ? 'disabled' : '',
          hasSelectedClass,
          ellipsis ? 'ellipsis' : '',
          dropdownDirection ? `dropdown-menu-${dropdownDirection}` : '',
        ].join(' ')}
        style={style}
        ref={ref => { this.refDropdown = ref; }}
        onClick={this.stopPropagation}
      >
        {
          !button ? (
            <DropdownButton
              className="btn-block"
              style={buttonStyle}
              onClick={this.dropdown}
            >
              {!hiddenText && this.getText()}
            </DropdownButton>
          ) : (
            <div
              onClick={this.handleOpen}
            >
              {button}
            </div>
          )
        }
        <div
          className={`dropdown-menu ${multiple ? 'multiple' : 'no-multiple'}`}
          style={{
            width: popoverWidth || 'auto',
            ...menuStyle,
            left,
            top,
          }}
        >
          {loading &&
            <div className="loading-box">
              <div className="loading-icon" />
            </div>
          }
          {(() => {
            if (children) {
              return children;
            } else if (multiple) {
              return (
                <DropdownPanel
                  multiple
                  onSubmit={this.handleMultipleSubmit}
                >
                  {this.renderDropdownMenu()}
                </DropdownPanel>
              );
            }
            return this.renderDropdownMenu();
          })()}
        </div>
      </div>
    );
  }
}
