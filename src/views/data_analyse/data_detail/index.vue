<template lang="pug">
  .data_detail.w1200.mgauto
    .menu_box
      .title_box
        .title
          el-breadcrumb(separator-class="el-icon-arrow-right")
            el-breadcrumb-item(:to="{ path: '/data/analyse' }") 实时数据
            el-breadcrumb-item 数据详情
        .info
          .search_item
            el-form(:inline="true")
              el-form-item(label="开始时间")
                el-date-picker(
                v-model="searchItem.start_time"
                type="datetime"
                placeholder="选择开始时间"
                )
              el-form-item(label="结束时间")
                el-date-picker(
                v-model="searchItem.end_time"
                type="datetime"
                placeholder="选择结束时间"
                )
              el-form-item
                el-button(type="primary" @click="searchBtnClick") 搜索
              el-form-item
                el-button(type="info" @click="resetClick") 重置
              el-form-item
                el-button(type="primary" @click="exportDataClick") 导出为Excel
      .table_list(v-if="listItem.length")
        el-table(:data="listItem" v-loading="loading" )
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
          label="水箱状态")
          el-table-column(
          header-align="center"
          align="center"
          prop="order_state"
          label="单位")
          el-table-column(
          header-align="center"
          align="center"
          prop="site_name"
          label="站点")
            template(slot-scope="scope")
              span {{site_name}}
          el-table-column(
          header-align="center"
          align="center"
          prop="device_name"
          label="所属设备")
      Empty(v-else)
      .pagination
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
  import { analysisRealtimeItems, analysisItemsExcel } from '_api/data_manage'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'

  export default {
    components: {
      Empty,
    },
    data() {
      return {
        getDateChange,
        device_id: this.$route.query.device_id,
        name: this.$route.query.name,
        site_name: this.$route.query.site_name,
        row: 10,
        page: 1,
        total: 0,
        loading: false,
        listItem: [],
        excelList: [],
        searchItem: {
          start_time: null,
          end_time: null,
        },

      }
    },
    mounted() {

    },
    methods: {
      getDataList() {
        this.loading = true
        let params = {
          device_id: this.device_id,
          start_time: getDateChange(this.searchItem.start_time),
          end_time: getDateChange(this.searchItem.end_time),
          page: this.page,
          row: this.row,
        }
        analysisRealtimeItems(params, 'get', this.name).then((res) => {
          if (res.data.code === 200) {
            this.loading = false
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
      searchBtnClick() {
        if (!this.searchItem.start_time || !this.searchItem.end_time) {
          this.$message.error('请完善筛选条件')
          return
        }
        this.getDataList()
      },
      resetClick() {
        this.searchItem = {}
        this.listItem = []
        this.excelList = []
        this.total = 0
      },
      exportExcell(data) {
        let ws = XLSX.utils.aoa_to_sheet(data)
        let wb = XLSX.utils.book_new()
        wb.SheetNames.push('sheet1')
        wb.Sheets['sheet1'] = ws
        // wb.row = true;// 转换成excel时，使用原始格式
        let wopts = { bookType: 'xlsx', bookSST: false, type: 'array' }
        let wbout = XLSX.write(wb, wopts)
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '数据详情.xlsx')
      },
      exportDataClick() {
        if (!this.searchItem.start_time || !this.searchItem.end_time) {
          this.$message.error('请完善筛选条件')
          return
        }
        let params = {
          device_id: this.device_id,
          start_time: getDateChange(this.searchItem.start_time),
          end_time: getDateChange(this.searchItem.end_time),
          page: this.page,
          row: this.row,
        }
        analysisItemsExcel(params, 'get', this.name).then((res) => {
          if (res.data.code === 200) {
            this.loading = false
            this.excelList = [res.data.data.title,...res.data.data.list]
            if (!res.data.data.list.length) {
              this.$message.error('暂无导出数据')
              return
            }
            this.exportExcell(this.excelList)
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.loading = false
          this.$message.error('获取数据失败')
        })
      },
      handleCurrentChange() {
        this.getDataList()
      },

    },
  }
</script>

<style scoped lang="stylus">
  .data_detail
    wh 100% 100%
    display flex
    padding 30px 30px 12px 0px
    .menu_box
      display flex
      flex 1
      flex-direction column
      .title_box
        display flex
        flex-direction column
        background #fff
        margin-bottom 10px
        padding 0 30px
        .title
          display flex
          flex-direction row
          fsc 16px #333333
          padding 24px 0
          border-bottom 1px solid rgba(182, 189, 194, 0.5)
        .info
          display flex
          flex-direction row
          padding 24px 0
          fsc 16px #333333
          align-items center
          .name
            margin-right 120px
          .start
            display flex
            flex-direction row
            align-items center
            .tip
              margin-right 10px
            .switch
              display flex
              flex-direction row
              span
                display flex
                wh 54px 34px
                align-items center
                justify-content center
                fsc 16px #333333
                border 1px solid #C0C0C0
                border-radius 4px 0px 0px 4px
                &.active
                  border 1px solid #1E9AFF
                  background #1E9AFF
                  color #fff
                &:first-child
                  border-right 0px
                &:last-child
                  border-left 0px
                  border-radius 0px 4px 4px 0px
          .add_data_detailr
            display flex
            margin-left 30px
            button
              display flex
              align-items center
              justify-content center
              wh 120px 34px
              fsc 16px #fff
              background #1E9AFF
              border-radius 4px
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
              background #1E9AFF

  .el-tabs__header
    background #fff
    padding 14px 0 14px 30px
    margin-bottom 0

  .el-table th
    color #333333
    background rgba(246,248,249,0.45)

  .el-form-item__label
    display flex

  .el-form-item__content
    flex 1
    text-align left

  .el-select
    width 100%
</style>
