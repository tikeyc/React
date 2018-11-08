import React, { Component, PropTypes } from 'react';
import Option from '../HOCDropdownMenu/Option';

export default class Grid extends Component {
  static propTypes = {
    isRoot: PropTypes.bool,
    option: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isRoot: false,
  };

  render() {
    const { isRoot, option, onChange } = this.props;

    if (option.show !== false && option.children && option.children.length) {
      return (
        <table className={isRoot ? 'is-root' : ''}>
          <tbody>
            <tr>
              <td>
                {option.value !== ' ' &&
                  <Option option={option} onChange={onChange} />
                }
                {option.value === ' ' &&
                  <div style={{ margin: '5px 10px', color: '#aaa' }}>
                    {option.text}
                  </div>
                }
              </td>
              <td className="children">
                {option.children.map(item => (
                  <Grid
                    key={item.value}
                    option={item}
                    onChange={onChange}
                  />
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      );
    }
    return option.show !== false ? <Option option={option} onChange={onChange} /> : <span />;
  }
}
