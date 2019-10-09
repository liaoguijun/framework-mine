<template>
  <div class="container">
    <div class="filterbox">
      <el-form label-width="120px">
        <el-form-item label="目：">
          <el-select v-model="paramsList.categoryId" placeholder="请选择目">
            <el-option
              v-for="item in categoryArr"
              :key="item.id"
              :label="item.categoryName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科：">
          <el-select v-model="paramsList.categoryClassId" placeholder="请选择">
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
        <el-form-item>
          <el-button type="primary">搜索</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <Tablefoldlist :listData="listData" @parent="child"></Tablefoldlist>

    <el-dialog title="提示" :visible.sync="dialogFormVisible1" width="30%">
      <span>请选择添加目或科</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="addCategory">目</el-button>
        <el-button type="primary" @click="addFamily">科</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="dialog.title" :visible.sync="dialogFormVisible3">
      <el-form>
        <el-form-item label="目" :label-width="formLabelWidth">
          <el-select v-model="dialogForm.categoryId" placeholder="请选择所属目">
            <el-option
              v-for="item in categoryArr"
              :key="item.id"
              :label="item.categoryName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科" :label-width="formLabelWidth">
          <el-input
            v-model="dialogForm.categoryClassName"
            placeholder="以“科”字结尾"
            auto-complete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="dialogOperating(dialog.operating)">{{dialog.operating}}</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加目" :visible.sync="dialogFormVisible2">
      <el-form>
        <el-form-item label="目" :label-width="formLabelWidth">
          <el-input v-model="dialogForm.categoryName" placeholder="以“目”字结尾" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="dialogOperating('添加目')">添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Tablefoldlist from "../public/tablefoldlist";
export default {
  data() {
    return {
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      paramsList: {
        categoryId: "",
        categoryClassId: ""
      },
      categoryArr: [],
      familyArr: [],
      dialog: {
        title: "",
        operating: ""
      },
      dialogForm: {},
      formLabelWidth: "120px",
      listData: {
        where: "tablefoldlist",
        title: "tablefold列表",
        operation: ["新增", "删除"],
        tableList: [
          {
            label: "鸟类目",
            prop: "categoryName"
          },
          {
            label: "鸟类科",
            prop: "categoryClassName"
          },
          {
            label: "创建时间",
            prop: "createTime"
          }
        ],
        tableData: [],
        handle: ["编辑", "删除"]
      }
    };
  },
  created() {},
  methods: {
    addCategory() {
      var _this = this;
      setTimeout(function() {
        _this.dialogFormVisible1 = false;
      }, 1000);
      _this.dialogFormVisible2 = true;
    },
    addFamily() {
      var _this = this;
      setTimeout(function() {
        _this.dialogFormVisible1 = false;
      }, 1000);
      _this.dialog.title = "添加科";
      _this.dialog.operating = "添加";
      _this.dialogFormVisible3 = true;
    },
    dialogOperating(val) {
      switch (val) {
        case "添加目":
          alert(val);
          break;
        case "添加科":
          alert(val);
          break;
        case "修改":
          alert(val);
          break;
      }
    },
    child(val) {
      switch (val.identify) {
        case "editor":
          this.dialog.title = "编辑科";
          this.dialog.operating = "修改";
          this.dialogFormVisible3 = true;
          break;
        case "singleRemove":
          this.$confirm("是否删除该鸟类科/目?", "提示", {
            confirmButtonText: "确定删除",
            cancelButtonText: "取消",
            type: "warning",
            center: true
          })
            .then(() => {
              alert("单个删除接口编写")
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除"
              });
            });
          break;

        case "add":
          this.dialogFormVisible1 = true;
          this.dialogForm = {};
          break;
        case "page":
          break;
        default:
      }
    }
  },
  components: { Tablefoldlist }
};
</script>

<style lang="less">
</style>