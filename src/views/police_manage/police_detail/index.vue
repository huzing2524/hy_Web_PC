<template lang="pug">
  .detail.w1200.mgauto
    .menu_box
      .title_box
        .title
          el-breadcrumb(separator-class="el-icon-arrow-right")
            el-breadcrumb-item(:to="{ path: '/police/manage' }") 报警管理
            el-breadcrumb-item 实时报警
            el-breadcrumb-item 查看详情
      .detail_box
        .item.item_basic
          .item_title 基本信息
          .item_info
            .info.center
              span 设备名称：
              p {{basic_info.device_name}}
            .info.center
              span 设备编码：
              p {{basic_info.device_id}}
          .item_info
            .info.center
              span 报警名称：
              p {{basic_info.name}}
            .info.center
              span 报警编码：
              p {{basic_info.id}}
            .info.center
              span 报警等级：
              p 高
            .info.center
              span 报警频次：
              p 1
          .item_info
            .info.center
              span 初次报警时间：
              p {{basic_info.time}}
            .info.center
              span 末次报警时间：
              p {{basic_info.time}}
            .info.center
              span 报警时长(分钟)：
              p 0.46
        .item.item_deal
          .item_title 报警处置
          .item_info
            .info.center
              span 确认人：
              p {{alarm_solution.confirm_person}}
            .info.center
              span 确认时间：
              p {{alarm_solution.confirm_time}}
          .item_info
            .info
              span 问题描述：
              p {{alarm_solution.problem}}
          .item_info
            .info
              span 解决方案：
              p {{alarm_solution.plan_description}}
</template>

<script>
  import { policeDetail } from '_api/police_manage'
  export default {
    data() {
      return {
        id: '',
        basic_info: {},
        alarm_solution: {},
      }
    },
    mounted() {
      this.initData()
    },
    methods: {
      initData(){
        this.id = this.$route.query.id || ''
        policeDetail({},'get',this.id).then((res) => {
          if(res.data.code === 200){
            this.basic_info = res.data.data.basic_info
            this.alarm_solution = res.data.data.alarm_solution
          }else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.$message.error('获取数据失败')
        })
      }

    }
  }
</script>

<style scoped lang="stylus">
  .detail
    wh 100% 100%
    display flex
    padding 30px 30px 12px
    .menu_box
      display flex
      flex 1
      flex-direction column
      .title_box
        display flex
        flex-direction column
        background #fff
        margin-bottom 10px
        padding  0 30px
        .title
          display flex
          flex-direction row
          fsc 16px #333333
          padding 24px 0
      .detail_box
        display flex
        flex-direction row
        justify-content space-around
        .item
          display flex
          flex 1
          flex-direction column
          background #fff
          padding 24px 30px
          &:first-child
            margin-right 10px
          .item_title
            fsc 24px #333333
            margin-bottom 48px
          .item_info
            display flex
            flex-direction column
            margin-bottom 48px
            .info
              display flex
              flex-direction row
              margin-bottom 24px
              &.center
                align-items center
              span
                min-width 80px
                display flex
                fsc 16px #666666
                margin-right 10px
              p
                display flex
                fsc 16px #333333
</style>
<style lang="stylus">
  .el-dialog
    width 550px
    .el-dialog__header
      text-align center
      font-weight 500
    .el-dialog__body
      padding 30px 60px
      .el-form
        text-align center
        .el-form-item
          display flex
          flex-direction row
          margin-bottom 24px
          button
            width 140px
            margin 0 20px
            fsc 16px #fff
            &:first-child
              background #B8C5D0
            &:last-child
              background #1E9AFF
  .el-tabs__header
    background #fff
    padding 14px 30px
    margin-bottom 0
  .el-table th
    color #333333
    background rgba(246,248,249,0.45)
  .el-form-item__label
    display flex
    width 80px
  .el-form-item__content
    flex 1
    text-align left
  .el-select
    width 100%
  .el-breadcrumb span
    fsc 16px #666666
</style>
