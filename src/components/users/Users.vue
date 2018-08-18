<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home'}">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users'}">用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <div style="margin-top: 15px;">
      <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
      <el-button type="success" plain @click="showadddialog=true">添加用户</el-button>

      <!-- 分页组件 -->
      <el-pagination
        class="pagina"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="pagesize"
        layout="total,sizes, jumper"
        :total="total">
      </el-pagination>
    </div>
    <el-table
      :data="userList"
      stripe
      align="center"
      size="small"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="160">
      </el-table-column>
      <el-table-column
        prop="mg_state"
        label="用户状态"
        width="80">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change='changeState(scope.row)'>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" plain @click="showEditDialog(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" plain @click="deleteUser(scope.row)"></el-button>
          <el-button type="success" icon="el-icon-check" size="small" plain>分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
      <!-- 每页显示的条数 -->
      <el-pagination
        class="pagination"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="pagesize"
        layout="prev, pager, next"
        :total="total">
      </el-pagination>
      <!-- 添加用户对话框 -->
      <el-dialog
        title="提示"
        :visible.sync="showadddialog"
        width="30%"
        :before-close="handleClose">
        <el-form
        ref="addForm"
        :model="addForm"
        label-width="70px"
        :rules="addRules">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="email">
            <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showadddialog = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
     <!-- 编辑用户对话框 -->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="30%"
        :before-close="handleClose">
        <el-form
        ref="editForm"
        :model="editForm"
        label-width="70px"
        :rules="addRules">
          <el-form-item label="用户名" prop="username">
            <el-tag type="info">{{editForm.username}}</el-tag>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="email">
            <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 添加用户表单数据
      addForm: {
        username: '',
        email: '',
        mobile: ''
      },
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      addRules: { // 添加用户的校验规则
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        email: [
          // { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱的格式', trigger: 'blur' }
        ],
        mobile: [
          // { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机格式', trigger: 'blur' }
        ]
      },
      // 添加用户对话框
      showadddialog: false,
      editDialogVisible: false,
      // 关键字
      query: '',
      // 当前页
      current: 1,
      // 每页的条数
      pagesize: 2,
      // 总条数
      total: 0,
      userList: []
    }
  },

  methods: {
    // 显示修改用户对话框
    showEditDialog (u) {
      this.editDialogVisible = true
      this.editForm.username = u.username
      this.editForm.email = u.email
      this.editForm.mobile = u.mobile
      this.editForm.id = u.id
    },
    editUser () {
      // 表单验证
      this.$refs.editForm.validate(v => {
        if (v) {
          // 发送ajax请求,修改用户
          this.axios.put(`users/${this.editForm.id}`, this.editForm).then(res => {
            if (res.data.meta.status === 200) {
              // 关闭模态框
              this.editDialogVisible = false
              // 重置表单样式
              this.$refs.editForm.resetFields()
              // 重新渲染
              this.getUserList()
              // 提示用户
              this.$message.success('用户信息修改成功')
            }
          })
        }
      })
    },
    deleteUser (u) {
      // 提示用户是否删除
      this.$confirm('你确定要删除这个用户么>', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送ajax请求
        this.axios.delete(`users/${u.id}`).then(res => {
          const { status } = res.data.meta
          if (status === 200) {
            // 如果当前数据只有一条,需要让页数减1
            if (this.userList.length === 1) {
              this.current--
            }
            // 重新渲染页面
            this.getUserList()
            // 给用户提示消息
            this.$message.success('删除成功了')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    addUser () {
      this.$refs.addForm.validate((v) => {
        if (v) {
          this.axios.post('users', this.addForm).then(res => {
            console.log(res.data)
            if (res.data.meta.status === 201) {
              // 关闭模态框
              this.showadddialog = false
              // 重置样式
              this.$refs.addForm.resetFields()
              // 重新渲染
              this.total++
              this.current = Math.ceil(this.total / this.pagesize)
              this.getUserList()
              // 提示
              this.$message.success('添加用户成功')
            } else {
              this.$message.erorr(res.data.meta.msg)
            }
          })
        }
      })
    },
    // 添加用户对话框
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    },
    // 改变用户状态
    changeState (d) {
      this.axios.put(`users/${d.id}/state/${d.mg_state}`)
        .then(res => {
          const { meta: { status } } = res.data
          if (status === 200) {
            this.$message.success('用户状态修改成功')
            this.$message.success('修改用户状态成功')
          } else {
            this.$message.error('用户状态修改失败')
          }
        })
    },
    async getUserList () {
      const res = await this.axios({
        method: 'get',
        url: 'http://localhost:8888/api/private/v1/users',
        params: {
          query: this.query,
          pagenum: this.current,
          pagesize: this.pagesize
        },
        // 设置请求头
        headers: {
          'Authorization': localStorage.getItem('myToken')
        }
      })

      const { meta, data } = res.data
      if (meta.status === 200) {
        this.userList = data.users
        this.total = data.total
      }
    },
    handleCurrentChange (val) {
      // 修改当前页
      this.current = val
      // 重新发送请求
      this.getUserList()
    },
    handleSizeChange (val) {
      // 修改每页的条数
      this.pagesize = val
      // 当前页应该变成1
      this.current = 1
      // 重新发送请求
      this.getUserList()
    },
    search () {
      this.current = 1
      this.getUserList()
    }

  },
  created () {
    this.getUserList()
  }

}
</script>

<style>
.el-breadcrumb {
  margin: 20px 0px;
}
.el-input-group {
  width: 300px;
}
.pagina {
  text-align: right;
}
.pagination {
  text-align: right;
}
</style>
