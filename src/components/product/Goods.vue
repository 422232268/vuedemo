<template>
  <div class="goods">
      <el-button type="success" plain @click="$router.push('/good-add')">添加商品</el-button>

    <!-- 表格 -->
    <el-table
      :data="GoodList"
      style="width: 100%">
      <el-table-column
        align="center"
        type="index"
        :index="indexmethod"
        width="50">
      </el-table-column>
      <el-table-column align="center" label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column align="center" label="商品价格" prop="goods_price"></el-table-column>
      <el-table-column align="center" label="商品重量" prop="goods_weight"></el-table-column>
      <el-table-column
        align="center"
        label="创建日期">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.add_time }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-edit">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current"
      :page-sizes="[6, 12, 18, 24]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      current: 1,
      pagesize: 10,
      total: 0,
      GoodList: []

    }
  },
  methods: {
    async getGoodList () {
      const res = await this.axios.get(`goods`, {
        params: {
          query: this.query,
          pagenum: this.current,
          pagesize: this.pagesize
        }
      })
      console.log(res)

      const { meta, data } = res.data
      if (meta.status === 200) {
        this.GoodList = data.goods
        this.total = data.total
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.current = 1
      this.getGoodList()
    },
    handleCurrentChange (val) {
      this.current = val
      this.getGoodList()
    },
    indexmethod (index) {
      return (this.current - 1) * this.pagesize + index + 1
    }
  },
  created () {
    this.getGoodList()
  }
}
</script>

<style>
</style>
