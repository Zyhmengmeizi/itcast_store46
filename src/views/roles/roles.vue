<template>
  <el-card class="box-card">
      <!-- 面包屑 -->
    <my-breadcrumb level1="权限管理" level2="角色列表"></my-breadcrumb>
    <el-row class="row-btn">
      <el-col :span="24">
        <el-button>添加角色</el-button>  
      </el-col>
    </el-row>
    <!-- 表格 -->
     <el-table
      border
      :data="list"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row
            class="level1" 
            v-for="item1 in scope.row.children"
            :key="item1.id">
            <el-col :span="4">
              <el-tag @close="hanldeClose(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row
              v-for="item2 in item1.children"
              :key="item2.id">
                <el-col :span="4">
                  <el-tag @close="hanldeClose(scope.row,item2.id)" closable type="success">{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag 
                  @close="hanldeClose(scope.row,item3.id)"
                  class="level3"
                  closable
                  type="warning"
                  v-for="item3 in item2.children" 
                  :key="item3.id">{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length===0">
            <el-col :span="24">未分配权限</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        width="80">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述"
        width="180">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" icon="el-icon-edit"></el-button>
          <el-button plain size="mini" type="danger" icon="el-icon-delete"></el-button>
          <el-button @click="dialogVisible=true" plain size="mini" type="success" icon="el-icon-check" ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="分配权限"
      :visible.sync="dialogVisible">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </el-card> 
</template>

<script>
export default {
  data() {
    return {
     list: [],
     dialogVisible: false 
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      // const res = await this.$http.get('roles');
      // console.log(res);
      // 服务器返回的数据
      const {data: resData} = await this.$http.get('roles');
      const {data, meta: {status, msg}} = resData;
      if(status === 200) {
        this.list = data;
      } else {
        this.$message.error(msg);
      }
    },
    async  hanldeClose(roleId, rightId) {
      const {data: resData} = await this.$http.delete(`roles/$(role.id)/rights/$(rightId)`);
      const {data,meta: {status,msg} } = resData;
      if(status === 200) {
        this.$message.success(msg);
        role.children = data;
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
  overflow: auto;
}
.row-btn {
  margin-top: 10px;
  margin-bottom: 10px;
}
.level3 {
margin-bottom: 5px;
margin-right: 5px;
}
.level1 {
  margin-bottom: 10px;
}
</style>
