function formatNum(strNum) {
  if (strNum === '-') {
    return '';
  }
  if (strNum.length <= 3) {
    return strNum;
  }
  if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(strNum)) {
    return strNum;
  }
  let a = RegExp.$1;
  let b = RegExp.$2;
  const c = RegExp.$3;
  const re = new RegExp();
  re.compile('(\\d)(\\d{3})(,|$)');
  while (re.test(b)) {
    b = b.replace(re, '$1,$2$3');
  }
  a += '';
  a += b;
  a += '';
  a += c;
  // a + '' + b + '' + c
  return a;
}

function getYearSalesEchartOption(data) {
  if (data) {
    const date = [];
    const sales = [];
    for (let i = 0; i < data.length; i += 1) {
      date[i] = data[i].year;
      sales[i] = data[i].sales;
    }

    return {
      grid: {
        left: '0',
        right: '0',
        top: '30',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: date,
          axisTick: {
            show: false,
            alignWithLabel: true,
            interval: 1,
          },
          axisLine: {
            show: false,
          },
        },
      ],
      yAxis: [
        {
          name: '万辆',
          show: true,
          type: 'value',
          position: 'left',
          axisLabel: {
            show: true,
            color: 'rgba(255,255,255,0)',
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: '累计销量',
          type: 'line',
          data: sales,
          symbol: 'circle',
          symbolSize: 10,
          label: {
            show: true,
            position: 'top',
            color: '#000000',
            formatter: item => formatNum(item.data),
          },
          itemStyle: {
            color: '#7a9344',
          },
          lineStyle: {
            width: 4,
          },
        },
      ],
    };
  }
  return null;
}

function getReportYearSalesEchartOption(data) {
  if (data) {
    const date = [];
    const sales = [];
    for (let i = 0; i < data.length; i += 1) {
      date[i] = data[i].year;
      sales[i] = data[i].sales;
    }

    return {
      animation: false,
      grid: {
        left: '0',
        right: '0',
        top: '40',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: date,
          axisTick: {
            show: false,
            alignWithLabel: true,
            interval: 1,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            show: true,
            fontSize: 28,
            interval: 0,
          },
        },
      ],
      yAxis: [
        {
          name: '万辆',
          show: true,
          type: 'value',
          position: 'left',
          nameTextStyle: {
            fontSize: 28,
          },
          axisLabel: {
            show: true,
            color: 'rgba(255,255,255,0)',
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: '累计销量',
          type: 'line',
          data: sales,
          symbol: 'circle',
          symbolSize: 20,
          label: {
            show: true,
            position: 'top',
            color: '#000000',
            fontSize: 28,
            formatter: item => formatNum(item.data),
          },
          itemStyle: {
            color: '#7a9344',
          },
          lineStyle: {
            width: 8,
          },
        },
      ],
    };
  }
  return null;
}

export {
  getYearSalesEchartOption,
  getReportYearSalesEchartOption,
};
