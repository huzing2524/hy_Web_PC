<template lang="pug">
  .layouts_container.full_box
    Header
    .main.fbox
      .left_menu
        el-menu.el-menu-vertical(:default-active="$route.path" router)
          el-menu-item(index="/monitor/manage/map")
            .icon
              svg.ali_icon(aria-hidden="true")
                use(xlink:href="#iconjiankong1")
            .icon
              svg.ali_icon(aria-hidden="true")
                use(xlink:href="#iconjiankong")
            | 监控管理
          el-menu-item(index="/device/manage")
            .icon
              svg.ali_icon(aria-hidden="true")
                use(xlink:href="#iconshebei1")
            .icon
              svg.ali_icon(aria-hidden="true")
                use(xlink:href="#iconshebei")
            | 设备管理
          el-menu-item(index="/police/manage")
            .icon
              svg.ali_icon(aria-hidden="true")
                use(xlink:href="#iconbaojin1")
            .icon
              svg.ali_icon(aria-hidden="true")
                use(xlink:href="#iconbaojin")
            | 报警管理
          el-menu-item(index="/client_manage")
            .icon
              svg.ali_icon(aria-hidden="true")
                use(xlink:href="#iconkehu1")
            .icon
              svg.ali_icon(aria-hidden="true")
                use(xlink:href="#iconkehu")
            | 客户管理
          el-menu-item(index="/data/analyse")
            .icon
              svg.ali_icon(aria-hidden="true")
                use(xlink:href="#iconshuju1")
            .icon
              svg.ali_icon(aria-hidden="true")
                use(xlink:href="#iconshuju")
            | 数据分析
          el-menu-item(index="/data/history")
            .icon
              svg.ali_icon(aria-hidden="true")
                use(xlink:href="#iconlishi1")
            .icon
              svg.ali_icon(aria-hidden="true")
                use(xlink:href="#iconlishi")
            | 历史数据
          el-menu-item(index="/authority_manage")
            .icon
              svg.ali_icon(aria-hidden="true")
                use(xlink:href="#iconquanxiang")
            .icon
              svg.ali_icon(aria-hidden="true")
                use(xlink:href="#iconquanxian")
            | 权限管理
          el-menu-item(index="/system_setting")
            .icon
              svg.ali_icon(aria-hidden="true")
                use(xlink:href="#iconxitong1")
            .icon
              svg.ali_icon(aria-hidden="true")
                use(xlink:href="#iconxitong")
            | 系统设置
          el-menu-item(index="/service_manual")
            .icon
              svg.ali_icon(aria-hidden="true")
                use(xlink:href="#iconshiyong1")
            .icon
              svg.ali_icon(aria-hidden="true")
                use(xlink:href="#iconshiyong")
            | 使用手册
          <!--el-menu-item(@click="tabClick(10)")-->
            <!--.icon(v-if="tabIndex === 10")-->
              <!--svg.ali_icon(aria-hidden="true")-->
                <!--use(xlink:href="#iconhuiyuan1")-->
            <!--.icon(v-else)-->
              <!--svg.ali_icon(aria-hidden="true")-->
                <!--use(xlink:href="#iconhuiyuan")-->
            <!--| 会员管理-->
          el-menu-item(index="/log_manage")
            .icon
              svg.ali_icon(aria-hidden="true")
                use(xlink:href="#iconcaozuo1")
            .icon
              svg.ali_icon(aria-hidden="true")
                use(xlink:href="#iconcaozuo")
            | 操作日志
      .container.fbox
        router-view
</template>

<script>
  import Header from '_components/header'
  export default {
    components: {
      Header
    },
    data() {
      return {
        tabIndex: 1,
      }
    },
    computed: {},
    mounted() {},
    methods: {},
  }
</script>

<style lang="stylus" scoped>
  .main
    width 100%
    display flex
    flex-direction row
    background #EBEFF2
    .left_menu
      width 170px
      height 100%
      display flex
      flex-direction column
      align-items center
      .el-menu-vertical
        display flex
        flex-direction column
        .el-menu-item
          display flex
          flex-direction row
          align-items center
          font-size 18px
          .icon
            display flex
            wh 18px 18px
            margin-right 20px
</style>
<style lang="stylus">
  .el-menu
    width 170px
    height 100%
    background-color #EBEFF2!important
    border-right 0!important
    li
      text-align center
      .icon
        &:first-child
          display none!important
        &:last-child
          display flex!important
      &:first-child
        margin-top 20px
      &.is-active
        .icon
          &:first-child
            display flex!important
          &:last-child
            display none!important
</style>
