import HOCDropdownMenu from '../HOCDropdownMenu';
import DropdownMenuTree from './index';

export default HOCDropdownMenu(DropdownMenuTree, {
  popupWidth: 600,
  resetBtnText: '取消',
  title: '细分市场',
  search: false,
  placeholderKeyword: '请输入城市关键字',
});
