<template>
  <div class="app-container">
    <!--工具栏-->
    <div style="margin: -8px 20px 0 0;">
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
      style="width: 100%;"
      @row-click="jumpNewsDetails"
    >
      <el-table-column prop="title" align="center" label="标题" />
      <el-table-column :show-overflow-tooltip="true" align="center" prop="summary" label="摘要" />
      <el-table-column prop="newsTName" label="新闻类型" align="center" />
      <el-table-column prop="author" label="作者" align="center" />
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
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CRUD, { presenter, header, crud } from '@crud/crud'
import pagination from '@crud/Pagination'
import Long from 'long'

// crud交由presenter持有
const defaultCrud = CRUD({ requestType: 'post', query: { status: '0' }, url: 'news/getReviewRecords' })
export default {
  name: 'NewsVerify',
  components: { pagination },
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

  },
  methods: {
    jumpNewsDetails(row) {
      this.$router.push({
        path: 'news/verify',
        query: {
          rowId: (Long.fromValue(row.id)).toString()
        }
      })
    },
    parseUrl(imgUrl) {
      return this.baseApi + imgUrl
    }
  }
}
</script>

<style scoped>

</style>
