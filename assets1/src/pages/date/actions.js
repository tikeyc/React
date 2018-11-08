import createActions from '../../helpers/createActions';

export const {
  LOAD_DATE_FILTER,
  loadDateFilter,
  RESET_DATE,
  resetDate,
  UPDATE_DATE,
  updateDate,
} = createActions({
  RESET_DATE: () => ({
  }),

  LOAD_DATE_FILTER: () => ({
    endpoint: {
      url: 'data:date-filters',
      // url: '/base-services-001/first-part/get_A007',
    },
  }),

  UPDATE_DATE: select => ({
    select,
  }),
}, 'DATE');
