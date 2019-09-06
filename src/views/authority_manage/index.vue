<template lang="pug">
  .main.w1200.mgauto
    .head.border_shadow
      .search_condition
        span 账号
        el-input(placeholder="填写账号" v-model="searchBean.account")
        span 姓名
        el-input(placeholder="填写姓名" v-model="searchBean.name")
        span 手机号
        el-input(placeholder="填写手机号" v-model="searchBean.phone" type="number")
        el-button(type="primary" style="width:100px;margin-right:20px;font-size:16px" @click="getAuthorityList()") 搜索
        el-button(style="width:100px;margin-right:40px;font-size:16px" @click="resetSearchParams()") 重置
        el-button(type="primary" style="width:120px;font-size:16px" @click="addRow()") 新增管理员
    .body.border_shadow
      el-table(v-if="tableData.length" :data="tableData" style="width: 100%" :header-cell-style="headerStyle" :cell-style="cellStyle" :row-class-name="rowClassName" )
        el-table-column(type = "index" label="序号" fixed width="160px")
          template(slot-scope="scope")
            span {{scope.row.index + 1 + (page-1) * row}}
        el-table-column(prop="account" label="账号")
        el-table-column(prop="name" label="姓名")
        el-table-column(prop="phone" label="手机号" )
        el-table-column(prop="role" label="角色")
          template(slot-scope="scope")
            span {{getRole(scope.row.role)}}
        el-table-column(prop="right" label="权限")
          template(slot-scope="scope")
            span {{getRight(scope.row.right)}}
        el-table-column(prop="creator" label="创建人")
        el-table-column(prop="time" label="创建时间")
        el-table-column(label="操作")
          template(slot-scope="scope")
            el-button(v-if="scope.row.role !== '2'" @click="showDeleteDialog(scope.row)" type="text" size="small") 删除
            el-button(v-if="scope.row.role !== '2'" @click="modifyRow(scope.row)" type="text" size="small") 修改
      Empty(v-else)
    .pagination.border_shadow
      el-pagination(
        :background="false"
        :page-size="row"
        :total="total"
        :current-page.sync="page"
        @current-change="handleCurrentChange"
        layout="prev, pager, next,total,jumper")
    el-dialog(:visible.sync="isDialogVisible" :title="isCreate ? '新增管理员' : '修改管理员'" :width="dialogWidth+'px'" center)
      el-form(ref="form" :model="dialogMessage" :inline="true")
        el-form-item(label="角色" label-width="100px")
          el-radio-group(v-model="dialogMessage.role")
            el-radio(label="0") 普通管理员
            el-radio(label="1") 企业管理员
        el-form-item(v-if="dialogMessage.role === '1'" label="选择企业" label-width="100px")
          el-select(v-model="dialogMessage.customer_id" placeholder="请选择")
            el-option(v-for="item in customerList" :key="item.customer_id" :label="item.name_cn" :value="item.customer_id")
        el-form-item(label="账号" label-width="100px")
          el-input(v-model="dialogMessage.account" placeholder="填写账号(25位以内纯数字)" ref="pureNumber" autocomplete="off"  oninput="value = value.replace(/[^\\d]/g,'').slice(0,25)" )
        el-form-item(label="姓名" label-width="100px")
          el-input(v-model="dialogMessage.name" placeholder="填写姓名(中文汉字)" autocomplete="off" type="text" maxlength="10" show-word-limit)
        el-form-item(label="手机号" label-width="100px")
          el-input(v-model="dialogMessage.phone" placeholder="填写手机号" type="number" autocomplete="off")
        el-form-item(v-if="isCreate" label="登录密码" label-width="100px")
          el-input(v-model="dialogMessage.password" placeholder="填写登录密码(8-16位数字+字母组合)" autocomplete="off" show-password)
        el-form-item(label="选择权限" label-width="100px")
          el-checkbox-group(v-model="chooiceRight")
            el-checkbox(v-for="right in rights" :label="right" :key="right" ) {{right}}
      .el-dialog__footer
        el-button(@click="clickCancelDialog()" ) 取消
        el-button(type="primary" @click="clickSureDialog()") 确定
    el-dialog(:visible.sync="isTipDialogVisible" title="删除管理员" width="30%" center)
      .tip 确定要删除吗
      .el-dialog__footer
        el-button(@click="cancelDelete()" ) 取消
        el-button(type="primary" @click="sureDelete()") 确定
</template>

