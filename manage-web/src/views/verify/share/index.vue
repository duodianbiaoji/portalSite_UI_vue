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
    </div>
    <!--表格渲染-->
    <el-table
      v-loading="crud.loading"
      :data="crud.data"
      style="width: 100%;margin-top: 12px;"
      @row-click="jumpShareDetails"
    >
      <el-table-column type="selection" align="center" width="55" />
      <el-table-column prop="title" label="知识分享标题" align="center" />
      <el-table-column prop="author" label="作者" align="center" />
      <el-table-column width="135" prop="publishdate" align="center" label="发布时间" />
      <el-table-column prop="reviewstatusStr" align="center" label="审核状态" />
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import Long from 'long'
import { mapGetters } from 'vuex'
import crudShare from '@/api/verify/verifyShare'
import CRUD, { presenter, header, crud } from '@crud/crud'
import pagination from '@crud/Pagination'

// crud交由presenter持有
const defaultCrud = CRUD({ requestType: 'post', url: 'knowledgeShare/getReviewRecords', query: { status: '0' }, crudMethod: { ...crudShare }})
export default {
  name: 'NewsVerify',
  components: { pagination },
  mixins: [presenter(defaultCrud), header(), crud()],
  data() {
    return {
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
  methods: {
    jumpShareDetails(row) {
      this.$router.push({
        path: 'share/verify',
        query: {
          rowId: (Long.fromValue(row.id)).toString(),
          type: row.type
        }
      })
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
