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
    <div>
      <el-button
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-upload"
        style="float:left;margin: -10px 10px 0 0;padding: 5px;padding-right: 8px;"
        @click="toAdd"
      >发布
      </el-button>
      <el-button
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-edit"
        style="float:left;margin: -10px 10px 0 0;padding: 5px;padding-right: 8px;"
        :disabled="crud.selections.length !== 1"
        @click="toEdit"
      >修改
      </el-button>
      <crudOperation style="float:left" />
    </div>
    <!--表格渲染-->
    <el-table
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%;margin-top: 24px;"
      @selection-change="crud.selectionChangeHandler"
    >
      <el-table-column :selectable="checkboxT" type="selection" width="50" />
      <el-table-column width="130" :show-overflow-tooltip="true" prop="title" align="center" label="标题" />
      <el-table-column width="250" :show-overflow-tooltip="true" align="center" prop="summary" label="概要" />
      <el-table-column prop="newsTName" :show-overflow-tooltip="true" label="新闻类型" align="center" />
      <el-table-column prop="author" :show-overflow-tooltip="true" label="作者" align="center" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="imageUrl" label="缩略图">
        <template slot-scope="{row}">
          <el-image
            :src="parseUrl(row.imageUrl)"
            :preview-src-list="[parseUrl(row.imageUrl)]"
            fit="contain"
            lazy
            class="el-avatar"
          />
        </template>
      </el-table-column>
      <el-table-column width="135" prop="publishdate" align="center" label="发布日期" />
      <el-table-column prop="reviewstatusStr" align="center" label="审核状态" />
      <el-table-column
        label="审核详情"
      >
        <template slot-scope="scope">
          <el-button slot="reference" style="padding: 6px;" type="primary" size="mini" @click="handleClick(scope.row)">详情</el-button>
        </template>
      </el-table-column>
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
import crudNewsPublish from '@/api/publish/newsPublish'
import { getNewsDetail } from '@/api/publish/newsPublish'
import { mapGetters } from 'vuex'
import CRUD, { presenter, header, crud } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
const defaultCrud = CRUD({ requestType: 'post', url: 'news/getReviewRecords', query: { status: '0' }, crudMethod: { ...crudNewsPublish }})
export default {
  name: 'Pictures',
  components: { crudOperation, pagination },
  mixins: [presenter(defaultCrud), header(), crud()],
  data() {
    return {
      showdetail: false,
      detail: {},
      detailsList: {},
      enabledTypeOptions: [
        { key: '0', display_name: '未通过' },
        { key: '1', display_name: '已通过' },
        { key: '2', display_name: '全部' }
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
    toAdd() {
      this.$router.push({
        path: '/publish/news/create/'
      })
      this.crud.selections.length = 0
    },
    toEdit() {
      this.$router.push({
        path: '/publish/news/edit/',
        query: {
          row: this.crud.selections[0]
        }
      })
      this.crud.selections.length = 0
    },
    handleClick(row) {
      this.detail = row
      this.showdetail = true
      this.detailsList = {}
      getNewsDetail((Long.fromValue(row.id)).toString()).then(res => {
        this.detailsList = res
      })
    },
    parseUrl(imgUrl) {
      return `${window.g.baseURL}${imgUrl}`
    },
    checkboxT(row) {
      return row.reviewstatus !== 1
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-dialog-div {
    height: 60vh;
    overflow: auto;
  }

  .drawer-item {
    font-size: 14px;
    padding: 12px 0;
  }

</style>
