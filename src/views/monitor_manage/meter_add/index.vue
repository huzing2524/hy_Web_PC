<template lang="pug">
  .meter_add.fbox
    .header
      el-breadcrumb(separator-class="el-icon-arrow-right")
        el-breadcrumb-item(:to="{ path: '/data/analyse' }") 数据看板
        el-breadcrumb-item 添加数据看板
    .content.fbox
      .left_box
        .title 实时预览
        .meter_box
          p {{chartName}}
          .column_box
            Column(v-show="styleIndex === 0")
            Lines(v-show="styleIndex === 1")
            ColumnB(v-show="styleIndex === 2")
            Pie(v-show="styleIndex === 3")
      .right_box
        .info
          .name
            .title 看板名称
            el-input(placeholder="填写看板名称" v-model="chartName")
          .date
            .title 时间单位
            .date_box
              .item(:class="timeIndex === 0 ? 'active' : ''" @click="timeOptions(0)") 分
              .item(:class="timeIndex === 1 ? 'active' : ''" @click="timeOptions(1)") 时
              .item(:class="timeIndex === 2 ? 'active' : ''" @click="timeOptions(2)") 天
        .style_select
          .title 看板样式
          .style_list
            .item(:class="styleIndex === 0 ? 'checked' : ''" @click="styleOptions(0)")
              .icon(v-if="styleIndex === 0")
                svg.ali_icon(aria-hidden="true")
                  use(xlink:href="#iconzhu_white")
              .icon(v-else)
                svg.ali_icon(aria-hidden="true")
                  use(xlink:href="#iconzhu_blue")
              .info
                p 柱状图
                p 单组数据多个时间段
            .item(:class="styleIndex === 1 ? 'checked' : ''" @click="styleOptions(1)")
              .icon(v-if="styleIndex === 1")
                svg.ali_icon(aria-hidden="true")
                  use(xlink:href="#iconzhe_white_px")
              .icon(v-else)
                svg.ali_icon(aria-hidden="true")
                  use(xlink:href="#iconzhe_blue_px")
              .info
                p 折线图
                p 单组数据多个时间段
          .style_list
            .item(:class="styleIndex === 2 ? 'checked' : ''" @click="styleOptions(2)")
              .icon(v-if="styleIndex === 2")
                svg.ali_icon(aria-hidden="true")
                  use(xlink:href="#icontiao_white")
              .icon(v-else)
                svg.ali_icon(aria-hidden="true")
                  use(xlink:href="#icontiao_blue")
              .info
                p 条形图
                p 多组数据单个时间段
            .item(:class="styleIndex === 3 ? 'checked' : ''" @click="styleOptions(3)")
              .icon(v-if="styleIndex === 3")
                svg.ali_icon(aria-hidden="true")
                  use(xlink:href="#iconbing_white")
              .icon(v-else)
                svg.ali_icon(aria-hidden="true")
                  use(xlink:href="#iconbing_blue")
              .info
                p 饼图
                p 多组数据单个时间段
        .data_select
          .title 选择监控数据
          el-table.border_side(:data="deviceItems"
          height="250"
          style="width: 100%")
            el-table-column(
            header-align="center"
            align="center"
            label="序号")
              template(slot-scope="scope")
                span {{scope.$index+1}}
            el-table-column(
            header-align="center"
            align="center"
            prop="name"
            label="数据名称")
            el-table-column(
            header-align="center"
            align="center"
            prop="type"
            label="数据类型")
            el-table-column(
            header-align="center"
            align="center"
            prop="unit"
            label="单位")
            el-table-column(
            header-align="center"
            align="center"
            prop="device_name"
            label="所属设备")
            el-table-column(
            header-align="center"
            align="center"
            prop="address"
            label="选择")
              template(slot-scope="scope")
                el-row.center(:gutter="20")
                  .checkBox(:class="scope.row.isChecked ? 'checked' : ''" @click="checkData(scope.$index,scope.row.isChecked)")
        .btn_box
          el-button(type="primary" style="width: 140px;" @click="saveClick") 保存
          el-button(type="info" style="width: 140px;" @click="deleteClick" v-if="$route.query.chart_type") 删除
          el-button(type="info" style="width: 140px;" @click="cancelClick") 取消
</template>

