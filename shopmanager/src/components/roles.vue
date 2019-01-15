<template>
  <el-card class="card">
    <my-bread level1="权限管理" level2="角色列表" class="cusBread"></my-bread>
    <!-- 按钮 -->
    <el-button type="success" plain >添加角色</el-button>
    <!-- 列表 -->
     <el-table :data="roles" style="width: 100%" class="table">
       <el-table-column type="expand">
        <template slot-scope="scope">
            <el-row v-for="(v,i) in scope.row.children" :key="i" style="width:350">
              <el-col :span="4">
                <el-tag @close="deleteRight(scope.row,v)" closable type="info">{{v.authName}}</el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <el-col :span="20">
                <el-row v-for="(item,i) in v.children" :key="i">
                  <el-col :span="4">
                    <el-tag closable type="success" @close="deleteRight(scope.row,item)">{{item.authName}}</el-tag>
                   <i class="el-icon-arrow-right"></i> 
                  </el-col>
                  <el-col :span="20">
                    <el-tag closable type="warning" v-for="(item1,i) in item.children" :key="i" class="three" @close="deleteRight(scope.row,item1)">{{item1.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- // 角色没有分配角色时显示 -->
            <el-row v-if="scope.row.children.length===0">
              <el-col><span>该角色没有分配权限</span></el-col>
            </el-row>
        </template>
       </el-table-column>
      <el-table-column prop="id" label="#"  width="80"></el-table-column>
      <el-table-column  prop="roleName"  label="角色名称"  width="100"></el-table-column>
      <el-table-column  prop="roleDesc"  label="角色描述" width="200"></el-table-column>
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


    <!-- 权限展示的对话框 -->
    <el-dialog title="权限管理" :visible.sync="dialogVisibleRight" width="50%">
   <!-- 树形显示权限 -->
    <el-tree
      ref="tree"
     :data="treeData"
      show-checkbox
       node-key="id"
      default-expand-all
      :default-checked-keys="checkedArr"
      :props="defaultProps">
    </el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisibleRight = false">取 消</el-button>
    <el-button type="primary" @click="setCurrentRight()">确 定</el-button>
  </span>
</el-dialog>
   
  </el-card>
</template>

<script>
export default {
  data(){
    return {
      roles:[],
      dialogVisibleRight:false,
      // 树形图的数据
      treeData:[],
       defaultProps: {
          children: 'children',
          label: 'authName'
        },
        checkedArr:[],
        roleId:-1
    }
  },
  created(){
    this.getRoles()
  },
  methods:{
    //设置、修改权限
    async setCurrentRight(){
      //获取所有全选权限
      const arr1=this.$refs.tree.getCheckedKeys()
      // 获取所有半选权限
      const arr2 = this.$refs.tree.getHalfCheckedKeys()
      //合并两个数组
      const arr = [...arr1,...arr2];
      //发送请求
      const res = await this.$http.post(`roles/${this.roleId}/rights`,{
        rids:arr.join(",")
      });
      //刷新页面
      this.getRoles();
      this.dialogVisibleRight=false
      },
    //删除权限
    async deleteRight(role,right){
      const res = await this.$http.delete(`roles/${role.id}/rights/${right.id}`);
      //将当前剩余的权限赋值给所有的权限
      role.children=res.data.data;
    },
    //显示当前用户的权限
    async showDiaRole(rights){
      this.dialogVisibleRight=true;
      const res = await this.$http.get(`rights/tree`); 
      // console.log(res)
      this.treeData=res.data.data
      this.roleId=rights.id
      const tempArr = [];
      // 循环遍历得到当前用户的所有权限
      rights.children.forEach(item1 => {      
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            tempArr.push(item3.id);
          });
        });
      });
      this.checkedArr = tempArr;
     
    },
    // 显示所有角色
    async getRoles(){
      const res= await this.$http.get('roles');
      // console.log(res);
      this.roles=res.data.data;
      // console.log(this.roles)
    }
  }
}
</script>

<style scoped>
.card{
  height: 100%;
}
.cusBread{
  margin-bottom: 20px;
}
                   
.three{
  margin-right:5px;
  margin-top: 5px;
}
</style>
