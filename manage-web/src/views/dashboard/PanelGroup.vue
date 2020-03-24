<template>
  <div style="display: flex;flex-direction: column;flex-wrap: wrap">
    <el-row :gutter="10" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="icon-news" />
          <count-to :start-val="0" :end-val="count.news" :duration="2600" class="card-panel-num-news" />
        </div>
        <div class="card-panel-text">新闻</div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col2">
        <div class="card-panel">
          <div class="icon-notice" />
          <count-to :start-val="0" :end-val="count.notice" :duration="3000" class="card-panel-num-notice" />
        </div>
        <div class="card-panel-text">通告</div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col2">
        <div class="card-panel">
          <div class="icon-train" />
          <count-to :start-val="0" :end-val="count.train" :duration="3200" class="card-panel-num-inst" />
        </div>
        <div class="card-panel-text2">培训专栏</div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col2">
        <div class="card-panel">
          <div class="icon-quality" />
          <count-to :start-val="0" :end-val="count.quality" :duration="3600" class="card-panel-num-quality" />
        </div>
        <div class="card-panel-text2">质量专栏</div>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="panel-group2">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel">
          <div class="icon-news" />
          <count-to :start-val="0" :end-val="count.instution" :duration="2600" class="card-panel-num-news" />
        </div>
        <div class="card-panel-text2">制度文档</div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col2">
        <div class="card-panel">
          <div class="icon-honour" />
          <count-to :start-val="0" :end-val="count.honour" :duration="3000" class="card-panel-num-honour" />
        </div>
        <div class="card-panel-text2">荣誉中亚</div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col2">
        <div class="card-panel">
          <div class="icon-konolge" />
          <count-to :start-val="0" :end-val="count.konolge" :duration="3800" class="card-panel-num-konolge" />
        </div>
        <div class="card-panel-text2">知识分享</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import { getSystemData } from '@/api/home/home'
export default {
  components: {
    CountTo
  },
  data() {
    return {
      count: { news: 0, notice: 0, train: 0, quality: 0, instution: 0, honour: 0, konolge: 0 }
    }
  },
  mounted() {
    getSystemData().then(res => {
      res.forEach(item => {
        if (item.articletype === 0) {
          this.count.news = item.count
        } else if (item.articletype === 1) {
          this.count.notice = item.count
        } else if (item.articletype === 2) {
          this.count.train = item.count
        } else if (item.articletype === 3) {
          this.count.quality = item.count
        } else if (item.articletype === 4) {
          this.count.instution = item.count
        } else if (item.articletype === 5) {
          this.count.honour = item.count
        } else if (item.articletype === 6) {
          this.count.konolge = item.count
        }
      })
    })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  .card-panel-col {
    margin-bottom: 12px;
    margin-left: 24px;
  }
  .card-panel-col2 {
    margin-left: -15px;
  }
  .card-panel {
    margin-top: 74px;
    width: 145px;
    height: 139px;
    position: relative;
    overflow: hidden;
    background: #E4F7FF;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    border-radius: 7px;
    .icon-news {
      width: 100%;
      height: 100%;
      background: url("../../assets/images/新闻.png") no-repeat center center;
      background-size: 40% 40%;
    }
    .icon-notice {
      width: 100%;
      height: 100%;
      background: url("../../assets/images/通告.png") no-repeat center center;
      background-size: 40% 40%;
    }

    .icon-train {
      width: 100%;
      height: 100%;
      background: url("../../assets/images/培训专栏.png") no-repeat center center;
      background-size: 40% 40%;
    }

    .icon-quality {
      width: 100%;
      height: 100%;
      background: url("../../assets/images/质量专栏.png") no-repeat center center;
      background-size: 40% 40%;
    }

    .card-panel-num-news {
      position: absolute;
      top: 6px;
      right: 8px;
      color: #74DDF9;
    }

    .card-panel-num-notice {
      position: absolute;
      top: 6px;
      right: 8px;
      color: #EBA564;
    }

    .card-panel-num-train {
      position: absolute;
      top: 6px;
      right: 8px;
      color: #EBA564;
    }

    .card-panel-num-inst {
      position: absolute;
      top: 6px;
      right: 8px;
      color: #EC5C90;
    }

    .card-panel-num-quality {
      position: absolute;
      top: 6px;
      right: 8px;
      color: #59C8F5;
    }
  }

  .card-panel-text {
    font-weight: bold;
    font-size: 16px;
    font-family: "微软雅黑";
    color: #fff;
    padding: 22px 0 12px 52px;
  }

  .card-panel-text2 {
    font-weight: bold;
    font-size: 16px;
    font-family: "微软雅黑";
    color: #fff;
    padding: 22px 0 12px 38px;
  }
}

  .panel-group2 {
    .card-panel-col {
      margin-top: -90px;
      margin-bottom: 46px;
      margin-left: 24px;
    }

    .card-panel-col2 {
      margin-top: -90px;
      margin-bottom: 56px;
      margin-left: -15px;
    }
    .card-panel {
      margin-top: 94px;
      width: 145px;
      height: 139px;
      position: relative;
      overflow: hidden;
      background: #E4F7FF;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);
      border-radius: 7px;
      .icon-news {
        width: 100%;
        height: 100%;
        background: url("../../assets/images/制度文档.png") no-repeat center center;
        background-size: 40% 40%;
      }

      .icon-honour {
        width: 100%;
        height: 100%;
        background: url("../../assets/images/荣誉中亚.png") no-repeat center center;
        background-size: 40% 40%;
      }

      .icon-konolge {
        width: 100%;
        height: 100%;
        background: url("../../assets/images/知识分享.png") no-repeat center center;
        background-size: 40% 40%;
      }

      .card-panel-num-news {
        position: absolute;
        top: 6px;
        right: 8px;
        color: #58D7AD;
      }

      .card-panel-num-honour {
        position: absolute;
        top: 6px;
        right: 8px;
        color: #40B1EF;
      }

      .card-panel-num-konolge {
        position: absolute;
        top: 6px;
        right: 8px;
        color: #9B67D4;
      }
    }

    .card-panel-text2 {
      font-weight: bold;
      font-size: 16px;
      font-family: "微软雅黑";
      color: #fff;
      padding: 22px 0 12px 38px;
    }
  }
</style>
