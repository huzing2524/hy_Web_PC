<template lang="pug">
  .pie
    g2-pie(
      v-if="isShow"
      :width="width" :height="height"
      :type="'pie'"
      :data="pieData"
      :axis-name="{name:'年份', value:'GDP(亿美元)'}")
    //- g2-pie(
    //-   :type="'pie'" :axis-name="{name:'年份', value:'GDP(亿美元)'}"
    //-   :data="[{ name: '2016', value: 2 },{ name: '2017', value: 1 },{ name: '2018', value: 3 }]")
</template>

<script>
  import Bus from '@/bus'
  export default {
    data() {
      return {
        pieData: [],
        defaultData: [
          {
            name: '1951 年',
            value: 38,
          },
          {
            name: '1952 年',
            value: 52,
          },
          {
            name: '1956 年',
            value: 61,
          },
        ],
        isShow: false,
        width: 0,
        height: 0,
      }
    },
    mounted() {
      if (this.width) {
        this.isShow = true
      }
      Bus.$on('pie', (val) => {
        this.width = val.width
        this.height = val.height
        if (!val.chartData) {
          this.pieData = this.defaultData
          this.isShow = true
          return
        }
        val.chartData.data_x.forEach((item, idx) => {
          this.pieData.push({ name: item, value: val.chartData.data_y[idx] })
        })

        this.isShow = true
      })
    },
  }
</script>

<style lang="stylus" scoped>
        // .pie
        //   wh 100% 100%
</style>