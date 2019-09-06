<template lang="pug">
  .main
    .head.border_shadow
      el-breadcrumb(separator-class="el-icon-arrow-right" class = 'bread')
        el-breadcrumb-item(:to="{ path: '/client_manage' }") 客户管理
        el-breadcrumb-item 查看详情
    .body.border_shadow
      .part
        .item
          span.title 客户编码：
          span.content {{customerBean.customer_id}}
        .item
          span.title 客户中文名称：
          span.content {{customerBean.name_cn}}
        .item
          span.title 客户英文名称：
          span.content {{customerBean.name_en}}
        .item
          span.title 客户简称：
          span.content {{customerBean.name_short}}
        .item
          span.title 客户类型:
          span.content {{customerBean.customer_category}}
        .item
          span.title 助记码：
          span.content {{customerBean.code_mnemonic}}
        .item
          span.title 地址：
          span.content {{customerBean.province}}{{customerBean.city}}{{customerBean.district}}{{customerBean.address}}
        .item
          span.title 联系人：
          span.content {{customerBean.contact}}
        .item
          span.title 联系电话：
          span.content {{customerBean.phone}}
        .item
          span.title 人民币账户：
          span.content {{customerBean.account_rmb}}
        .item
          span.title 美元账号：
          span.content {{customerBean.account_dollar}}
      .part
        .photo
          span 经营许可证
          a(:href="customerBean.business_license" target="_blank")
            img(:src="customerBean.business_license")
        .item
          span.title 经营范围：
          span.content {{customerBean.business}}
        .item
          span.title 组织机构代码：
          span.content {{customerBean.code_organization}}
        .item
          span.title 税号：
          span.content {{customerBean.ein}}
        .item
          span.title 税收号：
          span.content {{customerBean.tax_no}}
        .item
          span.title 个税类型：
          span.content {{customerBean.tax_types}}
        .item
          span.title 备注：
          span.content {{customerBean.remark}}
    .bottom.border_shadow
      el-button(@click="modifyDetail()" type="primary" size="small") 修改
      el-button(@click="changeLockState()"  size="small") {{customerBean.lock_status === '1' ? '解锁' : '锁定'}}
      el-button(@click="showDeleteDialog()"  size="small") 删除
    el-dialog(:visible.sync="isDialogVisible" title="修改客户" :width="dialogWidth+'px'" center size="small")
      el-form(ref="form" :model="dialogMessage" :inline="true" :rules="customuerRules")
        el-form-item(label="客户中文名称" :label-width="formLabelWidth" prop="name_cn")
          el-input(v-model="dialogMessage.name_cn"  autocomplete="off" type="text" maxlength="10" show-word-limit)
        el-form-item(label="省" :label-width="formLabelWidth" prop="province")
          el-select(v-model="addressValue.province" placeholder="请选择" @change="selectProvince()")
            el-option(v-for="item in addressValue.mProvinceList" :key="item.value" :label="item.text" :value="item.text")

        el-form-item(label="客户英文名称" :label-width="formLabelWidth" prop="name_en")
          el-input(v-model="dialogMessage.name_en"  autocomplete="off" type="text" maxlength="20" show-word-limit)
        el-form-item(label="市" :label-width="formLabelWidth" prop="city")
          el-select(v-model="addressValue.city" placeholder="请选择" @change="selectCity()")
            el-option(v-for="item in addressValue.mCityList" :key="item.value" :label="item.text" :value="item.text")

        el-form-item(label="客户简称" :label-width="formLabelWidth" prop="name_short")
          el-input(v-model="dialogMessage.name_short"  autocomplete="off" type="text" maxlength="10" show-word-limit)
        el-form-item(label="区/县" :label-width="formLabelWidth" prop="district")
          el-select(v-model="addressValue.district" placeholder="请选择")
            el-option(v-for="item in addressValue.mDistrictList" :key="item.value" :label="item.text" :value="item.text")

        el-form-item(label="客户类别" :label-width="formLabelWidth" prop="customer_category")
          el-select(v-model="dialogMessage.customer_category" placeholder="请选择")
            el-option(v-for="item in clientCategorys" :key="item.value" :label="item.label" :value="item.label")
        el-form-item(label="详细地址" :label-width="formLabelWidth" prop="address")
          el-input(v-model="addressValue.address"  autocomplete="off" type="text" maxlength="20")

        el-form-item(label="助记码" :label-width="formLabelWidth" prop="code_mnemonic")
          el-input(v-model="dialogMessage.code_mnemonic"  autocomplete="off" type="text" maxlength="10")
        el-form-item(label="经营范围" :label-width="formLabelWidth" prop="business")
          el-select(v-model="dialogMessage.business" placeholder="请选择")
            el-option(v-for="item in companyCategory" :key="item.key" :label="item.text" :value="item.text")

        el-form-item(label="联系人" :label-width="formLabelWidth" prop="contact")
          el-input(v-model="dialogMessage.contact"  autocomplete="off" type="text" maxlength="10" show-word-limit)
        el-form-item(label="组织机构代码" :label-width="formLabelWidth" prop="code_organization")
          el-input(v-model="dialogMessage.code_organization"  autocomplete="off" type="text" maxlength="30")

        el-form-item(label="联系电话" :label-width="formLabelWidth" prop="phone")
          el-input(v-model="dialogMessage.phone"  autocomplete="off")
        el-form-item(label="税号" :label-width="formLabelWidth" prop="ein")
          el-input(v-model="dialogMessage.ein"  autocomplete="off" type="text" maxlength="30")

        el-form-item(label="人民币账号" :label-width="formLabelWidth" prop="account_rmb")
          el-input(v-model="dialogMessage.account_rmb"  autocomplete="off" type="text" maxlength="30")
        el-form-item(label="税收号" :label-width="formLabelWidth" prop="tax_no")
          el-input(v-model="dialogMessage.tax_no"  autocomplete="off" type="text" maxlength="30")

        el-form-item(label="美元账号" :label-width="formLabelWidth" prop="account_dollar")
          el-input(v-model="dialogMessage.account_dollar"  autocomplete="off" type="text" maxlength="30")
        el-form-item(label="个税类型" :label-width="formLabelWidth" prop="tax_types")
          el-input(v-model="dialogMessage.tax_types"  autocomplete="off" type="text" maxlength="10")

        el-form-item(label="邮箱" :label-width="formLabelWidth" prop="email")
          el-input(v-model="dialogMessage.email"  autocomplete="off")
        el-form-item(label="备注" :label-width="formLabelWidth")
          el-input(v-model="dialogMessage.remark"  autocomplete="off" type="text" maxlength="50")

        el-form-item(label="经营许可证" :label-width="formLabelWidth" ref="uploadElement" prop="business_license")
          .select_photo
            img(v-if="photoUrl.length" :src="photoUrl" @click="selectHeadPhoto")
            .icon_default(v-else @click="selectHeadPhoto")
              svg.ali_icon(aria-hidden="true")
                use(xlink:href="#iconimage")
            input(type="file", accept="image/jpeg,image/jpg,image/png,image/svg,image/webp", ref="imgInput", @change="chooiceHeadPhoto" :class="{hide: photoUrl.length}")
      .el-dialog__footer
        el-button(@click="clickCancelDialog()" ) 取消
        el-button(@click="clickResetDialog()" class="clear") 清空
        el-button(type="primary" @click="clickSureDialog('form')") 保存
    el-dialog(:visible.sync="isTipDialogVisible" title="删除客户" width="30%" center)
      .tip 确定要删除吗
      .el-dialog__footer
        el-button(@click="cancelDelete()" ) 取消
        el-button(type="primary" @click="sureDelete()") 确定
