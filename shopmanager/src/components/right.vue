<template>
<el-card class="card">
  <my-bread level1="权限管理" level2="权限列表" class="cusBread"></my-bread>
  <!-- 表格 -->
       <el-table class="td" height="450px" border stripe :data="rights"  style="width: 100%">
       <el-table-column type="index" width="50"></el-table-column>
      <el-table-column  prop="authName"  label="权限名称" width="180"></el-table-column>
      <el-table-column  prop="path"  label="路径"  width="180"></el-table-column>
      <el-table-column  prop="level"  label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-if="scope.row.level === '1'">二级</span>
          <span v-if="scope.row.level === '2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
</el-card>
</template>

<script>
export default {
  data() {
    return {
     rights:[]
    };
  },
  created(){
    this.getRights()
  },
  methods:{
  async getRights(){
     // 设置用户权限---在http.js的拦截器中处理
    // const AUTH_TOKEN=localStorage.getItem('token');
    // this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
  const res = await this.$http.get('rights/list');
  // console.log(res)
  const {meta:{msg,status},data}=res.data;
  if(status===200){
    this.rights=data;
  }else{
    this.$message.warning(msg);
  }
    }
  }
};
</script>

<style scoped>
.cusBread{
  margin-bottom: 15px;
}
</style>
