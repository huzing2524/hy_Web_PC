<template lang="pug">
  .device.w1200.mgauto
    .menu_box
      .search_item.border_shadow
        el-form(:inline="true")
          el-form-item(label="状态")
            el-select(v-model="searchItem.status" placeholder="选择状态" clearable)
              el-option(v-for="items in keywordList" :key="items.value" :label="items.label" :value="items.value")
          el-form-item(label="客户名称")
            el-select(v-model="searchItem.customer_id" placeholder="选择客户" clearable @change="changeSearchCustomer")
              el-option(v-for="item in customerList" :key="item.customer_id" :label="item.name_cn" :value="item.customer_id")
          el-form-item(label="站点")
            el-select(v-model="searchItem.site_id" placeholder="选择站点" clearable)
              el-option(v-for="item in siteSearchList" :key="item.id" :label="item.site_name" :value="item.id")
          el-form-item(label="设备名称")
            el-input(v-model="searchItem.device_id" placeholder="填写设备名称" clearable)
          el-form-item
            el-button(@click="searchBtnClick" type="primary") 搜索
          el-form-item
            el-button(@click="resetClick") 重置
          el-form-item
            el-button(@click="addDeviceClick" type="primary") 新增设备
      .table_list.border_shadow(v-if="listItem.length")
        el-table(:data="listItem" v-loading="loading" stripe)
          el-table-column(
          header-align="center"
          align="center"
          label="序号")
            template(slot-scope="scope")
              span {{(page-1)*10 + scope.$index+1}}
          el-table-column(
          header-align="center"
          align="center"
          prop="name"
          label="设备名称")
          el-table-column(
          header-align="center"
          align="center"
          prop="id"
          label="序列号")
          el-table-column(
          header-align="center"
          align="center"
          prop="state"
          label="状态")
            template(slot-scope="scope")
              p {{scope.row.state | getState}}
          el-table-column(
          header-align="center"
          align="center"
          prop="offline_time"
          label="最后上线时间")
          el-table-column(
          header-align="center"
          align="center"
          prop="customer_name"
          label="所属客户")
          el-table-column(
          header-align="center"
          align="center"
          prop="site_name"
          label="所属站点")
          el-table-column(
          header-align="center"
          align="center"
          prop="option"
          label="操作")
            template(slot-scope="scope")
              el-row(:gutter="20")
                el-col
                  el-button(@click="changeClick(scope.$index,scope.row)" type="text" size="small") 修改
      Empty(v-else)
      .pagination.border_shadow
        el-pagination(
        :background="false"
        :page-size="row"
        :total="total"
        :current-page.sync="page"
        @current-change="handleCurrentChange"
        layout="prev, pager, next,total,jumper")
      el-dialog(:title="editType ==='create'?'新增设备':'修改设备'" v-if="dialogFormVisible" :visible.sync="dialogFormVisible")
        el-form.dialog_width(ref="form" :model="formData")
          el-form-item(label="序列号")
            el-input(v-model="formData.id" type="text" placeholder="请填写序列号" :disabled="editType==='edit'? true : false")
          el-form-item(label="密码")
            el-input(v-model="formData.pwd" type="text" placeholder="填写设备密码")
          el-form-item(label="名称")
            el-input(v-model="formData.name" type="text" placeholder="填写设备名称")
          el-form-item(label="所属客户")
            el-select(v-model="formData.customer_id" placeholder="选择客户" @change="changeCustomer")
              el-option(v-for="item in customerList" :key="item.customer_id" :label="item.name_cn" :value="item.customer_id")
          el-form-item(label="所属站点")
            el-select(v-model="formData.site_id" placeholder="选择站点" clearable)
              el-option(v-for="item in siteList" :key="item.id" :label="item.site_name" :value="item.id")
          el-form-item
            el-button(@click="cancelBtnClick") 取消
            el-button(@click="confirmClick") 确定
