<template lang="pug">
  .empty
    .icon
      svg.ali_icon(aria-hidden="true")
        use(xlink:href="#iconEmpty_pt1")
    p 暂无数据
</template>

<script>
  export default {
    data() {
      return {}
    },
    mounted() {

    },
    methods: {},
  }
</script>

<style scoped lang="stylus">
  .empty
    display flex
    flex 1
    flex-direction column
    align-items center
    justify-content center
    background #fff
    box-shadow 0px 0px 5px 0px rgba(219, 227, 232, 1)
    border-radius 2px
    .icon
      wh 140px 130px
      margin-bottom 24px
    p
      fsc 20px #999999

</style>