<script>
  import { getAuthorityList, addManager, modifyManager,deleteManager,getCustomerList } from '_api/authority_manage'
  import {deepCopy} from '_common/util'
  import Empty from '_components/empty'

  export default {
    components: {
      Empty,
    },
    data() {
      return {
        row:10,
        page:1,
        total:0,
        searchBean: {
          account:'',// 账号
          name:'',// 姓名
          phone:'',// 手机号
        },
        tableData:[
            // {
            //   "id":"001",// 唯一标识
            //   "account": "sit laborum",
            //   "name": "Harry",
            //   "phone": "13691867535",
            //   "role": "普通管理员",
            //   "right": ['监控中心','设备管理'],
            //   "creator": "longrise",
            //   "time": "2019-8-15 15:43"
            // },
            // {
            //   "id":"002",
            //   "account": "non deserunt",
            //   "name": "HaiPhon",
            //   "phone": "13691867533",
            //   "role": "超级管理员",
            //   "right": ['监控中心', '设备管理', '报警管理', '客户管理', '数据分析', '权限管理', '系统设置'],
            //   "creator": "longrise",
            //   "time": "2019-8-15 15:55"
            // }
        ],

        headerStyle() {
          return 'background-color:rgba(246,248,249,0.45);height:48px;border-radius:2px;text-align:center;font-size:16px;font-weight:500;color:#333333'
        },
        cellStyle() {
          return "text-align:center;height:56px"
        },
        // 新建客户Dialog相关
        isDialogVisible: false,
        dialogWidth: '700',
        formLabelWidth: '156px',
        isCreate: true,
        customerList: [],
        dialogMessage:{
          "id":"",
          "account": "sit laborum",
          "customer_id": "",
          "name": "dolore aliqua dolore",
          "phone": "",
          "role": "",
          "right":[],
          "creator": "longrise",
          "time": "2019-8-15 15:55",
          "password": ""
        },
        // 不能直接用dialogMessage.right,el-checkbox-group会触发选一个就把其它全部自动选上的bug
        chooiceRight:[],
        rights:['监控管理', '设备管理', '报警管理', '客户管理', '数据分析', '权限管理', '系统设置'],
        // 删除站点提示框相关
        isTipDialogVisible: false,
        // 用户点击删除的那一行站点的数据
        tempManagerBean : {}
      }
    },
    created() {
      // this.formLabelWidth = this.dialogWidth / 4.5 + 'px'
      this.getCusomers()
    },
    mounted() {
      this.getAuthorityList()
    },
    methods: {
      handleCurrentChange(val){
        this.page = val
        this.getAuthorityList()
      },
      rowClassName({row, rowIndex}) {
        //把每一行的索引放进row
        row.index = rowIndex;
      },
      getRole(val) {
        switch (val) {
          case '0':
            val = '普通管理员'
            break;
          case '1':
            val = '企业管理员'
            break;
          case '2':
            val = '超级管理员'
            break;
          default:
            val = ''
            break;
        }
        return val
      },
      // 将权限数组拆分并在中间加上,再显示出来
      getRight(array) {
        let rightString = ''
        if(array){
          for(let i = 0 ; i < array.length; i++) {
            if(i == 0) {
              rightString += this.transformNumToRight(array[i])
            } else {
              rightString = rightString + ',' + this.transformNumToRight(array[i])
            }
          }
        }
        return rightString
      },
      transformNumToRight(val) {
        switch (val) {
          case '0':
            val = '全部权限'
            break;
          case '1':
            val = '监控管理'
            break;
          case '2':
            val = '设备管理'
            break;
          case '3':
            val = '报警管理'
            break;
          case '4':
            val = '客户管理'
            break;
          case '5':
            val = '数据分析'
            break;
          case '6':
            val = '权限管理'
            break;
          case '7':
            val = '系统设置'
            break;
          default:
            val = ''
        }
        return val
      },
      transformRightToNum(val) {
        switch (val) {
          case '监控管理':
            val = '1'
            break;
          case '设备管理':
            val = '2'
            break;
          case '报警管理':
            val = '3'
            break;
          case '客户管理':
            val = '4'
            break;
          case '数据分析':
            val = '5'
            break;
          case '权限管理':
            val = '6'
            break;
          case '系统设置':
            val = '7'
            break;
          default:
            val = ''
            break;
        }
        return val
      },
      // 例子：['监控管理','设备管理']转换成['1','2']
      transformRightsNum(val) {
        let array = []
        if(val.length === 7) {// 如果选了7个权限，则用['0']代替
          array = ['0']
        } else if(val.length > 0) { // 如果小于7，把汉字字符数组转成用'0','1','2'的数组
          for (let i = 0,j=0; i < val.length; i++) {
            let variable = this.transformRightToNum(val[i])
            if(variable === '') {
              continue
            } else {
              array[j] = variable
              j++
            }
          }
          array.sort().join('').split('')// 重新排序并且去除空串
        }
        return array
      },
      // 例子：['1','2']转换成['监控管理','设备管理']
      transformNumRight(val) {
        let array = []
        if(val[0] === '0') { // ['0']代表选了全部
          array = this.rights
        } else if(val.length > 0) {
          for(let i = 0,j = 0;i < val.length; i++) {
            let variable = this.transformNumToRight(val[i])
            if(variable === '') {
              continue
            } else {
              array[j] = variable
              j++
            }
          }
          array.sort().join('').split('')// 重新排序并且去除空串
        }
        return array
      },
      // 检查新增或者修改的客户数据是否达标
      checkState() {
        if(!this.dialogMessage.role) {
          this.$message.warning('请选择一个角色')
          return false
        } else if(this.dialogMessage.role === '1' && !this.dialogMessage.customer_id) { // 如果选择了公司角色，则需要填用户id
          this.$message.warning('请选择一个公司')
          return false
        }else if(!this.dialogMessage.account) {
          this.$message.warning('请填写账号')
          return false
        } else if(!this.dialogMessage.name) {
          this.$message.warning('请填写姓名')
          this.dialogMessage.name = ''
          return false
        } else if(this.dialogMessage.name && (/[^\u4E00-\u9FA5]/g.test(this.dialogMessage.name))) {
          this.$message.warning('姓名请填写纯中文')
          return false
        }
        else if(!this.dialogMessage.phone) {
          this.$message.warning('请填写手机号码')
        } else if(this.dialogMessage.phone && !(/^1[0-9]{10}$/.test(this.dialogMessage.phone))) {
          this.$message.warning('请填写正确的手机号码')
          return false
        } else if(this.isCreate && !this.dialogMessage.password) {
          this.$message.warning('请填写登陆密码')
          return false
        } else if(this.isCreate && this.dialogMessage.password  && !this.checkPassword(this.dialogMessage.password)){
          this.$message.warning('密码必须是8-16位数字+字母组合')
          return false
        } else if(this.chooiceRight === undefined || this.chooiceRight.length === 0) {
          this.$message.warning('必须选择一部分权限')
          return false
        } else{
          return true
        }
      },
      //校验密码,校验成功返回true,校验失败返回false
      checkPassword(password){
        let numberCount,//数字字符数目
          letterCount,//字母字符数目
          numberRegExp = /[0-9]/,//数字正则
          letterRegExp = /[a-z]/i,//字母正则,不区分大小写
          length = (password = password || '').length;
        if(length < 8 || length > 16){
          return false;
        }
        numberCount = letterCount = 0;
        for(let i = 0, char; i < length; i++){
          char = password.charAt(i);//取得每个字符
          if(numberRegExp.test(char)){
            numberCount += 1;//数字字符数目加1
          }else if(letterRegExp.test(char)){
            letterCount += 1;//字母字符数目加1
          }else{
            return false;//即不是字母又不数字,直接返回false
          }
        }
        return !(numberCount == length || letterCount == length);
      },
      // 修改客户
      modifyRow(row) {
        this.isCreate = false
        this.isDialogVisible  = true
        this.dialogMessage = deepCopy(row)
        delete this.dialogMessage.index
        // 如果不用deepCopy，改了this.chooiceRight会改变this.dialogMessage.right，修改失败无法还原了。
        this.chooiceRight = this.transformNumRight(deepCopy(this.dialogMessage.right))
        console.log(this.chooiceRight)
      },
      // 新增客户
      addRow(){
          this.resetDialog()
          this.isCreate = true
          this.isDialogVisible  = true
      },
      // 重置搜索条件
      resetSearchParams() {
        this.searchBean.account = ''
        this.searchBean.name = ''
        this.searchBean.phone = ''
        this.page = 1
        // 重刷权限列表
        this.getAuthorityList()
      },
      resetDialog() {
          this.dialogMessage
          for(let key in this.dialogMessage){
              this.dialogMessage[key] = ''
          }
      },
      clickCancelDialog(){
          this.isDialogVisible = false
      },
      clickSureDialog(){
        if(!this.checkState()) {
          return
        }
        if(this.isCreate) {
          this.clickAddManager()
        } else {
          this.clickModifyManager()
        }
      },
      showDeleteDialog(row) {
        this.isTipDialogVisible = true
        this.tempManagerBean = row
      },
      cancelDelete() {
        this.isTipDialogVisible = false
      },
      sureDelete() {
        this.isTipDialogVisible = false
        this.deleteRow()
      },
      /**----服务调用----**/
      // 获取客户/公司列表
      getCusomers() {
        getCustomerList().then((res)=>{
          if(res.data.code === 200) {
            this.customerList = res.data.data
          } else {
            console.log('获取公司列表失败')
          }
        }).catch(()=>{
          console.log("获取公司列表失败")
        })
      },
      // 获取管理员列表
      getAuthorityList() {
        // 可以不输入手机号，但是如果有手机号必须是正确的
        if (this.searchBean.phone !== '' && !(/^1[0-9]{10}$/.test(this.searchBean.phone))) {
          this.$message.warning('请填写正确的手机号码')
          return
        }
        let body = {
          row:this.row,
          page:this.page,
          name:this.searchBean.name,
          account:this.searchBean.account,
          phone:this.searchBean.phone
        }
        getAuthorityList(body).then((res)=>{
          if(res.data.code === 200) {
            this.tableData = res.data.data.list
            this.total = res.data.data.total
          } else {
            this.$message.error('获取列表数据失败')
          }
        }).catch(()=>{
          this.$message.error('获取列表数据失败')
        })
      },
      // 删除列表的某个管理员
      deleteRow() {
        if(null === this.tempManagerBean)
          return
        deleteManager(this.tempManagerBean.id).then((res)=>{
          if(res.data.code === 200) {
            this.$message.success('已删除')
            // 查找需要删除的是哪一行。
            let index = this.tableData.findIndex(item =>{
              if(item.id==this.tempManagerBean.id){
                return true
              }
            })
            // 本地数据删除某一行。
            this.tableData.splice(index, 1)
            this.total = this.total -1
          } else {
            this.$message.error('删除失败')
          }
        })
      },
      // 新增管理员
      clickAddManager() {
        let body = deepCopy(this.dialogMessage)
        delete body.id
        delete body.time
        delete body.creator
        body.right = this.transformRightsNum(deepCopy(this.chooiceRight))
        addManager(body).then((res)=>{
            if(res.data.code === 200) {
              this.$message.success('已添加')
              this.isDialogVisible = false
              this.getAuthorityList()
            } else{
              if(res.data.code === 10006) {
                this.$message.error('手机号已存在')
              } else {
                this.$message.error('添加失败')
              }
            }
        })
      },
      // 修改管理员
      clickModifyManager() {
        let body = deepCopy(this.dialogMessage)
        delete body.id
        delete body.creator
        delete body.time
        delete body.password
        body.right = this.transformRightsNum(deepCopy(this.chooiceRight))
        modifyManager(this.dialogMessage.id, body).then((res)=>{
          if(res.data.code === 200) {
            this.$message.success('修改成功')
            this.isDialogVisible = false
            this.getAuthorityList()
          } else {
            if(res.data.code === 10006) {
              this.$message.error('手机号已经存在')
            } else {
              this.$message.error('修改失败')
            }
          }
        })
      },
    },
  }
