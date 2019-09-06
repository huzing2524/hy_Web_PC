<template lang="pug">
  .data_analyse.w1200.mgauto
    .menu_box
      .tab_item
        el-tabs(v-model="activeName" @tab-click="handleClick")
          el-tab-pane(label="数据看板" name="first")
            .search_item
              el-form.border_top(:inline="true")
                el-form-item(label="客户名称")
                  el-select(v-model="searchItem.customer_id" placeholder="选择客户名称" @change="changeSearchCustomer" clearable)
                    el-option(v-for="item in customerList" :key="item.customer_id" :label="item.name_cn" :value="item.customer_id")
                el-form-item(label="站点")
                  el-select(v-model="searchItem.site_id" placeholder="选择站点" clearable @change="changeSite")
                    el-option(v-for="item in siteSearchList" :key="item.id" :label="item.site_name" :value="item.id")
            .chart_item
              .item
                .icon
                  svg.ali_icon(aria-hidden="true")
                    use(xlink:href="#iconbianji")
                .title 污水处理量
                .column_box
                  Column
              .item
                .icon
                  svg.ali_icon(aria-hidden="true")
                    use(xlink:href="#iconbianji")
                .title 进出口压力
                .column_box
                  Pie
              .item
                .icon
                  svg.ali_icon(aria-hidden="true")
                    use(xlink:href="#iconbianji")
                .title 水箱运行频率
                .column_box
                  ColumnB
              .item
                .icon
                  svg.ali_icon(aria-hidden="true")
                    use(xlink:href="#iconbianji")
                .title 有害物质收集
                .column_box
                  Lines
              .item(@click="toDataBoard")
                .title
                  span 添加数据看板
                  p 以图表的形式展现数据，更直观也更美观
                  .add
                    svg.ali_icon(aria-hidden="true")
                      use(xlink:href="#iconadd")
              .item(@click="toDataPredict")
                .predict 预测
                .title
                  span 添加预测看板
                  p 预测某个数据未来的数值
                  .add
                    svg.ali_icon(aria-hidden="true")
                      use(xlink:href="#iconadd")
          el-tab-pane(label="实时数据" name="second")
            .search_item
              el-form.border_top(:inline="true")
                el-form-item(label="客户名称")
                  el-select(v-model="searchItem.customer_id" placeholder="选择客户名称"  @change="changeSearchCustomer" clearable)
                    el-option(v-for="item in customerList" :key="item.customer_id" :label="item.name_cn" :value="item.customer_id")
                el-form-item(label="站点")
                  el-select(v-model="searchItem.site_id" placeholder="选择站点" clearable @change="changeSearchSite")
                    el-option(v-for="item in siteSearchList" :key="item.id" :label="item.site_name" :value="item.id")
                el-form-item
                  el-button(type="primary" @click="addDataClick") 编辑数据
            .data_item
              .item(v-for="(item,index) in (realtimeData.length > 0 ? realtimeData : realtimeDeafultData)" :key="index" @click="toDetailClick(item)")
                span {{item.value}}
                p {{item.name}}
</template>

