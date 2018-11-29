import createReducer from 'createReducer';
import {
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
} from '../actions';
import {
  getYearSalesEchartOption,
  getReportYearSalesEchartOption,
} from './echartOption/yearSales';
import {
  getMonthSalesEchartOption,
  getReportMonthSalesEchartOption,
} from './echartOption/yearMonth';
import {
  getMarketSalesEchartOption,
  getReportMarketSalesEchartOption,
} from './echartOption/marketSales';
import getMapEchartOption from './echartOption/mapOption';
import {
  getPriceSalesEchartOption,
  getReportPriceSalesEchartOption,
} from './echartOption/priceSales';
import {
  getMarketSales2EchartOption,
  getReportMarketSales2EchartOption,
} from './echartOption/marketSales2';

export default createReducer({
  CONSTRUCT() {
    return {
      screenShotImgUrl: '',
      totalData: {},
      yearSales: { chart: null },
      monthSales: { chart: null },
      tranditionMonthSales: { chart: null },
      tranditionMarketSales: { charts: [] },
      tranditionTopTen: [],
      tranditionPriceSales: { carList: [], chart: null },
      brandSales: [],
      newEnergyMonthSales: { chart: null },
      newEnergyMarketSales: { charts: [] },
      newEnergyPriceSales: { carList: [], chart: null },
      newEnergyCitySales: { cityList: [], chart: null },
      focusModel: [],
      newCar: {},
    };
  },

  [GET_SCREEN_SHOT](state, { response: { data } }) {
    return { ...state, screenShotImgUrl: data.file };
  },
  [GET_TOTAL_DATAS](state, { response }) {
    return { ...state, totalData: response };
  },
  [GET_YEAR_SALES](state, { response }) {
    const options = {
      ...response,
      chart: getYearSalesEchartOption(response.data),
      reportChart: getReportYearSalesEchartOption(response.data),
    };
    return { ...state, yearSales: options };
  },
  [GET_MONTH_SALES](state, { response }) {
    const options = {
      ...response,
      chart: getMonthSalesEchartOption(response.data, '万辆'),
      reportChart: getReportMonthSalesEchartOption(response.data, '万辆'),
    };
    return { ...state, monthSales: options };
  },
  [GET_TRANDITION_MONTH_SALES](state, { response }) {
    const options = {
      ...response,
      chart: getMonthSalesEchartOption(response.data, '万辆'),
      reportChart: getReportMonthSalesEchartOption(response.data, '万辆'),
    };
    return { ...state, tranditionMonthSales: options };
  },
  [GET_TRANDITION_MARKET_SALES](state, { response }) {
    const options = {
      ...response,
      charts: [
        getMarketSalesEchartOption(response.sedan, 'Sedan', 'carModelSedanImg', response.barHeight),
        getMarketSalesEchartOption(response.suv, 'SUV', 'carModelSUVImg', response.barHeight),
        getMarketSalesEchartOption(response.mpv, 'MPV', 'carModelMPVImg', response.barHeight),
      ],
      reportCharts: [
        getReportMarketSalesEchartOption(response.sedan, 'Sedan', 'carModelSedanImg'),
        getReportMarketSalesEchartOption(response.suv, 'SUV', 'carModelSUVImg'),
        getReportMarketSalesEchartOption(response.mpv, 'MPV', 'carModelMPVImg'),
      ],
    };
    return { ...state, tranditionMarketSales: options };
  },

  [GET_TRANDITION_TOP_TEN](state, { response }) {
    return { ...state, tranditionTopTen: response };
  },
  [GET_TRANDITION_PRICE_SALES](state, { response }) {
    const options = {
      carList: response,
      chart: getPriceSalesEchartOption(response, '万辆'),
      reportChart: getReportPriceSalesEchartOption(response, '万辆'),
    };
    return { ...state, tranditionPriceSales: options };
  },
  [GET_BRAND_SALES](state, { response }) {
    return { ...state, brandSales: response };
  },
  [GET_NEW_ENERGY_MONTH_SALES](state, { response }) {
    const options = {
      ...response,
      chart: getMonthSalesEchartOption(response.data, '辆'),
      reportChart: getReportMonthSalesEchartOption(response.data, '辆'),
    };
    return { ...state, newEnergyMonthSales: options };
  },
  [GET_NEW_ENERGY_MARKET_SALES](state, { response }) {
    const options = {
      ...response,
      charts: [
        getMarketSales2EchartOption(response.sedan, 'Sedan', 'carModelSedanImg', response.barHeight),
        getMarketSales2EchartOption(response.suv, 'SUV', 'carModelSUVImg', response.barHeight),
        getMarketSales2EchartOption(response.mpv, 'MPV', 'carModelMPVImg', response.barHeight),
      ],
      reportCharts: [
        getReportMarketSales2EchartOption(response.sedan, 'Sedan', 'carModelSedanImg'),
        getReportMarketSales2EchartOption(response.suv, 'SUV', 'carModelSUVImg'),
        getReportMarketSales2EchartOption(response.mpv, 'MPV', 'carModelMPVImg'),
      ],
    };
    return { ...state, newEnergyMarketSales: options };
  },
  [GET_NEW_ENERGY_PRICE_SALES](state, { response }) {
    const options = {
      carList: response,
      chart: getPriceSalesEchartOption(response, '辆'),
      reportChart: getReportPriceSalesEchartOption(response, '辆'),
    };
    return { ...state, newEnergyPriceSales: options };
  },
  [GET_NEW_ENERGY_CITY_SALES](state, { response }) {
    const options = {
      cityList: response,
      chart: getMapEchartOption(response),
    };
    return { ...state, newEnergyCitySales: options };
  },
  [GET_FOCUS_MODEL](state, { response }) {
    return { ...state, focusModel: response };
  },
  [GET_NEW_CAR](state, { response }) {
    return { ...state, newCar: response };
  },
});
