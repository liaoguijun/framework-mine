<template>
  <div class="container">
    <div class="filterbox">
      <el-form :model="paramsList" label-width="80px">
        <el-form-item label="站台名称： ">
          <el-input v-model="paramsList.name"></el-input>
        </el-form-item>
        <el-form-item label="站台编码： ">
          <el-input v-model="paramsList.num"></el-input>
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
        <el-form-item label="站台名称" :label-width="formLabelWidth" :rules="[
      { required: true}]">
          <el-input v-model="dialogForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="站台编码" :label-width="formLabelWidth" :rules="[ { required: true}]">
          <el-input v-model="dialogForm.num" auto-complete="off"></el-input>
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
      formLabelWidth: "120px",
      paramsList: {
        page: 1,
        limit: 10,
        sort: "createTime",
        order: "desc",
        name: "",
        num: ""
      },
      listData: {
        where: "platforminfo",
        title: "站台信息列表",
        operation: ["新增", "删除"],
        tableList: [
          {
            label: "序号",
            prop: "xuhao",
            sort: true
          },
          {
            label: "站台编码",
            prop: "num"
          },
          {
            label: "站台名称",
            prop: "name"
          }
        ],
        tableData: [],
        handle: ["编辑", "删除"],
        currentPage: 1,
        pages: 0,
        total: 0
      },
    };
  },
  methods: {
    conditionSearch() {
      this.getplatforminfoList();
    },
    getplatforminfoList() {
      this.axios
        .get("/codmin/station/list", {
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
            alert("获取站台信息列表出错！");
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
              "/codmin/station/update/" + this.dialogForm.id,
              this.dialogForm
            )
            .then(res => {
              if (res.status === 200) {
                this.$alert("修改成功", "提示", {
                  confirmButtonText: "确定",
                  callback: action => {
                    this.getplatforminfoList();
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
            .post("/codmin/station/add", this.dialogForm)
            .then(res => {
              if (res.status === 200) {
                this.$alert("添加成功", "提示", {
                  confirmButtonText: "确定",
                  callback: action => {
                    this.dialogFormVisible = false;
                    this.getplatforminfoList()
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
        pageSize: 10,
        sort: "createTime",
        order: "desc",
        name: "",
        num: ""
      };
      this.getplatforminfoList();
    },
    child(val) {
      switch (val.identify) {
        case "editor":
          this.dialog.title = "编辑站台信息";
          this.dialog.operating = "修改";
          this.axios
            .get("/codmin/station/detail/" + val.data.id)
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
                console.log(val.data)
          this.$confirm("是否删除该站台?", "提示", {
            confirmButtonText: "确定删除",
            cancelButtonText: "取消",
            type: "warning",
            center: true
          })
            .then(() => {
              this.axios
                .post("/codmin/station/remove/" + val.data[0])
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
            this.$confirm("请选择站台！", "提示", {
              type: "warning",
              center: true
            });
          } else {
            this.$confirm("是否删除被选中的站台列表?", "提示", {
              confirmButtonText: "确定删除",
              cancelButtonText: "取消",
              type: "warning",
              center: true
            })
              .then(() => {
                this.axios
                  .post("/codmin/station/remove-batch", {
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
          this.dialog.title = "添加站台";
          this.dialog.operating = "添加";
          this.dialogFormVisible = true;
          this.dialogForm = [];
          break;
        case "page":
          this.paramsList.page = val.data;
          this.getplatforminfoList();
          break;
        case "sizechange":
          this.paramsList.limit = val.data;
          this.getplatforminfoList();
          break;
        default:
      }
    }
  },
  created() {
    this.getplatforminfoList();
  },
  mounted() {},
  components: { Tablelist }
};
</script>

<style lang="less">
</style>