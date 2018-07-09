<template>
  <el-card class="box-card">
   <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索区域 -->
    <el-row class="searchArea">
      <el-col :span="24">
        <el-input class="searchInput" clearable placeholder="请输入内容">
          <el-button  slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" plain>成功按钮</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      v-loading="loadning"
      stripe
      border
      :data="list"
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="100">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        label="创建日期">
        <template slot-scope="scope">
          {{ scope.row.create_time | famDate('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column
        label="用户状态" width="100">
        <template slot-scope="scope">
          <!-- scope.row就是当前行绑定的数据对象 -->
          <el-switch
            v-model="scope.row.my_status"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" icon="el-icon-edit"></el-button>
          <el-button plain size="mini" type="danger" icon="el-icon-delete"></el-button>
          <el-button plain size="mini" type="success" icon="el-icon-check"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card> 
</template>

<script>
export default {
  data() {
    return {
      list:[],
      loading: true
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      // 发送异步请求之前
      this.loading = true;
      // 发送请求之前，获取token
      const token = sessionStorage.getItem('token');
      // 在请求头中设置token
      this.$http.defaults.headers.common['Authorization'] = token;
      // 异步请求结束之后
      this.loading = false;
      const res = await this.$http.get('users?pagenum=1&pagesize=10');
      const data = res.data;
      const { meta: {status, msg} } = data;
      if (status === 200) {
        const { data : { users }} = data;
        this.list = users;
      } else {
        this.$message.error(msg);
      }
    }
  }      
};    
</script>

<style>
.box-card {
height: 100%;
}
.searchArea {
  margin-top: 20px;
  margin-bottom: 10px;
}
.searchArea .searchInput {
  width: 350px;
}
</style>
