<template lang="pug">
  .line
    g2-line(
      v-if="isShow"
      :width="width" :height="height"
      :is-smooth="true" :padding="['auto', 100]"
      :data="lineData"
      :axis-name="{name:'年份', value:'GDP(亿美元)'}")
</template>

<script>
  import Bus from '@/bus'
  export default {
    data() {
      return {
        lineData: [],
        lineDatas: [
          { name: '1997', value: 86085, type: 'America' },
          { name: '2007', value: 144776, type: 'America' },
          { name: '2017', value: 193868, type: 'America' },
          { name: '1997', value: 9616, type: 'China' },
          { name: '2007', value: 35715, type: 'China' },
          { name: '2017', value: 122503, type: 'China' },
          { name: '1997', value: 44122, type: 'Japan' },
          { name: '2007', value: 45153, type: 'Japan' },
          { name: '2017', value: 48675, type: 'Japan' },
          { name: '1997', value: 22159, type: 'Germany' },
          { name: '2007', value: 34447, type: 'Germany' },
          { name: '2017', value: 36865, type: 'Germany' },
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
      Bus.$on('line', (val) => {
        this.width = val.width
        this.height = val.height
        if (!val.chartData) {
          this.lineData = this.defaultData
          this.isShow = true
          return
        }
        val.chartData.data_x.forEach((item, idx) => {
          val.chartData.data_y.forEach((items, idxs) => {
            this.lineData.push({
              name: item,
              value: val.chartData.data_y[idxs][idx],
              type: val.chartData.items[idxs].name,
            })
          })
        })
        this.isShow = true
      })
    },
  }
</script>
