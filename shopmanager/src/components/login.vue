<template>
  <div class="login-wrap">
    <el-form class="form" label-position="top" label-width="80px" :model="formdata">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>

      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>

      <el-button
      @click="handleLogin()"
      class="btn" type="primary">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formdata: {
        username: "",
        password: ""
      }
    };
  },
  methods:{

   async  handleLogin(){
    const res = await  this.$http.post("login",this.formdata);
    console.log(res);
  const {data:{data,meta:{msg,status}}}= res
        if (status===200) {
          // 保存token值(将来写其他功能时会用)
          localStorage.setItem('token',data.token)
          //
          // localStorage.getItem('token')
          // 渲染home组件
          this.$router.push({
            name:'home'
          });

        } else{
          this.$message.warning(msg)

        }
  }
    // 目的: 不想看到层层嵌套的{}
    // -> ES7 async+await

}

};
</script>

<style scoped>
.login-wrap{
  height: 100%;
  background-color:#324152;
  display: flex;
  justify-content: center;
  align-items: center;

}
.login-wrap .form{
  width: 400px;
  padding: 30px;
  background-color: #FFFFFF;
  border-radius: 4px;
}
.login-wrap .form .btn{
  width: 100%;
}
</style>
