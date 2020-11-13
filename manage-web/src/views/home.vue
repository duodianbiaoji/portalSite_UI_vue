<template>
  <div class="dashboard-editor-container">
    <div class="welcome">
      <span style="margin-right: 18px;">欢迎{{ realname }}登录系统</span>
      <span> {{date}} </span>
    </div>
    <el-row>
      <el-col :xs="24" :sm="24" :lg="17">
        <panel-group />
      </el-col>
      <el-col :xs="24" :sm="24" :lg="7">
        <to-do-list />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './dashboard/PanelGroup'
import ToDoList from './dashboard/ToDoList'

export default {
  name: 'Dashboard',
  components: {
    PanelGroup,
    ToDoList
  },
  data() {
    return {
      realname: null,
      date: null
    }
  },
  methods: {
    getDate() {
      const date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const monthHandle = month < 10 ? '0' + month : month
      const dayHandle = day < 10 ? '0' + day : day
      this.date = `${year}-${monthHandle}-${dayHandle}`
    }
  },
  mounted() {
    this.realname = sessionStorage.getItem('realname')
    this.getDate()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    background: url("../assets/images/背景.png") no-repeat center center;
    background-size: 100% 100%;
    .welcome {
      font-size: 21px;
      font-family: "方正粗倩简体";
      float: right;
      margin: 28px 0 0 0;
      color: #fff;
      font-weight: bold;
      margin-right: 24px;
    }
  }
</style>
