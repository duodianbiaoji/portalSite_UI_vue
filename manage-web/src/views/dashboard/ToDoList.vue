<template>
  <div>
    <el-card v-if="showTodoList" class="box-card">
      <span class="header">待办事项</span>
      <div v-for="item in todoList" :key="item.articletype" class="text item" @click="clickToJump(item)">
        <span style="margin-left: 20px;">{{ item.articletypeStr }}</span>
        <span style="margin-right: 20px;">{{ item.count }}</span>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getToDoList } from '@/api/home/home'
export default {
  name: 'ToDoList',
  data() {
    return {
      todoList: [],
      showTodoList: false
    }
  },
  mounted() {
    this.getToDoList()
  },
  methods: {
    getToDoList() {
      this.todoList = []
      getToDoList().then(res => {
        console.log(res)
        if (res.length !== 0) {
          this.showTodoList = true
          this.todoList = res
        } else {
          this.showTodoList = false
          this.todoList = []
        }
      })
    },
    clickToJump(row) {
      if (row.articletype === 0) {
        this.$router.push('/verify/news')
      } else if (row.articletype === 1) {
        this.$router.push('/verify/notice')
      } else if (row.articletype === 6) {
        this.$router.push('/verify/share')
      } else if (row.articletype === 7) {
        this.$router.push('/verify/comment')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .box-card {
    margin-top: 70px;
    margin-right: 20px;
    border-color: rgba(0, 0, 0, .05);
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-radius: 7px;
    width: 90%;
    height: 380px;
    margin-bottom: 12px;
    background: #207CCE;
    .header {
      font-size: 14px;
      color: #fff;
    }
    .text {
      font-size: 12px;
      margin-top: 12px;
      color: #fff;
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      cursor: pointer;
    }

    .item {
      margin-bottom: 16px;
    }

  }
</style>
