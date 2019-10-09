<template>
  <div class="foldlist">
    <div class="foldlist-title">{{listData.title}}</div>
    <div class="foldlist-operation">
      <div class="foldlist-operation-btn">
        <el-button type="primary" round @click="add(listData.where)">新增</el-button>
      </div>
      <div class="foldlist-operation-fresh">
      </div>
    </div>
    <el-table
      :data="listData.tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      :tree-props="{children: 'birdsCategoryClasses'}"
    >
      <el-table-column
        v-for="(item,index) in listData.tableList"
        :key="index"
        :label="item.label"
        :prop="item.prop"
      ></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="editor(scope.row)" type="primary" size="mini" v-if="!scope.row.date">编辑</el-button>
          <el-button
            @click="singleRemove(scope.row.id, scope.$index)"
            type="text"
            size="small"
            v-if="!scope.row.date"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
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
    add(where) {
      var obj = {
        identify: "add",
        data: where
      };
      this.$emit("parent", obj);
    }
  },
  props: ["listData"]
};
</script>


<style lang="less">
.foldlist {
  width: 100%;
  background-color: #fff;
  margin: 20px;
  border-radius: 10px;
  box-sizing: border-box;
  padding: 0 20px 20px 20px;
  .foldlist-title {
    width: 100%;
    height: 50px;
    box-sizing: border-box;
    padding-left: 20px;
    display: flex;
    align-items: center;
    font-size: 16px;
    border-bottom: 1px solid #666;
  }
  .foldlist-operation {
    height: 60px;
    display: flex;
    align-items: center;
    .foldlist-operation-btn {
      width: 80%;
      .el-button.is-round {
        padding: 8px 12px;
        border-radius: 16px;
      }
    }
    .foldlist-operation-fresh {
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
}
</style>