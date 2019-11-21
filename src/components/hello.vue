<template>
  <div class="homepage">
    <div class="homepage-top">
      <h1>胜维野生动物保护识别管理系统</h1>
      <el-tooltip class="item" effect="dark" :content="content" placement="bottom">
        <span class></span>
        <span class="iconfont icon-yonghu" @click="jump"></span>
      </el-tooltip>
    </div>
    <div class="homepage-left">
      <div class="homepage-left-top">
        <div id="fisrtchar"></div>
      </div>
      <div class="homepage-left-bottom">
        <div id="secondchar"></div>
      </div>
    </div>
    <div class="homepage-middle">
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
      </div>
      <div class="homepage-middle-bottom">
        <ul>
          <li>重点监测鸟类名称</li>
          <!-- <li>英文名称</li> -->
          <li>抓取时间</li>
          <li>抓取地点</li>
        </ul>
        <div class="important-bids">
          <ul v-for="item in keymonitorBids" :key="item.id">
            <li>{{item.nameZh}}</li>
            <!-- <li>{{item.nameUs}}</li> -->
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
      <div class="homepage-right-bottom">
        <div id="thirdchar"></div>
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
      frequencyBids: [],
      keymonitorBids: [],
      content: "亲，请登录"
    };
  },
  methods: {
    // 获取图表数据
    getEcharsData() {
      // 获取重点监测鸟类列表
      this.axios
        .get("/birds-server/birds-catch/control-list")
        .then(res => {
          res.data.data.forEach(item => {
            item.nameZh = `${item.nameZh}(${item.nameUs})`
          })
          this.keymonitorBids = res.data.data;
        })
        .catch(response => {});
      // 获取近七日鸟类种类数据
      this.axios
        .get("/birds-server/data-record/get-last-seven-day")
        .then(res => {
          let dateArr = res.data.data.dateList;
          let countArr = [];
          for (let i = 0; i < res.data.data.dateList.length; i++) {
            let countObj = {};
            countObj.name = res.data.data.dateList[i];
            countObj.value = res.data.data.countAndNamesList[i].count;
            countObj.infoData = res.data.data.countAndNamesList[i].nameList;
            countArr.push(countObj);
          }
          this.echartsSetOptions2(dateArr, countArr);
        })
        .catch(response => {
          console.log(response);
        });
      // 获取抓取鸟类最多的前三地点
      this.axios
        .get("birds-server/birds-catch/most-address-catch")
        .then(res => {
          var threeData = res.data.data.splice(0, 3);
          let grabBidsData = [];
          var address = [];
          let title = "抓取鸟类最多前三地点";
          threeData.forEach(item => {
            var grabBids = {};
            grabBids.value = parseInt(item.count);
            grabBids.name = item.address;
            grabBidsData.push(grabBids);
            address.push(item.address);
          });
          this.echartsSetOptions1(
            title,
            address,
            grabBidsData,
            document.getElementById("secondchar")
          );
        })
        .catch(response => {
          console.log(response);
        });

      // 获取近七日出现次数最多前六的鸟类
      this.axios
        .get("/birds-server/birds-catch/top-six-catch")
        .then(res => {
          this.frequencyBids = res.data.data;
        })
        .catch(response => {
          console.log(response);
        });
      //获取近七日重点布控鸟类种类数量前三地点详情图
      this.axios.get("/birds-server/data-record/address/detail").then(res => {
        let adressArr = res.data.data.address;
        let dateArr = res.data.data.date;
        let countArr = [];
        for (let j = 0; j < res.data.data.address.length; j++) {
          let countArr1 = [];
          for (let k = 0; k < res.data.data.date.length; k++) {
            let countObj = {};
            countObj.name = res.data.data.date[k];
            countObj.value = res.data.data.data[j][k].count;
            countObj.address = res.data.data.address[j];
            countObj.infoData = res.data.data.data[j][k].nameList;
            countArr1.push(countObj);
          }
          countArr.push(countArr1);
        }
        this.echartsSetOptions3(dateArr, adressArr, countArr);
      });
    },
    // 抓取鸟类最多的地方
    echartsSetOptions1(title, address, data, selector) {
      var myChart2 = echarts.init(selector);
      myChart2.setOption({
        title: {
          text: title,
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
            name: "地点",
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
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          },
          formatter: function(params) {
            let lihtml = "";
            for (let j = 0; j < params[0].data.infoData.length; j++) {
              if (j < 10) {
                lihtml += `<li>${params[0].data.infoData[j]}</li>`;
              }
            }
            let html = `<div style="text-align:center">
            ${params[0].data.name}日:  ${params[0].data.value}种
            <div>
            <ul style="list-style: none">${lihtml}</ul>
            </div>
            </div>`;
            return html;
          }
        },
        xAxis: {
          data: date,
          type: "category",
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
    // 近七日前三地点折线图
    echartsSetOptions3(dateArr, adressArr, countArr) {
      var myChart3 = echarts.init(document.getElementById("thirdchar"));
      myChart3.setOption({
        title: {
          text: "近七日布控鸟类高频活动区域统计图",
          textStyle: {
            color: "#fff"
          },
          top: 5,
          left: 10
        },
        legend: {
          data: adressArr,
          orient: "horizontal",
          x: "center",
          top: 34,
          textStyle: { color: "#fff" }
        },
        tooltip: {
          trigger: "item",
          formatter: function(params) {
            let lihtml = "";
            for (let j = 0; j < params.data.infoData.length; j++) {
              if (j < 10) {
                lihtml += `<li>${params.data.infoData[j]}</li>`;
              }
            }
            let html = `<div style="text-align:center">
            <div>${params.data.address}</div>
            ${params.data.name}日:  ${params.data.value}种
            <div>
            <ul style="list-style: none">${lihtml}</ul>
            </div>
            </div>`;
            return html;
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        color: ["#ec4e9c", "#29a8ff", "#621fd3"],
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: dateArr,
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
          type: "value",
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
            name: adressArr[0],
            type: "line",
            data: countArr[0]
          },
          {
            name: adressArr[1],
            type: "line",
            data: countArr[1]
          },
          {
            name: adressArr[2],
            type: "line",
            data: countArr[2]
          }
        ]
      });
    },
    //获取当前时间
    getNowtime() {
      var timeObj = new Date();
      var year = timeObj.getFullYear();
      var month = timeObj.getMonth() + 1;
      month = month >= 10 ? month : "0" + month;
      var date = timeObj.getDate();
      date = date >= 10 ? date : "0" + date;
      var time = year.toString() + month + date.toString();
      this.timeArr = time.split("");
    },
    jump() {
      if(localStorage.token) {
        this.$router.push({ path: "/home" });
      }else {
        this.$router.push({ path: "/login" });
      }
    }
  },
  created() {
    this.getEcharsData();
    this.getNowtime();
  },
  mounted() {
    this.content = sessionStorage.getItem('user')||'亲，请登录'
  }
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
.homepage {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: url("../assets/hello/beijing.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  display: flex;
  flex-wrap: wrap;
  .homepage-top {
    width: 100%;
    height: 10%;
    color: #fff;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    h1 {
      width: 50%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .item {
      width: 25%;
      height: 40%;
      font-size: 24px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .homepage-left {
    width: 25%;
    height: 90%;
    padding: 0 20px 4% 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .homepage-left-top {
      width: 100%;
      height: 44%;
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
    height: 90%;
    padding: 0 20px 4% 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .homepage-middle-top {
      width: 100%;
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
        display: flex;
        justify-content: space-between;
        align-items: center;
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
          display: flex;
          justify-content: space-between;
          align-items: center;
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
    height: 90%;
    padding: 0 20px 4% 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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
    .homepage-right-bottom {
      width: 100%;
      height: 44%;
      background-color: rgba(11, 19, 54, 0.4);
      box-shadow: 0 0 10px #807c7c;
      #thirdchar {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
