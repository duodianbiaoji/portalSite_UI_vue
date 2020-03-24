<template>
  <div>
    <verify-detail :detail-id="rowId" :get-detail="getKnlgeShareDetail" detail-name="articleid" :detail-type="type" :is-verify="true"/>
    <!-- 表单渲染 -->
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="verifyDialog"
      title="审核分享"
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
    <el-button style="float: right;margin: -100px 320px 0 0;z-index: 111" type="text" size="large" @click="handleClick">审核</el-button>
  </div>
</template>

<script>
import verifyDetail from '@/views/components/verifyDetail'
import { getKnlgeShareDetail } from '@/api/verify/verifyShare'
import { reviewShare } from '@/api/verify/verifyShare'
import CRUD, { presenter, header, crud } from '@crud/crud'
import crudShare from '@/api/verify/verifyShare'

// crud交由presenter持有
const defaultCrud = CRUD({ requestType: 'post', url: 'knowledgeShare/getReviewRecords', query: { status: '0' }, crudMethod: { ...crudShare }})
export default {
  name: 'NewsDetails',
  components: { verifyDetail },
  mixins: [presenter(defaultCrud), header(), crud()],
  data() {
    return {
      rowId: null,
      type: null,
      verifyDialog: false,
      verifyLoading: false,
      form: {
        reviewComment: null,
        reviewstatus: 1
      }
    }
  },
  created() {
    this.rowId = this.$route.query.rowId
    this.type = parseInt(this.$route.query.type)
  },
  methods: {
    getKnlgeShareDetail,
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
      reviewShare(this.rowId, this.form).then(res => {
        this.verifyLoading = false
        this.verifyDialog = false
        this.$message({
          type: 'success',
          message: '审核通过'
        })
        this.$router.push('/verify/share')
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
