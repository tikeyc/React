import React, { Component, PropTypes } from 'react';
import HOCDropdownMenu from '../../components/HOCDropdownMenu';

import './style.less';

class DropDownMenuMarket extends Component {
  static propTypes = {
    onChangeValue: PropTypes.func.isRequired,
    options: PropTypes.object.isRequired,
  }

  state = {
    options: { children: [] },
    selectedOption: [],
  }

  componentWillReceiveProps(nextProps) {
    const {
      options,
    } = nextProps;
    this.setState({ options });
  }

  getSelectedOptions = () => []

  getNextOptions = (selectedOption, options = this.props.options) => options

  handleClickItem = item => {
    const {
      options,
      selectedOption,
    } = this.state;
    item.checked = !item.checked;
    // console.log('handleClickItem', item);
    if (item.checked && !selectedOption.includes(item.value)) {
      selectedOption.push(item);
      // console.log('selectedOption', selectedOption);
      this.setState({ selectedOption });
      this.props.onChangeValue(selectedOption);
    } else {
      const newSelectedOption = selectedOption.filter(option => option.value !== item.value);
      // console.log('newSelectedOption', newSelectedOption);
      this.setState({ selectedOption: newSelectedOption });
      this.props.onChangeValue(newSelectedOption);
    }
    this.setState({ options });
  }

  render() {
    const {
      options,
    } = this.state;
    // console.log(1111111111, options);

    return (
      <div styleName="filter-container">
        <div styleName="content">
          <div styleName="table">
            {options &&
              <table>
                <tbody>
                  <tr>
                    <td rowSpan={options.children.length + 1}>
                      <div styleName="item">
                        <span
                          styleName={options.checked ? 'checked-tag' : 'unchecked-tag'}
                          onClick={() => this.handleClickItem(options)}
                        >
                          {options.checked ? '☑' : '☐'}
                        </span>
                        {options.text}
                      </div>
                    </td>
                  </tr>
                  {
                    options.children.map((item1, index1) => (
                      <tr key={index1}>
                        <td>
                          <div styleName="item">
                            <span
                              styleName={item1.checked ? 'checked-tag' : 'unchecked-tag'}
                              onClick={() => this.handleClickItem(item1)}
                            >
                              {item1.checked ? '☑' : '☐'}
                            </span>
                            {item1.text}
                          </div>
                        </td>
                        <td>
                          {
                            item1.children.map((item2, index2) => (
                              <div key={index2} styleName="item sub-item" >
                                <span
                                  styleName={item2.checked ? 'checked-tag' : 'unchecked-tag'}
                                  onClick={() => this.handleClickItem(item2)}
                                >
                                  {item2.checked ? '☑' : '☐'}
                                </span>
                                {item2.text}
                              </div>
                            ))
                          }
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default HOCDropdownMenu(DropDownMenuMarket, { popupWidth: 500, title: '细分市场' });
