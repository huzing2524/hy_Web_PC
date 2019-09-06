<template lang="pug">
  .column
    g2-column(
      v-if="isShow"
      :width="width" :height="height"
      :is-bar="false"
      :data="columnData"
      :axis-name="{name:'年份', value:'GDP(亿美元)'}")
</template>

<script>
  import Bus from '@/bus'
  export default {
    data() {
      return {
        columnData: [],
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
          {
            name: '1957 年',
            value: 145,
          },
          {
            name: '1958 年',
            value: 48,
          },
          {
            name: '1959 年',
            value: 38,
          },
          {
            name: '1960 年',
            value: 38,
          },
          {
            name: '1962 年',
            value: 38,
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
      Bus.$on('column', (val) => {
        this.width = val.width
        this.height = val.height
        if (!val.chartData) {
          this.columnData = this.defaultData
          this.isShow = true
          return
        }
        val.chartData.data_x.forEach((item, idx) => {
          this.columnData.push({ name: item, value: val.chartData.data_y[idx] })
        })
        this.isShow = true
      })
    },
  }
</script>

<style lang="stylus" scoped>
          // .column
          //   wh 100% 100%
</style>