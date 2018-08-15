<template>
<div class="roles">
  <el-button type="success" plain @click="addDialogVisible=true">添加角色</el-button>
    <!-- 表格 -->
  <el-table :data="roleList" stripe style="width: 100%">
    <el-table-column type="expand">
      <template slot-scope="scope">
        <!-- el-row表示一行  scope.row表示一个角色-->
        <!-- 一级权限 -->
        <el-row v-if="scope.row.children.length === 0">
          <span>该角色没有任何权限</span>
        </el-row>
        <el-row v-for="level1 in scope.row.children" :key="level1.id">
          <el-col :span="4">
             <el-tag closable  @close="deleteRight(scope.row, level1.id)">{{level1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
           </el-col>
          <el-col :span="20">
            <el-row v-for="level2 in level1.children" :key="level2.id">
                <el-col :span="4">
                  <el-tag closable  @close="deleteRight(scope.row, level2.id)">{{level2.authName}}</el-tag>
                    <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <span class="mr_10" v-for="level3 in level2.children" :key="level3.id">
                    <el-tag closable type="warning" @close="deleteRight(scope.row, level3.id)">{{level3.authName}}</el-tag>
                  </span>
                </el-col>
            </el-row>
          </el-col>
        </el-row>
      </template>
    </el-table-column>
    <el-table-column type="index"></el-table-column>
    <el-table-column prop="roleName" label="角色名称" align="center"> </el-table-column>
    <el-table-column prop="roleDesc" label="描述" align="center"></el-table-column>
    <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" plain @click="showeditform(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" plain @click="deleteRole(scope.row)"></el-button>
          <el-button type="success" icon="el-icon-check" size="small" plain @click="showAssignRight(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
      </el-table>
   <!-- 添加用户对话框 -->
  <el-dialog
    title="角色信息"
    :visible.sync="addDialogVisible"
    width="30%">
    <el-form
    ref="addForm"
    :model="addForm"
    label-width="80px"
    :rules="addRules">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="addForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="addForm.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addrole">确 定</el-button>
    </span>
  </el-dialog>
     <!-- 编辑用户对话框 -->
  <el-dialog
    title="角色信息"
    :visible.sync="editDialogVisible"
    width="30%">
    <el-form
    ref="editForm"
    :model="editForm"
    label-width="80px"
    :rules="addRules">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="editForm.roleName"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roleDesc">
        <el-input v-model="editForm.roleDesc"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="editDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editRole">确 定</el-button>
    </span>
  </el-dialog>
  <el-dialog
    title="提示"
    :visible.sync="assignDialogVisible"
    width="30%">
    <el-tree
      :data="rightList"
      show-checkbox
      default-expand-all
      node-key="id"
      ref="tree"
      highlight-current
      :props="defaultProps">
    </el-tree>
    <span slot="footer" class="dialog-footer">
      <el-button @click="assignDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="assignRight">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
export default {
  data () {
    return {
      addDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addRules: { // 添加的规则
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {
        roleName: '',
        roleDesc: '',
        id: ''
      },
      assignDialogVisible: false,
      rightList: [],
      defaultProps: {
        // children: 用户指定子树节点的属性
        children: 'children',
        // 指定节点文本的一个属性
        label: 'authName'
      },
      assignRoleId: '',
      roleList: []
    }
  },
  methods: {
    // 获取所有的角色列表
    async getroleList () {
      const res = await this.axios.get(`roles`)
      const { meta, data } = res.data
      if (meta.status === 200) {
        this.roleList = data
      } else {
        this.$message.error('获取权限信息失败')
      }
    },
    // 删除角色
    async deleteRole (u) {
      try {
        await this.$confirm('此操作将会永久删除用户,是否继续?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await this.axios.delete(`roles/${u.id}`)
        const { meta } = res.data
        if (meta.status === 200) {
          this.getroleList()
          this.$message.success('用户删除成功')
        }
      } catch (e) {
        this.$message.success('取消成功')
      }
    },
    addrole () {
      this.$refs.addForm.validate(async (v) => {
        if (v) {
          const res = await this.axios.post('roles', this.addForm)
          const { meta } = res.data
          if (meta.status === 201) {
            this.addDialogVisible = false
            this.$refs.addForm.resetFields()
            this.getroleList()
            this.$message.success('用户添加成功')
          }
        } else {
          return false
        }
      })
    },
    showeditform (u) {
      this.editDialogVisible = true
      this.editForm.roleName = u.roleName
      this.editForm.roleDesc = u.roleDesc
      this.editForm.id = u.id
    },
    editRole () {
      this.$refs.editForm.validate(async (v) => {
        if (v) {
          const res = await this.axios.put(`roles/${this.editForm.id}`, this.editForm)
          const { meta } = res.data
          if (meta.status === 200) {
            this.editDialogVisible = false
            this.$refs.editForm.resetFields()
            this.getroleList()
            this.$message.success('用户信息修改成功')
          }
        } else {
          return false
        }
      })
    },
    // 删除权限
    async deleteRight (role, rightId) {
      // 发送ajax请求
      const res = await this.axios.delete(`roles/${role.id}/rights/${rightId}`)
      const { meta, data } = res.data
      console.log(meta, data)
      if (meta.status === 200) {
        // 重新渲染, 修改role的children
        // 把删除后的权限重新赋值给role,
        role.children = data

        // 提示消息
        this.$message.success('删除成功')
      }
    },
    // 显示分配的对话框
    async showAssignRight (role) {
      // 显示分配的对话框
      this.assignDialogVisible = true
      // 获取到所有的角色的权限（tree）
      const res = await this.axios.get('rights/tree')
      const { meta, data } = res.data
      this.assignRoleId = role.id
      if (meta.status === 200) {
        this.rightList = data
        console.log(data)
        // 获取到当前角色下所有的三级权限
        const checkedKeys = []
        role.children.forEach(level1 => {
          level1.children.forEach(level2 => {
            level2.children.forEach(level3 => {
              checkedKeys.push(level3.id)
            })
          })
        })
        // 设置默认选中
        this.$refs.tree.setCheckedKeys(checkedKeys)
      }
    },
    // 分配权限
    async assignRight () {
      // roleId如何获取
      // console.log(this.assignRoleId)
      // 获取选中权限id
      let checkedKeys = this.$refs.tree.getCheckedKeys()
      // 获取到半选中的id
      let halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      // 发送ajax请求
      const res = await this.axios.post(`roles/${this.assignRoleId}/rights`, {
        rids: [...checkedKeys, ...halfCheckedKeys].join()
      })
      const { meta } = res.data
      if (meta.status === 200) {
        // 关闭对话框
        this.assignDialogVisible = false
        // 重新渲染
        this.getRoleList()
        // 提示
        this.$message.success('分配权限成功了')
      }
    }
  },
  created () {
    this.getroleList()
  }
}
</script>

<style>
</style>
