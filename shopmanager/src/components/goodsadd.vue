<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表" class="cusbread"></my-bread>
    <!-- 消息提示 -->
    <el-row class="alert">
      <el-col>
        <el-alert :closable="false" title="添加商品信息" type="info" center show-icon></el-alert>
      </el-col>
    </el-row>
    <el-steps :active="1*active" finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
  </el-steps>
  <!-- 标签页el-tabs
    当选中某个tab时  v-model绑定的数据active其值就是被选中的name值
    -->
    <el-form :v-model="form" label-width="80px" class="form" label-position="top">
    <el-tabs tab-position="left" v-model="active" class="tab" @tab-click="changeTab()">
      <el-tab-pane name="1" label="基本信息">
         <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
             <el-cascader
              expand-trigger="hover"
              :options="options" 
              v-model="selectedOptions"
              @change="handleChange"
              :props="defaultProp"
              >
           </el-cascader>
          </el-form-item>
      </el-tab-pane>
      <el-tab-pane name="2" label="商品参数">
        <el-form-item :label="item.attr_name" v-for="(item) in dynamicArr" :key="item.attr_id">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox border :label="item2" v-for="(item2,i) in item.attr_vals" :key="i"></el-checkbox>
            </el-checkbox-group>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane name="3" label="商品属性">
        <el-form-item :label="item1.attr_name" v-for="(item1) in staticArr" :key="item1.attr_id">
          <el-input v-model="item1.attr_vals"></el-input>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane name="4" label="商品图片">
        <el-form-item>
          <el-upload
            class="upload-demo"
            action="http://localhost:8888/api/private/v1/upload"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :headers="headers"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane name="5" label="商品内容">
        <el-form-item>
          <!-- 添加商品按钮 -->
          <el-button type="primary" class="btn-addgoods" @click="addgoods()">添加商品</el-button>
          <!-- 使用富文本 -->
          <quill-editor v-model="form.goods_introduce"></quill-editor>
        </el-form-item>
      </el-tab-pane>
    </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
//引入富文本编译器的样式文件和包
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  //配置富文本组件
    components: {
    quillEditor
  },
  data(){
    return {
      active:"1",
      form: {
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        // 商品分类 -> 级联选择器的商品分类
        goods_cat: "",
        // 图片  -> 图片上传 -> 图片临时路径
        pics: [],
        // 商品参数  ->  动态参数数据+静态参数数据
        // attr:[{attr_id:?,attr_value:?}]
        attrs: []
      },
      options:[],
      defaultProp:{
        label:'cat_name',
        value:'cat_id',
        children:'children'
      },
      selectedOptions:[1,3,6],
      checkList:[],
      // 动态参数数组
      dynamicArr:[],
      //静态参数数组
      staticArr:[],
       headers: {
        Authorization: localStorage.getItem("token")
      }
    }
  },
  created(){
    this.getGoodsCate()
  },
  methods:{
    //所有信息配置完毕，点击“添加商品”按钮，添加商品
    async addgoods(){
      //处理数据
      //处理goods_cat---》
      this.form.goods_cat=this.selectedOptions.join(',');
      //静态属性和动态参数
      //遍历两个数组
      //动态参数
     const arrNew1 = this.dynamicArr.map(item=>{
        return {attr_id:item.attr_id,attr_value:item.attr_vals}
      })
    // console.log(arrNew1);
    //静态属性
    const arrNew2 = this.staticArr.map(item=>{
      return {attr_id:item.attr_id,attr_value:item.attr_vals}
    })
    // console.log(arrNew2);
    //合并两个数组
    const arr = [...arrNew1,...arrNew2];
    this.form.attrs = arr;
    // console.log(this.form.attrs);
    //发送请求--提交数据
    const res = await this.$http.post( `goods`,this.form)
    // console.log(res);
    const {meta:{status,msg}}=res.data;
    if(status===201){
      //跳转到商品列表页
      this.$router.push({
        name:'goods'
      })
      this.$message.success(msg)
    }else{
      this.$message.warning(msg);
    }
    
    
    },
    //上传图片成功
    handleSuccess(response,file){
      //临时路径
      console.log(response,file);
      this.form.pics.push({
        pic:response.data.tmp_path
      });
    },
   
    //删除上传文件
    handleRemove(file,fileList){
      console.log(file);
      const INDEX = this.form.pics.findIndex(item => {
        return item.pic === file.response.data.tmp_path;
      });
      this.form.pics.splice(INDEX, 1);
      
    },
    //切换左侧导航
    async changeTab(){
      //判断是不是“商品参数”
      if(this.active==='2'){
        //判断上一步是否三级联动是否选择第三级
        if(this.selectedOptions.length===3){
          //获取商品的动态参数
          const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`);
          // console.log(res);
          this.dynamicArr=res.data.data;
          this.dynamicArr.map((item) =>{
            item.attr_vals = item.attr_vals.split(',');
          });
        }else{
          this.$message.warning('请先选择三级分类')
        }  
      }
      //静态参数
        if(this.active==='3'){
          if(this.selectedOptions.length===3){
            //获取静态参数
            const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`);
            // console.log(res);
            this.staticArr=res.data.data;
          }else{
            this.$message.warning('请先选择三级分类')
          }
        }
    },
   
    //获取所有的分类
    async getGoodsCate(){
      const res = await this.$http.get(`categories?type=3`);
      // console.log(res);
      this.options=res.data.data
      
      
    },
    //改变分类
    handleChange(){

    }
  }
}
</script>

<style scoped>
.card{
  height: 100%;
}
.cusbread,.alert{
  margin-bottom: 20px;
}
.tab{
  margin-top: 20px;
}
.form{
  height: 300px;
  overflow: auto;
}
/* 修改富文本样式 */
.ql-editor{
  min-height: 200px
}
.btn-addgoods{
  margin-bottom: 20px;
}
</style>
