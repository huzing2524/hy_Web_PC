<template lang="pug">
    .map.fbox
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

        .map
            .title
                .icon
                    svg.ali_icon(aria-hidden="true")
                        use(xlink:href="#iconhezi_pt_black1")
                .info
                    span {{total}}台
                    p 盒子总数
                .icon
                    svg.ali_icon(aria-hidden="true")
                        use(xlink:href="#iconhezi_pt_blue")
                .info
                    span {{running}}台
                    p 运行中的盒子数
                .icon
                    svg.ali_icon(aria-hidden="true")
                        use(xlink:href="#iconhezi_pt_red")
                .info
                    span {{warning}}台
                    p 当前报警盒子数
                .icon
                    svg.ali_icon(aria-hidden="true")
                        use(xlink:href="#iconbaojing_pt")
                .info
                    span {{warn_msgs}}条
                    p 当前报警条数

            .map
                baidu-map.bm_view(ak="Q9SFeX3HFspDgjbj0lycKWXMpD4R6Iyb" center="中国" :zoom="5" :double-click-zoom="false" :scrollWheelZoom="true")
                    bm-marker(v-for="(d, index) in devices" :position="{lng: d.lng, lat: d.lat}" :icon="{url: d.icon, size: {width: 80, height: 80}}"
                    @click="infoWindowOpen(index)" :top="true")
                        bm-label(:content="d.devices" :zIndex="999" :labelStyle="{zIndex:99, background:'none',color:'#fff',border:'none', fontSize:'16px'}"
                        :offset="{width: offset_width, height: offset_height}")
                        bm-info-window(:show="d.show" @close="infoWindowClose(index)" :offset="{width: 10, height: -20}")
                            p 企业: {{d.customer_name}}
                            p 站点：{{d.site_name}}
                            p 站点位置：{{d.address}}
                            p 盒子数量：{{d.devices}}台
                            p 运行中盒子：{{d.running}}台
                            p 报警盒子：{{d.wanning}}台
                            p 报警条目：{{d.warn_msgs}}条

</template>

<script>
  import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
  import BmOverlay from 'vue-baidu-map/components/overlays/Overlay.vue'
  import BmMarker from 'vue-baidu-map/components/overlays/Marker.vue'
  import BmInfoWindow from 'vue-baidu-map/components/overlays/InfoWindow.vue'
  import BmLabel from 'vue-baidu-map/components/overlays/Label.vue'

  import { GetDevicesData } from '_api/monitor'
  import { regionCustomer, customerSite } from '_api/client_manage'

  export default {
    components: {
      BaiduMap,
      BmOverlay,
      BmMarker,
      BmInfoWindow,
      BmLabel,
    },
    data() {
      return {
        center1: '北京',
        devices: [],
        offset_width: 32,
        offset_height: 27,
        searchItem: {},
        value: '',
        customerList: [],
        siteSearchList: [],
        options: [],
        running: 0,
        warning: 0,
        warn_msgs: 0,
        total: 0,
      }
    },
    created() {
      // this.getData()
    },
    mounted() {
      this.getRegionCustomer()
    },
    methods: {
      infoWindowClose(index) {
        this.$set(this.devices, index, Object.assign(this.devices[index], { 'show': false }))
      },
      infoWindowOpen(index) {
        this.$set(this.devices, index, Object.assign(this.devices[index], { 'show': true }))
      },
      changeSite() {
        if (this.searchItem.site_id) {
          this.getData()
        }
      },
      getData() {
        GetDevicesData(
          {
            customer_id: this.searchItem.customer_id,
            site_id: this.searchItem.site_id,
          },
          'get',
        )
          .then((res) => {
            console.log(res)
            if (res.data.code === 200) {
              if (res.data.data.devices[0]) {
                // this.center1 = res.data.data.devices[0].location
              }
              this.total = res.data.data.total
              this.running = res.data.data.running
              this.warning = res.data.data.warning
              this.warn_msgs = res.data.data.warn_msgs
              this.devices = res.data.data.devices
              for (let i = 0; i < this.devices.length; i++) {
                if (this.devices[i].wanning > 0) {
                  this.devices[i].icon = 'https://dsd-images.oss-cn-shenzhen.aliyuncs.com/hy/red_coordinate.png'
                } else {
                  this.devices[i].icon = 'https://dsd-images.oss-cn-shenzhen.aliyuncs.com/hy/green_coordinate.png'
                }
                this.devices[i].show = false
              }
            } else {
              this.$message.error(res.data.msg)
            }
          })
          .catch(() => {
            this.loading = false
            this.$message.error('获取数据失败')
          })
      },

      getRegionCustomer() {
        regionCustomer({
          customer_id: this.searchItem.customer_id,
          site_id: this.searchItem.site_id,
        }, 'get')
          .then((res) => {
            if (res.data.code === 200) {
              this.loading = false
              this.customerList = res.data.data
              this.searchItem.customer_id = this.customerList[0].customer_id
              console.log(this.searchItem.customer_id)
              if (this.searchItem.customer_id) {
                customerSite({}, 'get', this.searchItem.customer_id)
                  .then((res) => {
                    if (res.data.code === 200) {
                      this.loading = false
                      this.siteSearchList = res.data.data.list
                      if (this.siteSearchList[0]) {
                        this.searchItem.site_id = this.siteSearchList[0].id
                        this.getData()
                      }
                    } else {
                      this.$message.error(res.data.msg)
                    }
                  })
                  .catch(() => {
                    this.loading = false
                    this.$message.error('获取数据失败')
                  })
              }
            } else {
              this.$message.error(res.data.msg)
            }
          })
          .catch(() => {
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
      handleClick() {
        this.searchItem = {}
      },

    }
    ,
  }
</script>

<style lang="stylus">
    .map
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

        .map
            bgf()
            margin-top 10px
            wh 100% 150%

            .title
                wh 100% 90px
                display flex
                align-items center
                border-bottom 1px solid #EEEEEE
                padding 0 30px
                .icon
                    display flex
                    wh 46px 38px
                .info
                    flex-direction column
                    display flex
                    margin-left 10px
                    width 8%
                    span
                        fsc 20px #333333
                    p
                        margin-top 5px
                        fsc 10px #666666

            .map
                display flex
                align-items center
                padding 0 30px
                .bm_view
                    margin-top 20px
                    width 100%
                    height 100%


</style>
<style lang="stylus">
    .anchorBL{
        display:none;
    }
</style>
