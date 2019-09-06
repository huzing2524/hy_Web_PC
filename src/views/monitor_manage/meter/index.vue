<template lang="pug">
  .meter.fbox
    .header
      p 地区
      .select
        el-select(v-model="value" placeholder="请选择")
          el-option(v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value")
      p 客户名称
      .select
        el-select(v-model="searchItem.customer_id" placeholder="选择客户名称" @change="changeSearchCustomer" clearable)
          el-option(v-for="item in customerList" :key="item.customer_id" :label="item.name_cn" :value="item.customer_id")
      p 站点
      .select
        el-select(v-model="searchItem.site_id" placeholder="选择站点" clearable @change="changeSite")
          el-option(v-for="item in siteSearchList" :key="item.id" :label="item.site_name" :value="item.id")
    .content(v-if="0" style="flex: 1;width: 100%;display: flex;flex-direction: column;overflow-y: scroll;-webkit-overflow-scrolling: touch;")
      img(src="./test.jpg")
    .content.fbox(v-else)
      .title
        .button
          el-button(type="primary" @click="selectImg") 上传工艺图
          input(type="file", accept="image/*", ref="imgInput", @change="selectedImg()")
        .icon
          svg.ali_icon(aria-hidden="true")
            use(xlink:href="#iconfullscreen")
      .line
      .com_name 深圳润迅科技
      .data_box
        .left_box
          ChartItem(v-for="(item, idx) in chartList" v-if="idx < 3" :chartData="item" v-on:modifyData="getModifyData(idx)" :key="idx")
          //- ChartItem(v-if="chartList[1]" :chartData="chartList[1]")
          //- ChartItem(v-if="chartList[2]" :chartData="chartList[2]")
          //- .item
          //-   .icon
          //-     svg.ali_icon(aria-hidden="true")
          //-       use(xlink:href="#iconbianji")
          //-   .title 水箱运行频率
          //-   .column_box
          //-     ColumnB
          //- .item
          //-   .icon
          //-     svg.ali_icon(aria-hidden="true")
          //-       use(xlink:href="#iconbianji")
          //-   .title 进出口压力
          //-   .column_box
          //-     Pie
        .right_box
          .big_img(:style="photoStyle")
          .bottom_box
            //- ChartItem(v-if="chartList[3]" :chartData="chartList[3]")
            //- ChartItem(v-if="chartList[4]" :chartData="chartList[4]")
            //- ChartItem(v-if="chartList[5]" :chartData="chartList[5]")
            ChartItem(v-for="(item, idx) in chartList" v-if="idx >= 3" :chartData="item" v-on:modifyData="getModifyData(idx)" :key="idx")
            //- .item
            //-   .icon
            //-     svg.ali_icon(aria-hidden="true")
            //-       use(xlink:href="#iconbianji")
            //-   .title 有害物质收集
            //-   .column_box
            //-     Lines
            //- .item
            //-   .icon
            //-     svg.ali_icon(aria-hidden="true")
            //-       use(xlink:href="#iconbianji")
            .item(@click="toAddChart")
              .title 添加数据看板
              .info 以图表的形式展现数据，更直观也更美观
              .add_icon
                svg.ali_icon(aria-hidden="true")
                  use(xlink:href="#iconadd")
</template>

<script>
  import { getDataUrl } from '_common/util'
  import lrz from 'lrz'
  import Bus from '@/bus'
  import ChartItem from '_components/chart'
  import Column from '_components/chart/column'
  import ColumnB from '_components/chart/column_b'
  import Pie from '_components/chart/pie'
  import Lines from '_components/chart/line'
  import { MainChart, ChartData, ChartImg } from '_api/monitor'
  import { regionCustomer, customerSite } from '_api/client_manage'

  export default {
    components: {
      ChartItem,
      Column,
      ColumnB,
      Pie,
      Lines,
    },
    data() {
      return {
        options: [],
        value: '',
        searchItem: {
          startTime: null,
          endTime: null,
        },
        customerList: [],
        siteSearchList: [],
        chartList: [],
        file: '',
        photoStyle: '',
        photoUrl: '',
      }
    },
    mounted() {
      this.getRegionCustomer()
      // Bus.$emit('column', {
      //   width: 300,
      //   height: 260,
      // })

      Bus.$emit('pie', {
        width: 300,
        height: 260,
      })

      Bus.$emit('line', {
        width: 300,
        height: 260,
      })
    },
    methods: {
      getMainChart() {
        MainChart()
      },
      getChartMain() {
        MainChart(
          {
            customer_id: this.searchItem.customer_id,
            site_id: this.searchItem.site_id,
          },
          'get',
        )
          .then((res) => {
            if (res.data.code === 200) {
              this.loading = false
              this.chartList = res.data.data.charts
              this.photoUrl = res.data.data.img
              this.setImgStyle(res.data.data.img)
            }
          })
          .catch(() => {
            this.loading = false
            this.$message.error('获取数据失败')
          })
      },
      getRegionCustomer() {
        regionCustomer({}, 'get')
          .then((res) => {
            if (res.data.code === 200) {
              this.loading = false
              this.customerList = res.data.data
            } else {
              this.$message.error(res.data.msg)
            }
          })
          .catch(() => {
            this.loading = false
            this.$message.error('获取数据失败')
          })
        this.handleClick({ index: '0' })
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
          customerSite({}, 'get', this.customer_id)
            .then((res) => {
              if (res.data.code === 200) {
                this.loading = false
                this.siteSearchList = res.data.data.list
              } else {
                this.$message.error(res.data.msg)
              }
            })
            .catch(() => {
              this.loading = false
              this.$message.error('获取数据失败')
            })
        }
      },
      handleClick(tab) {
        this.searchItem = {}
        this.index = tab.index || '0'
        // let indexs = this.index || tab.index
        this.loading = true
        // if (indexs === '0') {
        //
        // }
        // if(indexs === '1'){
        //
        // }
      },
      changeSite() {
        if (this.searchItem.site_id) {
          this.getChartMain()
        }
      },
      toAddChart() {
        if (!this.searchItem.customer_id || !this.searchItem.site_id) {
          this.$message.error('请完善筛选条件')
          return
        }
        this.$router.push(
          `/monitor/manage/meter_add?customer_id=${this.searchItem.customer_id}&site_id=${this.searchItem.site_id}`,
        )
      },
      getModifyData(idx) {
        console.log(this.chartList[idx])
        let idxData = this.chartList[idx]
        this.$router.push(
          `/monitor/manage/meter_add?customer_id=${this.searchItem.customer_id}&site_id=${this.searchItem.site_id}&id=${idxData.id}&chart_type=${idxData.chart_type}&name=${idxData.name}`,
        )
      },
      selectImg() {
        this.$refs.imgInput.click()
      },
      selectedImg() {
        if (this.$refs.imgInput.files[0]) {
          lrz(this.$refs.imgInput.files[0], { quality: 0.2 }).then((rst) => {
            this.setImgStyle()
            let reader = new FileReader()
            reader.onload = (e) => {
              getDataUrl(e.target.result, 690, 420)
                .then((dataurl) => {
                  this.setImgStyle(dataurl)
                })
                .catch(() => {})
            }
            this.file = rst.file
            reader.readAsDataURL(rst.file)
            console.log('>>>')
            this.uploadImg()
          })
        }
      },
      setImgStyle(dataUrl) {
        dataUrl = dataUrl ? dataUrl : ``
        let photoStyle = dataUrl
          ? `
                        background: url(${dataUrl}) no-repeat;
                        background-position:center;
                        background-size: 100%;
                        `
          : ``
        this.photoUrl = dataUrl
        this.photoStyle = photoStyle
      },
      uploadImg() {
        console.log(1)

        ChartImg(
          {
            img: this.file,
          },
          'post',
        ).then((res) => {
          console.log('>>>》')
          if (res.data.code === 200) {
            this.$message.success('添加成功')
          }
        })
      },
    },
  }
