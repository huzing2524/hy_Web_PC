<template lang="pug">
  .main.w1200.mgauto
    .head.border_shadow
      el-breadcrumb(separator-class="el-icon-arrow-right")
        el-breadcrumb-item(:to="{ path: '/client_manage' }") 客户管理
        el-breadcrumb-item 站点管理
      .item
        span {{queryName()}}
        el-button(type="primary" @click="addRow()") 新增站点
    .body.border_shadow
      el-table(v-if="tableData.length" :data="tableData" style="width: 100%" :header-cell-style="headerStyle" :cell-style="cellStyle" :row-class-name="rowClassName" )
        el-table-column(type="index" label="序号" fixed width ="220")
          template(slot-scope="scope")
            span {{scope.row.index + 1 + (page-1) * row}}
        el-table-column(prop="site_name" label="站点名称")
        el-table-column(prop="province,city,district" label="位置")
          template(slot-scope="scope")
            span {{scope.row.province}}{{scope.row.city}}{{scope.row.district}}
        el-table-column(prop="address" label="详细地址" )
        el-table-column(prop="remark" label="备注")
        el-table-column(label="操作")
          template(slot-scope="scope")
            el-button(@click="showDeleteDialog(scope.row)" type="text" size="small") 删除
            el-button(@click="modifyRow(scope.row)" type="text" size="small") 修改
      Empty(v-else)
    .pagination.border_shadow
      el-pagination(
        :background="false"
        :page-size="row"
        :total="total"
        :current-page.sync="page"
        @current-change="handleCurrentChange"
        layout="prev, pager, next,total,jumper")
    el-dialog(:visible.sync="isDialogVisible" :title="isCreate ? '新建站点' : '修改站点'" :width="dialogWidth+'px'" center )
      el-form(ref="form" :model="dialogMessage" :inline="true")
        el-form-item(label="站点名称" label-width="100px")
          el-input(v-model="dialogMessage.site_name" placeholder="填写站点名称"  autocomplete="off" :style="{ width: 490 + 'px' }")
        el-form-item(label="位置" label-width="100px")
          el-select(v-model="addressValue.province" placeholder="省" @change="selectProvince()" )
            el-option(v-for="item in addressValue.mProvinceList" :key="item.value" :label="item.text" :value="item.text")
          el-select(v-model="addressValue.city" placeholder="市" @change="selectCity()" class="city")
            el-option(v-for="item in addressValue.mCityList" :key="item.value" :label="item.text" :value="item.text")
          el-select(v-model="addressValue.district" placeholder="县城/区" )
            el-option(v-for="item in addressValue.mDistrictList" :key="item.value" :label="item.text" :value="item.text")
        el-form-item(label="详细地址" label-width="100px")
          el-input(v-model="addressValue.address" placeholder="填写备注详细地址" autocomplete="off" :style="{ width: 490 + 'px' }")
        el-form-item(label="备注" label-width="100px")
          el-input(v-model="dialogMessage.remark" placeholder="(选填)填写备注" autocomplete="off" :style="{ width: 490 + 'px' }")
      .el-dialog__footer
        el-button( @click="clickCancelDialog()" ) 取消
        el-button(type="primary" @click="clickSureDialog()") 确定
    el-dialog(:visible.sync="isTipDialogVisible" title="删除站点" width="30%" center)
      .tip 确定要删除吗
      .el-dialog__footer
        el-button(@click="cancelDelete()" ) 取消
        el-button(type="primary" @click="sureDelete()") 确定
</template>

