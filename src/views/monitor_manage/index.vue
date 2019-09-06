<template lang="pug">
  .monitor.fbox
    nav
      router-link.menu(to="/monitor/manage/map") 地图模式
      router-link.menu(to="/monitor/manage/meter") 仪表模式
    .line
    router-view
</template>

<script>
</script>

<style lang="stylus">
  .monitor
    padding 30px 30px 0 30px
    height 100%

    >nav
      display flex
      align-items center
      height 84px
      padding 30px
      bgf()

      .menu
        fsc 20px #333
        margin-right 24px

        &.active
          color #1E9AFF
          position relative

          &:after
            position absolute
            bottom -6px
            left 0
            content ''
            wh 100% 4px
            bg #1E9AFF

    >.line
      height 1px
      margin 0 30px
      bg #B6BDC2
</style>