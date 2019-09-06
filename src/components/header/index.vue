<template lang="pug">
  .header
    .content.mgauto
      .title
        img(:src="icon")
        <!--.icon-->
          <!--svg.ali_icon(aria-hidden="true")-->
            <!--use(xlink:href="#iconLOGO")-->
        <!--span 汉宇污水处理大数据平台-->
        span {{name}}
      <!--.language-->
        <!--span 中文-->
        <!--| /-->
        <!--p English-->
      <!--.mail-->
        <!--.icon-->
          <!--svg.ali_icon(aria-hidden="true")-->
            <!--use(xlink:href="#iconyoujian")-->
        <!--span 24-->
      .phone {{localStorage.getItem('UserName') || ''}}
      .sign_out(@click="signOut") {{localStorage.getItem('Phone')?'退出':'登录'}}
</template>

<script>
  import { getSystemMessage } from '_api/system_setting'
  import Bus from '@/bus'
  export default {
    data() {
      return {
        // icon: localStorage.getItem('Icon'),
        icon: '',
        // name: localStorage.getItem('Name'),
        name: '',
        localStorage: window.localStorage,
      }
    },
    mounted() {
      Bus.$on('Icon', val => {
        // localStorage.setItem('Icon',val)
        this.icon = val
      })
      Bus.$on('Name', val => {
        // localStorage.setItem('Name',val)
        this.name = val
      })
      this.initData()
    },
    methods: {
      initData(){
        getSystemMessage({},'get').then((res) => {
          if(res.data.code === 200){
            this.name = res.data.data.name
            this.icon = res.data.data.icon
          }else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.$message.error('获取数据失败')
        })
      },
      signOut() {
        if (!localStorage.getItem('Phone')) {
          this.$router.replace(`/login_signup?isLogin=1`)
          return
        }
        this.$confirm('确认退出？')
          .then(() => {
            localStorage.clear()
            this.$router.replace(`/login_signup?isLogin=1`)
          })
          .catch(() => {})
      },
    },
  }
</script>

<style lang="stylus" scoped>
  .header
    min-width 1200px
    height 80px
    padding 40px 20px
    bg #fff
    border-bottom 1px solid #ebeef5

    .content
      display flex
      align-items center
      height 100%

      .title
        flex 1
        display flex
        flex-direction row
        align-items center
        .icon
          wh 38px 38px
          margin-right 10px
        img
          display flex
          wh 38px 38px
          margin-right 10px
          border-radius 50%
        span
          display flex
          fsc 26px #333333
      .language
        display flex
        flex-direction row
        align-items center
        span
          display flex
          fsc 16px #333333
          padding 0 4px
          margin-top -4px
        p
          display flex
          fsc 16px #BEC3CB
          padding 0 4px

      .mail
        display flex
        margin 0 40px
        position relative
        .icon
          wh 20px 16px
        span
          display flex
          justify-content center
          align-items center
          position absolute
          right -16px
          top -10px
          padding 2px 4px
          background #FF4452
          border-radius 7px
          fsc 10px #FFF
      .phone
        fsc 16px #000
        margin 0 10px

      .sign_out
        fsc 16px #1E9AFF
</style>
