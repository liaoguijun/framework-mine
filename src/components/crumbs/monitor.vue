<template>
  <div class="container">
    <div class="box4" ref="box">
      <div class="monitorbox" v-for="item in box4Arr" :key="item.label">
        <h4>{{item.label}}</h4>
        <div class="monitorwindow">
          <videoPlayer class="vjs-custom-skin videoPlayer" :options="playerOptions"></videoPlayer>
        </div>
      </div>
    </div>
    <div class="list-paging">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[4, 6, 9, 12]"
        :page-size="100"
        layout="sizes, prev, pager, next"
        :total="12"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import "video.js/dist/video-js.css";
import { videoPlayer } from "vue-video-player";
import "videojs-flash";
export default {
  data() {
    return {
      box4Arr: [
        {
          label: "4条1每页"
        },
        {
          label: "4条2每页"
        },
        {
          label: "4条3每页"
        },
        {
          label: "4条4每页"
        }
      ],
      box6Arr: [
        {
          label: "6条1每页"
        },
        {
          label: "6条2每页"
        },
        {
          label: "6条3每页"
        },
        {
          label: "6条4每页"
        },
        {
          label: "6条5每页"
        },
        {
          label: "6条6每页"
        }
      ],
      box9Arr: [
        {
          label: "9条1每页"
        },
        {
          label: "9条2每页"
        },
        {
          label: "9条3每页"
        },
        {
          label: "9条4每页"
        },
        {
          label: "9条5每页"
        },
        {
          label: "9条6每页"
        },
        {
          label: "9条7每页"
        },
        {
          label: "9条8每页"
        },
        {
          label: "9条9每页"
        }
      ],
      box12Arr: [
        {
          label: "12条每页"
        },
        {
          label: "12条2每页"
        },
        {
          label: "12条3每页"
        },
        {
          label: "12条4每页"
        },
        {
          label: "12条5每页"
        },
        {
          label: "12条6每页"
        },
        {
          label: "12条7每页"
        },
        {
          label: "12条8每页"
        },
        {
          label: "12条9每页"
        },
        {
          label: "12条10每页"
        },
        {
          label: "12条11每页"
        },
        {
          label: "12条12每页"
        }
      ],
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
      }
    };
  },
  methods: {
    // 每页的监控数
    handleSizeChange(val) {
      var classVal = this.$refs.box.getAttribute("class");
      classVal = classVal.replace(classVal, `box${val}`);
      this.$refs.box.setAttribute("class", classVal);
    },
    // 分页
    handleCurrentChange(val) {
      console.log(val);
    }
  },
  created() {},
  components: {
    videoPlayer
  }
};
</script>

<style lang="less">
.container {
  .box4 {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    .monitorbox {
      width: 568px;
      height: 360px;
      background-color: #fff;
      margin: 20px;
      h4 {
        height: 40px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .monitorwindow {
        width: 100%;
        height: 320px;
      }
    }
    .monitorbox:hover {
      box-shadow: 2px 2px 10px #949090;
    }
  }
  .box6 {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    .monitorbox {
      width: 500px;
      height: 320px;
      background-color: #fff;
      margin: 20px;
      h4 {
        height: 40px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .monitorbox:hover {
      box-shadow: 2px 2px 10px #949090;
    }
  }
  .box9 {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    .monitorbox {
      width: 400px;
      height: 264px;
      background-color: #fff;
      margin: 10px;
      h4 {
        height: 40px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .monitorbox:hover {
      box-shadow: 2px 2px 10px #949090;
    }
  }
  .box12 {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    .monitorbox {
      width: 350px;
      height: 236px;
      background-color: #fff;
      margin: 20px;
      h4 {
        height: 40px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .monitorbox:hover {
      box-shadow: 2px 2px 10px #949090;
    }
  }
  .list-paging {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>