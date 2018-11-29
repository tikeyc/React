export default function getMapEchartOption(datas) {
  if (!datas) {
    return null;
  }
  // {
  //   "name": "天津",
  //   "type": "1",
  //   "typeName": "天津",
  //   "growth": "613%",
  //   "sales": "6916"
  // }
  const data = datas;
  for (let i = 0; i < data.length; i += 1) {
    if (i < data.length - 1) {
      for (let j = i + 1; j < data.length; j += 1) {
        if (data[i].typeName === data[j].typeName) {
          if (data[i].type !== 0 && data[j].type !== 0) {
            if (data[i].type === 3 || data[j].type === 3) {
              data[i].type = 3;
              data[j].type = 0;
            } else if (data[i].type === data[j].type) {
              data[j].type = 0;
            } else {
              data[i].type = 3;
              data[j].type = 0;
            }
          }
        }
      }
    }
  }

  const map = [];
  for (let i = 0; i < data.length; i += 1) {
    const a = {
      name: data[i].typeName,
      value: data[i].type,
    };
    map.push(a);
  }

  return {
    title: {
      textStyle: {
        fontSize: 30,
      },
      x: 'center',
    },
    visualMap: {
      type: 'piecewise',
      align: 'left',
      pieces: [
        { value: 1, label: '限牌', color: '#008AE7' },
        { value: 2, label: '限购', color: 'green' },
        { value: 3, label: '限牌、限购 ', color: 'red' },
      ],
      splitNumber: 5,
      left: '80%',
      bottom: '10%',
      calculable: true,
      seriesIndex: 0,
      itemWidth: 30,
      itemHeight: 30,
      textStyle: {
        fontSize: 24,
      },
    },
    xAxis: {
      type: 'value',
      scale: true,
      position: 'top',
      splitNumber: 1,
      boundaryGap: false,
      splitLine: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        margin: 2,
        textStyle: {
          color: '#aaa',
        },
      },
    },
    yAxis: {
      type: 'category',
      nameGap: 16,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    geo: {
      roam: false,
      map: 'china',
      left: 'center',
      layoutSize: '80%',
      zoom: '1.2',
      label: {
        emphasis: {
          show: false,
        },
      },
      itemStyle: {
        emphasis: {
          show: false,
          areaColor: 'rgba(0,0,0,0.01)',
        },
      },
      regions: [{
        name: '南海诸岛',
        value: 0,
        itemStyle: {
          normal: {
            opacity: 0,
            label: {
              show: false,
            },
          },
        },
      }],
    },
    series: [
      {
        name: 'mapSer',
        type: 'map',
        roam: false,
        geoIndex: 0,
        label: {
          show: false,
        },
        data: map,
      },
    ],
  };
}
