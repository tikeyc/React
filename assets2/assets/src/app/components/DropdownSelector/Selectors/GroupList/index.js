import React, { PropTypes } from 'react';

import DropdownSelector from '../../index';
import GroupList from '../../PopoverContent/GroupList';
import SelectorSuper from '../../SelectorSuper';

export default class GroupListSelector extends SelectorSuper {
  static propTypes = {
    className: PropTypes.string,
    multiple: PropTypes.bool,
    onSelect: PropTypes.func.isRequired,
  }

  getContent() {
    const { multiple } = this.props;
    const { options } = this.state;
    return (
      <GroupList
        options={options}
        multiple={multiple}
        onSelect={this.select}
      />
    );
  }

  render() {
    const {
      className = '',
      multiple,
    } = this.props;

    const selectedCount = this.getSelectedOriginalOptionsCount();
    const toggleText = this.getToggleText(selectedCount);

    return (
      <DropdownSelector
        placeholder={this.placeholder}
        multiple={multiple}
        className={className}
        width={500}
        onSubmit={this.submit}
        onRestore={this.restore}
        toggleText={toggleText}
        ref={ref => { this.refElm = ref; }}
      >
        {this.getContent()}
      </DropdownSelector>
    );
  }
}
