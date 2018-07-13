<template>
<el-card class="box-card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="商品管理" level2="商品分类"></my-breadcrumb>

    <el-row class="row-add">
      <el-col :span="24">
        <el-button type="success" plain>添加分类</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table
      v-loading="loading"
      border
      stripe
      :data="list"
      style="width: 100%">
      <el-tree-grid
        prop="cat_name"
        label="分类名称"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        childKey="children"
        :indentSize="30">
      </el-tree-grid>
      <el-table-column
        prop="cat_name"
        label="分类名称"
        width="180">
      </el-table-column>
      <el-table-column
        label="级别"
        width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-else-if="scope.row.cat_level === 1">二级</span>
          <span v-else-if="scope.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>
      <el-table-column
        label="是否有效">
        <template slot-scope="scope">
          {{ scope.row.cat_deleted ? '无效' : '有效' }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" icon="el-icon-edit" ></el-button>
          <el-button plain size="mini" type="danger" icon="el-icon-delete" ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>   
</template>

<script>
import ElTreeGrid from 'element-tree-grid';
export default {
  data() {
    return {
      list :[],
      loading:true,
      pagenum:1,
      pagesize:5,
      total:0  
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      const {data: resData} = await this.$http.get(`categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      this.loading = false;
      const {data: {result, total}} = resData;
      this.list = result;
      this.total = total;
    },
     handleSizeChange(val) {
       this.pagenum = val;
       this.loadData();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pagesize = val;
      this.loadData();
      console.log(`当前页: ${val}`);
    }
  },
    components: {
    ElTreeGrid
  }
}    
</script>

<style>
.box-card {
  height: 100%;
  overflow: auto;
}
.row-add {
  margin-top: 10px;
  margin-bottom: 5px;
}
</style>