</template>

<script>
  import {getCustomerDetail,lockCustomer,unlockCustomer,modifyCustomer,deleteCustomer} from '_api/client_manage'
  import { provinceList, cityList, areaList } from '_common/area'
  import { company_category } from '_common/company_category'
  import {deepCopy} from '_common/util'
  import lrz from 'lrz'
  import { getDataUrl } from '_common/util'

  export default {
    data() {
      let validateName = (rule, value, callback) => {
        if(value.trim() === '') {
          callback(new Error('请填写中文名称'));
        } else {
          if((/[^\u4E00-\u9FA5]/g.test(value))) {
            callback(new Error('请填写纯中文'));
          }
          callback();
        }
      };
      let validateProvince = (rule, value, callback) => {
        if(this.addressValue.province === '') {
          callback(new Error('请选择省份'));
        } else {
          callback();
        }
      };
      let validateCity = (rule, value, callback) => {
        if(this.addressValue.city === '') {
          callback(new Error('请选择市'));
        } else {
          callback();
        }
      };
      let validateDistrict = (rule, value, callback) => {
        if(this.addressValue.district === '') {
          callback(new Error('请选择县/区'));
        } else {
          callback();
        }
      };
      let validateAddress = (rule, value, callback) => {
        if(this.addressValue.address === '') {
          callback(new Error('请填写详细地址'));
        } else {
          callback();
        }
      };
      let validatePhone = (rule, value, callback) => {
        if(value.trim() === '') {
          callback(new Error('请填写手机号'));
        } else {
          if(!(/^1[0-9]{10}$/.test(value))) {
            callback(new Error('请填写正确的手机号'));
          }
          callback();
        }
      };
      let validateBusiness = (rule, value, callback) => {
        if(value === '') {
          callback(new Error('请选择经营范围'));
        } else {
          callback();
        }
      };
      let validateCategory = (rule, value, callback) => {
        if(value === '') {
          callback(new Error('请选择客户类别'));
        } else {
          callback();
        }
      };
      return {
        clientCategorys:[
          {
            value: '全部',
            label: '全部'
          },
          {
            value: '超级会员',
            label: '超级会员'
          }, {
            value: '普通用户',
            label: '普通用户'
          }
        ],
        photoUrl:'',
        photoFile:{},
        photoStyle : this.photoUrl
          ? `
                background: url(${this.photoUrl}) no-repeat;
                background-position:center;
                background-size: 100%;
                ` : ``,
        customerBean: {
          // "customer_id": "9527",// 客户编码
          // "name_cn": "深圳大疆污水处理公司",// 客户中文名称
          // "name_en": "haiphon",// 客户英文名称
          // "name_short": "eiu", // 客户简称
          // "code_mnemonic":"etc",// 助记码
          // "province":"广东省",
          // "city":"深圳市",
          // "district":"南山区",
          // "address": "东环大道新一佳",// 地址
          // "contact": "haiphon",// 联系人
          // "phone": "13691867534",// 联系电话
          // "email":"hai_phon@163.com",// 邮箱
          // "customer_category": "全部",// 客户类别
          // "business": "钢铁行业",// 经营范围
          // "account_rmb": "amet aliqua aute anim consectetur", // 人民币账号
          // "account_dollar": "reprehenderit est ut ipsum",// 美元账号
          // "code_organization": "eiusmod fugiat Ut minim",// 组织机构代码
          // "ein": "id dolor adipisicing",// 税号
          // "tax_no": "",// 税收号
          // "tax_types": "dolor proident",// 个税类型
          // "business_license": "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1461643366,2092385068&fm=26&gp=0.jpg",// 经营许可证图片
          // "remark": "et ullamco est",// 备注
          // "lock_status":'1',// 锁定状态
        },
        // 修改客户Dialog相关
        isDialogVisible: false,
        dialogWidth: '1000',
        formLabelWidth: '222px',
        dialogMessage:{
          "customer_id": "9527",// 客户编码
          "name_cn": "et",// 客户中文名称
          "name_en": "haiphon",// 客户英文名称
          "name_short": "eiu", // 客户简称
          "code_mnemonic":"etc",// 助记码
          "province":"广东省",
          "city":"广州市",
          "district":"南山区",
          "address": "越秀区龙珠大道112",// 详细地址
          "contact": "haiphon",// 联系人
          "phone": "13691867534",// 联系电话
          "email":"hai_phon@163.com",// 邮箱
          "customer_category": "全部",// 客户类别
          "business": "棉、麻、毛、丝纺织",// 经营范围
          "account_rmb": "amet aliqua aute anim consectetur", // 人民币账号
          "account_dollar": "reprehenderit est ut ipsum",// 美元账号
          "code_organization": "eiusmod fugiat Ut minim",// 组织机构代码
          "ein": "id dolor adipisicing",// 税号
          "tax_no": "",// 税收号
          "tax_types": "dolor proident",// 个税类型
          "business_license": "",// 经营许可证图片
          "remark": "et ullamco est",// 备注
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
        // 经营范围
        companyCategory: company_category,

        // 删除客户提示框相关
        isTipDialogVisible: false,
        // 表单输入规则
        customuerRules: {
          name_cn: [
            { required: true,validator: validateName },
          ],
          province: [
            { required: true,validator: validateProvince },
          ],
          city: [
            { required: true,validator: validateCity },
          ],
          district: [
            { required: true,validator: validateDistrict },
          ],
          customer_category: [
            { required: true, validator: validateCategory },
          ],
          address: [
            { required: true, validator: validateAddress },
          ],
          business: [
            { required: true, validator: validateBusiness },
          ],
          contact: [
            { required: true, message: '请输入联系人', trigger: 'blur' },
          ],
          phone: [
            { required: true, message: '请输入联系电话', trigger: 'blur' },
            { required: true, validator: validatePhone },
          ],
          email: [
            { type: 'email', message: '请输入正确的邮箱', trigger: 'blur,change' }
          ],
        },
      }
    },
    created() {
      // 初始化省列表，这个只会初始化一次，提前初始化。
      this.addressValue.mProvinceList = provinceList
      // this.formLabelWidth = this.dialogWidth / 4.5 + 'px'
    },
    mounted(){
      this.getCustomerDetail()
    },
    methods: {
      queryClientId() {
        return (null === this.$route.query.clientId) ? '' : this.$route.query.clientId
      },
      // img调用input的选择图片方法
      selectHeadPhoto(){
        this.$refs.imgInput.click()
      },
      // 用户选中图片后拿到返回的路径进行显示
      chooiceHeadPhoto() {
        if (this.$refs.imgInput.files[0]) {
          lrz(this.$refs.imgInput.files[0], { quality: 0.9 }).then((rst) => {
            let reader = new FileReader()
            reader.onload = (e) => {
              getDataUrl(e.target.result, 1080, 480)
                .then((dataurl) => {
                  this.setBgPhotoStyle(dataurl)
                })
                .catch(() => {})
            }
            // this.photoFile = rst.file
            this.photoFile = this.$refs.imgInput.files[0]
            reader.readAsDataURL(rst.file)
          })
        }
      },
      // 设置图片样式
      setBgPhotoStyle(dataUrl) {
        dataUrl = dataUrl ? dataUrl : ``
        this.photoUrl = dataUrl;
      },
      modifyDetail() {
        this.isDialogVisible  = true
        this.dialogMessage = deepCopy(this.customerBean)
        this.photoUrl = this.dialogMessage.business_license
        this.refreshAddressList()
      },
      // 改变客户锁定状态
      changeLockState() {
        if(this.customerBean.lock_status === '1') {// '1'是锁定状态，显示的文案是'解锁'，点击触发'解锁'服务。
          this.clickUnLockCustomer(this.customerBean.customer_id)
        } else {
          this.clickLockCustomer(this.customerBean.customer_id)
        }
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
                    // 拿到对应的区
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
      clickResetDialog() {
        this.dialogMessage
        for(let key in this.dialogMessage){
          this.dialogMessage[key] = ''
        }
        this.addressValue.province = ''
        this.addressValue.city = ''
        this.addressValue.district = ''
        this.addressValue.address = ''
        this.photoUrl = ''
      },
      clickSureDialog(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.photoUrl === '') {
              this.$message.warning('请上传经营许可证图片')
              return
            }
            this.modifyCustomer()
            // 必须置空，否则重新上传同一张图片不会触发onChange()的监听
            this.$refs.imgInput.value = ''
          } else {
            console.log('表单数据填写有误');
            return false;
          }
        });
      },
      showDeleteDialog() {
        this.isTipDialogVisible = true
      },
      cancelDelete() {
        this.isTipDialogVisible = false
      },
      sureDelete() {
        this.isTipDialogVisible = false
        this.deleteRow()
      },
      /**-----以下是服务方法-----**/
      // 获取客户列表
      getCustomerDetail() {
        getCustomerDetail(this.queryClientId()).then((res)=>{
          console.log(res)
          if(res.data.code === 200) {
            this.customerBean = res.data.data
            this.photoUrl = this.customerBean.business_license
          } else {
            this.$message.warning('获取客户详情失败')
          }
        }).catch(()=>{
          this.$message.warning("获取客户详情失败")
        })
      },
      // 锁定客户
      clickLockCustomer(id) {
        lockCustomer(id).then((res)=>{
          if(res.data.code === 200) {
            this.$message.success('已锁定')
            this.customerBean.lock_status = "1"
          } else {
            this.$message.success('锁定失败')
          }
        })
      },
      // 解锁客户
      clickUnLockCustomer(id) {
        unlockCustomer(id).then((res)=>{
          if(res.data.code === 200) {
            this.$message.success('已解锁')
            this.customerBean.lock_status = "0"
          } else {
            this.$message.warning('解锁失败')
          }
        })
      },
      // 修改客户
      modifyCustomer() {
        let body = deepCopy(this.dialogMessage)
        delete body.customer_id
        delete body.total
        delete body.lock_status


        body.province = this.addressValue.province
        body.city = this.addressValue.city
        body.district = this.addressValue.district
        body.address = this.addressValue.address
        // 如果没改图片，则相同，而且这个情况下不能穿business_license,这个在拿客户详情的时候返回的是图片地址；但是修改客户需要的是一个文件，如果不删除回报错。
        if(this.photoUrl === this.customerBean.business_license) {
          delete body.business_license
        } else {
          body.business_license = this.photoFile
        }
        modifyCustomer(this.dialogMessage.customer_id, body).then((res)=>{
          if(res.data.code === 200) {
            this.$message.success('修改成功')
            this.isDialogVisible = false
            this.getCustomerDetail()
          } else {
            this.$message.warning('修改失败')
            this.photoUrl = this.customerBean.business_license // 失败则恢复原来图片
          }
        })
      },
      // 删除客户
      deleteRow() {
        deleteCustomer(this.queryClientId()).then((res)=>{
          if(res.data.code === 200) {
            this.$message.success('已删除')
            this.$router.go(-1)
          } else {
            this.$message.error('删除失败')
          }
        })
      },
    }
  }
