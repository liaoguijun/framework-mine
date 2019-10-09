<template>
  <div class="logincontainer" :style="windowSize">
    <div class="loginbox">
      <div class="left">
        <div class="welcomebox">
          <p>欢迎来到</p>
          <p>端台智能预警管理系统</p>
        </div>
      </div>
      <div class="right">
        <div class="formbox">
          <h4>端台智能预警管理系统</h4>
          <el-form :model="loginform" label-width="80px">
            <el-form-item label="用户名">
              <el-input v-model="loginform.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="loginform.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="记住密码" prop="delivery">
              <el-switch v-model="loginform.checked"></el-switch>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="loginIn">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as types from "../store/types";
export default {
  data() {
    return {
      windowSize: {
        height: ""
      },
      loginform: {
        username: "",
        password: "",
        checked: true
      }
    };
  },
  methods: {
    getWindowSize() {
      this.windowSize.height = window.innerHeight + "px";
    },
    loginIn() {
      if (this.loginform.username !== "" && this.loginform.password !== "") {
        this.axios
          .post("/admin/login/token", {
            username: this.loginform.username,
            password: this.loginform.password
          })
          .then(res => {
            if (res.status === 200) {
              this.$store.commit(types.LOGIN, res.data.data.access_token);
              this.$alert("登录成功", "提示", {
                confirmButtonText: "确定",
                callback: action => {
                  this.$router.push({ path: "/monitor" });
                }
              });
            }
          })
          .catch(response => {
            this.$alert("用户名或密码错误", "提示", {
              confirmButtonText: "确定"
            });
          });
      } else {
        this.$alert("用户名或密码不能为空", "提示", {
          confirmButtonText: "确定"
        });
      }
    }
  },
  created() {
    localStorage.removeItem("token");
  },
  mounted() {
    this.getWindowSize();
  },
  updated() {
    this.getWindowSize();
  }
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}

@media (min-width: 768px) {
  .logincontainer {
    width: 100%;
    background: url("../assets/login/beijing.png");
    background-size: cover;
    background-position: center 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .loginbox {
      width: 900px;
      height: 400px;
      display: flex;
      .left {
        width: 60%;
        height: 100%;
        background-color: rgba(149, 161, 162, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        .welcomebox {
          width: 54%;
          height: 40%;
          p {
            height: 40px;
            line-height: 40px;
            color: #fff;
            font-size: 20px;
          }
          p:nth-child(1) {
            border-bottom: 1px solid #fff;
          }
        }
      }
      .right {
        width: 40%;
        height: 100%;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        .formbox {
          width: 80%;
          height: 80%;
          h4 {
            height: 60px;
            width: 100%;
            line-height: 60px;
            text-align: center;
          }
        }
      }
    }
  }
}
@media (max-width: 768px) {
  .logincontainer {
    width: 100%;
    background: url("../assets/login/beijing.png");
    background-size: cover;
    background-position: center 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .loginbox {
      width: 340px;
      height: 400px;
      display: flex;
      .left {
        display: none;
      }
      .right {
        width: 100%;
        height: 100%;
        background-color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        .formbox {
          width: 80%;
          height: 80%;
          h4 {
            height: 60px;
            width: 100%;
            line-height: 60px;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>>