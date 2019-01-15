<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 输入框和添加按钮 -->
    <el-input placeholder="请输入内容" v-model="query" clearable class="input-with-select"  @clear="getAllUsers()">
    <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
  </el-input>
  <el-button type="success" @click="handleAdd()">添加用户</el-button>
  <!-- 表格 -->
   <el-table :data="tableData" style="width: 100%" class="table">
      <el-table-column prop="id" label="#"  width="80"></el-table-column>
      <el-table-column  prop="username"  label="用户名"  width="80"></el-table-column>
      <el-table-column  prop="email"  label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"  width="180"></el-table-column>
      <el-table-column  label="创建日期" width="120">
       <template slot-scope="scope">
       {{scope.row.create_time | fmtDate}}
      </template>
      </el-table-column>
      <el-table-column label="状态"  width="100">
         <!-- 该单元格中的数据不是prop的值  true -->
         <!-- 单元里里面如果不是 prop 需要加容器 template -->
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="changeUserState(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="handleEdit(scope.row)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteUser(scope.row)"></el-button>
            <el-button type="success" icon="el-icon-check" size="mini" circle @click="showDiaRole(scope.row)"></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
     <!-- 添加用户的弹出层 -->
     <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑页面的弹出层 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
  <el-form :model="form">
    <el-form-item label="用户名:" :label-width="formLabelWidth">
      {{currentUserName}}
    </el-form-item>
    <el-form-item label="角色:" :label-width="formLabelWidth">
      <el-select v-model="currentUserRoleId">
        <el-option label="请选择" :value="-1"></el-option>
        <el-option v-for="(v,i) in roles" :key="i" :label="v.roleName" :value="v.id"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
    <el-button type="primary" @click="updateRole()">确 定</el-button>
  </div>
</el-dialog>
  </el-card>

 
</template>

<script>
export default {
  data(){
     return {
       tableData:[],
       query:'',
       pagenum:1,
       pagesize:2,
       total:-1,
       dialogFormVisibleAdd: false,
        dialogFormVisibleEdit: false,
        dialogFormVisibleRole:false,
       form:{
         username: "",
        password: "",
        email: "",
        mobile: ""
       },
       formLabelWidth:"100px",
      //  分配角色的下拉框数据--假定的---》v-model
      currentUserRoleId:-1,
      roles:[],
      currentUserName:'',
      currentUserId:-1
       
     }
    },
    created(){
      this.getTableData()
    },
    methods:{
      // 获取表格数据
      async getTableData(){
        // 设置用户权限
        const AUTH_TOKEN=localStorage.getItem('token');
        this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
        const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`);
        // console.log(res);
        const {data:{data:{total,users},meta:{msg,status}}}=res;
        if(status===200){
          this.tableData = users;
          this.total=total;
           //2. 提示
        this.$message.success(msg);
        }
      },
      // 分页功能
       handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.pagesize=val;
        this.pagenum=1;
        this.getTableData();
      },
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.pagenum=val;
        this.getTableData();
      },

      // 搜索功能
      searchUser(){
        this.pagenum = 1;
        this.getTableData();
      },
      //清空输入框
      getAllUsers(){
        this.getTableData();
      },
      //添加用户--显示添加表单
      handleAdd(){
        // 清空原有的内容
        this.form = {};
        this.dialogFormVisibleAdd=true
      },
      // 添加用户--添加数据
      async addUser(){
        //发送请求
       const res = await this.$http.post('users',this.form);
      //  console.log(res);
       const {data,meta:{msg,status}}=res.data;
       if(status===201){
         this.dialogFormVisibleAdd=false;
         this.getTableData();
       }
      },
      // 编辑用户---显示编辑表单
      handleEdit(user){
        this.form = user;
        this.dialogFormVisibleEdit=true;
      },
      //编辑用户--提交表单
      async editUser(){
        const res = await this.$http.put(`users/${this.form.id}`,{
          email:this.form.email,
          mobile:this.form.mobile
        });
        const {meta:{msg,status}}=res.data;
        if(status===200){
          this.dialogFormVisibleEdit=false;
          this.getTableData();
        }else{
          this.$message.warning(msg);
        }
      },
      // 删除用户
      deleteUser(user){
         this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // 发送请求
        const res = await this.$http.delete(`users/${user.id}`);
        console.log(res);
        const {data:{meta:{msg,status}}}=res;
        if(status===200){
          this.getTableData();
        }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        
      },

      //修改状态
    async  changeUserState(user){
        const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`);
        const {meta:{msg,status}}=res.data;
        if(status===200){
          this.getTableData();
        }
    },
      //显示角色对话框
      async showDiaRole(user){
        this.dialogFormVisibleRole=true; 
        this.currentUserName = user.username;
        this.currentUserId=user.id;
        
         //查询角色信息---发请求
         const res = await this.$http.get('roles');
         this.roles = res.data.data;
        //根据id查询用户得到角色id
         const res2 = await this.$http.get(`users/${user.id}`);
          this.currentUserRoleId = res2.data.data.rid;
      },
      //修改角色信息
      async updateRole(){
        const res = await this.$http.put(`users/${this.currentUserId}/role`,{
          rid:this.currentUserRoleId
        });
        // console.log(res);
        this.dialogFormVisibleRole=false;
        
      }
    

    }
};
</script>

<style scoped>
.input-with-select {
  width: 300px;
  margin-top: 20px;
}
.table{
  margin-bottom: 10px;
}
</style>