<script>
  import Bus from '@/bus'
  import Column from '_components/chart/column'
  import ColumnB from '_components/chart/column_b'
  import Pie from '_components/chart/pie'
  import Lines from '_components/chart/line'
  import { regionCustomer, customerSite } from '_api/client_manage'
  import { analysisChartMain, analysisChartData, analysisRealtime } from '_api/data_manage'

  export default {
    components: {
      Column,
      ColumnB,
      Pie,
      Lines,
    },
    data() {
      return {
        activeName: 'first',
        index: '0',
        loading: false,
        site_name: '',
        customer_id: '',
        site_id: '',
        searchItem: {
          startTime: null,
          endTime: null,
        },
        customerList: [],
        siteSearchList: [],
        realtimeData: [],
        realtimeDeafultData: [
          {
            device_id: '300218120705',
            name: 'I0.0',
            value: '0',
          },
          {
            device_id: '300218120705',
            name: 'I0.1',
            value: '1',
          },
          {
            device_id: '300218120705',
            name: 'I0.2',
            value: '1',
          },
          {
            device_id: '300218120705',
            name: 'I0.3',
            value: '0',
          },
          {
            device_id: '300218120705',
            name: 'I0.4',
            value: '0',
          },
          {
            device_id: '300218120705',
            name: 'I0.5',
            value: '1',
          },
          {
            device_id: '300218120705',
            name: 'I0.6',
            value: '0',
          },
          {
            device_id: '300218120705',
            name: 'I0.3',
            value: '0',
          },
          {
            device_id: '300218120705',
            name: 'I0.7',
            value: '0',
          },
          {
            device_id: '300218120705',
            name: 'I0.8',
            value: '0',
          },
          {
            device_id: '300218120705',
            name: 'I0.9',
            value: '0',
          },
          {
            device_id: '300218120705',
            name: 'I0.10',
            value: '1',
          },
          {
            device_id: '300218120705',
            name: 'I0.11',
            value: '0',
          },
          {
            device_id: '300218120705',
            name: 'I0.12',
            value: '1',
          },
          {
            device_id: '300218120705',
            name: 'I0.3',
            value: '1',
          },
          {
            device_id: '300218120705',
            name: 'I0.13',
            value: '1',
          },
          {
            device_id: '300218120705',
            name: 'I0.14',
            value: '0',
          },
          {
            device_id: '300218120705',
            name: 'I0.15',
            value: '1',
          },
          {
            device_id: '300218120705',
            name: 'I0.16',
            value: '0',
          },
          {
            device_id: '300218120705',
            name: 'I0.17',
            value: '0',
          },
          {
            device_id: '300218120705',
            name: 'I0.18',
            value: '1',
          },
          {
            device_id: '300218120705',
            name: 'I0.19',
            value: '0',
          },
          {
            device_id: '300218120705',
            name: 'I0.20',
            value: '0',
          },
          {
            device_id: '300218120705',
            name: 'I0.21',
            value: '1',
          },
          {
            device_id: '300218120705',
            name: 'I0.22',
            value: '0',
          },
          {
            device_id: '300218120705',
            name: 'I0.23',
            value: '0',
          },
          {
            device_id: '300218120705',
            name: 'I0.24',
            value: '0',
          },
          {
            device_id: '300218120705',
            name: 'I0.25',
            value: '1',
          },
        ],
        chartListItem: [],
        chartDataItem: {},
        chartList: [],
      }
    },
    mounted() {
      Bus.$emit('column', {
        height: 320,
      })

      Bus.$emit('pie', {
        height: 320,
      })

      Bus.$emit('line', {
        height: 320,
      })
      this.initData()
    },
    methods: {
      initData() {
        regionCustomer({}, 'get').then((res) => {
          if (res.data.code === 200) {
            this.loading = false
            this.customerList = res.data.data
          }
        }).catch(() => {
          this.loading = false
          this.$message.error('获取数据失败')
        })
        this.handleClick({ index: '0' })
      },
      getChartMain() {
        analysisChartMain({
          customer_id: this.searchItem.customer_id,
          site_id: this.searchItem.site_id,
        }, 'get').then((res) => {
          if (res.data.code === 200) {
            this.loading = false
            this.chartListItem = res.data.data
            this.chartListItem.forEach((item) => {
              analysisChartData({}, 'get', item.id).then((res) => {
                if (res.data.code === 200) {
                  this.loading = false
                  this.chartDataItem = res.data.data
                  this.chartDataItem.name = item.name
                  this.chartDataItem.type = item.type
                  this.chartDataItem.chart_type = item.chart_type
                  this.chartList.push(this.chartDataItem)
                } else {
                  this.$message.error(res.data.msg)
                }
              }).catch(() => {
                this.loading = false
                this.$message.error('获取数据失败')
              })
            })
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.loading = false
          this.$message.error('获取数据失败')
        })
      },
      getRealtimeData() {
        this.loading = true
        let params = {
          customer_id: this.searchItem.customer_id,
          site_id: this.searchItem.site_id,
        }
        analysisRealtime(params, 'get').then((res) => {
          if (res.data.code === 200) {
            this.loading = false
            this.realtimeData = res.data.data
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.loading = false
          this.$message.error('获取数据失败')
        })
      },
      changeSearchCustomer() {
        if (this.searchItem.customer_id === '') {
          this.searchItem = {}
        }
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
      changeSearchSite() {
        if (this.searchItem.site_id) {
          this.getRealtimeData()
          this.siteSearchList.forEach((item) => {
            if (item.id === this.searchItem.site_id) {
              this.site_name = item.site_name
            }
          })
        }
      },
      changeSite() {
        if (this.searchItem.site_id) {
          this.getChartMain()
        }
      },
      toDataBoard() {
        if (!this.searchItem.customer_id || !this.searchItem.site_id) {
          this.$message.error('请完善筛选条件')
          return
        }
        this.$router.push(`/data/board?customer_id=${this.searchItem.customer_id}&site_id=${this.searchItem.site_id}`)
      },
      toDataPredict() {
        if (!this.searchItem.customer_id || !this.searchItem.site_id) {
          this.$message.error('请完善筛选条件')
          return
        }
        this.$router.push(`/data/predict?customer_id=${this.searchItem.customer_id}&site_id=${this.searchItem.site_id}`)
      },
      addDataClick() {
        if (!this.searchItem.customer_id || !this.searchItem.site_id) {
          this.$message.error('请完善筛选条件')
          return
        }
        this.$router.push(`/data/add?site_id=${this.searchItem.site_id}&site_name=${this.site_name}`)
      },
      toDetailClick(item) {
        this.$router.push(`/data/detail?device_id=${item.device_id}&name=${item.name}&site_name=${this.site_name}`)
      },
      handleClick(tab) {
        this.searchItem = {}
        this.index = tab.index || '0'
        // let indexs = this.index || tab.index
        this.loading = true
        // if (indexs === '0') {
        //   // this.initData()
        // }
        // if(indexs === '1'){
        //   this.initData()
        // }
      },
    },
  }
</script>

<style scoped lang="stylus">
  .data_analyse
    wh 100% 100%
    display flex
    padding 30px 30px 12px
    .menu_box
      display flex
      flex 1
      flex-direction column
      .tab_item
        display flex
        flex-direction column
        overflow-y scroll
        .search_item
          background #fff
          padding 0px 30px
          margin-bottom 10px
          border 1px solid #DBE3E8
          box-shadow 0px 0px 5px 0px rgba(219, 227, 232, 1)
          border-radius 2px
          border-top 0
        .chart_item
          display flex
          min-width 1200px
          display flex
          flex-wrap wrap
          .item
            display flex
            flex-direction column
            width 32.66%
            height 380px
            background #fff
            margin-bottom 10px
            position relative
            &:nth-of-type(3n-1)
              margin-left 1%
              margin-right 1%
            .predict
              position absolute
              left 0
              top 0
              wh 64px 28px
              line-height 28px
              background #AC6CFF
              fsc 14px #fff
              text-align center
            .icon
              position absolute
              wh 20px 20px
              right 12px
              top 12px
            .title
              display flex
              flex-direction column
              align-items center
              margin-top 10px
              span
                display flex
                fsc 18px #333333
                margin-bottom 4px
              p
                display flex
                fsc 14px #999999
                margin-bottom 80px
              .add
                display flex
                wh 80px 80px
            .column_box
              padding 0 10px
              width 100%
              height 100%
              margin-top 20px
        .data_item
          display flex
          min-width 1200px
          display flex
          flex-wrap wrap
          .item
            display flex
            flex-direction column
            width 15.83%
            height 140px
            background #fff
            margin-bottom 10px
            justify-content center
            align-items center
            margin-right 1%
            &:nth-of-type(6n)
              margin-right 0
            span
              fsc 24px #333333
              margin-bottom 14px
            p
              fsc 16px #666666
</style>
<style lang="stylus">
  .el-tabs__header
    background #fff
    padding 14px 0 22px 30px
    margin-bottom 0

  .el-tabs__nav-wrap::after
    height 0

  .border_top
    padding-top 24px
    border-top 1px solid #B6BDC2

  .el-table th
    color #333333
    background rgba(246,248,249,0.45)

  .el-form-item__label
    fsc 16px #666666
    display flex

  .el-tabs__header
    border 1px solid #DBE3E8
    box-shadow 0px 0px 5px 0px rgba(219, 227, 232, 1)
    border-radius 2px
    border-bottom 0

  .el-form-item__content
    flex 1
    text-align left

  .el-select
    width 100%

  .el-tabs__item
    fsc 20px #333333
</style>
