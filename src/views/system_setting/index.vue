<template lang="pug">
  .main
    .content
      .item
        .left
          span 设置LOGO
        .select_photo
          img(v-if="photoUrl.length" :src="photoUrl" @click="selectHeadPhoto")
          .icon_default(v-else @click="selectHeadPhoto")
            svg.ali_icon(aria-hidden="true")
              use(xlink:href="#iconLOGO")
          input(type="file", accept="image/*", ref="imgInput", @change="chooiceHeadPhoto()")
      .item
        .left
          span 设置名称
        .right
          span {{bean.name}}
          .icon(@click="settingName()")
            svg.ali_icon(aria-hidden="true")
              use(xlink:href="#iconbianji")
      .item
        .left
          span 登陆页背景图
        .select_photo
          img(v-if="bgUrl.length" :src="bgUrl" @click="selectBgPhoto" class="bg")
          .icon_default(v-else @click="selectBgPhoto")
            svg.ali_icon(aria-hidden="true")
              use(xlink:href="#iconLOGO")
          input(type="file", accept="image/*", ref="bgInput", @change="chooiceBgPhoto")
      .item
        .left
          span 系统语言
        .right
          .language(:class="{chooiced:languageType === 0}" @click="changeLanguage()") 中文
          .language(:class="{chooiced:languageType === 1}" @click="changeLanguage()") English
      .item
        .left
          span 登录失败次数
          span 当天登录失败次数达到上限后，当天禁止该账户登录
        .right
          span {{bean.login_failure_times}}
          .icon(@click="settingTimes()")
            svg.ali_icon(aria-hidden="true")
              use(xlink:href="#iconbianji")
    el-dialog(:visible.sync="isDialogVisible" :title="dialogMessage.title" width="30%" center)
      el-form
        el-form-item(:label="dialogMessage.contentTip" :label-width="formLabelWidth")
          el-input(v-if="dialogType === 0" v-model="dialogMessage.content" placeholder="不能超出15个字符" autocomplete="off" type="text" maxlength="15" show-word-limit)
          el-input(v-else v-model="dialogMessage.content" type="text" maxlength="2" show-word-limit autocomplete="off"  oninput="value = value.replace(/[^\\d]/g,'').slice(0,2)")
      .el-dialog__footer
        el-button(type="primary" @click="clickCancel()") 取消
        el-button(type="primary" @click="clickSure()") 确定
</template>

