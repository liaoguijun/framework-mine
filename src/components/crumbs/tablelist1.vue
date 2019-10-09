<template>
  <div class="container">
    <div class="filterbox">
      <el-form ref="form" :model="paramsList" label-width="80px">
        <el-form-item label="标题1： ">
          <el-input v-model="paramsList.prop1"></el-input>
        </el-form-item>
        <el-form-item label="标题2： ">
          <el-input v-model="paramsList.prop2"></el-input>
        </el-form-item>
        <el-form-item label="标题3：">
          <el-select v-model="paramsList.prop3" placeholder="请选择">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">搜索</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <Tablelist :listData="listData" @parent="child"></Tablelist>

    <el-dialog :title="dialog.title" :visible.sync="dialogFormVisible">
      <el-form :model="dialogForm">
        <el-form-item label="标题1" :label-width="formLabelWidth" :rules="[
      { required: true}]">
          <el-input v-model="dialogForm.nameZh" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="标题2" :label-width="formLabelWidth" :rules="[ { required: true}]">
          <el-input v-model="dialogForm.nameUs" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="标题3" :label-width="formLabelWidth" :rules="[{ required: true}]">
          <el-select v-model="dialogForm.categoryId" placeholder="请选择所属目">
            <el-option
              v-for="item in categoryArr"
              :key="item.id"
              :label="item.categoryName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="上传图片" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            :action="uploadUrl"
            :headers="uploadHeaders"
            :on-success="handleSuccess"
            :file-list="fileList2"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="是否" :label-width="formLabelWidth">
          <el-switch
            v-model="dialogForm.controlType"
            inactive-value="0"
            active-value="1"
            @change="getNewValue($event, dialogForm.id)"
          ></el-switch>
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
        where: "tablelist",
        title: "table列表",
        operation: ["新增", "删除"],
        tableList: [
          {
            label: "标题1",
            prop: "prop1",
            sort: true
          },
          {
            label: "标题2",
            prop: "prop2"
          },
          {
            label: "标题3",
            prop: "prop3"
          },
          {
            label: "标题4",
            prop: "prop4"
          }
        ],
        tableData: [
          {
            prop1: "1",
            prop2: "2",
            prop3: "3",
            prop4: "4",
            image: require("../../assets/bidslist/xiaoyanzi.jpg"),
            control: "1",
            id: 111
          },
          {
            prop1: "1",
            prop2: "2",
            prop3: "3",
            prop4: "4",
            image: require("../../assets/bidslist/xiaoyanzi.jpg"),
            control: "1",
            id: 111
          }
        ],
        handle: ["编辑", "删除"],
        currentPage: 1,
        pages: 0,
        total: 0
      },
      fileList2: [],
      uploadUrl: "",
      uploadHeaders: {},
      uploadData: {}
    };
  },
  methods: {
    child(val) {
      switch (val.identify) {
        case "editor":
          this.dialog.title = "编辑";
          this.dialog.operating = "修改";
          this.dialogFormVisible = true;
          break;
        case "singleRemove":
          this.$confirm("是否删除?", "提示", {
            confirmButtonText: "确定删除",
            cancelButtonText: "取消",
            type: "warning",
            center: true
          })
            .then(() => {
              alert("单个删除接口编写");
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
            this.$confirm("请选择！", "提示", {
              type: "warning",
              center: true
            });
          } else {
            this.$confirm("是否删除被选中的?", "提示", {
              confirmButtonText: "确定删除",
              cancelButtonText: "取消",
              type: "warning",
              center: true
            })
              .then(() => {
                alert("多个删除接口编写");
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
          this.dialog.title = "添加";
          this.dialog.operating = "添加";
          this.dialogFormVisible = true;
          this.dialogForm = {};
          break;
        case "page":
          this.paramsList.page = val.data;
          alert(val.data);
          break;
        case "sizechange":
          this.paramsList.limit = val.data;
          alert(val.data);
          break;
        case "choose":
          alert(val.data[0]);
          break;
        default:
      }
    },
    getNewValue($event, id) {
      console.log($event, id)
    },
    handleSuccess(res) {
      console.log(res)
    }
  },
  created() {},
  mounted() {},
  components: { Tablelist }
};
</script>

<style lang="less">
</style>