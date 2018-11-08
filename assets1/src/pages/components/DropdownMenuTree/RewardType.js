import HOCDropdownMenu from '../HOCDropdownMenu';
import DropdownMenuTree from './index';

export default HOCDropdownMenu(DropdownMenuTree, {
  popupWidth: 700,
  resetBtnText: '重置',
  title: '奖励类型',
  search: false,
  placeholderKeyword: '请输入城市关键字',
});
