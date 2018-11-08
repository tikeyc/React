import 'echarts/map/js/china';
import Chart from './index';

export default class MapChart extends Chart {
  getOptions() {
    const { options: originalOptions, options: { series: originalSeries } } = this.props;

    if (!originalSeries) return originalOptions;

    let series = originalSeries;
    if (!Array.isArray(originalSeries)) {
      series = [originalSeries];
    }
    if (series.length > 0) {
      series = series.map(item => {
        if (item.type === 'map') {
          const { map, mapLevel } = item;
          return {
            ...item,
            map: mapLevel === 'city' ? map.replace(/市$/, '') : map,
            mapSource: `${mapLevel}/${map}`,
          };
        }
        return item;
      });
    }
    if (!Array.isArray(originalSeries)) {
      [series] = series;
    }

    return {
      ...originalOptions,
      series,
    };
  }

  draw() {
    const options = this.getOptions();
    const { series } = options;
    if (series) {
      const mapSeries = series.filter(({ type, map }) => type === 'map' && map !== 'china');
      if (mapSeries.length > 0) {
        mapSeries.forEach(({ mapSource, mapLevel }) => {
          if (mapLevel === 'province') {
            require.ensure([], require => {
              require(`echarts/map/js/province/${mapSource.split('/')[1]}.js`);
              this.drawChart(options);
            });
          } else if (mapLevel === 'city') {
            require.ensure([], require => {
              require(`echarts/map/js/city/${mapSource.split('/')[1]}.js`);
              this.drawChart(options);
            });
          }
        });
        // require.ensure([], require => {
        //   mapSeries.forEach(({ mapSource }) => {
        //     require(`echarts/map/js/${mapSource}.js`);
        //   });
        //   this.drawChart(options);
        // });
        return null;
      }
    }

    this.drawChart(this.props.options);
    return null;
  }
}
