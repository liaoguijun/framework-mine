<template>
  <div class="alarmcontainer">
    <div class="a-left">
      <div class="box">
        <h4>一站台上行视频显示</h4>
        <div class="monitorwindow">
          <videoPlayer class="vjs-custom-skin videoPlayer" :options="playerOptions"></videoPlayer>
        </div>
      </div>
      <div class="box">
        <h4>二站台上行视频显示</h4>
        <div class="monitorwindow">
          <videoPlayer class="vjs-custom-skin videoPlayer" :options="playerOptions"></videoPlayer>
        </div>
      </div>
    </div>
    <div class="a-middle">
      <div class="tablebox">
        <h4>站台列表信息</h4>
        <el-table :data="listData1.tableData" border style="width: 100%" height="288">
          <el-table-column prop="date" label="站台名称" align="center"></el-table-column>
          <el-table-column label="上行" align="center">
            <template slot-scope="scope">
              <span
                v-for="item in scope.row.icons"
                :key="item"
                :class="item"
                style="margin-left:10px"
              ></span>
            </template>
          </el-table-column>
          <el-table-column label="下行" align="center">
            <template slot-scope="scope">
              <span
                v-for="item in scope.row.icons"
                :key="item"
                :class="item"
                style="margin-left:10px"
              ></span>
            </template>
          </el-table-column>
        </el-table>
        <div class="list-paging">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="listData1.currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="listData1.pages*10"
          ></el-pagination>
        </div>
      </div>
      <div class="tablebox">
        <h4>未处理报警信息</h4>
        <el-table :data="listData2.tableData" border style="width: 100%" height="288">
          <el-table-column
            v-for="item in listData2.tableList"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="record(scope.row)">处理报警</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="list-paging">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="listData2.currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="listData2.pages*10"
          ></el-pagination>
        </div>
      </div>
    </div>
    <div class="a-right">
      <div class="echartsbox" id="echartsbox1"></div>
      <div class="echartsbox" id="echartsbox2"></div>
      <div class="echartsbox" id="echartsbox3"></div>
    </div>
  </div>
</template>>

<script>
import "video.js/dist/video-js.css";
import { videoPlayer } from "vue-video-player";
import "videojs-flash";
import echarts from "echarts";
export default {
  data() {
    return {
      playerOptions: {
        live: true,
        autoplay: true,
        muted: true, // 默认情况下将会消除任何音频
        loop: false,
        preload: "auto",
        aspectRatio: "16:9",
        fluid: true,
        controlBar: {
          timeDivider: false,
          durationDisplay: false,
          remainingTimeDisplay: false,
          currentTimeDisplay: false, // 当前时间
          volumeControl: false, // 声音控制键
          playToggle: true, // 暂停和播放键
          progressControl: true, // 进度条
          fullscreenToggle: true // 全屏按钮
        },
        techOrder: ["html5", "flash"],
        sources: [
          {
            type: "rtmp/flv",
            src: "rtmp://58.200.131.2:1935/livetv/hunantv"
          }
        ],
        notSupportedMessage: "此视频暂无法播放，请稍后再试"
      },
      listData1: {
        tableList: [
          {
            label: "站台名称",
            prop: "date"
          }
        ],
        tableData: [
          {
            date: "2016-05-02",
            icons: ["el-icon-edit", "el-icon-share"]
          }
        ],
        handle: ["编辑", "删除"],
        currentPage: 1,
        pages: 0,
        total: 0
      },
      listData2: {
        tableList: [
          {
            label: "序号",
            prop: "date"
          },
          {
            label: "报警站台",
            prop: "date"
          },
          {
            label: "站台位置",
            prop: "date"
          },
          {
            label: "报警时间",
            prop: "date"
          }
        ],
        tableData: [
          {
            date: "2016-05-02",
            icons: ["el-icon-edit", "el-icon-share"]
          }
        ],
        handle: ["编辑", "删除"],
        currentPage: 1,
        pages: 0,
        total: 0
      }
    };
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    echartsSetOptions1(selector) {
      var myChart = echarts.init(selector);
      myChart.setOption({
        title: {
          text: "近七日数据统计",
          x: "center"
        },
        color: ["#006699", "#4cabce", "#e5323e"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {
          orient: "vertical",
          x: "right",
          data: ["正常数据", "入侵数据", "误报数据"]
        },
        xAxis: [
          {
            type: "category",
            axisTick: { show: false },
            data: [
              "10-01",
              "10-01",
              "10-01",
              "10-01",
              "10-01",
              "10-01",
              "10-01"
            ]
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "正常数据",
            type: "bar",
            barGap: 0,
            barWidth: 12,
            data: [320, 332, 301, 334, 390, 400, 350]
          },
          {
            name: "入侵数据",
            type: "bar",
            barWidth: 12,
            data: [220, 182, 191, 234, 290, 191, 234]
          },
          {
            name: "误报数据",
            type: "bar",
            barWidth: 12,
            data: [150, 232, 201, 154, 190, 154, 190]
          }
        ]
      });
    },
    echartsSetOptions2(selector) {
      var myChart = echarts.init(selector);
      myChart.setOption({
        title: {
          text: "今日数据统计",
          x: "center"
        },
        color: ["#006699", "#4cabce", "#e5323e"],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: ["正常数据", "入侵数据", "待处理数据"]
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { value: 335, name: "正常数据" },
              { value: 310, name: "入侵数据" },
              { value: 234, name: "待处理数据" }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    },
    echartsSetOptions3(selector) {
      var myChart = echarts.init(selector);
      myChart.setOption({
        title: {
          text: "近一个月数据统计",
          x: "center"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          x: "center",
          y: 30,
          data: ["总数据", "正常数据", "入侵数据", "误报数据"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "总数据",
            type: "line",
            stack: "总量",
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "正常数据",
            type: "line",
            stack: "总量",
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: "入侵数据",
            type: "line",
            stack: "总量",
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: "误报数据",
            type: "line",
            stack: "总量",
            data: [320, 332, 301, 334, 390, 330, 320]
          }
        ]
      });
    }
  },
  mounted() {
    this.echartsSetOptions1(document.getElementById("echartsbox1"));
    this.echartsSetOptions2(document.getElementById("echartsbox2"));
    this.echartsSetOptions3(document.getElementById("echartsbox3"));
  },
  components: {
    videoPlayer
  }
};
</script>

<style lang="less">
.alarmcontainer {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  .a-left {
    width: 34%;
    min-width: 500px;
    box-sizing: border-box;
    padding: 10px 20px;
    .box {
      width: 100%;
      height: 330px;
      h4 {
        height: 40px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
      }
      .monitorwindow {
        width: 100%;
        min-height: 288px;
        background-color: #f7f7f7;
        display: flex;
        justify-content: center;
        align-items: center;
        .video-player {
          width: 100%;
        }
      }
    }
    .box:nth-child(2) {
      margin-top: 60px;
    }
  }
  .a-middle {
    width: 36%;
    box-sizing: border-box;
    padding-top: 10px;
    min-width: 530px;
    .tablebox {
      width: 100%;
      height: 390px;
      h4 {
        height: 40px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
      }
      .list-paging {
        width: 100%;
        height: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .a-right {
    width: 30%;
    box-sizing: border-box;
    padding: 10px 0 0 20px;
    min-width: 460px;
    .echartsbox {
      width: 100%;
      height: 230px;
      margin-bottom: 14px;
      background-color: #fff;
    }
  }
}
</style>