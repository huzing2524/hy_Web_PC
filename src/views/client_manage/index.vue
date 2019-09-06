<!--https://www.cnblogs.com/hcxy/p/9665201.html el-table不出现横向滚动条的bug原因-->
<template lang="pug">
  .main.w1200.mgauto
    .head.border_shadow
      .search_condition
        span 客户编码
        el-input(placeholder="填写客户编码" v-model="searchBean.customer_id")
        span 客户简称
        el-input(placeholder="填写客户简称" v-model="searchBean.customer_short_name")
        span 助记码
        el-input(placeholder="填写助记码" v-model="searchBean.code_mnemonic")
      .search_condition
        span 客户类别
        el-select(v-model="searchBean.customer_category")
          el-option(v-for="item in clientCategorys" :key = "item.value" :label="item.label" :value="item.value")
        span 锁定状态
        el-select(v-model="searchBean.lock_status")
          el-option(v-for="item in lockStates" :key = "item.value" :label="item.label" :value="item.value")
        el-button(type="primary" style="width:100px;margin-right:20px;margin-left:16px;font-size:16px" @click="getCustomerList()") 搜索
        el-button(style="width:100px;margin-right:40px;font-size:16px" @click="resetSearchParams()") 重置
        el-button(type="primary" style="width:120px;font-size:16px" @click="addRow()") 新增客户
    .body.border_shadow
      el-table(v-if="tableData.length" :data="tableData" :header-cell-style="headerStyle" :cell-style="cellStyle" :row-class-name="rowClassName" )
        el-table-column(type="index" label="序号" header-align="center" align="center" width ="200")
          template(slot-scope="scope")
            span {{scope.row.index + 1 + (page-1) * row}}
        el-table-column(prop="customer_id" label="客户编码" header-align="center" align="center")
        el-table-column(prop="name_cn" label="客户中文名称" header-align="center" align="center")
        el-table-column(prop="name_short" label="客户简称" header-align="center" align="center")
        el-table-column(prop="customer_category" label="客户类型" header-align="center" align="center")
        el-table-column(prop="code_mnemonic" label="助记码" header-align="center" align="center")
        el-table-column(prop="code_mnemonic" label="锁定状态" header-align="center" align="center")
          template(slot-scope="scope")
            span {{scope.row.lock_status === '1' ? '解锁' : '锁定'}}
        el-table-column( label="操作" width ="160" header-align="center" align="center")
          template(slot-scope="scope")
            el-button(@click="openSite(scope.row)" type="text" size="small") 站点
            el-button(@click="openDetail(scope.row)" type="text" size="small") 查看详情
      Empty(v-else)
    .pagination.border_shadow
      el-pagination(
        :background="false"
        :page-size="row"
        :total="total"
        :current-page.sync="page"
        @current-change="handleCurrentChange"
        layout="prev, pager, next,total,jumper")
    el-dialog(:visible.sync="isDialogVisible" title="新建客户" :width="dialogWidth+'px'" center size="small")
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
          el-input(v-model="addressValue.address" autocomplete="off" type="text" maxlength="20")

        el-form-item(label="助记码" :label-width="formLabelWidth" prop="code_mnemonic")
          el-input(v-model="dialogMessage.code_mnemonic" placeholder="纯数字" autocomplete="off" type="text" maxlength="10" show-word-limit oninput="value = value.replace(/[^\\d]/g,'').slice(0,10)" )
        el-form-item(label="经营范围" :label-width="formLabelWidth" prop="business")
          el-select(v-model="dialogMessage.business" placeholder="请选择")
            el-option(v-for="item in companyCategory" :key="item.key" :label="item.text" :value="item.text")

        el-form-item(label="联系人" :label-width="formLabelWidth" prop="contact")
          el-input(v-model="dialogMessage.contact"  autocomplete="off" type="text" maxlength="10" show-word-limit)
        el-form-item(label="组织机构代码" :label-width="formLabelWidth" prop="code_organization")
          el-input(v-model="dialogMessage.code_organization"  autocomplete="off" type="text" maxlength="30")

        el-form-item(label="联系电话" :label-width="formLabelWidth" prop="phone")
          el-input(v-model="dialogMessage.phone"  autocomplete="off"   type="text" maxlength="11" show-word-limit oninput="value = value.replace(/[^\\d]/g,'')")
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
</template>

