import HOCDropdownMenu from '../HOCDropdownMenu';
import DropdownMenuTree from './index';

export default HOCDropdownMenu(DropdownMenuTree, {
  popupWidth: 600,
  resetBtnText: '取消',
  title: '子车型选择',
  search: false,
  placeholderKeyword: '请输入城市关键字',
});
