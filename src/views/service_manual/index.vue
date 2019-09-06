<template lang="pug">
  .main
    .head
      .search_condition
        el-upload(class="avatar-uploader"
          ref="upload"
          :show-file-list="false"
          action="/index/upload"
          accept=".pdf"
          :on-change="handleChange"
          :auto-upload="false")
          el-button(type="primary" style="width:auto;margin-right:20px;font-size:16px" ) 更新使用手册
        span 请上传格式为PDF的文件
    pdf(v-if="fileUrl" v-for="i in numPages" :key="i" :src="fileUrl" :page="i")
    .without_pdf(v-else)
      .icon
        svg.ali_icon(aria-hidden="true")
          use(xlink:href="#iconimg")
</template>

<script>
  import pdf from 'vue-pdf'
  import {getServiceManual, uploadServiceManual} from '_api/service_manual'

  export default {
    components: {
      pdf
    },
    data() {
      return {
        fileUrl:"",
        pdfFile: {},
        currentPage: 1,
        pageCount: 1,
        numPages:1,
      }
    },
    created() {
      this.getPdf()
    },
    methods: {
      // 选择pdf后的回调
      handleChange(file) {
        this.pdfFile = file.raw// file才是文件本身
        this.uploadPdf()
      },
      pdfTask(pdfUrl){
        let self = this
        let loadingTask = pdf.createLoadingTask(pdfUrl)
        loadingTask.then(pdf => {
          self.pdfUrl = loadingTask
          self.numPages = pdf.numPages
        }).catch((err) => {
          console.error('pdf加载失败')
        })
      },
      /**服务调用**/
      // 获取手册
      getPdf() {
        getServiceManual().then((res)=>{
          if(res.data.code === 200) {
            this.fileUrl =  res.data.data
            this.pdfTask(this.fileUrl)
          } else {
            this.$message.error('获取说明文档失败')
          }
        }).catch(()=>{
          this.$message.error('获取说明文档失败')
        })
      },
      // 上传手册
      uploadPdf() {
        console.log(this.pdfFile)
        uploadServiceManual({"content":this.pdfFile}).then((res)=>{
          if(res.data.code === 200) {
            this.$message.success('更新成功，正在重新加载')
            this.fileUrl =  res.data.data
            this.getPdf()
          } else {
            this.$message.error('上传说明文档失败')
          }
        }).catch(()=>{
          this.$message.error('上传说明文档失败')
        })
      }
    }
  }
</script>






<style scoped lang="stylus">
  .main
    padding 30px
    background #EBEFF2
    display flex
    flex-direction column
    .head
      padding 24px 30px
      background white
      display flex
      flex-direction column
      width 100%
      height auto

      margin-bottom 10px
      .search_condition
        display flex
        flex-direction row
        justify-content left
        height auto
        span
          font-size 16px
          color #666666
          height:38px;
          line-height:38px;
          font-weight:400;
          margin-right 8px
          width auto
          text-align center
    .pdf
      overscroll-behavior-y auto
      width 100%
      flex 1

      margin-bottom 10px
      background white
      display flex
      flex-direction row
      justify-content center
    .without_pdf
      overscroll-behavior-y auto
      width 100%
      min-height 600px

      margin-bottom 10px
      background white
      display flex
      justify-content center
      justify-items center
      .icon
        wh(auto, auto)
        display flex
        justify-content center
</style>
