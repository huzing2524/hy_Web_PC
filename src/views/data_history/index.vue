<template lang="pug">
  .data_history.w1200.mgauto
    .menu_box
      .search_item.border_shadow
        el-form(:inline="true")
          el-form-item(label="客户名称")
            el-select(v-model="searchItem.customer_id" placeholder="选择客户" @change="changeSearchCustomer" clearable)
              el-option(v-for="item in customerList" :key="item.customer_id" :label="item.name_cn" :value="item.customer_id")
          el-form-item(label="站点")
            el-select(v-model="searchItem.site_id" placeholder="选择站点" @change="changeSearchSite" clearable)
              el-option(v-for="item in siteSearchList" :key="item.id" :label="item.site_name" :value="item.id")
          el-form-item(label="设备名称")
            el-select(v-model="searchItem.equipment_id" placeholder="选择设备" @change="changeSearchEquipment" clearable)
              el-option(v-for="item in equipmentSearchList" :key="item.id" :label="item.name" :value="item.id")
          el-form-item(label="设备数据")
            el-select(v-model="searchItem.equipment_item" placeholder="选择数据" clearable)
              el-option(v-for="(item,index) in itemsSearchList" :key="index" :label="item" :value="item")
          <br/>
          el-form-item(label="开始时间")
            el-date-picker(
            v-model="searchItem.startTime"
            type="datetime"
            placeholder="选择开始时间"
            )
          el-form-item(label="结束时间")
            el-date-picker(
            v-model="searchItem.endTime"
            type="datetime"
            placeholder="选择结束时间"
            )
          el-form-item
            el-button(type="primary" @click="searchBtnClick") 搜索
          el-form-item
            el-button(@click="resetClick") 重置
          el-form-item.button_item
            .tab_button
              span(:class="typeIndex===0 ? 'active' : ''" @click="changeType(0)")
                .icon(v-if="typeIndex===0")
                  svg.ali_icon(aria-hidden="true")
                    use(xlink:href="#iconliebiao_white")
                .icon(v-else)
                  svg.ali_icon(aria-hidden="true")
                    use(xlink:href="#iconliebiao_black")
              span(:class="typeIndex===1 ? 'active' : ''" @click="changeType(1)")
                .icon(v-if="typeIndex===1")
                  svg.ali_icon(aria-hidden="true")
                    use(xlink:href="#iconzhexian_white")
                .icon(v-else)
                  svg.ali_icon(aria-hidden="true")
                    use(xlink:href="#iconzhexian_black")
          el-form-item
            el-button(type="primary" @click="exportData") 导出为Excel
      .table_list(v-if="typeIndex===0 && listItem.length>0")
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
          prop="time"
          label="时间")
          el-table-column(
          header-align="center"
          align="center"
          prop="value"
          :label="device_item ? device_item : '数据名称'")
      .chart_item(v-if="typeIndex===1 && listItem.length>0")
        ve-line(
        prevent-default
        :xAxis="xAxis"
        :yAxis ="yAxis"
        width="100%"
        height="100%"
        :series="series")
      Empty(v-if="listItem.length<= 0")
      .pagination.border_shadow(v-if="typeIndex===0")
        el-pagination(
        :background="false"
        :page-size="row"
        :total="total"
        :current-page.sync="page"
        @current-change="handleCurrentChange"
        layout="prev, pager, next,total,jumper")
</template>

