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
        <el-input v-model="searchValue" class="searchInput" clearable placeholder="请输入内容">
          <el-button @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" @click="addUserDialogVisible = true" plain>添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      v-loading="loading"
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
            @change="handleSwitchChange(scope.row)"
            v-model="scope.row.my_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button @click="handleShowEditDialog(scope.row)" plain size="mini" type="primary" icon="el-icon-edit"></el-button>
          <el-button @click="handleDelete(scope.row.id)" plain size="mini" type="danger" icon="el-icon-delete"></el-button>
          <el-button @click="handleShowSetRole(scope.row)" plain size="mini" type="success" icon="el-icon-check"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加用户的弹出框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogVisible" @closed="handleClosed">
      <el-form
        ref="myform"
        :rules="formRules"
        label-width="100px"
        :model="formData">
        <el-form-item label="用户名" prop="username">
          <el-input type="username" v-model="formData.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="formData.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="email" v-model="formData.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input type="mobile" v-model="formData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户的弹出框 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editUserDialogVisible" @closed="handleClosed">
      <el-form
        label-width="100px"
        :model="formData">
        <el-form-item label="用户名" prop="username">
          <el-input type="username" v-model="formData.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="email" v-model="formData.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input type="mobile" v-model="formData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible">
      <el-form
        label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input  disabled auto-complete="off">
            {{ currentUserName }}
          </el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="currentRoleId">
            <el-option disabled label="请选择" value="-1">
            </el-option>
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button @click="handleSetRole" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </el-card> 
</template>

<script>
export default {
  data() {
    return {
      list: [],
      loading: true,
      pagenum: 1,
      pagesize: 4,
      total: 0,
      searchValue :'',
      addUserDialogVisible: false,
      formData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      formRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 1, max: 6, message: '长度在 1 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
      },
      editUserDialogVisible: false,
      setRoleDialogVisible: false,
      // 分配角色需要的数据
      currentUserName :'',
      currentUserId :-1,
      currentRoleId : -1,
      roles: []
    }
      
  },
  created() {
    this.loadData();
  },
  methods: {
    handleSizeChange(val) {
        this.pagesize = val;
        this.loadData();
        console.log(`每页 ${val} 条`);
      },
    handleCurrentChange(val) {
        this.pagenum = val;
        this.loadData();
        console.log(`当前页: ${val}`);
      },
    async loadData() {
      // 发送异步请求之前
      this.loading = true;
      // 发送请求之前，获取token
      const token = sessionStorage.getItem('token');
      // 在请求头中设置token
      this.$http.defaults.headers.common['Authorization'] = token;
      const res = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchValue}`);
       // 异步请求结束之后
      this.loading = false;
      const data = res.data;
      const { meta: {status, msg} } = data;
      if (status === 200) {
        const {data : { users, total }} = data;
        this.list = users;
        this.total = total;
      } else {
        this.$message.error(msg);
      }
    },
    handleSearch() {
      this.loadData();
    },
    async handleSwitchChange(user) {
      // console.log(user)
      const res = await this.$http.put(`users/${user.id}/state/${user.my_state}`);
      const data = res.data;
      const { meta: {status, msg} } = data;
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    async handleDelete(id) {
       this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          // 点击确认按钮执行
          const res = await this.$http.delete(`users/${id}`);
          console.log(res)
          const data = res.data;
          const {mata : {status, msg }} = data;
          if(status === 200) {
            this.pagenum = 1;
            this.loadData();
            this.$message({
              type: 'success',
              message: 'msg'
            });
          } else {
            this.$message.error(msg);
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    async handleAdd() {
      // console.log(res);
      this.$refs.myform.validate(async(valid) => {
        if (!valid) {
          return this.$message.error(msg);
        }
        const res = await this.$http.post('users',this.formData);
        const data = res.data;
        const { meta: {status, msg }} = data;
        if(status === 201) {
          this.$message.success(msg);
          this.addUserDialogVisible = false;
          this.loadData();
          // for(let key in this.formData) {
          //   this.formData[key] = '';
          // } 
          }else {
            this.$message.error(msg);
        }
      });
    },
    handleShowEditDialog(user) {
      this.editUserDialogVisible= true;
      // this.formData = user;
      this.formData.username = user.username;
      this.formData.email = user.email;
      this.formData.mobile = user.mobile;
      this.formData.id = user.id;
    },
    async handleEdit() {
      // console.log(this.formData);
      const res = await this.$http.put(`users/${this.formData.id}`,{
        mobile: this.formData.mobile,
        email: this.formData.email
      });

      const data = res.data;
      const {meta: {status, msg} } = data;
        if(status === 200) {
          this.$message.success(msg);
          this.editUserDialogVisible= false;
          this.loadData();
          // for(let key in this.formData) {
          //   this.formData[key] = '';
          // }
        }else {
          this.$message.error(msg);
        }
      },
      handleClosed() {
        for(let key in this.formData) {
            this.formData[key] = '';
        }
      },
      async handleShowSetRole(user) {
        // console.log(user)
        this.currentUserId = user.id;
        this.currentUserName = user.username;
        // 显示对话框
        this.setRoleDialogVisible = true;
        // 获取所有的角色
        const res = await this.$http.get('roles');
        this.roles = res.data.data;
        // 根据用户id查询用户对象，觉得id
        const res1 = await this.$http.get(`users/${user.id}`);
        this.currentRoleId = res1.data.data.rid;
      },
      async handleSetRole() {
        const res = await this.$http.put(`users/${this.currentUserId}/role`,{
          rid: this.currentRoleId
        });
        const data = res.data;
        const { meta: {status, msg} } = data;
        if(status === 200) {
          this.setRoleDialogVisible = false,
          this.$message.success(msg);
          this.currentUserName = '';
          this.currentUserId = -1;
          this.currentRoleId = -1
        }else {
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
