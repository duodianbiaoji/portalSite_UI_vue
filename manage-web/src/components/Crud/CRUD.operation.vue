<template>
  <div class="crud-opts">
    <el-button
      v-if="crud.optShow.add"
      class="filter-item"
      size="mini"
      type="primary"
      icon="el-icon-plus"
      style="padding: 5px;margin-top: -2px;"
      @click="crud.toAdd"
    >
      新增
    </el-button>
    <el-button
      v-if="crud.optShow.edit"
      class="filter-item"
      size="mini"
      type="success"
      icon="el-icon-edit"
      style="padding: 5px;margin-top: -2px;"
      :disabled="crud.selections.length !== 1"
      @click="crud.toEdit(crud.selections[0])"
    >
      修改
    </el-button>
    <el-button
      v-if="crud.optShow.del"
      slot="reference"
      class="filter-item"
      type="danger"
      icon="el-icon-delete"
      size="mini"
      style="padding: 5px;margin-top: -2px;"
      :loading="crud.delAllLoading"
      :disabled="crud.selections.length !== 1"
      @click="openDel"
    >
      删除
    </el-button>
    <el-button
      v-if="crud.optShow.refresh"
      :disabled="!crud.data.length"
      class="filter-item"
      size="mini"
      type="warning"
      icon="el-icon-refresh"
      style="padding: 5px;margin-top: -2px;"
      @click="crud.refresh()"
    >
      刷新
    </el-button>
    <el-dialog
      title="删除确认"
      :visible.sync="centerDialogVisible"
      width="20%"
      center
      @close="cancel"
    >
      <el-input
        v-model="articleTitle"
        style="width: 70%;margin-left: 35px;"
        :placeholder="delContent"
        @input="changeInput"
      />
      <div slot="footer">
        <el-button style="margin-left: 140px;" @click="cancel">取 消</el-button>
        <el-button :loading="delLoading" :disabled="deleteStatus" type="primary" @click="deleteData(crud.selections[0])">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { crud } from '@crud/crud'
import Long from 'long'
export default {
  mixins: [crud()],
  props: {
    permission: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      centerDialogVisible: false,
      articleTitle: null,
      deleteStatus: true,
      delLoading: false,
      delContent: null
    }
  },
  methods: {
    /* toDelete(datas) {
      this.$confirm(`确认删除选中的${datas.length}条数据?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.crud.delAllLoading = true
        this.crud.doDelete(datas)
      }).catch(() => {
      })
    },*/
    openDel() {
      this.centerDialogVisible = true
      if (this.permission === false) this.delContent = '请输入角色名称'
      else this.delContent = '请输入标题内容'
    },
    cancel() {
      this.centerDialogVisible = false
      this.articleTitle = null
      this.deleteStatus = true
    },
    changeInput() {
      if (this.permission === false) {
        if (this.articleTitle !== this.crud.selections[0].role) return
        else this.deleteStatus = false
      } else {
        if (this.articleTitle !== this.crud.selections[0].title) return
        else this.deleteStatus = false
      }
    },
    commonHandle() {
      this.deleteStatus = true
      this.articleTitle = null
      this.centerDialogVisible = false
      setTimeout(() => {
        this.delLoading = false
      }, this.crud.time)
    },
    deleteData(data) {
      const ids = []
      ids.push(Long.fromValue(data.id).toString())
      this.delLoading = true
      this.crud.crudMethod.del(ids.join(',')).then(() => {
        this.crud.dleChangePage(1)
        this.crud.delSuccessNotify()
        this.commonHandle()
        this.crud.refresh()
      }).catch(() => {
        this.commonHandle()
      })
    }
  }
}
</script>

<style>
  .crud-opts {
    margin: -8px 0 0 0;
    display: -webkit-flex;
    display: flex;
    align-items: center;
  }
  .crud-opts .crud-opts-right {
    margin-left: auto;
  }
</style>
