<!--
 * @Author: your name
 * @Date: 2020-02-23 18:16:10
 * @LastEditTime: 2020-03-19 09:15:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \portalSite_UI_vue\src\views\news\news-details.vue
 -->
<template>
      
                <div class="news-details" v-if="activeInfo">
                       <!--  <img :src="scrUrl" alt=""  > -->
                        <el-image :src="scrUrl" :preview-src-list="srcUrlList">
                                <div slot="error" class="image-slot">
                                    <i class="el-icon-picture-outline"></i>
                                </div>
                        </el-image>
                        <p >{{activeInfo.title}}</p>
                        <span style="position: absolute;bottom: 25%;left:20%;transform: translateX(-20%); color: #ffffff;    font-weight: 700;
                        font-size: 20px;
                        line-height: 26px;
                        font-family: cursive;" >
                                {{activeInfo.summary}}
                        </span>
                            
                </div>
              
</template>

<script>
export default {
        data(){
                return{
                        scrUrl:null,
                        srcUrlList:[]
                }
        },
        props:{
                activeInfo:{
                        type:Object,
                        default:{}
                }
        },
        computed: {
        },
        watch: {
                activeInfo(){
                        this.scrUrl = `${process.env.VUE_APP_BASE_API}/${this.activeInfo.imageUrl}`
                        this.srcUrlList = [this.scrUrl]
                }
        }
}
</script>