<template>
  <div class="app-container">
    <!--工具栏-->
    <div style="float: left;margin: -12px 10px 0 0;">
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
    </div>
    <crudOperation />
    <!--表格渲染-->
    <el-table
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%;margin-top: 12px;"
      @row-click="jumpCommentDetails"
    >
      <el-table-column type="selection" align="center" width="55" />
      <el-table-column prop="articleTitle" label="文章标题" align="center" />
      <el-table-column prop="content" label="评论内容" align="center" />
      <el-table-column prop="ip" label="评论IP" align="center" />
      <el-table-column prop="author" label="作者" align="center" />
      <el-table-column prop="publishdate" width="160" align="center" label="发布时间" />
      <el-table-column prop="reviewstatusStr" align="center" label="审核状态" />
     <!-- <el-table-column
        width="180"
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="warning" style="padding: 6px;" size="mini" @click="handleClick(scope.row)">审核</el-button>
          <el-button type="primary" style="padding: 6px;" size="mini" @click="handleClickDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>-->
    </el-table>
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
    jumpCommentDetails(row) {
      this.$router.push({
        path: 'comment/verify',
        query: {
          id: (Long.fromValue(row.id)).toString(),
          articleTitle: row.articleTitle,
          publishdate: row.publishdate,
          author: row.author,
          content: row.content
        }
      })
    },
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
