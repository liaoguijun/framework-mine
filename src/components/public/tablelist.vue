<template>
  <div class="list">
    <div class="list-title">{{listData.title}}</div>
    <div class="list-operation">
      <div class="list-operation-btn">
        <el-button
          v-if="listData.operation.indexOf('新增') !== -1"
          type="primary"
          round
          @click="add(listData.where)"
        >新增</el-button>
        <el-button
          v-if="listData.operation.indexOf('删除') !== -1"
          type="info"
          round
          @click="multipleRemove"
        >删除</el-button>
      </div>
      <div class="list-operation-fresh"></div>
    </div>
    <el-table
      ref="multipleTable"
      :data="listData.tableData"
      tooltip-effect="dark"
      style="width: 100%"
      :default-sort="{prop: 'date', order: 'descending'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        v-for="item in listData.tableList"
        :key="item.id"
        :prop="item.prop"
        :label="item.label"
        :sortable="item.sort?true:false"
        :width="item.sort?180:''"
        :show-overflow-tooltip="item.sort?true:false"
        align="center"
      ></el-table-column>

      <el-table-column
        v-if="listData.where === 'birdslist' || listData.where === 'birdsphotographed'"
        label="图片"
        prop="imagePath"
      >
        <template slot-scope="scope">
          <img :src="scope.row.imagePath" alt style="width: 50px;height: 30px" />
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="listData.handle.indexOf('视频记录') !== -1 "
            type="text"
            @click="record(scope.row)"
          >视频记录</el-button>
          <el-button
            v-if="listData.handle.indexOf('编辑') !== -1 "
            type="text"
            @click="editor(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="listData.handle.indexOf('删除') !== -1"
            type="text"
            @click="singleRemove(scope.row.id, scope.$index)"
          >删除</el-button>
          <el-button v-if="listData.handle.indexOf('重置') !== -1" type="text">重置</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="list-paging">
      <el-pagination
        @size-change="sizeChange"
        @current-change="pageSwitch"
        :current-page="listData.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listData.pages*10"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      value1: "",
      value2: "",
      select: {
        selectIdList: [],
        selectIndexList: []
      },
      monitorArr: []
    };
  },
  methods: {
    record(data) {
      var obj = {
        identify: "record",
        data: data
      };
      this.$emit("parent", obj);
    },
    editor(data) {
      var obj = {
        identify: "editor",
        data: data
      };
      this.$emit("parent", obj);
    },
    singleRemove(id, index) {
      var obj = {
        identify: "singleRemove",
        data: [id, index]
      };
      this.$emit("parent", obj);
    },
    multipleRemove() {
      var obj = {
        identify: "multipleRemove",
        data: this.select
      };
      this.$emit("parent", obj);
    },
    add(where) {
      var obj = {
        identify: "add",
        data: where
      };
      this.$emit("parent", obj);
    },
    onoff(value) {
      console.log(value);
    },
    sizeChange(val) {
      var obj = {
        identify: "sizechange",
        data: val
      };
      this.$emit("parent", obj);
    },
    pageSwitch(page) {
      var obj = {
        identify: "page",
        data: page
      };
      this.$emit("parent", obj);
    },
    handleSelectionChange(val) {
      var idList = [];
      var indexList = [];
      val.forEach(item => {
        idList.push(item.id);
      });
      this.select.selectIdList = idList.join("-");
      val.forEach((val, index) => {
        this.listData.tableData.forEach((v, i) => {
          if (val.id == v.id) {
            indexList.push(i);
          }
        });
      });
      this.select.selectIndexList = indexList;
    },
    getNewValue(controlType, data) {
      var obj = {
        identify: "jiance",
        data: [controlType, data]
      };
      this.$emit("parent", obj);
    }
  },
  created() {},
  mounted() {},
  watch: {
    listData: {
      deep: true,
      handler(newValue, oldValue) {
        newValue.tableData.forEach(item => {
          this.monitorArr.push(item.controlType);
        });
      }
    }
  },
  props: ["listData"]
};
</script>
<style lang="less">
.list {
  width: 100%;
  margin-top: 20px;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 0 20px 20px 20px;
  .list-title {
    width: 100%;
    height: 50px;
    box-sizing: border-box;
    padding-left: 20px;
    display: flex;
    align-items: center;
    font-size: 16px;
    border-bottom: 1px solid #666;
  }
  .list-operation {
    height: 60px;
    display: flex;
    align-items: center;
    .list-operation-btn {
      width: 80%;
      .el-button.is-round {
        padding: 8px 12px;
        border-radius: 16px;
      }
    }
    .list-operation-fresh {
      width: 20%;
      box-sizing: border-box;
      padding-right: 40px;
      display: flex;
      justify-content: flex-end;
      span {
        color: #000;
        cursor: pointer;
      }
      span:hover {
        color: #02c0ff;
      }
    }
  }
  .list-paging {
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>