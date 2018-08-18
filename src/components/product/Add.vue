<template>
  <div class="add">
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>
    <el-tabs v-model="activeName" tab-position="right" @tab-click="handleClick">
    <el-tab-pane label="基本信息" name="basic">
      <el-form :model="addForm" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" >
            <el-input v-model="addForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
              <el-cascader
                :options="options"
                :props="props"
                v-model="addForm.goods_cat">
              </el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio v-model="addForm.is_promote" :label="true">是</el-radio>
            <el-radio v-model="addForm.is_promote" :label="false">否</el-radio>
          </el-form-item>
        </el-form>
      <el-button style="margin-top: 12px;" @click="next(1,'pic')">下一步</el-button>
    </el-tab-pane>
    <el-tab-pane label="商品图片" name="pic">
       <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          :headers="headers"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      <el-button style="margin-top: 12px;" @click="next(2,'content')">下一步</el-button>
    </el-tab-pane>
    <el-tab-pane label="商品内容" name="content">
        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
        <el-button type="primary" @click="addGood">确定</el-button>
      <el-button style="margin-top: 12px;" @click="next(0,'basic')">下一步</el-button>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: 0,
      options: [],
      activeName: 'basic',
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: [],
        is_promote: true,
        pics: []
      },
      headers: {
        Authorization: localStorage.getItem('myToken')
      },
      props: {
        value: 'cat_id',
        label: 'cat_name'
      }
    }
  },
  methods: {
    handleClick (tab, event) {
      this.active = +tab.index
    },
    next (active, activeName) {
      // 步骤条第2步
      this.active = active
      // 显示图片那一栏
      this.activeName = activeName
    },
    handleRemove (file, fileList) {
      console.log(file, fileList);
    },
    handleSuccess (file) {
      console.log(file)
    }
  }
}
</script>

<style>
.ql-editor {
  min-height: 300px;
  background-color: #fff;
}
.quill-editor {
  background-color: #fff;
}
</style>