</script>

<style scoped lang="stylus">
  .main
    padding 30px
    background #EBEFF2
    display flex
    wh 100% 100%
    flex-direction column
    .border_shadow
      border 1px solid #DBE3E8
      box-shadow 0px 0px 5px 0px rgba(219, 227, 232, 1)
      border-radius 2px
    .head
      padding 24px 30px
      background white
      display flex
      flex-direction column
      width 100%
      margin-bottom 10px
      .search_condition
        display flex
        flex-direction row
        justify-content left
        height auto
        span
          fsc(16px, #666666)
          height:38px;
          line-height:38px;
          font-weight:400;
          margin-right 8px
          min-width 80px
          text-align center
        .el-input
          width 200px
          height 34px
          margin-right 30px
          border-radius 4px
    .body
      width 100%
      flex 1
      margin-bottom 10px
      background white
      display flex
      flex-direction column
    .pagination
      display flex
      flex-direction row
      justify-content center
      padding 20px 0
      width 100%
      height 74px
      margin-bottom 10px
      background white
    .el-dialog
      position absolute
      left 60%
      top 40%
      .el-form
        width 100%
        margin-bottom 24px
        .el-radio-group
          margin-left 40px
        .el-input
          width 490px
          margin-left 40px
        .el-select
          width auto
          margin-left 40px
        .el-checkbox-group
          margin-left 40px
        .el-checkbox
          width 120px
      .tip
        margin 10px 0 30px
        text-align center
        width 100%
      .el-dialog__footer
        display flex
        flex-direction row
        justify-content center
        .el-button
          width 120px
          font-size 16px
          margin 0px 20px
</style>
