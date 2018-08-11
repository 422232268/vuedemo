<template>
  <div class="login">
    <el-form class="el-from" status-icon :rules="rules" ref="form" :label-position="labelPosition" :model="form" label-width="80px">
      <img src="../assets/avatar.jpg" alt="">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登陆</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      labelPosition: 'left',
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名称', trigger: 'change'},
          {min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'change'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'change'},
          {min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.form.validate(v => {
        if (v) {
          axios({
            method: 'post',
            url: 'http://localhost:8888/api/private/v1/login',
            data: this.form
          }).then(res => {
            if (res.data.meta.status === 200) {
              this.$message({
                message: '恭喜你，这是一条成功消息',
                type: 'success'
              })
              this.$router.push('home')
            } else {
              this.$message.error('验证失败,请您重新输入')
            }
          })
        } else {
          return false
        }
      })
    },
    reset () {
      this.$refs.form.resetFields()
    }
  }

}
</script>

<style lang="less">
.login {
  width: 100%;
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;

  .el-from {
    width: 400px;
    background-color: #fff;
    margin: 200px auto;
    padding: 75px 40px 15px 40px;
    border-radius: 20px;
    position: relative;
  }
    img {
    position: absolute;
    top: -80px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 50%;
    border: 10px solid #fff;
  }
    .el-button ~ .el-button {
    margin-left: 80px;
  }
}
</style>
