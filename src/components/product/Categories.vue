<template>
  <div class="categories">
    <!-- 添加分类按钮 -->
    <el-button type="success" plain @click="showAddDialog">添加分类</el-button>
    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="cateList"
      stripe
      align="center"
      size="small"
      style="width: 100%"
      >
      <el-table-tree-column
        label="分类名称"
        prop="cat_name"
        tree-key="cat_id"
        level-key="cat_level"
        parent-key="cat_pid"
        child-key="children"
        :indent-size="40">
      </el-table-tree-column>
      <el-table-column
        prop="cat_deleted"
        label="是否有效">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted">无效</span>
          <span v-else>有效</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="cat_level"
        label="排序"
        >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" plain @click="showEditDialog(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" plain @click="deleteCat(scope.row.cat_id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current"
      :page-sizes="[6, 12, 18, 24]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 添加分类 -->
    <el-dialog title="增加分类"
        :visible.sync="addDialogVisible"
        width="40%">
      <el-form
        :model="addForm"
        ref="addForm"
        label-width="80px"
        :rules="addRules">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级名称" prop="cat_pid">
            <el-cascader
              :props="props"
              clearable
              :options="options"
              change-on-select
              v-model="addForm.cat_pid"
            ></el-cascader>
          </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCat">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改分类 -->
    <el-dialog title="修改分类"
        :visible.sync="editDialogVisible"
        width="40%">
      <el-form
        :model="editForm"
        ref="editForm"
        label-width="80px"
        :rules="addRules">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCat">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import Vue from "vue"
import ElTreeGrid from 'element-tree-grid'
// console.log(ElTreeGrid.name)
// Vue.component(ElTreeGrid.name, ElTreeGrid)
export default {
  data () {
    return {
      current: 1,
      pagesize: 6,
      total: 0,
      cateList: [],
      loading: true,
      props: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      addForm: {
        cat_name: '',
        cat_pid: []
      },
      editForm: {
        cat_name: '',
        cat_pid: []
      },
      addRules: {
        cat_name: [
          { required: true, message: '请输入分类的名称', trigger: 'blur' }
        ]
      },
      addDialogVisible: false,
      editDialogVisible: false,
      options: []
    }
  },
  methods: {
    async getCateList () {
      const res = await this.axios.get(`categories`, {
        params: {
          type: 3,
          pagenum: this.current,
          pagesize: this.pagesize
        }
      })
      const { meta, data } = res.data
      console.log(data)
      if (meta.status === 200) {
        setTimeout(() => {
          this.cateList = data.result
          this.total = data.total
          this.loading = false
        }, 1)
      }
    },
    handleSizeChange (val) {
      this.loading = true
      this.pagesize = val
      this.current = 1
      this.getCateList()
    },
    handleCurrentChange (val) {
      this.loading = true
      this.current = val
      this.getCateList()
    },
    async showAddDialog () {
      this.addDialogVisible = true
      const res = await this.axios.get('categories?type=2')
      const { meta, data } = res.data
      if (meta.status === 200) {
        console.log(data)
        this.options = data
      }
    },
    addCat () {
      this.$refs.addForm.validate(async v => {
        if (v) {
          const { cat_name: catName, cat_pid: catPid } = this.addForm
          const res = await this.axios.post(`categories`, {
            cat_pid: catPid[catPid.length - 1] || 0,
            cat_name: catName,
            cat_level: catPid.length
          })
          const { meta } = res.data
          if (meta.status === 201) {
            this.addDialogVisible = false
            this.$refs.addForm.resetFields()
            this.getCateList()
            this.$message.success('添加分类成功了')
          }
        }
      })
    },
    showEditDialog (u) {
      this.editDialogVisible = true
      this.editForm.id = u.cat_id
      this.editForm.cat_name = u.cat_name
    },
    editCat () {
      this.$refs.editForm.validate(async v => {
        if (!v) {
          return false
        }
        const res = await this.axios.put(`categories/${this.editForm.id}`, this.editForm)
        const { meta } = res.data
        if (meta.status === 200) {
          this.editDialogVisible = false
          this.$refs.editForm.resetFields()
          this.getCateList()
          this.$message.success('修改成功')
        }
      })
    },
    async deleteCat (u) {
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await this.axios.delete(`categories/${u}`)
        const { meta } = res.data
        if (meta.status === 200) {
          this.getCateList()
          this.$message.success('删除成功')
        }
      } catch (e) {
        this.$message.info('删除已取消')
      }
    }
  },
  created () {
    this.getCateList()
  },
  components: {
    [ElTreeGrid.name]: ElTreeGrid
  }
}
</script>

<style>
</style>
