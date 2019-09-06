<template lang="pug">
  .data_add.w1200.mgauto
    .menu_box
      .title_box
        .title
          el-breadcrumb(separator-class="el-icon-arrow-right")
            el-breadcrumb-item(:to="{ path: '/data/analyse' }") 实时数据
            el-breadcrumb-item 新增数据
      .table_list(v-if="listItem.length")
        el-table(:data="listItem" v-loading="loading" )
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
          prop="unit"
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
          el-table-column(
          header-align="center"
          align="center"
          prop="option"
          label="操作")
            template(slot-scope="scope")
              el-row.center(:gutter="20")
                .checkBox(:class="scope.row.isChecked ? 'checked' : ''" @click="checkData(scope.$index,scope.row.isChecked)")
      Empty(v-else)
      .button_item
        button.save(@click="saveClick") 保存
        button.cancel(@click="cancelClick") 取消
</template>

<script>
  import Empty from '_components/empty'
  import { analysisRealtimeItems } from '_api/data_manage'

  export default {
    components: {
      Empty,
    },
    data() {
      return {
        loading: false,
        isChecked: false,
        listItem: [],
        addItem: {},
        addList: [],
        site_id: this.$route.query.site_id,
        site_name: this.$route.query.site_name,
      }
    },
    mounted() {
      this.initData()
    },
    methods: {
      initData() {
        this.getListData()
      },
      getListData() {
        this.loading = true
        analysisRealtimeItems({ site_id: this.site_id }, 'get').then((res) => {
          if (res.data.code === 200) {
            this.loading = false
            this.listItem = res.data.data
            this.listItem.forEach((item) => {
              if(item.check === '1'){
                item.isChecked = true
              }else {
                item.isChecked = false
              }
            })
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.loading = false
          this.$message.error('获取数据失败')
        })
      },
      checkData(index, isChecked) {
        this.listItem.forEach((item, indexs) => {
          if (index === indexs) {
            this.$set(this.listItem, indexs, Object.assign(item, { isChecked: !isChecked }))
          }
        })
      },
      saveClick() {
        this.listItem.forEach((item) => {
          if (item.isChecked) {
            this.addItem = {
              device_id: item.device_id,
              name: item.name,
            }
            this.addList.push(this.addItem)
          }
        })
        let params = {
          data: this.addList
        }
        analysisRealtimeItems(params, 'put',`?site_id=${this.site_id}`).then((res) => {
          if (res.data.code === 200) {
            this.loading = false
            this.$router.go(-1)
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.loading = false
          this.$message.error('获取数据失败')
        })
      },
      cancelClick() {
        this.$router.go(-1)
      },

    },
  }
</script>

<style scoped lang="stylus">
  .data_add
    wh 100% 100%
    display flex
    padding 30px 30px 12px
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
          .add_data_addr
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
      .button_item
        display flex
        flex-direction row
        padding 20px 30px
        background #fff
        margin-top 10px
        button
          display flex
          wh 140px 34px
          align-items center
          justify-content center
          fsc 16px #fff
          border-radius 4px
          &.save
            background #1E9AFF
            margin-right 20px
          &.cancel
            background #B8C5D0
</style>
<style lang="stylus">
  .el-tabs__header
    background #fff

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

  .el-breadcrumb span
    fsc 16px #666666
</style>
