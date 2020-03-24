<template>
  <div>
    <verify-detail :detail-id="rowId" :get-detail="getNoticesDetail" detail-name="noticeid" />
    <!-- 表单渲染 -->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="verifyDialog"
      title="审核通告"
      width="420px"
      @close="cancelCU"
    >
      <el-form ref="form" :inline="true" :model="form" size="small" label-width="110px">
        <el-form-item label="审核意见">
          <el-input v-model="form.reviewComment" style="width: 185px;" rows="2" type="textarea" />
        </el-form-item>
        <el-form-item label="是否通过" prop="reviewstatus">
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
    <el-button style="float: right;margin: -100px 320px 0 0;" type="text" size="large" @click="handleClick">审核</el-button>
  </div>
</template>

<script>
import verifyDetail from '@/views/components/verifyDetail'
import { getNoticesDetail } from '@/api/verify/verifyNotices'
import { reviewNotices } from '@/api/verify/verifyNotices'
import CRUD, { presenter, header, crud } from '@crud/crud'

// crud交由presenter持有
const defaultCrud = CRUD({ requestType: 'post', query: { status: '0' }, url: 'notice/getReviewRecords' })
export default {
  name: 'NewsDetails',
  components: { verifyDetail },
  mixins: [presenter(defaultCrud), header(), crud()],
  data() {
    return {
      rowId: null,
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
    this.rowId = this.$route.query.rowId
  },
  methods: {
    getNoticesDetail,
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
      reviewNotices(this.rowId, this.form).then(res => {
        this.verifyLoading = false
        this.verifyDialog = false
        this.$message({
          type: 'success',
          message: '审核通过'
        })
        this.$router.push('/verify/notice')
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
