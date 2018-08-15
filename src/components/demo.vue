<template>
<div class="roles">
  <el-button type="success" plain @click="showadddialog=true">添加角色</el-button>
   <!-- 添加用户对话框 -->
  <el-dialog
    title="角色信息"
    :visible.sync="showadddialog"
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
      <el-button @click="showadddialog = false">取 消</el-button>
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
  <el-table :data="rightList" stripe style="width: 100%">
    <el-table-column type="expand">
      <template slot-scope="scope">
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
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
export default {
  data () {
    return {
      assignDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      editForm: {
        roleName: '',
        roleDesc: '',
        id: ''
      },
      addRules: { // 添加的规则
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      defaultProps: {
        // children: 用户指定子树节点的属性
        children: 'children',
        // 指定节点文本的一个属性
        label: 'authName'
      },
      showadddialog: false,
      editDialogVisible: false,
      rightList: []
    }
  },
  methods: {
    showAssignRight (u) {
      this.assignDialogVisible = true
    },
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
    showeditform (u) {
      this.editDialogVisible = true
      this.editForm.roleName = u.roleName
      this.editForm.roleDesc = u.roleDesc
      this.editForm.id = u.id
    },
    editRole () {
      console.log(this.editForm.id)
      this.$refs.editForm.validate(async (v) => {
        if (v) {
          const res = await this.axios.put(`roles/${this.editForm.id}`, this.editForm)
          const { meta } = res.data
          if (meta.status === 200) {
            this.editDialogVisible = false
            this.$refs.editForm.resetFields()
            this.getRightList()
            this.$message.success('用户信息修改成功')
          }
        }
      })
    },
    addrole () {
      this.$refs.addForm.validate(async (v) => {
        if (v) {
          const res = await this.axios.post('roles', this.addForm)
          const { meta } = res.data
          if (meta.status === 201) {
            this.showadddialog = false
            this.$refs.addForm.resetFields()
            this.getRightList()
            this.$message.success('用户添加成功')
          } else {
            return false
          }
        }
      })
    },
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
          this.getRightList()
          this.$message.success('用户删除成功')
        }
      } catch (e) {
        this.$message.success('取消成功')
      }
    },
    async getRightList () {
      const res = await this.axios.get(`roles`)
      const { meta, data } = res.data
      if (meta.status === 200) {
        this.rightList = data
      } else {
        this.$message.error('获取权限信息失败')
      }
    }
  },
  created () {
    this.getRightList()
  }
}
</script>

<style>
</style>
