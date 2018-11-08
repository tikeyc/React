// fix touch to scroll background page on iOS
// https://github.com/ant-design/ant-design-mobile/issues/307
// https://github.com/ant-design/ant-design-mobile/issues/163
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);

export default () => {
  let maskProps;
  if (isIPhone) {
    // Note: the popup content will not scroll.
    maskProps = {
      onTouchStart: e => e.preventDefault(),
    };
  }
  return maskProps;
};
