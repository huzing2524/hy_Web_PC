<template lang="pug">
  el-button(@click="exportTableToExcel" type="primary" class="eb-header-button") {{buttonTitle}}
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  props:{
    buttonTitle:{
      default: '导出Excel'
    },
    fileNames: {
      default() {
        return []
      }
    },
    fileIds: {
      default() {
        return []
      }
    }
  },
  methods: {
    // 将表单数据生成excel
    exportTableToExcel() {
      for(let index = 0; index < this.fileIds.length; index ++) {
        console.log("this.fileIds[0]="+this.fileIds[0])
        let xlsxParam = { raw: true };//转换成excel时，使用原始的格式
        let wb = XLSX.utils.table_to_book(document.querySelector(`#${this.fileIds[index]}`), xlsxParam)
        console.log("wb=" + wb)
        let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
        console.log("wbout=" + wbout[0])
        try {
          FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), `${this.fileNames[index]}.xlsx`)
        } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
      }
    },
    // 将json数据生成excel
    exportJsonToExcel() {
        // 测试数据
        let aoa= [
          [ "id",   "name", "value","time" ], // 第一行的横向标题，一个bean的所有字段名字
          [    1, "sheetjs",    7262 , "2019-08-17 12:23:34"], // 每一行的内容，每一行包括一个bean的所有字段内容
          [    2, "js-xlsx",    6969 ,"2019-08-17 12:23:35"]
        ]
        let ws = XLSX.utils.aoa_to_sheet(aoa);
        let wb=XLSX.utils.book_new();
        wb.SheetNames.push('sheet1');
        wb.Sheets['sheet1'] = ws;
        // wb.row = true;// 转换成excel时，使用原始格式
        let wopts = { bookType:'xlsx', bookSST:false, type:'array' };
        let wbout = XLSX.write(wb,wopts);
        saveAs(new Blob([wbout],{type:"application/octet-stream"}), "data.xlsx");

        self.export_percentage=-1;
    }

  },

}
</script>

<style lang="stylus" scoped>
  .eb-header-button
    width 108px
    // height 34px
    background-color #1E9AFF
    color #fff
    margin-left 20px


</style>