<script>
  import Bus from '@/bus'
  import { getSystemMessage,setHeadPhoto,setBgPhoto,setSystemName,setSystemTimes } from '_api/system_setting'
  import { getDataUrl } from '_common/util'
  import lrz from 'lrz'

  export default {
    data() {
      return {
        photoUrl:'',
        photoStyle : this.photoUrl
          ? `
                background: url(${this.photoUrl}) no-repeat;
                background-position:center;
                background-size: 100%;
                ` : ``,
        headFile: {},
        bgUrl:'',
        bgStyle : this.bgUrl
          ? `
                background: url(${this.bgUrl}) no-repeat;
                background-position:center;
                background-size: 100%;
                ` : ``,
        bean: {
          icon:'',
          name:'汉宇污水处理大数据平台',
          login_failure_times:5,
          bg_img:''
        },
        languageType: 0, // 0是中文，1是English
        isDialogVisible: false,
        dialogType:0,
        dialogMessage:{
          'title':'',
          'contentTip':'',
          'content':''
        },
        formLabelWidth: '120px'
      }
    },
    created(){
      this.getSystemMsg()
    },
    methods: {
      changeLanguage(){
        this.languageType = this.languageType === 0 ? 1 : 0
      },
      // img调用input的选择图片方法
      selectHeadPhoto(){
        this.$refs.imgInput.click()
      },
      // 用户选中图片后拿到返回的路径进行显示
      chooiceHeadPhoto() {
        if (this.$refs.imgInput.files[0]) {
          lrz(this.$refs.imgInput.files[0], { quality: 0.5 }).then((rst) => {
            this.setHeadPhotoStyle()
            let reader = new FileReader()
            reader.onload = (e) => {
              getDataUrl(e.target.result, 690, 420)
                .then((dataurl) => {
                  this.setHeadPhotoStyle(dataurl)
                  this.uploadHeadClick()
                  this.$refs.imgInput.value = '';
                })
                .catch(() => {
                })
            }
            this.headFile = rst.file
            reader.readAsDataURL(rst.file)
          })
        }

      },
      // 设置图片样式
      setHeadPhotoStyle(dataUrl) {
        dataUrl = dataUrl ? dataUrl : ``
        this.photoUrl = dataUrl;
      },
      // 上传头像图片
      uploadHeadClick(){
        if(!this.photoUrl.length){
          this.$message.error('图片路径有误')
          return
        }
        setHeadPhoto({icon:this.headFile}).then((res) => {
          if(res.data.code == 200) {
            this.bean.icon = this.photoUrl // 成功则重新赋值
            Bus.$emit('Icon', this.bean.icon)
            this.$message.success('上传成功')
          } else {
            this.$message.error('上传失败')
            this.photoUrl = this.bean.icon // 失败则恢复原来图片
          }
        }).catch(error => {
          console.log(error)
        })
      },
      /****/
      // img调用input的选择图片方法
      selectBgPhoto(){
        this.$refs.bgInput.click()
      },
      // 用户选中图片后拿到返回的路径进行显示
      chooiceBgPhoto() {
        let file = this.$refs.bgInput.files[0];
        if (!file) {
          return
        }
        let reader = new FileReader();
        reader.onload = e => {
          getDataUrl(e.target.result, 690, 420)
            .then(dataUrl => {
              this.setBgPhotoStyle(dataUrl);
              this.uploadBgClick()
              // 必须置空，否则重新上传同一张图片不会触发onChange()的监听
              this.$refs.bgInput.value = ''
            })
            .catch(() => {
            });
        };
        reader.readAsDataURL(file);
      },
      // 设置图片样式
      setBgPhotoStyle(dataUrl) {
        dataUrl = dataUrl ? dataUrl : ``
        this.bgUrl = dataUrl;
      },
      // 上传背景图
      uploadBgClick(){
        if(!this.bgUrl.length){
          this.$message.error('图片路径有误')
          return
        }
        setBgPhoto({img:this.$refs.bgInput.files[0]}).then((res) => {
          if(res.data.code == 200) {
            this.bean.bg_img = this.bgUrl // 成功则重新赋值
            this.$message.success('上传成功')
          } else {
            this.$message.error('上传失败')
            this.bgUrl = this.bean.bg_img // 失败则恢复原来图片
          }
        }).catch(error => {
          console.log(error)
        })
      },
      /***/

      settingName() {
        this.dialogType = 0
        this.dialogMessage.title = '设置名称'
        this.dialogMessage.contentTip = this.dialogMessage.title
        this.dialogMessage.content = this.bean.name
        this.isDialogVisible = true
      },
      settingTimes() {
        this.dialogType = 1
        this.dialogMessage.title = '设置登陆失败次数'
        this.dialogMessage.contentTip = '设置次数'
        this.dialogMessage.content = this.bean.login_failure_times
        this.isDialogVisible = true
      },
      clickCancel(){
        this.isDialogVisible = false
      },
      clickSure(){
        if(this.dialogMessage.content === '') {
          this.$message.warning('不能为空')
          return
        }
        if(this.dialogType === 0) {
          this.setName()
        } else {
          this.dialogMessage.content = parseInt(this.dialogMessage.content)
          if(this.bean.login_failure_times === this.dialogMessage.content) {
            return
          } else if(this.dialogMessage.content < 1) {
            this.$message.warning('需要输入1-99的数字')
            this.dialogMessage.content = '1'
            return
          }
          this.setTimes()
        }
        this.isDialogVisible = false
      },
      // 设置系统名字
      setName() {
        if(this.bean.name === this.dialogMessage.content) {
          return
        }
        let body = new Object()
        body.name = this.dialogMessage.content
        setSystemName(body).then((res) => {
          if(res.data.code === 200) {
            this.bean.name = this.dialogMessage.content
            Bus.$emit('Name', this.bean.name)
            this.$message.success('设置成功')
          } else {
            this.dialogMessage.content = this.bean.name
            this.$message.error('设置失败')
          }
        }).catch(() => {
          this.dialogMessage.content = this.bean.name
          this.$message.error('设置失败')
        })
      },
      // 设置系统允许登陆失败次数
      setTimes() {
        let body = new Object()
        body.times = this.dialogMessage.content
        setSystemTimes(body).then((res) => {
          if(res.data.code === 200) {
            this.bean.login_failure_times = this.dialogMessage.content
          } else {
            this.dialogMessage.content = this.bean.login_failure_times
            this.$message.error('设置失败')
          }
        }).catch(() => {
          this.dialogMessage.content = this.bean.name
          this.$message.error('设置失败')
        })
      },
      // 获取系统信息
      getSystemMsg() {
        getSystemMessage().then((res) => {
          if(res.data.code === 200) {
            this.bean = res.data.data
            this.photoUrl = this.bean.icon
            this.bgUrl = this.bean.bg_img
          } else {
            this.$message.error('获取系统信息失败')
          }
        }).catch(() => {
          this.$message.error('获取系统信息失败')
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
  .main
    background #EBEFF2
    position relative
    .content
      background #EBEFF2
      width 40%
      height 50%
      display flex
      flex-direction column
      position absolute
      left 40%
      top 32%
      padding-top 100px
      transform translate(-50%,-50%)
      .item
        display flex
        flex-direction row
        justify-content space-between
        height 120px
        background white
        padding-left 40px
        padding-right 40px
        margin-bottom 20px
        .left
          display flex
          flex-direction column
          justify-content center
          justify-items center
          span
            font-size 20px
            text-align left
            font-weight:500;
            &:nth-of-type(1)
              color #666666
            &:nth-of-type(2)
              color #999999
              font-size 16px
              margin-top 6px
        .select_photo
          display flex
          flex-direction column
          justify-content center
          align-items center
          margin 20px 0px
          img
            wh(80px, 80px)
            &.bg
              width 120px
          .icon_default
            wh(80px, 80px)
          input
            width 1px
            height 1px
            opacity 0
        .right
          display flex
          flex-direction row
          justify-content center
          justify-items center
          span
            fsc(20px,#333333)
            line-height 120px
            justify-content content
            height 120px
            text-align center
            font-weight:500;
          .icon
            margin-left 10px
            wh(20px, 20px)
            margin-top 50px
          .language
            width:90px
            height:40px
            background white
            border 1px solid #C0C0C0
            text-align center
            line-height 40px
            margin 40px 0
            color #333333
            &:nth-of-type(1)
              border-right 0px
              border-radius:4px 0 0 4px;
            &:nth-of-type(2)
              border-left 0px
              border-radius:0 4px 4px 0;
            &.chooiced
              background #19CCAE
              border 1px solid #19CCAE
              border-right 1px
              color white
    .el-dialog
      position absolute
      left 60%
      top 40%
      .el-form
        width 100%
      .el-dialog__footer
        display flex
        flex-direction row
        justify-content center


</style>

<style lang="stylus">

</style>
