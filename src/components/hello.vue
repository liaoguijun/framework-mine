<template>
  <div class="homepage" :style="windowSize">
    <div class="homepage-left">
      <div class="homepage-left-top">
        <div id="fisrtchar"></div>
      </div>
      <div class="homepage-left-bottom">
        <div id="secondchar"></div>
      </div>
    </div>
    <div class="homepage-middle">
      <h1>胜维野生动物保护识别管理系统</h1>
      <div class="homepage-middle-top">
        <div class="nowtime">
          <div class="smallgrid">{{timeArr[0]}}</div>
          <div class="smallgrid">{{timeArr[1]}}</div>
          <div class="smallgrid">{{timeArr[2]}}</div>
          <div class="smallgrid">{{timeArr[3]}}</div>
          <div class="smallgrid">{{timeArr[4]}}</div>
          <div class="smallgrid">{{timeArr[5]}}</div>
          <div class="smallgrid">{{timeArr[6]}}</div>
          <div class="smallgrid">{{timeArr[7]}}</div>
        </div>
        <p>昨日监测范围内鸟类共：10种</p>
      </div>
      <div class="homepage-middle-bottom">
        <ul>
          <li>重点监测鸟类名称</li>
          <li>英文名称</li>
          <li>抓取时间</li>
          <li>抓取地点</li>
        </ul>
        <div class="important-bids">
          <ul v-for="item in keymonitorBids" :key="item.id">
            <li>{{item.nameZh}}</li>
            <li>{{item.nameUs}}</li>
            <li>{{item.catchTime}}</li>
            <li>{{item.address}}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="homepage-right">
      <div class="homepage-right-top">
        <div id="fourchar">
          <h3>近七日出现次数最多的鸟类</h3>
          <div class="smallbox" v-for="item in frequencyBids" :key="item.id">
            <div class="contbox">
              <p>{{item.count}}</p>
              <span>{{item.nameZh}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {
      timeArr: [],
      windowSize: {
        height: "",
        width: ""
      },
      pastTotalBids: {
        date: ["8.23", "8.24", "8.25", "8.26", "8.27", "8.28", "8.29"],
        number: [5, 20, 36, 10, 10, 20, 30]
      },
      frequencyBids: [],
      keymonitorBids: []
    };
  },
  methods: {
    // 获取屏幕宽高
    getWindowSize() {
      this.windowSize.height = window.innerHeight + "px";
      this.windowSize.width = window.innerWidth + "px";
    },
    // 获取图表数据
    getEcharsData() {
      this.axios
        .get("http://192.168.6.22:8888/birds-server/birds-catch/control-list")
        .then(res => {
          this.keymonitorBids = res.data.data;
        })
        .catch(response => {
          console.log(response);
        });
        this.axios
        .get("http://192.168.6.22:8888/birds-server/birds-catch/seven-category-catch")
        .then(res => {
          var lastData = res.data.data.reverse()
          var date = [];
          var nums = [];
          lastData.forEach(item => {
            var dateArr = item.date.split('-')
            date.push(dateArr[1]+'-'+dateArr[2])
            nums.push(item.categoryCount)
          })
          this.echartsSetOptions2(date, nums)
        })
        .catch(response => {
          console.log(response);
        });
      this.axios
        .get(
          "http://192.168.6.22:8888/birds-server/birds-catch/most-address-catch"
        )
        .then(res => {
          var grabBidsData = [];
          var address = [];
          res.data.data.forEach(item => {
            var grabBids = {};
            grabBids.value = parseInt(item.count);
            grabBids.name = item.address;
            grabBidsData.push(grabBids);
            address.push(item.address);
          });
          this.echartsSetOptions1(address, grabBidsData);
        })
        .catch(response => {
          console.log(response);
        });
      this.axios
        .get("http://192.168.6.22:8888/birds-server/birds-catch/top-six-catch")
        .then(res => {
          this.frequencyBids = res.data.data;
        })
        .catch(response => {
          console.log(response);
        });
    },
    // 抓取鸟类最多的地方
    echartsSetOptions1(address, data) {
      var myChart2 = echarts.init(document.getElementById("secondchar"));
      myChart2.setOption({
        title: {
          text: "抓取鸟类最多的地点",
          textStyle: {
            color: "#fff"
          },
          top: 10,
          left: 10
        },
        tooltip: {
          trigger: "item"
        },
        legend: {
          orient: "horizontal",
          x: "center",
          y: "86%",
          data: address,
          textStyle: {
            color: "#fff"
          }
        },
        color: ["#ec4e9c", "#29a8ff", "#621fd3"],
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
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
    // 近七日鸟类种类数据统计直方图
    echartsSetOptions2(date, nums) {
      var myChart1 = echarts.init(document.getElementById("fisrtchar"));
      myChart1.setOption({
        title: {
          text: "近七日鸟类种类数据统计直方图",
          textStyle: {
            color: "#fff"
          },
          top: 10,
          left: 10
        },
        tooltip: {},
        xAxis: {
          data: date,
          // type : 'category',
          axisLabel: {
            textStyle: {
              color: "#fff" //这里用参数代替了
            }
          },
          axisLine: {
            lineStyle: {
              color: "#28b1ff"
            }
          }
        },
        yAxis: {
          axisLabel: {
            textStyle: {
              color: "#fff" //这里用参数代替了
            }
          },
          axisLine: {
            lineStyle: {
              color: "#28b1ff"
            }
          }
        },
        series: [
          {
            name: "数量",
            type: "bar",
            data: nums,
            markLine: {
              show: false
            },
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 0.6, [
                  { offset: 0, color: "#83bff6" },
                  { offset: 0.5, color: "#188df0" },
                  { offset: 1, color: "#188df0" }
                ])
              },
              emphasis: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#2378f7" },
                  { offset: 0.7, color: "#2378f7" },
                  { offset: 1, color: "#83bff6" }
                ])
              }
            }
          }
        ]
      });
    },
    //获取当前时间
    getNowtime() {
      var timeObj = new Date()
      var year = timeObj.getFullYear()
      var month = timeObj.getMonth() + 1
      month = (month >10?month:'0' + month)
      var date = timeObj.getDate()
      var time = year.toString() + month + date.toString()
      this.timeArr = time.split('')
    }
  },
  created() {
    this.getWindowSize();
    this.getEcharsData();
    this.getNowtime()
  },
  mounted() {
    // 动态获取浏览器的宽高
    window.addEventListener("resize", this.getWindowSize);
  }
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
.homepage {
  background-image: url("../assets/hello/beijing.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  display: flex;
  .homepage-left {
    width: 25%;
    box-sizing: border-box;
    padding: 80px 20px 20px 20px;
    .homepage-left-top {
      width: 100%;
      height: 44%;
      margin-bottom: 8%;
      background-color: rgba(11, 19, 54, 0.4);
      box-shadow: 0 0 10px #807c7c;
      #fisrtchar {
        width: 100%;
        height: 100%;
      }
    }
    .homepage-left-bottom {
      width: 100%;
      height: 44%;
      background-color: rgba(11, 19, 54, 0.4);
      box-shadow: 0 0 10px #807c7c;
      #secondchar {
        width: 100%;
        height: 100%;
      }
    }
  }
  .homepage-middle {
    width: 50%;
    height: 100%;
    box-sizing: border-box;
    padding: 0 20px 20px 20px;
    h1 {
      color: #fff;
      width: 100%;
      height: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .homepage-middle-top {
      width: 100%;
      height: 60%;
      position: relative;
      .nowtime {
        width: 100%;
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        .smallgrid {
          width: 40px;
          height: 60px;
          background-color: rgba(11, 19, 54, 0.4);
          margin-left: 16px;
          border-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 30px;
          color: #6fb6f5;
        }
        .smallgrid:nth-child(1) {
          margin: 0;
        }
      }
      p {
        color: #fff;
        position: absolute;
        left: 4%;
        top: 30%;
      }
    }
    .homepage-middle-bottom {
      width: 100%;
      height: 24%;
      background-color: rgba(11, 19, 54, 0.4);
      box-shadow: 0 0 10px #807c7c;
      > ul {
        width: 100%;
        height: 20%;
        li {
          list-style: none;
          float: left;
          color: #fff;
          font-family: Microsoft Yahei;
          font-size: 16px;
          font-weight: 700;
          width: 25%;
          height: 100%;
          line-height: 40px;
          text-align: center;
        }
      }
      .important-bids {
        width: 100%;
        height: 80%;
        overflow-y: auto;
        background-image: url("../assets/hello/beijing1.png");
        background-repeat: no-repeat;
        background-position: right center;
        ul {
          width: 100%;
          height: 40px;
          border-bottom: 1px dashed #2a3438;
          li {
            list-style: none;
            float: left;
            color: #999;
            font-family: Microsoft Yahei;
            font-size: 16px;
            font-weight: 400;
            width: 25%;
            height: 100%;
            line-height: 40px;
            text-align: center;
          }
        }
      }
    }
  }
  .homepage-right {
    width: 25%;
    box-sizing: border-box;
    padding: 80px 20px 20px 20px;
    .homepage-right-top {
      width: 100%;
      height: 44%;
      background-color: rgba(11, 19, 54, 0.4);
      box-shadow: 0 0 10px #807c7c;
      #fourchar {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 20px 0 0 20px;
        h3 {
          width: 100%;
          height: 40px;
          color: #fff;
        }
        .smallbox {
          width: 28%;
          height: 30%;
          border: 1px solid #28b1ff;
          display: flex;
          justify-content: center;
          align-items: center;
          float: left;
          margin: 10px 4% 10% 0;
          .contbox {
            width: 100%;
            height: 64%;
            p {
              width: 100%;
              text-align: center;
              font-size: 26px;
              color: #439aff;
            }
            span {
              display: block;
              width: 100%;
              text-align: center;
              font-size: 14px;
              color: #fff;
              margin-top: 10px;
            }
          }
        }
      }
    }
  }
}
</style>