</script>

<style scoped lang="stylus">
  .main
    padding 40px 30px
    background #EBEFF2
    display flex
    flex-direction column
    width calc(100%)
    .border_shadow
      border 1px solid #DBE3E8
      box-shadow 0px 0px 5px 0px rgba(219, 227, 232, 1)
      border-radius 2px
    .head
      padding 30px
      background white
      display flex
      flex-direction column
      width calc(100%)

      margin-bottom 10px
    .body
      width 100%
      background white

      display flex
      flex-direction row
      justify-content space-between
      .part
        display flex
        flex 1
        flex-direction column
        margin-left 30px
        margin-bottom 30px
        justify-content space-between
        .item
          display flex
          flex-direction row
          margin-top  24px
          .title
            height:20px;
            font-size:16px;
            font-family:PingFangSC;
            font-weight:400;
            color:rgba(102,102,102,1);
            line-height:20px;
            margin-right 4px
          .content
            height:20px;
            font-size:16px;
            font-family:PingFangSC;
            font-weight:400;
            color:rgba(51,51,51,1);
            line-height:20px;
        .photo
          display flex
          flex-direction column
          margin-top  24px
          span
            height:20px;
            font-size:16px;
            font-family:PingFangSC;
            font-weight:400;
            color:rgba(102,102,102,1);
            line-height:20px;
            margin-bottom 14px
          img
             wh(140px, auto)
    .bottom
      margin-top 10px
      padding 30px
      background white
      display flex
      flex-direction row
      width calc(100%)

      margin-bottom 10px
      .el-button
        width:140px
        height 34px
        margin-right 30px
    .el-dialog
      position absolute
      left 60%
      top 40%
      .el-form
        width 100%
        .select_photo
          display flex
          flex-direction row
          align-items center
          img
            wh(140px,auto)
          .icon_default
            wh(140px, 92px)
          input
            margin-left 12px
            width auto
            height auto
            &.hide
              width 1px
              height 1px
              opacity 0
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
        .clear
          margin 0px 40px

</style>
