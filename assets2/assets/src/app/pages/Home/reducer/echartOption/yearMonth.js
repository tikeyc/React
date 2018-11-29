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

function getMonthSalesEchartOption(data, unit) {
  if (!data) {
    return null;
  }
  const growth = [];
  const sales = [];
  for (let i = 0; i < data.length; i += 1) {
    growth[i] = data[i].growth;
    sales[i] = data[i].sales;
  }

  const date = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
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
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
          alignWithLabel: true,
        },
        axisLine: {
          show: false,
        },
      },
    ],
    yAxis: [
      {
        show: false,
        type: 'value',
        boundaryGap: ['150%', '30%'],
      },
      {
        name: unit,
        show: true,
        type: 'value',
        boundaryGap: [0, '350%'],
        position: 'left',
        axisLabel: {
          show: false,
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
        name: '同比',
        yAxisIndex: 0,
        type: 'line',
        barWidth: 10,
        data: growth,
        symbol: 'circle',
        symbolSize: 10,
        label: {
          show: true,
          position: 'top',
          color: '#000000',
          formatter: '{c}%',
        },
        itemStyle: {
          color: '#7a9344',
        },
        lineStyle: {
          width: 4,
        },
      },
      {
        name: '累计销量',
        yAxisIndex: 1,
        type: 'bar',
        barWidth: 10,
        data: sales,
        itemStyle: {
          barWidth: 10,
          barBorderRadius: 10,
          color: '#7a9344',
        },
        label: {
          show: true,
          position: 'top',
          color: '#000000',
          formatter: item => formatNum(item.data),
        },
      },
    ],
  };
}

function getReportMonthSalesEchartOption(data, unit) {
  if (!data) {
    return null;
  }
  const growth = [];
  const sales = [];
  for (let i = 0; i < data.length; i += 1) {
    growth[i] = data[i].growth;
    sales[i] = data[i].sales;
  }

  const date = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
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
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
          alignWithLabel: true,
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
        show: false,
        type: 'value',
        boundaryGap: ['150%', '30%'],
      },
      {
        name: unit,
        show: true,
        type: 'value',
        boundaryGap: [0, '350%'],
        position: 'left',
        nameTextStyle: {
          fontSize: 28,
        },
        axisLabel: {
          show: false,
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
        name: '同比',
        yAxisIndex: 0,
        type: 'line',
        data: growth,
        symbol: 'circle',
        symbolSize: 20,
        label: {
          show: true,
          position: 'top',
          color: '#000000',
          fontSize: 28,
          formatter: '{c}%',
        },
        itemStyle: {
          color: '#7a9344',
        },
        lineStyle: {
          width: 8,
        },
      },
      {
        name: '累计销量',
        yAxisIndex: 1,
        type: 'bar',
        barWidth: 20,
        data: sales,
        itemStyle: {
          barWidth: 20,
          barBorderRadius: 20,
          color: '#7a9344',
        },
        label: {
          show: true,
          position: 'top',
          color: '#000000',
          fontSize: 28,
          formatter: item => formatNum(item.data),
        },
      },
    ],
  };
}

export {
  getMonthSalesEchartOption,
  getReportMonthSalesEchartOption,
};