<script>
  import {getCustomerSiteList,addCustomerSite,modifyCustomerSite,deleteCustomerSite} from '_api/client_manage'
  import { provinceList, cityList, areaList } from '_common/area'
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
        total: 0,
        tableData:[
            // {
            //   "id":"001",
            //   "site_name": "一号水泵",
            //   "province":"广东省",
            //   "city":"广州市",
            //   "district":"海珠区",
            //   "address": "东环大道一号店",
            //   "remark": "正常",
            //   "total": "Du"
            // },
            // {
            //   "id":"002",
            //   "site_name": "二号水泵",
            //   "province":"广东省",
            //   "city":"广州市",
            //   "district":"海珠区",
            //   "address": "龙珠大道168号",
            //   "remark": "异常,请及时检查",
            //   "total": "Du",
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
        formLabelWidth: '200',
        isCreate: true,
        dialogMessage:{
          "id":"001",
          "site_name": "一号水泵",
          "province":"广东省",
          "city":"深圳市",
          "district":"南山区",
          "address": "东环大道一号店",
          "remark": "正常",
        },
        // 新建时默认的省市区，以及为了初始化省，市，区三个选择器的三个list初始数据；如果是修改，则弹窗前调用getAddressPosition对所有数据进行重新赋值。
        addressValue:{
            mProvinceList:[],
            mCityList:[],
            mDistrictList:[],
            province:'',
            city:'',
            district:'',
            address:''
        },
        // 删除站点提示框相关
        isTipDialogVisible: false,
        // 用户点击删除的那一行站点的数据
        tempSiteBean : {}
      }
    },
    created() {
      // 初始化省列表，这个只会初始化一次，提前初始化。
      this.addressValue.mProvinceList = provinceList
      this.formLabelWidth = this.dialogWidth / 4.5 + 'px'
    },
    mounted() {
      this.getClientSiteList()
    },
    methods: {
      queryName() {
        return (null === this.$route.query.clientName) ? '' : this.$route.query.clientName
      },
      queryClientId() {
        return (null === this.$route.query.clientId) ? '' : this.$route.query.clientId
      },
      rowClassName({row, rowIndex}) {
        //把每一行的索引放进row
        row.index = rowIndex;
      },
      handleCurrentChange(val){
        this.page = val
        this.getClientSiteList()
      },
      modifyRow(row) {
        this.isCreate = false
        this.isDialogVisible  = true
        this.dialogMessage = deepCopy(row)
        this.refreshAddressList()
      },
      // 新增客户
      addRow(){
          this.resetDialog()
          this.isCreate = true
          this.isDialogVisible  = true
          this.refreshAddressList()
      },
      resetDialog() {
          this.dialogMessage
          for(let key in this.dialogMessage){
              this.dialogMessage[key] = ''
          }
          this.addressValue.province = '省'
          this.addressValue.city = '市'
          this.addressValue.district = '区/县'
          this.addressValue.address = ''
      },
      // 需要获取当前所在省，市，区对应的列表去刷新三个选择器对应的数据列表
      refreshAddressList() {
          for(let i = 0; i < provinceList.length; i++) {
              if(this.dialogMessage.province.indexOf(provinceList[i].text)!=-1) {
                  // 拿到对应的省
                  this.addressValue.province = provinceList[i].text
                  // 拿到对应省的所有城市列表
                  this.addressValue.mCityList =  cityList[provinceList[i].value]
                  for(let j = 0; j < this.addressValue.mCityList.length; j++) {
                      if(this.dialogMessage.city.indexOf(this.addressValue.mCityList[j].text)!=-1) {
                          // 拿到对应的市
                          this.addressValue.city = this.addressValue.mCityList[j].text
                          // 拿到对应市的所有县城/区列表
                          this.addressValue.mDistrictList = areaList[this.addressValue.mCityList[j].value]
                          for(let k = 0; k < this.addressValue.mDistrictList.length; k++) {
                              if(this.dialogMessage.district.indexOf(this.addressValue.mDistrictList[k].text)!=-1) {
                                  // 拿到对应的县城/区
                                  this.addressValue.district = this.addressValue.mDistrictList[k].text
                                  break;
                              }
                          }
                      }
                  }
              }
          }
          this.addressValue.address = this.dialogMessage.address
      },
      // 用户选择某个省触发回调
      selectProvince() {
          this.refreshCityList()
          this.refreshAreaList()
      },
      // 用户选择某个城市触发回调
      selectCity() {
          this.refreshAreaList()
      },
      // 选择了省份要重刷省的市列表
      refreshCityList() {
          // 如果不用一个辅助变量，虽然this.addressValue.mCityList的值变了，但是由于地址不变，vue认为还是没有变，会导致界面不刷新。
          let temp = [];
          for(let i = 0; i < provinceList.length; i++) {
              if (this.addressValue.province.indexOf(provinceList[i].text) != -1) {
                  temp  =  cityList[provinceList[i].value]
                  break;
              }
          }
          this.addressValue.mCityList = temp
          this.addressValue.city = temp[0].text
      },
      // 选择了市要重刷县城或者区的列表
      refreshAreaList() {
          // 如果不用一个辅助变量，虽然this.addressValue.mAreaList的值变了，但是由于地址不变，vue认为还是没有变，会导致界面不刷新。
          let temp = [];
          for(let j = 0; j < this.addressValue.mCityList.length; j++) {
              if (this.addressValue.city.indexOf(this.addressValue.mCityList[j].text) != -1) {
                  temp = areaList[this.addressValue.mCityList[j].value]
                  break;
              }
          }
          this.addressValue.mDistrictList = temp
          this.addressValue.district = temp[0].text
      },
      clickCancelDialog(){
          this.isDialogVisible = false
      },
      clickSureDialog(){
        if(this.isCreate) {
          this.addClientSite()
        } else {
          this.modifyClientSite()
        }
      },
      showDeleteDialog(row) {
        this.isTipDialogVisible = true
        this.tempSiteBean = row
      },
      cancelDelete() {
        this.isTipDialogVisible = false
      },
      sureDelete() {
        this.isTipDialogVisible = false
        this.deleteRow()
      },
      // 新建客户站点需要检查
      checkState() {
        let isPass = false
        if(this.dialogMessage.site_name.trim() === '') {
          this.$message.warning('请填写站点名称')
        } else if (this.addressValue.province === '省' || this.addressValue.province === '') {
          this.$message.warning('请选择省份')
        } else if(this.addressValue.city === '市' || this.addressValue.city === '') {
          this.$message.warning('请选择市')
        } else if(this.addressValue.district === '区/县' || this.addressValue.district === '') {
          this.$message.warning('请选择区/县')
        } else if(this.addressValue.address.trim() === '') {
          this.$message.warning('请填写详细地址')
        } else {
          isPass = true
        }
        console.log(isPass)
        return isPass
      },
      /**----服务调用----**/
      // 获取客户站点列表
      getClientSiteList() {
        let body = {
          row:this.row,
          page:this.page,
        }
        getCustomerSiteList(this.queryClientId(),body).then((res)=>{
          if(res.data.code === 200) {
            this.tableData = res.data.data.list
            this.total = res.data.data.total
          } else {
            this.$message.error('获取列表数据失败')
          }
        }).catch(()=>{
          this.$message.error("获取列表数据失败")
        })
      },
      // 删除客户某个站点
      deleteRow() {
        if(null === this.tempSiteBean)
          return
        deleteCustomerSite(this.tempSiteBean.id).then((res)=>{
          if(res.data.code === 200) {
            this.$message.success('已删除')
            // 查找需要删除的是哪一行。
            let index = this.tableData.findIndex(item =>{
              if(item.site_name==this.tempSiteBean.site_name){
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
      // 新增客户站点
      addClientSite() {
        if(this.checkState()) {
          let body = deepCopy(this.dialogMessage)
          body.province = this.addressValue.province
          body.city = this.addressValue.city
          body.district = this.addressValue.district
          body.address = this.addressValue.address
          console.log(JSON.stringify(body))
          addCustomerSite(this.queryClientId(), body).then((res)=>{
            if(res.data.code === 200) {
              this.$message.success('已添加')
              this.isDialogVisible = false
              this.getClientSiteList()
            } else {
              this.$message.error('添加失败')
            }
          })
        }
      },
      // 修改客户站点
      modifyClientSite() {
        if(this.checkState()) {
          let body = deepCopy(this.dialogMessage)
          body.province = this.addressValue.province
          body.city = this.addressValue.city
          body.district = this.addressValue.district
          body.address = this.addressValue.address
          delete body.id
          delete body.index
          modifyCustomerSite(this.dialogMessage.id, body).then((res)=>{
            if(res.data.code === 200) {
              this.$message.success('修改成功')
              this.isDialogVisible = false
              this.getClientSiteList()
            } else {
              this.$message.error('修改失败')
            }
          })
        }
      },
    },
  }
</script>

<style scoped lang="stylus">
  .main
    padding 30px
    background #EBEFF2
    display flex
    flex-direction column
    wh 100% 100%
    .border_shadow
      border 1px solid #DBE3E8
      box-shadow 0px 0px 5px 0px rgba(219, 227, 232, 1)
      border-radius 2px
    .head
      padding 24px 30px 20px
      background white
      display flex
      flex-direction column
      width calc(100%)
      height 153px
      margin-bottom 10px
      .el-breadcrumb
        border-bottom 1px solid #B6BDC2
        font-size 16px
        padding-bottom 24px
        width 100%
      .item
        display flex
        flex-direction row
        margin 28px 0px
        span
          min-width 30px
          height:40px;
          font-size:18px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(51,51,51,1);
          line-height:40px;
          margin-right 30px
        .el-button
          width 120px
    .body
      flex 1
      width calc(100%)
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
      .el-select
        width 150px
      .city
        margin 0 20px
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
