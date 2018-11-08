import createActions from '../../helpers/createActions';

export const {
  LOAD_DATE_FILTER,
  loadDateFilter,
} = createActions({
  LOAD_DATE_FILTER: data => ({
    endpoint: {
      url: 'data:date-filters',
      // url: '/base-services-001/first-part/get_A009',
      data,
    },
  }),
}, 'MANUFACTURERBRAND');