</template>

<script>
  import Empty from '_components/empty'
  import { getFullDate } from '_common/util'
  import { equipment } from '_api/device_manage'
  import { regionCustomer, customerSite } from '_api/client_manage'

  export default {
    name: 'home',
    components: {
      Empty,
    },
    filters: {
      getState(val) {
        switch (parseInt(val)) {
          case 0:
            return '离线'
          case 1:
            return '在线'
          default:
            return ''
        }
      },
    },
    data() {
      return {
        id: '',
        editType: 'create',
        row: 10,
        page: 1,
        total: 0,
        loading: false,
        dialogFormVisible: false,
        getFullDate,
        searchItem: {},
        keywordList: [
          {
            value: '0',
            label: '离线',
          },
          {
            value: '1',
            label: '在线',
          },
        ],
        customerList: [],
        siteSearchList: [],
        siteList: [],
        formData: {},
        listItem: [],
      }
    },
    mounted() {
      this.initData()
    },
    methods: {
      // ----------------  客户列表 初始化列表  ---------------- //
      initData() {
        regionCustomer({}, 'get').then((res) => {
          if (res.data.code === 200) {
            this.loading = false
            this.customerList = res.data.data
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.loading = false
          this.$message.error('获取数据失败')
        })
        this.getEquipmentList()
      },

      // ----------------  获取设备列表  ---------------- //
      getEquipmentList() {
        this.loading = true
        let params = {
          device_id: this.searchItem.device_id,
          customer_id: this.searchItem.customer_id,
          site_id: this.searchItem.site_id,
          status: this.searchItem.status,
          row: this.row,
          page: this.page,
        }
        equipment(params, 'get').then((res) => {
          this.loading = false
          if (res.data.code === 200) {
            this.listItem = res.data.data.list
            this.total = res.data.data.total
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.loading = false
          this.$message.error('获取数据失败')
        })
      },
      // ----------------  切换搜索客户  ---------------- //
      changeSearchCustomer() {
        if (this.searchItem.site_id) {
          this.searchItem.site_id = ''
        }
        this.customer_id = this.searchItem.customer_id
        if (this.customer_id) {
          customerSite({}, 'get', this.customer_id).then((res) => {
            if (res.data.code === 200) {
              this.loading = false
              this.siteSearchList = res.data.data.list
            } else {
              this.$message.error(res.data.msg)
            }
          }).catch(() => {
            this.loading = false
            this.$message.error('获取数据失败')
          })
        }
      },

      // ----------------  切换 新增、修改客户  ---------------- //
      changeCustomer() {
        if (this.editType === 'edit') {
          this.formData.site_id = ''
        }
        if (this.customer_id) {
          this.formData.site_id = ''
        }
        this.customer_id = this.formData.customer_id
        customerSite({}, 'get', this.customer_id).then((res) => {
          if (res.data.code === 200) {
            this.loading = false
            this.siteList = res.data.data.list
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.loading = false
          this.$message.error('获取数据失败')
        })
      },

      // ----------------  搜索设备  ---------------- //
      searchBtnClick() {
        this.getEquipmentList()
      },

      // ----------------  重置设备  ---------------- //
      resetClick() {
        this.searchItem.device_id = ''
        this.searchItem.customer_id = ''
        this.searchItem.site_id = ''
        this.searchItem.status = ''
        this.getEquipmentList()
      },

      // ----------------  新增设备  ---------------- //
      addDeviceClick() {
        this.formData = {
          id: '',
          pwd: '',
          name: '',
          customer_id: '',
          site_id: '',
        }
        this.editType = 'create'
        this.dialogFormVisible = true
      },

      // ----------------  修改设备  ---------------- //
      changeClick(index, row) {
        this.id = row.id
        this.dialogFormVisible = true
        this.editType = 'edit'
        this.formData = this.$_.cloneDeep(row)
        customerSite({}, 'get', this.formData.customer_id).then((res) => {
          if (res.data.code === 200) {
            this.siteList = res.data.data.list
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.loading = false
          this.$message.error('获取数据失败')
        })
      },

      // ----------------  取消 新增、修改设备  ---------------- //
      cancelBtnClick() {
        this.dialogFormVisible = false
      },

      // ----------------  新增、修改设备  ---------------- //
      confirmClick() {
        if (!this.formData.id.replace(/\s+/g, '') || !this.formData.pwd.replace(/\s+/g, '') || !this.formData.name.replace(/\s+/g, '') || !this.formData.customer_id || !this.formData.site_id) {
          this.$message.error('请完善设备信息后提交')
          return
        }
        if (!(/^\d+$/.test(this.formData.id))) {
          this.$message.error('序列号格式错误,请重新输入')
          return
        }
        if (this.editType === 'create') {
          let params = {
            id: this.formData.id.replace(/\s+/g, ''),
            pwd: this.formData.pwd.replace(/\s+/g, ''),
            name: this.formData.name.replace(/\s+/g, ''),
            customer_id: this.formData.customer_id,
            site_id: this.formData.site_id,
          }
          equipment(params, 'post').then((res) => {
            this.loading = false
            if (res.data.code === 200) {
              this.$message.success('新增成功')
              this.dialogFormVisible = false
              this.formData.site_id = ''
              this.getEquipmentList()
            } else {
              this.$message.error(res.data.msg)
            }
          }).catch(() => {
            this.loading = false
            this.$message.error('获取数据失败')
          })
        }
        if (this.editType === 'edit') {
          let params = {
            id: this.formData.id,
            pwd: this.formData.pwd,
            name: this.formData.name,
            customer_id: this.formData.customer_id,
            site_id: this.formData.site_id,
          }
          equipment(params, 'put', this.id).then((res) => {
            this.loading = false
            if (res.data.code === 200) {
              this.$message.success('修改成功')
              this.dialogFormVisible = false
              this.getEquipmentList()
            } else {
              this.$message.error(res.data.msg)
            }
          }).catch(() => {
            this.loading = false
            this.$message.error('获取数据失败')
          })
        }
      },

      // ----------------  页码切换  ---------------- //
      handleCurrentChange() {
        this.getEquipmentList()
      },
    },
  }
</script>

<style lang="stylus" scoped>
  .device
    wh 100% 100%
    display flex
    padding 30px 30px 12px
    .menu_box
      display flex
      flex 1
      flex-direction column
      .search_item
        display flex
        flex-direction row
        background #fff
        margin-bottom 10px
        padding 22px 0px 0px 20px
        form
          width 100%
          .el-form-item
            display inline-block
      .table_list
        flex-direction column
        flex 1
        overflow-y scroll
      .pagination
        display flex
        flex-direction row
        justify-content center
        padding 20px 0
        background #fff
        margin-top 10px
      .border_shadow
        border 1px solid #DBE3E8
        box-shadow 0px 0px 5px 0px rgba(219, 227, 232, 1)
        border-radius 2px
      .el-dialog
        display flex
        flex-direction column
</style>
<style lang="stylus">
  .el-dialog
    width 550px
    .el-dialog__header
      text-align center
      font-weight 500
    .el-dialog__body
      padding 30px 60px
      .el-form
        text-align center
        .el-form-item
          display flex
          flex-direction row
          margin-bottom 24px
          button
            width 140px
            margin 0 20px
            fsc 16px #fff
            &:first-child
              background #B8C5D0
            &:last-child
              background #19CCAE

  /*.el-table*/

  .el-table th
    color #333333
    background #F6F8F9

  .el-form-item__label
    fsc 16px #666666
    display flex

  .el-form-item__content
    flex 1

  .el-select
    width 100%

  .dialog_width
    .el-form-item__label
      width 80px


  .el-dialog__headerbtn
    display none
</style>
