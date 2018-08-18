<template>
<div class="rights">
    <el-table
    :data="rightList"
    stripe
    style="width: 100%">
    <el-table-column
      type="index">
    </el-table-column>
    <el-table-column
      prop="authName"
      label="权限名称"
      align="center">
    </el-table-column>
    <el-table-column
      prop="path"
      label="路径"
      align="center">
    </el-table-column>
    <el-table-column
      label="层级"
      align="center">
      <template slot-scope='scope'>
        <span v-if="scope.row.level==0">一级分类</span>
        <span v-else-if="scope.row.level==1">二级分类</span>
        <span v-else>三级分类</span>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
export default {
  data () {
    return {
      rightList: []
    }
  },
  methods: {
    async getRightList () {
      const res = await this.axios.get(`rights/list`)
      console.log(res)
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
