import HOCDropdownMenu from '../HOCDropdownMenu';
import DropdownMenuTree from './index';

export default HOCDropdownMenu(DropdownMenuTree, {
  popupWidth: 690,
  resetBtnText: '重置',
  title: '细分市场',
  search: false,
  placeholderKeyword: '请输入城市关键字',
});
