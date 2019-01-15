<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="分类参数" class="cusbread"></my-bread>
    <!-- 消息提示 -->
    <el-row class="alert">
      <el-col>
        <el-alert :closable="false" title="设置商品参数信息" type="info" center show-icon></el-alert>
      </el-col>
    </el-row>
    <!-- 三级分类 -->
    <el-form v-model="form">
      <el-form-item label="请选择商品分类">
         <el-cascader
            class="cascader"
          expand-trigger="hover"
          :options="options" 
          v-model="selectedOptions"
          @change="handleChange"
          :props="defaultProp"
          :show-all-levels="false"
          >
        </el-cascader>
      </el-form-item>
    </el-form>
   
     <!-- 动态参数和静态参数的tab栏 -->
      <el-tabs type="border-card" @click="changeTab" v-model="active">
        <el-tab-pane label="动态参数" name="1">
           <el-table :data="dynamicArr" style="width: 100%" class="table">
           <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 动态el-tag编辑 -->
              <el-tag
                :key="item.attr_id"
                v-for="(item) in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row,item)"
              >{{item}}</el-tag>
               <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column  prop="attr_name"  label="属性名称"  width="100"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-row>
                  <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editParams"></el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleParams"></el-button>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="2">
          <el-button type="primary" :disabled="selectedOptions.length===0">添加静态属性</el-button>
           <el-table height="300px" :data="staticArr" style="width: 100%">
          <el-table-column type="index" width="200" label="#"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width="200"></el-table-column>
          <el-table-column prop="attr_vals" label="属性值" width="200"></el-table-column>

          <el-table-column label="操作" width="400">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" plain circle></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" plain circle></el-button>
            </template>
          </el-table-column>
        </el-table>
        </el-tab-pane>
      </el-tabs>
  </el-card>
</template>

<script>
export default {
  data(){
    return {
      options:[],
      selectedOptions:[],
      defaultProp:{
         label:'cat_name',
        value:'cat_id',
        children:'children'
      },
      form:{},
      dynamicArr:[],
      staticArr:[],
      active:"1",
      tabData:[],
      inputVisible:false,
      inputValue:'',
      isAble:false
    }
  },
  created(){
    this.getGoodsCate()
  },
  methods:{
    editParams(){},
    deleParams(){},
    showInput(){
      this.inputVisible=true;
       this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    async handleInputConfirm(attr){
        let inputValue = this.inputValue;
        if(inputValue){
            // 向数组添加元素
          attr.attr_vals.push(inputValue);
          //
          const putData = {
            attr_name: attr.attr_name,
            attr_sel: attr.attr_sel,
            attr_vals: attr.attr_vals.join(",") // 接口没写参数的值类型
          }
           //发送请求
           const res =await this.$http.put( `categories/${this.selectedOptions[2]}/attributes/${attr.attr_id}`,
          putData)
        }
        this.inputVisible=false;
        this.inputValue='';
       
    },
    async handleClose(attr,item){
       // 从attr_vals中移除当前item
      attr.attr_vals.splice(attr.attr_vals.indexOf(item), 1);
      const putData = {
        attr_name: attr.attr_name,
        attr_sel: attr.attr_sel,
        attr_vals: attr.attr_vals.join(",") // 接口没写参数的值类型
      };
      // 发送请求 put
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${attr.attr_id}`,
        putData
      );

    },
    changeTab(){
      if(this.selectedOptions.length===3&&this.active==='1'){
        //获取动态参数数据
        this.getDynamicParams();
        }
      if(this.selectedOptions.length===3&&this.active==='2'){
        //获取动态参数数据
        this.getStaticParams();
        
        }
    },
   handleChange(){
      //获取三级分类的参数
      if(this.selectedOptions.length===3&&this.active==='1'){
        //获取动态参数数据
        this.getDynamicParams();
        }else{
          this.$message.warning('请先选择三级分类')
        }  
       //获取三级分类的参数
      if(this.selectedOptions.length===3&&this.active==='2'){
        //获取动态参数数据
        this.getStaticParams();
        }else{
          this.$message.warning('请先选择三级分类')
        }  
    },
    //获取静态属性

    async getStaticParams(){
      const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`);
          console.log(res);
          this.staticArr=res.data.data;
    },
    //获取动态参数数据
    async getDynamicParams(){
       const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`);
          console.log(res);
          this.dynamicArr=res.data.data;
          console.log(this.dynamicArr)
          this.dynamicArr.map((item) =>{
            item.attr_vals = item.attr_vals.trim().split(',');
          });
    },
    //获取所有的分类
    async getGoodsCate(){
      const res = await this.$http.get(`categories?type=3`);
      // console.log(res);
      this.options=res.data.data
    }
  }
}
</script>

<style scoped>
.card{
  height: 100%;
}
.cusbread,.alert,.cascader{
  margin-bottom: 20px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
