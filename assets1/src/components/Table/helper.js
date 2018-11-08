import _ from 'lodash';

export const getFixed = fixed => (fixed === true ? 'left' : fixed);

export const getRowKey = (row, rowKey) => {
  if (!rowKey) return 'key';
  if (_.isFunction(rowKey)) {
    return rowKey(row);
  }
  return rowKey;
};
