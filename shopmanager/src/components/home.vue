<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <img src="" alt>
        </el-col>
        <el-col :span="19">
          <h2 class="middle">电商后台管理系统</h2>
        </el-col>
        <el-col :span="1">
          <a href class="loginout" @click="handleLoginout">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <!-- 导航 -->
        <el-menu default-active="2"
        :unique-opened="true" router>
          <!-- 1 -->
          <el-submenu :index="''+item.order" v-for="(item) in menus" :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>

            <el-menu-item :index="item1.path" v-for="(item1) in item.children" :key="item1.id">
              <i class="el-icon-menu"></i>
              {{item1.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  beforeCreate(){
    // if(!localStorage.getItem('token')){
    //   //回到登录页
    //   this.$router.push({
    //     name:'login'
    //   });
    //   //提示
    //   this.$message.warning('请先登录');
    // }
  },
  data(){
    return {
      menus:[]
    }
  },
  created(){
    this.getCurrentUserRight()
  },
  methods:{
    //获取当前登录用户的所有权限
    async getCurrentUserRight(){
      //发哦送请求
     const res = await this.$http.get(`menus`);
    //  console.log(res);
    this.menus=res.data.data
    },
    handleLoginout(){
      //清除localStorage的token
      localStorage.clear();
      //回到登录页
      this.$router.push({
        name:'login'
      })
      //提示信息
      this.$message.success('退出成功')

    }
  }
};
</script>

<style scoped>
.container {
  height: 100%;
}
.header {
  background-color: #b3c0d1;
}
.aside {
  background-color: #fff;
}
.main {
  background-color: #fff;
}

.middle {
  /* width: 100%; */
  line-height: 60px;
  text-align: center;
  color:#fff;
}
.loginout {
  line-height: 60px;
  text-decoration: none;
}
</style>