<script>
  import Empty from '_components/empty'
  import { getDateChange } from '_common/util'
  import { equipmentSite,equipmentItems } from '_api/device_manage'
  import { histroyData,histroyDataExcel } from '_api/data_manage'
  import { regionCustomer,customerSite } from '_api/client_manage'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  export default {
    components: {
      Empty,
    },
    data(){
      return {
        getDateChange,
        typeIndex: 0,
        row: 10,
        page: 1,
        total: 0,
        loading: false,
        listItem: [],
        excelList: [],
        customerList: [],
        siteSearchList: [],
        equipmentSearchList: [],
        itemsSearchList: [],
        xData: [],
        yData: [],
        searchItem: {
          startTime: null,
          endTime: null,
        },
        device_item: '',
      }
    },
    mounted() {
      this.initData()
    },
    methods: {
      initData() {
        regionCustomer({},'get').then((res) => {
          if(res.data.code === 200){
            this.loading = false
            this.customerList = res.data.data
          }else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.loading = false;
          this.$message.error('获取数据失败')
        })
      },
      changeSearchCustomer(){
        if(this.searchItem.site_id){
          this.searchItem.site_id = ''
        }
        if(this.searchItem.equipment_id){
          this.searchItem.equipment_id = ''
        }
        this.customer_id = this.searchItem.customer_id
        if(this.customer_id){
          customerSite({},'get',this.customer_id).then((res) => {
            if(res.data.code === 200){
              this.loading = false
              this.siteSearchList = res.data.data.list
            }else {
              this.$message.error(res.data.msg)
            }
          }).catch(() => {
            this.loading = false;
            this.$message.error('获取数据失败')
          })
        }
      },
      changeSearchSite(){
        if(this.searchItem.equipment_id){
          this.searchItem.equipment_id = ''
        }
        this.site_id = this.searchItem.site_id
        if(this.site_id){
          equipmentSite({},'get',this.site_id).then((res) => {
            if(res.data.code === 200){
              this.loading = false
              this.equipmentSearchList = res.data.data
            }else {
              this.$message.error(res.data.msg)
            }
          }).catch(() => {
            this.loading = false;
            this.$message.error('获取数据失败')
          })
        }
      },
      changeSearchEquipment(){
        this.equipment_id = this.searchItem.equipment_id
        if(this.equipment_id){
          equipmentItems({},'get',this.equipment_id).then((res) => {
            if(res.data.code === 200){
              this.loading = false
              this.itemsSearchList = res.data.data
            }else {
              this.$message.error(res.data.msg)
            }
          }).catch(() => {
            this.loading = false;
            this.$message.error('获取数据失败')
          })
        }
      },
      getHistoryData() {
        this.loading = true
        let params = {
          customer_id: this.searchItem.customer_id,
          site_id: this.searchItem.site_id,
          device_id: this.searchItem.equipment_id,
          device_item_id: this.searchItem.equipment_item,
          start_time: getDateChange(this.searchItem.startTime),
          end_time: getDateChange(this.searchItem.endTime),
          page: this.page,
          row: this.row
        }
        histroyData(params, 'get').then((res) => {
          if(res.data.code === 200){
            this.loading = false
            this.listItem = res.data.data.list
            this.device_item = res.data.data.list[0].device_item
            this.total = res.data.data.total
            this.listItem.forEach((item) => {
              this.xData.push(item.time)
              this.yData.push(item.value)
            })
            this.xAxis = {
              type: 'category',
              data: this.xData
            },
              this.yAxis = {
                type: 'value'
              },
              this.series = [{
                data: this.yData,
                type: 'line'
              }]
          }else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.loading = false;
          this.$message.error('获取数据失败')
        })
      },
      searchBtnClick(){
        this.xData = []
        this.yData = []
        if(!this.searchItem.customer_id || !this.searchItem.site_id || !this.searchItem.equipment_id || !this.searchItem.equipment_item || !this.searchItem.startTime || !this.searchItem.endTime){
          this.$message.error('请完善筛选条件')
          return
        }
        this.getHistoryData()
      },
      resetClick(){
        this.searchItem = {}
        this.listItem = []
        this.excelList = []
        this.total = 0
      },
      changeType(index){
        this.typeIndex = index
        if(this.typeIndex===1 && this.listItem.length===0){
          this.$message.error('暂无图表数据')
          return
        }
      },
      exportExcell(data) {
        let ws = XLSX.utils.aoa_to_sheet(data)
        let wb = XLSX.utils.book_new()
        wb.SheetNames.push('sheet1')
        wb.Sheets['sheet1'] = ws
        // wb.row = true;// 转换成excel时，使用原始格式
        let wopts = { bookType: 'xlsx', bookSST: false, type: 'array' }
        let wbout = XLSX.write(wb, wopts)
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '历史数据.xlsx')
      },
      exportData(){
        if(!this.searchItem.customer_id || !this.searchItem.site_id || !this.searchItem.equipment_id || !this.searchItem.equipment_item || !this.searchItem.startTime || !this.searchItem.endTime){
          this.$message.error('请完善筛选条件')
          return
        }
        let params = {
          customer_id: this.searchItem.customer_id,
          site_id: this.searchItem.site_id,
          device_id: this.searchItem.equipment_id,
          device_item_id: this.searchItem.equipment_item,
          start_time: getDateChange(this.searchItem.startTime),
          end_time: getDateChange(this.searchItem.endTime),
          page: this.page,
          row: this.row
        }
        histroyDataExcel(params, 'get').then((res) => {
          if(res.data.code === 200){
            this.loading = false
            this.excelList = [res.data.data.title,...res.data.data.list]
            if(!res.data.data.list.length){
              this.$message.error('暂无导出数据')
              return
            }
            this.exportExcell(this.excelList)
          }else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.loading = false;
          this.$message.error('获取数据失败')
        })
        if(!this.excelList.length){
          this.$message.error('暂无导出数据')
          return
        }
      },
      handleCurrentChange(){
        this.getHistoryData()
      },
    },
  }
</script>

<style scoped lang="stylus">
  .data_history
    wh 100% 100%
    display flex
    padding 30px 30px 12px
    .menu_box
      display flex
      flex 1
      flex-direction column
      .search_item
        display flex
        flex-direction column
        background #fff
        margin-bottom 10px
        padding 22px 30px 0px 30px
        min-width 1430px
      .table_list
        display flex
        flex-direction column
        flex 1
        overflow-y scroll
      .chart_item
        flex-direction column
        flex 1
        background #fff
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
</style>
<style lang="stylus">
  .el-table
    border 1px solid #DBE3E8
    box-shadow 0px 0px 5px 0px rgba(219, 227, 232, 1)
    border-radius 2px
  .el-table th
    color #333333
    background rgba(246,248,249,0.45)

  .el-form-item__label
    fsc 16px #666666
    display flex
  .button_item
    .el-form-item__content
      display flex
      flex-direction row
      align-items center
      .tab_button
        display flex
        flex-direction row
        margin-right 30px
        span
          wh 54px 40px
          display flex
          align-items center
          justify-content center
          border 1px solid #C0C0C0
          &.active
            border-color #19CCAE
            background #19CCAE
          &:first-child
            border-right 0
            border-radius 4px 0px 0px 4px
          &:last-child
            border-left 0
            border-radius 0px 4px 4px 0px
          .icon
            display flex
            wh 18px 16px
</style>
