<template lang="pug">
  .login_signup.full_box
    .header
      .title
        img(src="./logo.jpg")
        <!--.icon-->
          <!--svg.ali_icon(aria-hidden="true")-->
            <!--use(xlink:href="#iconLOGO")-->
        span 零壹数聚
      <!--.language-->
        <!--span 中文-->
        <!--| /-->
        <!--span English-->
    .content
      .box
        .title {{isLogin?'登录':'重置密码'}}
        .input_box
          el-input.noborder(
            placeholder="填写手机号"
            v-model="phone"
            clearable)
        .input_box(v-if="!isLogin")
          el-input.noborder(
          placeholder="填写验证码"
          v-model="code"
          clearable)
          el-button(size="mini" round @click="toSendSms" style="margin-bottom: 10px;") 获取验证码
        .input_box
          el-input.noborder(
          :placeholder="isLogin? '填写密码':'填写新密码：字母+数字、8-16位'"
          v-model="password"
          clearable
          show-password)
        .input_box
          el-button(type="primary"  width="100%" @click="toOtherBt(1)" style="width: 100%;") {{isLogin?'登录':'重置密码'}}
        .input_box
          .to_other
            el-link(type="info" :underline="false" @click="toOtherBt(2)") {{isLogin?'忘记密码 ＞':'登录 ＞'}}
</template>

<script>
  import { login,sendCode,resetPwd } from '_api/login_signup'
  // import { getSystemMessage } from '_api/system_setting'
  import { Base64 } from 'js-base64'
  import { SetDefaultHeader } from '_common/http'
  export default {
    data() {
      return {
        isLogin: false,
        phone: '',
        password: '',
        code: '',
      }
    },
    mounted() {
      if (parseInt(this.$route.query.isLogin)) {
        this.isLogin = true
      }
    },
    methods: {
      toLogin() {
        if (!this.phone) {
          this.$message.error('请输入手机号')
          return
        }
        if (!(/^1[3456789]\d{9}$/.test(this.phone))) {
          this.$message.error('请输入正确的手机号')
          return
        }
        if (!this.password) {
          this.$message.error('请输入密码')
          return
        }
        SetDefaultHeader(
          'Authorization',
          Base64.encode(`${this.phone}:${this.password}`),
        )
        login({},'get').then((response) => {
          if (parseInt(response.data.code) === 200) {
            this.$message.success('登录成功')
            let authorization = 'Basic ' + response.data.data.jwt
            localStorage.setItem('Authorization', authorization)
            localStorage.setItem('Phone', this.phone)
            localStorage.setItem('UserName', response.data.data.name)
            SetDefaultHeader('Authorization', authorization)
            // getSystemMessage({},'get').then((res) => {
            //   if(res.data.code === 200){
            //     localStorage.setItem('Name', res.data.data.name)
            //     localStorage.setItem('Icon', res.data.data.icon)
            //   }else {
            //     this.$message.error(res.data.msg)
            //   }
            // }).catch(() => {
            //   this.$message.error('获取数据失败')
            // })

            if (this.$route.query.from) {
              this.$router.replace(this.$route.query.from)
            } else {
              this.$router.replace('/monitor/manage')
            }
          } else {
            this.$message.error(response.data.msg)
          }
        })
      },
      toReset() {
        if (!this.phone) {
          this.$message.error('请输入手机号')
          return
        }
        if (!(/^1[3456789]\d{9}$/.test(this.phone))) {
          this.$message.error('请输入正确的手机号')
          return
        }
        if (!this.code) {
          this.$message.error('请输入验证码')
          return
        }
        if (!this.password) {
          this.$message.error('请输入密码')
          return
        }
        if (!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(this.password))) {
          this.$message.error('请输入正确格式的密码')
          return
        }
        resetPwd(
          {
            phone: this.phone,
            code: this.code,
            pwd: this.password,
          },
          'post',
        ).then((res) => {
          if (res.data.code === 200) {
            this.$message.success('修改成功')
            this.$router.replace(
              `/login_signup?isLogin=${this.isLogin ? '0' : '1'}&from=${
                this.$route.query.from ? this.$route.query.from : '/monitor/manage'
                }`,
            )
            this.isLogin = !this.isLogin
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      toSendSms() {
        if (!this.phone) {
          this.$message.error('请输入手机号')
          return
        }
        sendCode({
          phone: this.phone,
        },'get').then((res) => {
          if (res.data.code === 200) {
            this.$message.success('发送成功')
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      toOtherBt(idx) {
        if (idx === 1) {
          if (this.isLogin) {
            this.toLogin()
          } else {
            this.toReset()
          }
        } else {
          if(this.isLogin){
            this.phone = ''
            this.code = ''
            this.password = ''
          }
          this.$router.replace(
            `/login_signup?isLogin=${this.isLogin ? '0' : '1'}&from=${
              this.$route.query.from ? this.$route.query.from : '/monitor/manage'
              }`,
          )
          this.isLogin = !this.isLogin
        }
      },
    },
  }
</script>

<style lang="stylus" scoped>
  .login_signup
    background #EBEFF2
    background-size cover
    display flex
    flex-direction column
    min-width 1200px
    .header
      display flex
      width 100%
      height 80px
      align-items center
      justify-content space-between
      padding 20px
      fsc 26px #333
      background #fff
      .title
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
          fsc 16px #BEC3CB
          padding 0 4px
          margin-top -4px
          &:last-child
            margin-top 2px
        p
          display flex
          fsc 16px #BEC3CB
          padding 0 4px
    .content
      width 100%
      height 100%
      bg url('./bg.png') center
      background-size cover
      fct()
      .box
        bgf()
        width 560px
        border 1px solid #ebeef5
        border-radius 8px
        box-shadow 0px 8px 20px 0px rgba(194,212,225,0.8)
        padding 40px 112px
        margin 0 auto
        .title
          fsc 26px #333333
          text-align center

        .input_box
          display flex
          flex-direction row
          justify-content center
          margin 26px 0
          border-bottom 1px solid #EEEEEE
          &:last-child
            border-bottom 0

          .to_other
            fsc 16px #666666
            text-align center
</style>
<style lang="stylus">
  .noborder
    input
      border none!important
      padding-left 0
</style>
