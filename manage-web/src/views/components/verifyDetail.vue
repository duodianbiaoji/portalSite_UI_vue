<template>
  <div v-if="detailsData" style="background: #fff;padding: 20px;margin-top: -20px;">
    <div>
      <h3 style="text-align: center;">{{ detailsData.title }}</h3>
    </div>
    <div style="text-align: center;">
      <span><svg-icon icon-class="dateDetail" class-name="from-like" />{{ detailsData.publishdate }}</span>
      <span style="margin-left: 20px"><svg-icon icon-class="people" class-name="from-like" />{{ detailsData.author }}</span>
      <el-button v-if="isVerify" type="text" style="margin-left: 20px;" size="large" @click="handleClick">审核</el-button>
    </div>
    <div style="width: 100%;height: 100%;background: #fff;overflow: hidden;border-top: 1px solid #666;">
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
  </div>
</template>
<script>
import { fileDownload } from '@/api/file'
import { download } from '@/utils/download'
import Long from 'long'

export default {
  props: {
    detailId: {
      type: String
    },
    getDetail: {
      type: Function
    },
    detailName: {
      type: String
    },
    detailType: {
      type: Number
    }
  },
  data() {
    return {
      detailsData: null,
      isLoading: false,
      isFile: false
    }
  },
  watch: {
    isLoading() {
      this.$emit('emitIsLoading', this.isLoading)
    }
  },
  mounted() {
    this.handleGetKnlgeShareDetail()
  },
  methods: {
    // 获取分享详情
    handleGetKnlgeShareDetail({ detailId = this.detailId } = {}) {
      this.isFile = false
      const detailName = this.detailName
      const data = {}
      if (this.detailType !== undefined && this.detailType !== null) {
        data['type'] = this.detailType
      }

      data[detailName] = detailId

      this.getDetail(data).then(response => {
        if (response !== undefined && response) {
          this.isLoading = true

          if (response.annexes.length > 0) {
            this.isFile = true
            console.log(this.isFile)
            response.annexes = response.annexes.map(item => {
              item.fid = (Long.fromValue(item.fid)).toString()
              return item
            })
          }
          this.detailsData = response
        }
      })
    },
    // 文件下载
    handleFileDownLoad(file) {
      fileDownload(file).then(response => {
        download(response, file.name)
      })
    }
  }
}
</script>

<style scoped>
.from-like {
    font-size: 16px;
}
</style>
