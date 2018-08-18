<template>
  <div class="home">
    <el-container>
      <el-aside width="200px">
        <el-menu
          menu-trigger
          router
          unique-opened
          default-active="$route.path.slice(1)"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-submenu :index="l1.path" v-for="l1 in menuList" :key="l1.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{l1.authName}}</span>
            </template>
              <el-menu-item :index="l2.path" v-for="l2 in l1.children" :key="l2.id">
                <i class="el-icon-menu"></i>
                <span slot="title">{{l2.authName}}</span>
              </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
              <el-menu-item index="/rights">
                <i class="el-icon-menu"></i>
                <span slot="title">权限列表</span>
              </el-menu-item>
              <el-menu-item index="/roles">
                <i class="el-icon-menu"></i>
                <span slot="title">角色列表</span>
              </el-menu-item>
              <el-menu-item index="/demo">
                <i class="el-icon-menu"></i>
                <span slot="title">demo</span>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
        <div class="login"></div>
        <div class="logout">
          欢迎光临
          <a href="javascript:;" @click="logout">退出</a>
        </div>
        <div class="title">
        <h3>电商后台管理系统</h3>
        </div>
        </el-header>
        <el-main>
          <!--  显示home组件的子组件， 子组件的出口 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menuList: []
    }
  },
  methods: {
    async logout () {
      try {
        await this.$confirm('你确定要退出系统吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        // 1. 删除localStorage中的myToken
        localStorage.removeItem('myToken')
        // 2. 跳转到登录组件
        this.$router.push('login')
        // 3. 给一个退出的提示
        this.$message.success('退出成功了')
      } catch (e) {
        this.$message({
          type: 'info',
          message: '退出取消了'
        })
      }
    },
    async getMenuList () {
      // 发送ajax请求，获取菜单数据
      const res = await this.axios.get('menus')
      const { meta, data } = res.data
      if (meta.status === 200) {
        this.menuList = data
        // console.log(this.menuList)
      }
    }
  },
  created () {
    this.getMenuList()
  }
}
</script>

<style lang="less">
.home {
  height: 100%;
  .el-container {
    height: 100%;

    .login {
      width: 180px;
      height: 60px;
      background: url("../assets/logo.png") no-repeat center;
      background-size: contain;
      float: left;
    }
    .logout {
      float: right;
      height: 60px;
      line-height: 60px;
      font-size: 26px;
      font-weight: 700;
      text-align: right;
      a {
        color: darkorange;
      }
    }
    .title {
      font-size: 30px;
      text-align: center;
      height: 60px;
      line-height: 60px;
    }
  }
  .el-aside {
    background-color: rgb(84, 92, 100);
    .el-submenu {
      width: 200px;
    }
  }
}
</style>
