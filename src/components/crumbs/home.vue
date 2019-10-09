<template>
  <div class="homecontainer">
    <div class="firstchart">
      <h4>昨日出现次数最多鸟类统计>></h4>
      <div class="chartcontainer">
        <div class="chart" id="chart0"></div>
        <div class="chart" id="chart1"></div>
        <div class="chart" id="chart2"></div>
      </div>
    </div>
    <div class="secondchart" id="secondchart"></div>
    <div class="bot">
      <div class="thirdchart" id="thirdchart"></div>
      <div class="fourthchart" id="fourthchart"></div>
      <div class="forthchart" id="forthchart"></div>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
export default {
  data() {
    return {
      address: ["小燕子"],
      data: [{ value: 20, name: "小燕子" }]
    };
  },
  methods: {
    firstChart() {
      var divArr = [];
      var colorArr = ["#ec4e9c", "#29a8ff", "#621fd3"];
      for (var i = 0; i < 3; i++) {
        var char = document.getElementById("chart" + i);
        this.echartsSetOptions1(char, this.address, this.data, colorArr[i]);
      }
    },
    secondChart() {
      this.axios
        .get("/birds-server/birds-catch/seven-category-catch")
        .then(res => {
          if (res.status === 200) {
            var dateArr = [];
            var numberArr = [];
            res.data.data.forEach(item => {
              dateArr.push(item.date);
              numberArr.push(item.categoryCount);
            });
            dateArr.reverse();
            numberArr.reverse();
          }
          this.echartsSetOptions2(secondchart, dateArr, numberArr);
        });
    },
    // 饼形图
    echartsSetOptions1(selector, address, data, color) {
      var myChart = echarts.init(selector);
      myChart.setOption({
        tooltip: {
          trigger: "item"
        },
        legend: {
          orient: "horizontal",
          x: "center",
          y: "90%",
          data: address,
          textStyle: {
            color: "#fff"
          }
        },
        color: color,
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                position: "center",
                formatter: function(argument) {
                  var html;
                  html = "20只";
                  return html;
                },
                textStyle: {
                  fontSize: 30,
                  color: "#fff",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: data
          }
        ]
      });
    },
    // 折线图
    echartsSetOptions2(selector, dateArr, numberArr) {
      var myChart = echarts.init(selector);
      myChart.setOption({
        title: {
          text: "近七日鸟类种类数据统计>>",
          textStyle: {
            color: "#fff"
          },
          left: 20,
          top: 16
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: dateArr,
          axisLine: {
            lineStyle: {
              // 设置x轴颜色
              color: "#fff"
            }
          }
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              // 设置x轴颜色
              color: "#fff"
            }
          }
        },
        tooltip: {
          trigger: "axis"
        },
        series: [
          {
            data: numberArr,
            type: "line",
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#72bcff" },
                  { offset: 0.5, color: "#1d2f40" },
                  { offset: 1, color: "#1a1b1b" }
                ])
              }
            },
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "skyblue" //线的颜色
                }
              }
            }
          }
        ]
      });
    },
    // 玫瑰图
    echartsSetOptions3(selector) {
      var myChart = echarts.init(selector);
      myChart.setOption({
        title: {
          text: "鸟类抓取地点统计>>",
          textStyle: {
            color: "#fff"
          },
          left: 20,
          top: 16
        },
        color: [
          "#ED7C30",
          "#80FF80",
          "#FF8096",
          "#800080",
          "#ec4e9c",
          "#29a8ff",
          "#621fd3"
        ],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          x: "center",
          y: "90%",
          data: ["rose1", "rose2", "rose3", "rose4", "rose5", "rose6", "rose7"],
          textStyle: {
            color: "#ffffff"
          }
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              type: ["pie", "funnel"]
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        series: [
          {
            name: "面积模式",
            type: "pie",
            radius: [30, 110],
            center: ["50%", "50%"],
            roseType: "area",
            data: [
              { value: 10, name: "rose1" },
              { value: 5, name: "rose2" },
              { value: 15, name: "rose3" },
              { value: 25, name: "rose4" },
              { value: 20, name: "rose5" },
              { value: 35, name: "rose6" },
              { value: 30, name: "rose7" }
            ]
          }
        ]
      });
    },
    // 柱状图
    echartsSetOptions4(selector) {
      var myChart = echarts.init(selector);
      myChart.setOption({
        title: {
          text: "近六个月每月鸟类数量统计>>",
          textStyle: {
            color: "#fff"
          },
          left: 20,
          top: 16
        },
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                // 设置x轴颜色
                color: "#fff"
              }
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLine: {
              lineStyle: {
                // 设置x轴颜色
                color: "#fff"
              }
            }
          }
        ],
        series: [
          {
            name: "直接访问",
            type: "bar",
            barWidth: "60%",
            data: [10, 52, 200, 334, 390, 330, 220]
          }
        ]
      });
    },
    //漏斗图
    echartsSetOptions5(selector) {
      var myChart = echarts.init(selector);
      myChart.setOption({
        title: {
          text: "本月与上月排民前五鸟类数量对比图>>",
          textStyle: {
            color: "#fff"
          },
          left: 20,
          top: 16
        },
        color: ["#80FF80", "#800080", "#ec4e9c", "#621fd3", "#29a8ff"],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}%"
        },
        toolbox: {
          orient: "horizontal",
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          }
        },
        calculable: true,
        series: [
          {
            name: "九月份",
            type: "funnel",
            width: "40%",
            height: "40%",
            left: "32%",
            top: "15%",
            label: {
              normal: {
                position: "left"
              }
            },
            data: [
              { value: 60, name: "第五" },
              { value: 30, name: "第四" },
              { value: 10, name: "第三" },
              { value: 80, name: "第二" },
              { value: 100, name: "第一" }
            ]
          },
          {
            name: "八月份",
            type: "funnel",
            width: "40%",
            height: "40%",
            left: "32%",
            top: "55%",
            sort: "ascending",
            label: {
              normal: {
                position: "left"
              }
            },
            data: [
              { value: 60, name: "第五" },
              { value: 30, name: "第四" },
              { value: 10, name: "第三" },
              { value: 80, name: "第二" },
              { value: 100, name: "第一" }
            ]
          }
        ]
      });
    }
  },
  mounted() {
    this.firstChart();
    this.secondChart();
    this.echartsSetOptions3(document.getElementById("thirdchart"));
    this.echartsSetOptions4(document.getElementById("fourthchart"));
    this.echartsSetOptions5(document.getElementById("forthchart"));
  }
};
</script>
<style lang="less">
.homecontainer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .firstchart {
    width: 50%;
    height: 300px;
    min-width: 600px;
    background-color: #888;
    border-radius: 10px;
    margin-top: 20px;
    h4 {
      color: #fff;
      width: 100%;
      height: 60px;
      font-size: 18px;
      font-weight: 800;
      box-sizing: border-box;
      padding-left: 20px;
      display: flex;
      align-items: center;
    }
    .chartcontainer {
      width: 100%;
      height: 240px;
      display: flex;
      justify-content: center;
      .chart {
        float: left;
        width: 30%;
        height: 220px;
        margin: 0 10px;
      }
    }
  }
  .secondchart {
    width: 45%;
    min-width: 600px;
    height: 300px;
    margin-top: 20px;
    border-radius: 10px;
    background-color: #888;
  }
  .bot {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .thirdchart,
    .fourthchart,
    .forthchart {
      margin-top: 50px;
      width: 32%;
      min-width: 400px;
      height: 400px;
      border-radius: 10px;
      background-color: #888;
    }
  }
}
</style>