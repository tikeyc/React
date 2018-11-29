import ButtonGroup from '../ButtonGroup';

import './style';

export default class CheckboxGroup extends ButtonGroup {
  className = 'checkbox-group'

  handleSelect(value) {
    this.handleSelectCheckbox(value);
  }
}
