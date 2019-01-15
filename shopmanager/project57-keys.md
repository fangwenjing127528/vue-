## Vue-项目-重点

### day06-项目-重点

#### 01-项目-准备-项目功能演示

1. 登录
2. 首页
   1. 用户管理
      1. 用户列表
   2. 权限管理
      1. 角色列表
      2. 权限列表
   3. 商品管理
      1. 商品列表
      2. 分类参数
      3. 商品分类
   4. 订单管理
      1. 订单列表
   5. 数据统计
      1. 数据报表

> UI 部分->使用主流的第三方 UI 库 element-ui
>
> 重复组件不写(快速完成!)
>
> 接口数据
>
> vue+element-ui+vue-router+axios

#### 02-项目-准备-项目准备素材说明

> 06-02-其他资源-项目素材

1. itcast.sql -> 启动 MySQL->打开 navicat.exe->新建数据库->导入.sql

2. 项目后台(服务器)->api-server 压缩包->node 项目-

   1. 修改 config/default.json 文件/修改为自己的数据库配置信息

      ```json
      "db_config" : {
      		"protocol" : "mysql",
      		"host" : "127.0.0.1",
      		"database" : "itcast",
      		"user" : "root",
      		"password" : "root",
      		"port" : 3306
      	}
      ```

2)  npm i

3)  node app.js -> 启动项目的服务器

4)  接口文档->docs/index.html

### day07-项目-重点

#### 01-项目-准备-批处理

1. 来到指令执行的目录 比如api-server
2. 新建run.txt 在该文件中 输入 node app.js(不要加多余的空格和回车)
3. 修改run.txt的后缀  改为run.bat文件
4. 双击run.bat->自动打开cmd自动执行指令

> 目的: 批处理-提高效率

#### 02-项目-准备-vue-cli-创建项目结构

> 使用cli生成vue项目目录

1. vue init webpack 项目名
2. vue编译的方式->for most users
3. 是否安装vue-router->Y
4. 是否使用ESLint -> Y

> ESLint 自动监测代码规范

4. 提示用哪个代码规范  S

5. unit test/e2e 测试  -> n

6. cd 项目目录

7. npm run dev -> 启动开发模式(并不会自动打开浏览器)

   > package.json->scripts(自定义指令的)->修改dev的值 ->末尾--open->重启npm run dev



#### 03-项目-准备-项目目录说明
> src我们需要关心的文件
1. main.js入口
2. App.vue 根组件 router-view
3. router/index.js 路由模块
4. components: 自己的组件
5. assets/静态资源
> build:webpack打包的结果
> config:配置服务器信息
> index.html

#### 04-项目-准备-代码规范-自定义指令-lintfix
> 编译时 eslint自动检测代码 -> cmd页面会报错
1. package.json > scripts {"lintfix":"eslint --ext .js,.vue src --fix"}
2. npm run lintfix
3. 自动修复代码 (未使用变量无法修复)


#### 05-项目-准备-element-ui-文档分析
> ui使用饿了么开发团队->element-ui
> element-ui ->PC端
> mint-ui ->移动端
1. 确定要用的组件
2. 具体使用的组件
3. 组件的属性列表
> el-input
#### 06-项目-准备-element-ui-安装-引入
1. npm i element-ui
2. main.js 引入element-ui和.css文件
3. main.js Vue.use(插件名)
> 在任意组件template中就可以使用element-ui的组件

#### 07-项目-准备-项目模板简化-调整
> 简化模板
> 路由配置中 path必须赋值的属性

#### 08-项目-准备-git-版本控制
1. git init
2. git status
3. git add .
4. git commit -m ""
5. 去代码托管平台 -> 新建仓库
6. git remote add origin https://github.com/自己的名字/shopmanager57.git
7. git push -u origin master
> 第一次使用git的流程
> 第二次使用时 2347(其中7在master 不需要加-u后面 只写git push)


#### 09-项目-登录-新建分支-login 组件-配置路由
>  master:管理其他分支/叠加新版本(添加版本号)/合并master
1. 新建分支
1.1. 查看分支git branch
1.2 新建分支并且切换到该分支 git checkout -b dev-login
1.3 切换master: git checkout master
1.4 合并分支: git merge dev-login
1.5 在master上,  git push
> 网速不好

#### 10-项目-登录-引入表单组件
> form->顶部对齐
1. 找组件
2. 提供该组件使用的数据或者方法
#### 11-项目-登录-样式调整
> web开发插件(谷歌浏览器插件) FEHelper
> height:100%;
1. assets/index.css
```css
html,
body {
    height: 100%;
    padding: 0;
    margin: 0;
}

```
2. main.js 引入index.css
3. App.vue style 100%
4. login.vue 100%
> 注意: 只要你能实现布局样式 flex
#### 12-项目-登录-axios 插件
>使用axios发送登录请求
> 注意: 看接口文档

> 把axios独立库 变成Vue插件->Vue.use(自己的插件)
1. 新建http.js模块
2. 导入axios
3. 看文档 开发插件
4. 导出http模块
5. main.js 导入插件
6. Vue.use(插件)
> this.$http不用改

#### 13-项目-登录-引入提示框组件
> 登录提示
> Message组件
> this.$message.success/error(提示文本消息msg)

#### 14-项目-登录-登录成功-进入-home-组件
> 登录成功->进入home.vue
1. 编程式导航
2. 新建home.vue组件
3. router.js 配置路由

#### 15-项目-登录-简化登录请求代码-async 和 await
> 不想在{}内部获取异步操作的结果 ->ES7async+await
1. 在异步操作方法的前面加await
2. 在距离异步操作方法最近的外层函数前面加async
> async+await: 只是为了让异步代码看起来像同步!

#### 16-项目-登录-保存 token 值
> 登录成功时 用户数据中有一个加密字符串token
> localStorage.setItem('token',data.token)
> 将来使用时 localStorage.getItem('token)
> 注意: 现在不需要关心token是什么!

#### 17-项目-首页-布局容器-使用-样式调整
1. home组件使用了布局容器
2. 引入组件
3. 调整样式
#### 19-项目-首页-头部-样式调整
> el-row>el-col (栅格)
> 头部(图片+标题+a)

#### 20-项目-首页-侧边栏-导航组件-文档
> el-menu
> 删除了目前没有使用的属性或者方法


#### 21-项目-首页-侧边栏-引入导航组件-调整
```html
  <el-menu default-active="2"
        :unique-opened="true">
          <!-- 1 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-d-arrow-right"></i>
              <span>用户管理</span>
            </template>

            <el-menu-item index="1-1">
              <i class="el-icon-location"></i>
              用户列表
            </el-menu-item>

          </el-submenu>

    </el-menu>
```

> index值不要重复
> :unique-opened="true" 注意类型是否正确

