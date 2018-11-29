import $ from 'jquery';
// import React, { Component, PropTypes } from 'react';

import './style';

// $(document).on('mouseenter', '[data-tooltip]', function () {
// });

// export default class Tooltip extends Component {
//   static propTypes = {
//     contents: PropTypes.array,
//   }
//
//   abc() {}
//
//   render() {
//     const { contents } = this.props;
//
//     return (
//       <div className="tooltips">
//         {contents.map((content, index) => (
//           <div key={index} show>
//             <div className="tooltip bottom danger">
//               <div className="tooltip-arrow tooltip-arrow-border" />
//               <div className="tooltip-arrow" />
//               <div className="tooltip-inner">{content}</div>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }
// }

export default class Tooltip {
  constructor({ target, content = '' }) {
    this.$target = $(target);
    this.content = content;
  }

  getNode(content) {
    return $(`
      <div class="tooltip bottom danger">
        <div class="tooltip-arrow tooltip-arrow-border" />
        <div class="tooltip-arrow" />
        <div class="tooltip-inner">${content || this.content}</div>
      </div>
    `);
  }

  show(content) {
    this.hide();

    let { top, left } = this.$target.offset();

    this.$node = this.getNode(content);

    $('body').append(this.$node);

    top += this.$target.outerHeight();
    left += (this.$target.outerWidth() - this.$node.outerWidth()) / 2;

    this.$node.css({ top, left });
  }

  hide() {
    if (this.$node) this.$node.remove();
  }
}
