<template>
  <div class="container">
    <div class="menu" ref="menu">
      <el-row class="tac">
        <el-col :span="24">
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            :collapse="isCollapse"
            :unique-opened="isOpened"
          >
            <el-submenu v-for="item in menus" :key="item.id" :index="item.id">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{item.label}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  v-for="node in item.children"
                  :key="node.id"
                  :index="node.id"
                  @click="routerJump(node.label, node.path)"
                >{{node.label}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-row>
    </div>

    <div class="main" ref="main">
      <div class="main-top" ref="mainTop">
        <div class="spread">
          <span class="iconfont icon-shouqianniuicon" @click="isSpread"></span>
        </div>
        <div class="title">管理系统</div>
        <div class="information">
          <div class="info-account">
            <el-dropdown placement="bottom-start" @command="handleCommand">
              <span class="el-dropdown-link">
                <img src="../assets/main/account.png" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item command="退出登录">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
      <div class="main-middle">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item
            v-for="item in breadcrumbArr"
            :key="item.path"
            :to="item.path"
          >{{item.label}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <div class="main-bottom">
        <router-view />
        <div class="systeminfo">成都胜维四通科技有限公司copyright2019</div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/iconfont/iconfont.css";
export default {
  data() {
    return {
      menus: [
        {
          label: "视频",
          icon: "iconfont icon-jiankong",
          id: "2",
          children: [
            {
              label: "监控中心",
              path: "/monitor",
              id: "56"
            }
          ]
        },
        {
          label: "表格",
          icon: "iconfont icon-caigoutong1108",
          id: "3",
          children: [
            {
              label: "表格1",
              path: "/tablelist",
              icon: "iconfont icon-iconfront-",
              id: "10"
            },
            {
              label: "表格2",
              path: "/tablefoldlist",
              icon: "iconfont icon-leimu",
              id: "11"
            }
          ]
        },
      ],
      breadcrumbArr: [],
      isCollapse: false,
      isOpened: true
    };
  },
  methods: {
    handleNodeClick(data) {
      if (!data.children) {
        this.currentLocation = data.label;
        this.$router.push({ path: data.path });
      }
    },
    handleCommand(command) {
      switch (command) {
        case "退出登录":
          sessionStorage.removeItem("routerPaths");
          sessionStorage.removeItem("user");
          localStorage.removeItem("token");
          this.$router.push({ path: "/" });
          break;
      }
    },
    aaa(point, w, t) {
      point.$refs.menu.style.width = w + "px";
      point.$refs.menu.style.transitionDuration = t + "s";
      point.$refs.main.style.marginLeft = w + "px";
      point.$refs.main.style.transitionDuration = t + "s";
      point.$refs.mainTop.style.paddingLeft = w + "px";
      point.$refs.mainTop.style.transitionDuration = t + "s";
    },
    isSpread() {
      let _this = this;
      switch (this.isCollapse) {
        case false:
          setTimeout(function() {
            _this.aaa(_this, 77, 0.5);
          }, 300);
          _this.isCollapse = true;
          break;
        default:
          _this.aaa(_this, 210, 0.5);
          _this.isCollapse = false;
          break;
      }
    },
    routerJump(label, path) {
      var obj = {
        path: path,
        label: label
      };
      if (this.breadcrumbArr.length !== 0) {
        var flag = this.breadcrumbArr.some(item => {
          if (item.path == obj.path) {
            return true;
          }
        });
        if (flag !== true) {
          this.breadcrumbArr.push(obj);
        }
      } else {
        this.breadcrumbArr.push(obj);
      }
      this.$router.push({ path: path });
    }
  },
  created() {},
  mounted() {
    let _this = this;
    window.onresize = function() {
      if (window.innerWidth <= 1024) {
        setTimeout(function() {
          _this.aaa(_this, 77, 0.5);
        }, 300);
        _this.isCollapse = true;
      } else {
        _this.aaa(_this, 210, 0.5);
        _this.isCollapse = false;
      }
    };
  }
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
.container {
  width: 100%;
  overflow: hidden;
  position: relative;
  .menu {
    width: 210px;
    height: 100%;
    background-color: #545c64;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    .tac {
      .el-col {
        .el-menu {
          border: 0;
          width: 100%;
          .el-menu-item {
            width: 100%;
          }
        }
      }
      ul {
        li {
          min-width: 0;
        }
      }
    }
  }
  .main {
    width: 100%;
    margin-left: 210px;
    .main-top {
      width: 100%;
      height: 60px;
      display: flex;
      background-color: #fff;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 10;
      box-shadow: 0px 5px 5px #f3eeee;
      box-sizing: border-box;
      padding-left: 210px;
      .spread {
        width: 10%;
        min-width: 80px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          cursor: pointer;
        }
        span:hover {
          color: #ccc;
        }
      }
      .title {
        width: 24%;
        min-width: 422px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        font-weight: 700;
      }
      .information {
        width: 76%;
        height: 100%;
        display: flex;
        .info-account {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          .el-dropdown {
            width: 30px;
            margin-right: 200px;
            cursor: pointer;
          }
          img {
            width: 100%;
          }
        }
      }
    }
    .main-middle {
      box-sizing: border-box;
      margin: 80px 2% 0 2%;
      padding-left: 20px;
      font-size: 14px;
      font-family: "STHeiti";
      font-weight: 700;
      color: #fff;
    }
    .main-bottom {
      width: 100%;
      box-sizing: border-box;
      padding: 20px 2% 40px 2%;
      .systeminfo {
        font-size: 14px;
        position: fixed;
        bottom: 10px;
        right: 2%;
      }
    }
  }
}
// .active {
//   color: #ffd04b !important;
// }
</style>
