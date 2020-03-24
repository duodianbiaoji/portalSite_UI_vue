<template>
  <div class="app-container">
    <!--工具栏-->
    <crudOperation />
    <div style="float: right;margin: -23px 20px 0 0;">
      <el-select
        v-model="query.status"
        size="mini"
        placeholder="状态"
        class="filter-item"
        style="width:85px;"
        @change="crud.toQuery"
      >
        <el-option
          v-for="item in enabledTypeOptions"
          :key="item.key"
          :label="item.display_name"
          :value="item.key"
        />
      </el-select>
      <span>
        <el-button class="filter-item" style="padding: 5px;" size="mini" type="success" icon="el-icon-search" @click="crud.toQuery">搜索</el-button>
        <el-button style="margin-left: 5px;padding: 5px;" class="filter-item" size="mini" type="warning" icon="el-icon-refresh-left" @click="crud.resetQuery()">重置</el-button>
      </span>
    </div>
    <!--表格渲染-->
    <el-table
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%;margin-top: 12px;"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column type="selection" align="center" width="55" />
      <el-table-column prop="articleTitle" label="文章标题" align="center" />
      <el-table-column prop="content" label="评论内容" align="center" />
      <el-table-column prop="ip" label="评论IP" align="center" />
      <el-table-column prop="author" label="作者" align="center" />
      <el-table-column prop="publishdate" width="160" align="center" label="发布时间" />
      <el-table-column prop="reviewstatusStr" align="center" label="审核状态" />
      <el-table-column
        width="180"
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="warning" style="padding: 6px;" size="mini" @click="handleClick(scope.row)">审核</el-button>
          <el-button type="primary" style="padding: 6px;" size="mini" @click="handleClickDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
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
    <el-drawer
      :title="detail.title"
      :visible.sync="showdetail"
      direction="rtl"
      size="30%"
    >
      <div>
        <div class="drawer-item" style="margin-top: -30px;">
          <span style="margin-left: 22px;">审核状态:</span>
          <span>{{ detailsList.reviewstatusStr }}</span>
        </div>
        <div class="drawer-item" style="margin-top: -10px;">
          <span style="margin-left: 22px;">审核意见:</span>
          <span>{{ detailsList.reviewComment }}</span>
        </div>
        <div class="drawer-item" style="margin-top: -10px;">
          <span style="margin-left: 22px;">审核人:</span>
          <span>{{ detailsList.reviewer }}</span>
        </div>
        <div class="drawer-item" style="margin-top: -10px;">
          <span style="margin-left: 22px;">审核日期:</span>
          <span>{{ detailsList.reviewdate }}</span>
        </div>
      </div>
    </el-drawer>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import Long from 'long'
import { mapGetters } from 'vuex'
import { reviewComment, getVerifyDetail } from '@/api/verify/verifyComment'
import crudComment from '@/api/verify/verifyComment'
import CRUD, { presenter, header, crud } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
const defaultCrud = CRUD({ requestType: 'post', url: 'comment/getReviewRecords', query: { status: '0' }, crudMethod: { ...crudComment }})
export default {
  name: 'NewsVerify',
  components: { crudOperation, pagination },
  mixins: [presenter(defaultCrud), header(), crud()],
  data() {
    return {
      verifyDialog: false,
      verifyLoading: false,
      form: {
        reviewComment: null,
        reviewstatus: 1
      },
      selectRowId: undefined,
      showdetail: false,
      detail: {},
      detailsList: {},
      enabledTypeOptions: [
        { key: '0', display_name: '未通过' },
        { key: '1', display_name: '已通过' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'baseApi'
    ])
  },
  created() {
    this.crud.optShow.add = false
    this.crud.optShow.edit = false
  },
  methods: {
    handleClick(row) {
      this.selectRowId = (Long.fromValue(row.id)).toString()
      this.verifyDialog = true
    },
    handleClickDetail(row) {
      this.detail = row
      this.showdetail = true
      this.detailsList = {}
      getVerifyDetail(row.id).then(res => {
        this.detailsList = res
      })
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
      reviewComment(this.selectRowId, this.form).then(res => {
        this.verifyLoading = false
        this.verifyDialog = false
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
  .drawer-item {
    font-size: 14px;
    padding: 12px 0;
  }
</style>