<script>
  import Bus from '@/bus'
  import Column from '_components/chart/column'
  import ColumnB from '_components/chart/column_b'
  import Pie from '_components/chart/pie'
  import Lines from '_components/chart/line'
  import { ChartDeviceItems, Chart } from '_api/monitor'
  export default {
    components: {
      Column,
      ColumnB,
      Pie,
      Lines,
    },
    data() {
      return {
        timeIndex: 0,
        styleIndex: 0,
        chartName: '',
        addItem: {},
        addList: [],
        deviceItems: [],
      }
    },
    mounted() {
      if (this.$route.query.chart_type) {
        this.styleOptions(parseInt(this.$route.query.chart_type))
        this.chartName = this.$route.query.name
      } else {
        this.styleOptions(0)
      }
      this.getChartDeviceItems()
    },
    methods: {
      timeOptions(index) {
        this.timeIndex = index
      },
      styleOptions(index) {
        this.styleIndex = index
        if (this.styleIndex === 0) {
          Bus.$emit('column', {
            width: 314,
            height: 300,
          })
        } else if (this.styleIndex === 1) {
          Bus.$emit('line', {
            width: 314,
            height: 300,
          })
        } else if (this.styleIndex === 2) {
          Bus.$emit('column_b', {
            width: 314,
            height: 300,
          })
        } else if (this.styleIndex === 3) {
          Bus.$emit('pie', {
            width: 314,
            height: 300,
          })
        }
      },
      getChartDeviceItems() {
        // ChartDeviceItems({}, 'get', this.styleIndex + '').then()
        ChartDeviceItems(
          {
            customer_id: this.$route.query.customer_id || '',
            site_id: this.$route.query.site_id || '',
          },
          'get',
        )
          .then((res) => {
            if (res.data.code === 200) {
              this.loading = false
              this.deviceItems = res.data.data
              this.deviceItems.forEach((item) => {
                item.isChecked = false
              })
            } else {
              this.$message.error(res.data.msg)
            }
          })
          .catch(() => {
            this.loading = false
            this.$message.error('获取数据失败')
          })
      },
      checkData(index, isChecked) {
        this.deviceItems.forEach((item, indexs) => {
          if (index === indexs) {
            this.$set(
              this.deviceItems,
              indexs,
              Object.assign(item, { isChecked: !isChecked }),
            )
          }
        })
      },
      saveClick() {
        if (!this.chartName) {
          this.$message.warning('请输入看板名称')
          return
        }
        this.deviceItems.forEach((item) => {
          if (item.isChecked) {
            this.addItem = {
              device_id: item.device_id,
              name: item.name,
            }
            this.addList.push(this.addItem)
          }
        })
        if (this.addList.length <= 0) {
          this.$message.warning('请选择监控数据')
          return
        }
        let params = {
          name: this.chartName,
          type: '' + this.styleIndex,
          time_type: '' + this.timeIndex,
          items: this.addList,
        }
        console.log(params)
        if (this.$route.query.chart_type) {
          Chart(
            params,
            'put',
            `${this.$route.query.id}/?customer_id=${this.$route.query.customer_id}&site_id=${this.$route.query.site_id}`,
          ).then((res) => {
            if (res.data.code === 200) {
              this.loading = false
              this.$message.success('修改成功')
              this.$router.go(-1)
            } else {
              this.$message.error(res.data.msg)
            }
          })
          return
        }
        Chart(
          params,
          'post',
          `?customer_id=${this.$route.query.customer_id}&site_id=${this.$route.query.site_id}`,
        ).then((res) => {
          if (res.data.code === 200) {
            this.loading = false
            this.$message.success('添加成功')
            this.$router.go(-1)
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      cancelClick() {
        this.$router.go(-1)
      },
      deleteClick() {
        Chart(
          {},
          'delete',
          `${this.$route.query.id}`
        ).then((res) => {
          if (res.data.code === 200) {
            this.loading = false
            this.$message.success('删除成功')
            this.$router.go(-1)
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
    },
  }
</script>

<style lang="stylus" scoped>
  .meter_add
    padding 30px 30px 12px

    .header
      bgf()
      height 70px
      display flex
      align-items center
      padding 0 30px

    >.content
      margin-top 10px
      padding 30px 84px 0 100px
      bgf()
      flex 1
      display flex
      flex-direction row

      .left_box
        >.title
          fsc 22px #333

        .meter_box
          wh 554px 380px
          box-shadow 0px 0px 12px 0px rgba(197, 218, 235, 1)
          border-radius 2px
          margin-top 20px
          display flex
          flex-direction column
          justify-content center
          align-items center

          .column_box
            width 414px
            height 300px

      .right_box
        flex 1
        margin-left 100px

        .title
          fsc 20px #333
          margin-bottom 10px

        >.info
          display flex

          .name
            margin-right 40px

          .date
            .date_box
              wh 125px 34px
              border 1px solid rgba(192, 192, 192, 1)
              display flex
              border-radius 4px

              .item
                flex 1
                fct()
                border-right 1px solid #C0C0C0

                &.active
                  bg #1E9AFF
                  color #FFF
                  border-right 1px solid #1E9AFF

                &:nth-of-type(3)
                  border none

        .style_select
          margin-top 30px

          .style_list
            display flex

            &:nth-of-type(3)
              margin-top 20px

            .item
              box-shadow 0px 0px 6px 0px rgba(0, 83, 150, 0.55)
              border-radius 2px
              wh 230px 68px
              display flex
              align-items center
              justify-content space-between
              padding 0 20px

              &.checked
                background #1E9AFF

                .info
                  p
                    color #fff

              &:nth-of-type(2)
                margin-left 20px

              .icon
                wh 40px 40px

              .info
                p
                  &:nth-of-type(1)
                    font-size 18px

                  &:nth-of-type(2)
                    font-size 12px

        .data_select
          margin-top 30px

        .btn_box
          margin-top 30px
</style>
<style lang="stylus">
  .border_side
    border-left 1px solid #EBEEF5
    border-right 1px solid #EBEEF5

    thead
      color #333

      tr
        th
          background-color rgba(246, 248, 249, 0.45)

  .center
    display flex
    justify-content center

    .checkBox
      width 16px
      height 16px
      background #fff
      border 1px solid #C0C0C0
      border-radius 2px

      &.checked
        border-color #1E9AFF
        background #1E9AFF
</style>