<script>
  import {getCustomerList,addCustomer} from '_api/client_manage'
  import { provinceList, cityList, areaList } from '_common/area'
  import { company_category } from '_common/company_category'
  import {deepCopy} from '_common/util'
  import lrz from 'lrz'
  import { getDataUrl } from '_common/util'
  import Empty from '_components/empty'

  export default {
    components: {
      Empty,
    },
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
        row:10,
        page:1,
        total: 0,
        searchBean: {
          customer_id:'',// 客户编码
          customer_short_name:'',// 客户简称
          code_mnemonic:'',//助记码
          customer_category:'',//客户类别
          lock_status:''//锁定状态
        },
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
        lockStates:[
          {
            value: '0',
            label: '解锁'
          },
          {
            value: '1',
            label: '锁定'
          }, {
            value: '',
            label: '全部'
          }
        ],
        // 表单相关
        tableItemWidth: 120,
        "tableData": [
          // {
          //   "customer_id": "9527",// 客户编码
          //   "name_cn": "深圳大疆污水处理公司",// 客户中文名称
          //   "name_en": "haiphon",// 客户英文名称
          //   "name_short": "eiu", // 客户简称
          //   "code_mnemonic":"etc",// 助记码
          //   "province":"广东省",
          //   "city":"深圳市",
          //   "district":"南山区",
          //   "address": "东环大道新一佳",// 地址
          //   "contact": "haiphon",// 联系人
          //   "phone": "13691867534",// 联系电话
          //   "email":"hai_phon@163.com",// 邮箱
          //   "customer_category": "全部",// 客户类别
          //   "business": "钢铁行业",// 经营范围
          //   "account_rmb": "amet aliqua aute anim consectetur", // 人民币账号
          //   "account_dollar": "reprehenderit est ut ipsum",// 美元账号
          //   "code_organization": "eiusmod fugiat Ut minim",// 组织机构代码
          //   "ein": "id dolor adipisicing",// 税号
          //   "tax_no": "",// 税收号
          //   "tax_types": "dolor proident",// 个税类型
          //   "business_license": "http://localhost:8082/img/9072442936922112",// 经营许可证图片
          //   "remark": "et ullamco est",// 备注
          //   "lock_status":'1',// 锁定状态
          // }
        ],
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
        headerStyle() {
          return 'background-color:rgba(246,248,249,0.45);height:48px;border-radius:2px;text-align:center;font-size:16px;font-weight:500;color:#333333;'
        },
        cellStyle() {
          return "text-align:center;height:56px"
        },
        // 新建客户Dialog相关
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
          // "business_license": "http://localhost:8082/img/8998762949120000",// 经营许可证图片
          "business_license": "",// 经营许可证图片
          "remark": "et ullamco est",// 备注
          // "total": "in sit id non",// 总数
          // "lock_status":'1'// 锁定状态
        },
        photoUrl:'',
        photoFile: {},
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

      }
    },
    created() {
      // 初始化省列表，这个只会初始化一次，提前初始化。
      this.addressValue.mProvinceList = provinceList
      // this.formLabelWidth = this.dialogWidth / 4.5 + 'px'
    },
    mounted(){
      this.getCustomerList()
    },
    methods: {
      rowClassName({row, rowIndex}) {
        //把每一行的索引放进row
        row.index = rowIndex;
      },
      // 分页按钮事件回调
      handleCurrentChange(val){
        this.page = val
        this.getCustomerList()
      },
      // 重置搜索条件
      resetSearchParams() {
        this.searchBean.customer_short_name = ''
        this.searchBean.customer_id = ''
        this.searchBean.code_mnemonic = ''
        this.searchBean.customer_category = ''
        this.searchBean.lock_status = ''
        this.page = 1
        // 重刷客户列表
        this.getCustomerList()
      },
      // 新增客户
      addRow(){
        this.clickResetDialog()
        this.isDialogVisible  = true
        this.refreshAddressList()
        this.photoUrl = ''
      },
      // 打开某个客户对应的站点列表界面
      openSite(row) {
        console.log(row.customer_id)
        console.log(row.name_cn)
        this.$router.push(`/client_manage/site?clientId=${row.customer_id}&clientName=${row.name_cn}`)
      },
      // 打开客户详情
      openDetail(row) {
        this.$router.push(`/client_manage/detail?clientId=${row.customer_id}`)
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
            this.photoFile = this.$refs.imgInput.files[0]
            // this.photoFile = rst.file
            reader.readAsDataURL(rst.file)
          })
        }
      },
      // 设置图片样式
      setBgPhotoStyle(dataUrl) {
        dataUrl = dataUrl ? dataUrl : ``
        this.photoUrl = dataUrl;
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
            this.addClient()
            // 必须置空，否则重新上传同一张图片不会触发onChange()的监听
            this.$refs.imgInput.value = ''
          } else {
            console.log('表单数据填写有误');
            return false;
          }
        });
      },
      /**-----以下是服务方法-----**/
      // 获取客户列表
      getCustomerList() {
        let body = {
          row:this.row,
          page:this.page,
          customer_id:this.searchBean.customer_id,
          customer_short_name:this.searchBean.customer_short_name,
          code_mnemonic:this.searchBean.code_mnemonic,
          customer_category:this.searchBean.customer_category,
          lock_status:this.searchBean.lock_status
        }
        getCustomerList(body).then((res)=>{
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
      // 新增客户
      addClient() {
        let body = deepCopy(this.dialogMessage)
        delete body.customer_id
        body.province = this.addressValue.province
        body.city = this.addressValue.city
        body.district = this.addressValue.district
        body.address = this.addressValue.address
        body.business_license = this.photoFile
        console.log(body.business_license)
        addCustomer(body).then((res)=>{
          if(res.data.code === 200) {
            this.$message.success('已添加')
            this.isDialogVisible = false
            this.getCustomerList()
          } else {
            this.$message.error('添加失败')
          }
        })
      },
    }
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
      padding 30px
      background white
      display flex
      flex-direction column
      width calc(100%)
      height 156px
      margin-bottom 10px
      .search_condition
        display flex
        flex-direction row
        justify-content left
        height auto
        margin-bottom 24px
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
        .el-select
          width 200 px
          height 34px
          margin-right 30px
          border-radius 4px
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
      width calc(100%)
      height 74px
      margin-bottom 10px
      background white
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