</script>

<style lang="stylus" scoped>
  .meter
    .header
      height 82px
      bgf()
      display flex
      align-items center
      padding 0 30px

      p
        fsc 16px #666
        margin-right 6px

      .select
        margin-right 30px

    .content
      margin-top 10px
      padding 0 30px
      bgf()

      >.title
        height 83px
        display flex
        align-items center
        justify-content space-between
        margin-top 20px

        .button
          input
            wh 1px 1px
            opacity 0

        .icon
          wh 28px 28px

      >.line
        height 1px
        margin 0 30px
        bg #B6BDC2

      .com_name
        fsc 30px #333
        text-align center
        margin 10px 0

      .data_box
        display flex

        .item
          wh 380px 300px
          margin 20px 10px
          box-shadow 0px 0px 14px 0px rgba(197, 218, 235, 0.8)
          border-radius 4px
          padding 12px
          position relative
          display flex
          flex-direction column
          align-items center

          >.icon
            wh 20px 20px
            position absolute
            right 12px
            top 12px

          .column_box
            wh 300px 260px

          >.title
            fsc 16px #333

          >.info
            fsc 12px #999999

          >.add_icon
            wh 60px 60px
            margin-top 60px

        .left_box
          >*:nth-of-type(1)
            margin-top 0

        .left_box, .right_box
          .big_img
            height 620px
            margin-left 10px
            fct()

          .bottom_box
            display flex
</style>