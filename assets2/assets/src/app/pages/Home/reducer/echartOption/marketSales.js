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

function getMarketSalesEchartOption(data, name, carModalImg, barHeight) {
  if (!data) {
    return null;
  }

  const date = [];
  const growth = [];
  const sales = [];
  for (let i = 0; i < data.length; i += 1) {
    date[i] = data[i].levelName;
    growth[i] = data[i].growth;
    sales[i] = data[i].sales;
  }

  const h = barHeight;
  // for (let i = 0; i < sales.length; i += 1) {
  //   if (parseInt(h, 10) < parseInt(sales[i], 10)) {
  //     h = parseInt(sales[i], 10);
  //   }
  // }
  // h = parseInt(h, 10) + (parseInt(h, 10) * 0.3);
  const height = [];
  for (let i = 0; i < sales.length; i += 1) {
    height[i] = h - sales[i];
  }
  let showUnit = false;
  if (name === 'Sedan') {
    showUnit = true;
  }
  return {
    carModalName: name,
    carModalImgClassName: carModalImg,
    grid: {
      left: '0',
      right: '0',
      top: '30',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      interval: 0,
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
    yAxis: [
      {
        show: false,
        type: 'value',
        boundaryGap: ['500%', '0%'],
      },
      {
        name: '万辆',
        show: showUnit,
        type: 'value',
        boundaryGap: ['0%', '95%'],
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
        type: 'line',
        yAxisIndex: 0,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 4,
        },
        itemStyle: {
          color: '#7a9344',
        },
        data: growth,
        label: {
          show: true,
          position: 'top',
          color: '#000000',
          formatter: '{c}%',
        },
      },
      {
        name: '销量',
        type: 'bar',
        yAxisIndex: 1,
        stack: 'sum0',
        data: sales,
        barWidth: 14,
        itemStyle: {
          barWidth: 10,
          color: '#7a9344',
          borderColor: '#7a9344',
          borderWidth: 1,
        },
        label: {
          show: true,
          position: 'top',
          color: '#000000',
          formatter: item => formatNum(item.data),
        },
      },
      {
        name: '销量',
        type: 'bar',
        yAxisIndex: 1,
        stack: 'sum0',
        data: height,
        barWidth: 14,
        itemStyle: {
          normal: {
            barWidth: 10,
            color: 'rgba(255,255,255,0.1)',
            borderColor: '#7a9344',
            borderWidth: 1,
          },
        },
        label: {
          show: false,
          position: 'insideTop',
          color: '#000000',
        },
      },
    ],
  };
}
function getReportMarketSalesEchartOption(data, name, carModalImg) {
  if (!data) {
    return null;
  }

  const date = [];
  const growth = [];
  const sales = [];
  for (let i = 0; i < data.length; i += 1) {
    date[i] = data[i].levelName;
    growth[i] = data[i].growth;
    sales[i] = data[i].sales;
  }

  let h = 0;
  for (let i = 0; i < sales.length; i += 1) {
    if (parseInt(h, 10) < parseInt(sales[i], 10)) {
      h = parseInt(sales[i], 10);
    }
  }
  h = parseInt(h, 10) + (parseInt(h, 10) * 0.3);
  const height = [];
  for (let i = 0; i < sales.length; i += 1) {
    height[i] = h - sales[i];
  }
  let showUnit = false;
  if (name === 'Sedan') {
    showUnit = true;
  }
  return {
    carModalName: name,
    carModalImgClassName: carModalImg,
    animation: false,
    grid: {
      left: '0',
      right: '0',
      top: '40',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      interval: 0,
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
    yAxis: [
      {
        show: false,
        type: 'value',
        boundaryGap: ['150%', '0%'],
      },
      {
        name: '万辆',
        show: showUnit,
        type: 'value',
        boundaryGap: ['0%', '150%'],
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
        type: 'line',
        yAxisIndex: 0,
        symbol: 'circle',
        symbolSize: 20,
        lineStyle: {
          width: 8,
        },
        itemStyle: {
          color: '#7a9344',
        },
        data: growth,
        label: {
          show: true,
          position: 'top',
          color: '#000000',
          fontSize: 28,
          formatter: '{c}%',
        },
      },
      {
        name: '销量',
        type: 'bar',
        yAxisIndex: 1,
        stack: 'sum0',
        data: sales,
        barWidth: 28,
        itemStyle: {
          barWidth: 20,
          color: '#7a9344',
          borderColor: '#7a9344',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'top',
          color: '#000000',
          fontSize: 28,
          formatter: item => formatNum(item.data),
        },
      },
      {
        name: '销量',
        type: 'bar',
        yAxisIndex: 1,
        stack: 'sum0',
        data: height,
        barWidth: 28,
        itemStyle: {
          normal: {
            barWidth: 20,
            color: 'rgba(255,255,255,0.1)',
            borderColor: '#7a9344',
            borderWidth: 2,
          },
        },
        label: {
          show: false,
          position: 'insideTop',
          color: '#000000',
          fontSize: 28,
        },
      },
    ],
  };
}
export {
  getMarketSalesEchartOption,
  getReportMarketSalesEchartOption,
};
