<template>
  <div class="container">
    <div class="filterbox">
      <el-form :model="paramsList" label-width="80px">
        <el-form-item label="站台名：">
          <el-select v-model="paramsList.stationId" placeholder="请选择">
            <el-option
              v-for="item in platformArr"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理人员： ">
          <el-input v-model="paramsList.dealStaff"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="conditionSearch">搜索</el-button>
          <el-button @click="formReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <Tablelist :listData="listData" @parent="child"></Tablelist>

    <el-dialog :title="dialog.title" :visible.sync="dialogFormVisible">
      
    </el-dialog>
  </div>
</template>>

<script>
import Tablelist from "../public/tablelist";
import "../../css/my.less";
export default {
  data() {
    return {
      dialogFormVisible: false,
      dialogForm: {},
      dialog: {
        title: "",
        operating: ""
      },
      formLabelWidth: "120px",
      platformArr: [],
      paramsList: {
        page: 1,
        limit: 10,
        sort: "createTime",
        order: "asc",
        stationId: "",
        dealStaff: ""
      },
      listData: {
        where: "callpolicelist",
        title: "已处理报警列表",
        operation: [],
        tableList: [
          {
            label: "序号",
            prop: "xuhao",
            sort: true
          },
          {
            label: "站台名称",
            prop: "stationName"
          },
          {
            label: "报警位置",
            prop: "position"
          },
          {
            label: "报警类型",
            prop: "classes"
          },
          {
            label: "警报触发物",
            prop: "warnTrigger"
          },
          {
            label: "处理人员",
            prop: "dealStaff"
          },
          {
            label: "处理时间",
            prop: "dealTimeStr",
            sort: true
          },
          {
            label: "报警时间",
            prop: "warnTimeStr",
            sort: true
          }
        ],
        tableData: [],
        handle: ["视频记录"],
        currentPage: 1,
        pages: 0,
        total: 0
      }
    };
  },
  methods: {
    conditionSearch() {
      this.getCallpoliceList();
    },
    getCallpoliceList() {
      this.axios
        .get("/codmin/warnDealDesc/list", {
          params: this.paramsList
        })
        .then(res => {
          if (res.status === 200) {
            var a = 0;
            res.data.data.records.forEach(item => {
              item.xuhao = a;
              item.position = item.position === 1 ? "上行" : "下行";
              item.classes =
                item.classes === 0
                  ? "正常"
                  : item.classes === 1
                  ? "入侵"
                  : "误报";
              a++;
            });
            this.listData.tableData = res.data.data.records;
            this.listData.currentPage = parseInt(res.data.data.current);
            this.listData.pages = res.data.data.pages;
            this.listData.total = res.data.data.total;
          } else {
            alert("获取已处理报警列表出错！");
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    getPlatformList() {
      this.axios
        .get("/codmin/station/all")
        .then(res => {
          if (res.status === 200) {
            this.platformArr = res.data.data;
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    formReset() {
      this.paramsList = {
        page: 1,
        limit: 10,
        sort: "createTime",
        order: "asc",
        stationId: "",
        dealStaff: ""
      };
      this.getCallpoliceList();
    },
    child(val) {
      switch (val.identify) {
        case "record":
          console.log(val.data);
        case "editor":
          this.dialog.title = "编辑鸟类";
          this.dialog.operating = "修改";
          this.axios
            .get("/birds-server/bird/detail/" + val.data.id)
            .then(res => {
              this.dialogFormVisible = true;
              if (res.status === 200) {
                res.data.data.controlType =
                  res.data.data.controlType === 1 ? "1" : "0";
                this.dialogForm = res.data.data;
                this.uploadUrl = `http://192.168.6.22:8888/birds-server/file/upload-image`;
                this.uploadHeaders.Authorization = `Bearer ${localStorage.token}`;
              } else {
                this.$message({
                  type: "info",
                  message: "编辑失败"
                });
              }
            });
          break;
        case "singleRemove":
          this.$confirm("是否删除该鸟类?", "提示", {
            confirmButtonText: "确定删除",
            cancelButtonText: "取消",
            type: "warning",
            center: true
          })
            .then(() => {
              this.axios
                .post("/birds-server/bird/remove/" + val.data[0])
                .then(res => {
                  if (res.status === 200) {
                    this.$message({
                      type: "success",
                      message: "删除成功!"
                    });
                    this.listData.tableData.splice(val.data[1], 1);
                  }
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除"
              });
            });
          break;
        case "multipleRemove":
          if (!val.data.selectIdList[0]) {
            this.$confirm("请选择鸟类！", "提示", {
              type: "warning",
              center: true
            });
          } else {
            this.$confirm("是否删除被选中的鸟类?", "提示", {
              confirmButtonText: "确定删除",
              cancelButtonText: "取消",
              type: "warning",
              center: true
            })
              .then(() => {
                this.axios
                  .post("/birds-server/bird/remove-batch", {
                    idList: val.data.selectIdList
                  })
                  .then(res => {
                    if (res.status === 200) {
                      this.$message({
                        type: "success",
                        message: "删除成功!"
                      });
                      val.data.selectIndexList.forEach(item => {
                        this.listData.tableData.splice(item, 1);
                      });
                    } else {
                      this.$message({
                        type: "error",
                        message: "删除失败"
                      });
                    }
                  });
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消删除"
                });
              });
          }
          break;
        case "add":
          this.dialog.title = "添加鸟类";
          this.dialog.operating = "添加";
          this.dialogFormVisible = true;
          this.dialogForm = [];
          this.getCategoryList();
          this.chooseCategory();
          break;
        case "page":
          this.paramsList.page = val.data;
          this.getBidsList();
          break;
        case "sizechange":
          this.paramsList.limit = val.data;
          this.getBidsList();
          break;
        default:
      }
    }
  },
  created() {
    this.getCallpoliceList();
    this.getPlatformList()
  },
  mounted() {},
  components: { Tablelist }
};
</script>

<style lang="less">
</style>