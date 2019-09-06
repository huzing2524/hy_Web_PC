<template lang="pug">
  #app.full_box(v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    )
    router-view
</template>
<script>
  import Bus from '@/bus'
  import Layouts from '@/layouts/'
  export default {
    components: {
      Layouts,
    },
    data() {
      return {
        loading: false,
      }
    },
    mounted() {
      Bus.$on('UnAuthorized', () => {
        localStorage.removeItem('Authorization')
        if (this.$route.path !== '/login_signup') {
          // this.$router.replace('/login_signup?isLogin=1&from=' + this.$route.fullPath)
        }
      })
      Bus.$on('NoRightsToBack', () => {
        this.$message.error('访问权限受限')
      })
      Bus.$on('SystemError', (val = '系统错误，请稍后再试') => {
        this.$message.error(val)
      })
      Bus.$on('showLoading', (val) => {
        if (val === 1) {
          this.loading = true
        } else if (val === 0) {
          this.loading = false
        }
      })
    },
  }
</script>

<style lang="stylus">
  @require '~@/style/reset.styl'
  @require '~@/style/common.styl'
  @import url('//at.alicdn.com/t/font_1337629_38rpxxx04qy.css')
</style>
