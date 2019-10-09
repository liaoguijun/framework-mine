<template>
  <div class="container">
    <div class="filterbox">
      <el-form ref="form" :model="paramsList" label-width="140px">
        <el-form-item label="LEDIP： ">
          <el-input v-model="paramsList.nameZh"></el-input>
        </el-form-item>
        <el-form-item label="LED端口号： ">
          <el-input v-model="paramsList.nameUs"></el-input>
        </el-form-item>
        <el-form-item label="LED所属站台：">
          <el-select v-model="paramsList.stationId" placeholder="请选择所属目">
            <el-option
              v-for="item in platformArr"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="conditionSearch">搜索</el-button>
          <el-button @click="formReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <Tablelist :listData="listData" @parent="child"></Tablelist>

    <el-dialog :title="dialog.title" :visible.sync="dialogFormVisible">
      <el-form :model="dialogForm">
        <el-form-item label="LED端口" :label-width="formLabelWidth" :rules="[
      { required: true}]">
          <el-input v-model="dialogForm.port" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="LEDIP" :label-width="formLabelWidth" :rules="[ { required: true}]">
          <el-input v-model="dialogForm.ip"></el-input>
        </el-form-item>
        <el-form-item label="LED所属站台" :label-width="formLabelWidth" :rules="[{ required: true}]">
          <el-select v-model="dialogForm.stationId" placeholder="请选择所属目">
            <el-option
              v-for="item in platformArr"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogOperating(dialog.operating)">{{dialog.operating}}</el-button>
      </div>
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
      platformArr: [],
      formLabelWidth: "120px",
      paramsList: {
        page: 1,
        limit: 10,
        sort: "createTime",
        order: "asc",
        ip: "",
        port: "",
        stationId: ""
      },
      listData: {
        where: "led",
        title: "LED列表",
        operation: ["新增", "删除"],
        tableList: [
          {
            label: "序号",
            prop: "xuhao",
            sort: true
          },
          {
            label: "LED端口",
            prop: "port"
          },
          {
            label: "LEDIP",
            prop: "ip"
          },
          {
            label: "LED所属站台",
            prop: "stationName"
          }
        ],
        tableData: [],
        handle: ["编辑", "删除"],
        currentPage: 1,
        pages: 0,
        total: 0
      }
    };
  },
  methods: {
    conditionSearch() {
      this.getledList();
    },
    getledList() {
      this.axios
        .get("/codmin/led/list", {
          params: this.paramsList
        })
        .then(res => {
          if (res.status === 200) {
            var a = 0;
            res.data.data.records.forEach(item => {
              item.xuhao = a;
              a++;
            });
            this.listData.tableData = res.data.data.records;
            this.listData.currentPage = parseInt(res.data.data.current);
            this.listData.pages = res.data.data.pages;
            this.listData.total = res.data.data.total;
          } else {
            alert("获取LED列表出错！");
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
    dialogOperating(val) {
      switch (val) {
        case "修改":
          this.axios
            .post(
              "/codmin/led/update/" + this.dialogForm.id,
              this.dialogForm
            )
            .then(res => {
              if (res.status === 200) {
                this.$alert("修改成功", "提示", {
                  confirmButtonText: "确定",
                  callback: action => {
                    this.getledList();
                    this.dialogFormVisible = false;
                  }
                });
              }
            })
            .catch(res => {
              this.$alert("修改失败", "提示", {
                confirmButtonText: "确定",
                callback: action => {
                  this.dialogFormVisible = false;
                }
              });
            });
          break;
        case "添加":
          this.axios
            .post("/codmin/led/add", this.dialogForm)
            .then(res => {
              if (res.status === 200) {
                this.$alert("添加成功", "提示", {
                  confirmButtonText: "确定",
                  callback: action => {
                    this.getledList()
                    this.dialogFormVisible = false;
                  }
                });
              }
            })
            .catch(res => {
              this.$alert("添加失败", "提示", {
                confirmButtonText: "确定",
                callback: action => {
                  this.dialogFormVisible = false;
                }
              });
            });
          break;
      }
    },
    formReset() {
      this.paramsList = {
        page: 1,
        limit: 10,
        sort: "createTime",
        order: "asc",
        ip: "",
        port: "",
        stationId: ""
      };
      this.getledList();
    },
    child(val) {
      switch (val.identify) {
        case "editor":
          this.dialog.title = "编辑LED";
          this.dialog.operating = "修改";
          this.axios
            .get("/codmin/led/detail/" + val.data.id)
            .then(res => {
              this.dialogFormVisible = true;
              if (res.status === 200) {
                this.dialogForm = res.data.data;
              } else {
                this.$message({
                  type: "info",
                  message: "编辑失败"
                });
              }
            });
          break;
        case "singleRemove":
          this.$confirm("是否删除该LED?", "提示", {
            confirmButtonText: "确定删除",
            cancelButtonText: "取消",
            type: "warning",
            center: true
          })
            .then(() => {
              this.axios
                .post("/codmin/led/remove/" + val.data[0])
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
            this.$confirm("请选择LED！", "提示", {
              type: "warning",
              center: true
            });
          } else {
            this.$confirm("是否删除被选中的LED?", "提示", {
              confirmButtonText: "确定删除",
              cancelButtonText: "取消",
              type: "warning",
              center: true
            })
              .then(() => {
                this.axios
                  .post("/codmin/led/remove-batch", {
                    ids: val.data.selectIdList
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
          this.dialog.title = "添加相机";
          this.dialog.operating = "添加";
          this.dialogFormVisible = true;
          this.dialogForm = [];
          break;
        case "page":
          this.paramsList.page = val.data;
          this.getledList();
          break;
        case "sizechange":
          this.paramsList.limit = val.data;
          this.getledList();
          break;
        default:
      }
    }
  },
  created() {
    this.getledList();
    this.getPlatformList();
  },
  mounted() {},
  components: { Tablelist }
};
</script>

<style lang="less">
</style>