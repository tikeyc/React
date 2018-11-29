import createActions from 'createActions';

export const {
  GET_SCREEN_SHOT,
  GET_TOTAL_DATAS,
  GET_YEAR_SALES,
  GET_MONTH_SALES,
  GET_TRANDITION_MONTH_SALES,
  GET_TRANDITION_MARKET_SALES,
  GET_TRANDITION_TOP_TEN,
  GET_TRANDITION_PRICE_SALES,
  GET_BRAND_SALES,
  GET_NEW_ENERGY_MONTH_SALES,
  GET_NEW_ENERGY_MARKET_SALES,
  GET_NEW_ENERGY_PRICE_SALES,
  GET_NEW_ENERGY_CITY_SALES,
  GET_FOCUS_MODEL,
  GET_NEW_CAR,
  getScreenShot,
  getTotalDatas,
  getYearSales,
  getMonthSales,
  getTranditionMonthSales,
  getTranditionMarketSales,
  getTranditionTopTen,
  getTranditionPriceSales,
  getBrandSales,
  getNewEnergyMonthSales,
  getNewEnergyMarketSales,
  getNewEnergyPriceSales,
  getNewEnergyCitySales,
  getFocusModel,
  getNewCar,
} = createActions({
  GET_SCREEN_SHOT: (data = '') => ({
    endpoint: {
      type: 'POST',
      url: 'http://10.11.2.159:3008/api/screenshot',
      data,
    },
  }),
  GET_TOTAL_DATAS: () => ({
    endpoint: `${window.$ctx}/assets/static/data/date.json`,
    // endpoint: '/getTotalData.do',
  }),
  GET_YEAR_SALES: () => ({
    // endpoint: 'data:dashboard/data',
    endpoint: '/getYearSales.do',
  }),
  GET_MONTH_SALES: () => ({
    // endpoint: 'data:dashboard/data',
    endpoint: '/getMonthSales.do',
  }),
  GET_TRANDITION_MONTH_SALES: () => ({
    // endpoint: 'data:dashboard/data',
    endpoint: '/getTranditionMonthSales.do',
  }),
  GET_TRANDITION_MARKET_SALES: () => ({
    // endpoint: 'data:dashboard/data',
    endpoint: '/getTranditionMarketSales.do',
  }),
  GET_TRANDITION_TOP_TEN: () => ({
    // endpoint: 'data:dashboard/data',
    endpoint: '/getTraditionTop10.do',
  }),
  GET_TRANDITION_PRICE_SALES: () => ({
    // endpoint: 'data:dashboard/data',
    endpoint: '/getTraditionPriceSales.do',
  }),
  GET_BRAND_SALES: () => ({
    // endpoint: 'data:dashboard/data',
    endpoint: '/getBrandSales.do',
  }),
  GET_NEW_ENERGY_MONTH_SALES: () => ({
    // endpoint: 'data:dashboard/data',
    endpoint: '/getNewEnergyMonthSales.do',
  }),
  GET_NEW_ENERGY_MARKET_SALES: () => ({
    // endpoint: 'data:dashboard/data',
    endpoint: '/getNewEnergyMarketSales.do',
  }),
  GET_NEW_ENERGY_PRICE_SALES: () => ({
    // endpoint: 'data:dashboard/data',
    endpoint: '/getNewEnergyPriceSales.do',
  }),
  GET_NEW_ENERGY_CITY_SALES: () => ({
    // endpoint: 'data:dashboard/data',
    endpoint: '/getNewEnergyCitySales.do',
  }),
  GET_FOCUS_MODEL: () => ({
    // endpoint: 'data:dashboard/data',
    endpoint: '/getFocusModel.do',
  }),
  GET_NEW_CAR: () => ({
    // endpoint: 'data:dashboard/data',
    endpoint: '/getNewCar.do',
  }),
}, 'DASHBOARD');
