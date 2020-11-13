<template>
  <div v-if="detailsData" style="padding: 100px;margin-top: -90px;">
    <h3 style="text-align: center;font-family: '华文宋体';">{{ detailsData.title }}</h3>
    <div style="text-align: center;">
      <span>{{ detailsData.publishdate }}</span>
      <span style="margin-left: 20px">{{ detailsData.author }}</span>
      <el-button type="text" style="margin-left: 20px;" size="large" @click="handleClick">审核</el-button>
    </div>
    <div style="width: 100%;height: 100%;overflow: hidden;border-top: 1px solid #666;margin-top: -2px;">
      <span v-html="detailsData.content" />
    </div>
    <div v-if="isFile" style="cursor: pointer;">
      <div style="height: 40px;background: #f3f1f1;line-height: 40px;">
        <h3 style="margin-left:20px;">附件</h3>
      </div>
      <div v-for="(item,index) in detailsData.annexes" :key="index" style="position: relative;height: 80px;">
        <div style="position: absolute;font-size:50px;top: 50%;transform: translateY(-40%)">
          <i class="el-icon-document" />
        </div>
        <div style="position: absolute;left: 6%;top: 20%;">
          <span style="text-align:center">{{ item.name }}</span>
        </div>
        <div style="position: absolute;left: 6%;top: 60%">
          <el-button type="primary" round @click="handleFileDownLoad(item)">下载</el-button>
        </div>
      </div>
    </div>
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
  </div>
</template>

<script>
import { getNoticesDetail } from '@/api/verify/verifyNotices'
import { reviewNotices } from '@/api/verify/verifyNotices'
import CRUD, { presenter, header, crud } from '@crud/crud'
import { fileDownload } from '@/api/file'
import { download } from '@/utils/download'
import Long from 'long'

// crud交由presenter持有
const defaultCrud = CRUD({ requestType: 'post', query: { status: '0' }, url: 'notice/getReviewRecords' })
export default {
  name: 'NewsDetails',
  mixins: [presenter(defaultCrud), header(), crud()],
  data() {
    return {
      detailsData: null,
      isFile: false,
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
  mounted() {
    this.getNoticesDetail()
  },
  methods: {
    getNoticesDetail() {
      getNoticesDetail(this.rowId).then(res => {
        if (res.annexes.length > 0) {
          this.isFile = true
          res.annexes = res.annexes.forEach(item => {
            item.fid = (Long.fromValue(item.fid)).toString()
            return item
          })
        }
        this.detailsData = res
      })
    },
    // 文件下载
    handleFileDownLoad(file) {
      fileDownload(file).then(response => {
        download(response, file.name)
      })
    },
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
