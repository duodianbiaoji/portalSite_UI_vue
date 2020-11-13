<template>
  <div style="padding: 100px;margin-top: -90px;">
    <h3 style="text-align: center;font-family: '华文宋体';">{{ articleTitle }}</h3>
    <div style="text-align: center;">
      <span>{{ publishdate }}</span>
      <span style="margin-left: 20px">{{ author }}</span>
      <el-button style="margin-left: 20px;" type="text" size="large" @click="handleClick">审核</el-button>
    </div>
    <div style="width: 100%;height: 100%;overflow: hidden;border-top: 1px solid #666;margin-top: -2px;">
      <span style="margin-top: 10px;display: block" v-html="content" />
    </div>
    <!-- 表单渲染 -->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="verifyDialog"
      title="审核评论"
      width="420px"
      @close="cancelCU"
    >
      <el-form ref="form" :inline="true" :model="form" size="small" label-width="110px">
        <el-form-item label="审核意见">
          <el-input v-model="form.reviewComment" style="width: 185px;" rows="2" type="textarea" />
        </el-form-item>
        <el-form-item label="是否通过">
          <el-radio-group v-model="form.reviewstatus" @change="changeRadio">
            <el-radio :label="1" style="margin-left: 23px;">通过</el-radio>
            <el-radio :label="0" style="margin-left: -12px;">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancelCU">取消</el-button>
        <el-button :loading="verifyLoading" type="primary" @click="verifySubmit">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { reviewComment } from '@/api/verify/verifyComment'
import crudComment from '@/api/verify/verifyComment'
import CRUD, { presenter, header, crud } from '@crud/crud'

// crud交由presenter持有
const defaultCrud = CRUD({ requestType: 'post', url: 'comment/getReviewRecords', query: { status: '0' }, crudMethod: { ...crudComment }})
export default {
  name: 'NewsDetails',
  mixins: [presenter(defaultCrud), header(), crud()],
  data() {
    return {
      rowId: null,
      articleTitle: null,
      publishdate: null,
      author: null,
      content: null,
      verifyDialog: false,
      verifyLoading: false,
      form: {
        reviewComment: null,
        reviewstatus: 1
      },
      enabledTypeOptions: [
        { key: '0', display_name: '未通过' },
        { key: '1', display_name: '已通过' }
      ]
    }
  },
  created() {
    this.rowId = this.$route.query.id
    this.articleTitle = this.$route.query.articleTitle
    this.publishdate = this.$route.query.publishdate
    this.author = this.$route.query.author
    this.content = this.$route.query.content
  },
  methods: {
    handleClick() {
      this.verifyDialog = true
    },
    resetForm() {
      this.form = {
        reviewComment: null,
        reviewstatus: 1
      }
    },
    cancelCU() {
      this.resetForm()
      this.verifyDialog = false
    },
    changeRadio(val) {
      this.form.reviewstatus = val
    },
    requestData() {
      this.verifyLoading = true
      reviewComment(this.rowId, this.form).then(res => {
        this.verifyLoading = false
        this.verifyDialog = false
        this.$router.push('/verify/comment')
        this.crud.refresh()
      })
    },
    verifySubmit() {
      if (this.form.reviewstatus === 0) {
        if (this.form.reviewComment === null) {
          this.$message({
            type: 'warning',
            message: '评论意见不能为空!'
          })
          return false
        } else {
          this.requestData()
        }
      } else {
        this.requestData()
      }
    }
  }
}
</script>

<style scoped>

</style>
