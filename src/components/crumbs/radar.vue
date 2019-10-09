<template>
  <div class="container">
    <div class="filterbox">
      <el-form ref="form" :model="paramsList" label-width="140px">
        <el-form-item label="雷达编码： ">
          <el-input v-model="paramsList.nameZh"></el-input>
        </el-form-item>
        <el-form-item label="端口号： ">
          <el-input v-model="paramsList.nameUs"></el-input>
        </el-form-item>
        <el-form-item label="雷达所属站台：">
          <el-select v-model="paramsList.categoryId" placeholder="请选择所属站台">
            <el-option
              v-for="item in categoryArr"
              :key="item.id"
              :label="item.categoryName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="雷达所属方向：">
          <el-select v-model="paramsList.categoryId" placeholder="请选择方向">
            <el-option label="上行" value="1"></el-option>
            <el-option label="下行" value="2"></el-option>
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
        <el-form-item label="中文名" :label-width="formLabelWidth" :rules="[
      { required: true}]">
          <el-input v-model="dialogForm.nameZh" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="英文名" :label-width="formLabelWidth" :rules="[ { required: true}]">
          <el-input v-model="dialogForm.nameUs" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属目" :label-width="formLabelWidth" :rules="[{ required: true}]">
          <el-select v-model="dialogForm.categoryId" placeholder="请选择所属目" @change="chooseCategory">
            <el-option
              v-for="item in categoryArr"
              :key="item.id"
              :label="item.categoryName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属科" :label-width="formLabelWidth" :rules="[{ required: true}]">
          <el-select v-model="dialogForm.categoryClassId" placeholder="请选择" @change="chooseFamily">
            <el-option-group
              v-for="group in familyArr"
              :key="group.categoryName"
              :label="group.categoryName"
            >
              <el-option
                v-for="item in group.birdsCategoryClasses"
                :key="item.id"
                :label="item.categoryClassName"
                :value="item.id"
              ></el-option>
            </el-option-group>
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
      categoryArr: [],
      familyArr: [],
      formLabelWidth: "120px",
      paramsList: {
        page: 1,
        limit: 10,
        sort: "createTime",
        order: "asc",
        nameZh: "",
        nameUs: "",
        categoryId: "",
        categoryClassId: ""
      },
      listData: {
        where: "radar",
        title: "雷达列表",
        operation: ["新增", "删除"],
        tableList: [
          {
            label: "序号",
            prop: "nameZh",
            sort: true
          },
          {
            label: "雷达编码",
            prop: "nameUs"
          },
          {
            label: "雷达端口",
            prop: "categoryName"
          },
          {
            label: "雷达所属站台",
            prop: "categoryClassName"
          },
          {
            label: "雷达所处方向",
            prop: "categoryClassName"
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
      this.getBidsList();
    },
    getBidsList() {
      this.axios
        .get("birds-server/bird/list", {
          params: this.paramsList
        })
        .then(res => {
          if (res.status === 200) {
            res.data.data.records.forEach(item => {
              item.controlType = item.controlType === 1 ? "1" : "0";
              item.imagePath = `/api/${item.imagePath}`;
            });
            this.listData.tableData = res.data.data.records;
            this.listData.currentPage = parseInt(res.data.data.current);
            this.listData.pages = res.data.data.pages;
            this.listData.total = res.data.data.total;
          } else {
            alert("获取鸟类列表出错！");
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
              "/birds-server/bird/update/" + this.dialogForm.id,
              this.dialogForm
            )
            .then(res => {
              if (res.status === 200) {
                this.$alert("修改成功", "提示", {
                  confirmButtonText: "确定",
                  callback: action => {
                    this.getBidsList();
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
            .post("/birds-server/bird/add", this.dialogForm)
            .then(res => {
              if (res.status === 200) {
                this.$alert("添加成功", "提示", {
                  confirmButtonText: "确定",
                  callback: action => {
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
    getCategoryList() {
      this.axios
        .get("/birds-server/birds-category/all", {
          params: {
            categoryName: "",
            createTime: "",
            delType: "",
            id: "",
            updateTime: ""
          }
        })
        .then(res => {
          if (res.status === 200) {
            this.categoryArr = res.data.data;
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    chooseCategory(val) {
      this.axios
        .get("/birds-server/birds-category-class/list-by-category", {
          params: {
            categoryId: val
          }
        })
        .then(res => {
          if (res.status === 200) {
            this.familyArr = res.data.data;
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    chooseFamily(val) {
      // console.log(this.familyArr);
    },
    formReset() {
      this.paramsList = {
        page: 1,
        pageSize: 10,
        sort: "createTime",
        order: "asc",
        nameZh: "",
        nameUs: "",
        categoryId: "",
        categoryClassId: ""
      };
      this.getBidsList();
    },
    getNewValue(val, id) {
      this.axios
        .post("/birds-server/bird/update-control-type", {
          controlType: val,
          id: id
        })
        .then(res => {
          if (res.status === 200) {
            alert("更改监测对象成功！");
          }
        })
        .catch(res => {
          alert("更改监测对象失败！");
        });
    },
    child(val) {
      switch (val.identify) {
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
        case "jiance":
          this.getNewValue(val.data[0], val.data[1].id);
          break;
        default:
      }
    }
  },
  created() {
    this.getBidsList();
    this.getCategoryList();
  },
  mounted() {},
  components: { Tablelist }
};
</script>

<style lang="less">
</style>