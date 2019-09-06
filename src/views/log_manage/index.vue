<template lang="pug">
  .main.w1200.mgauto
    .head
      .search_condition
        span 操作人
        el-input(placeholder="填写操作人" v-model="searchBean.operator")
        span 开始时间
        el-date-picker(v-model="searchBean.start_time" type="datetime" placeholder="选择时间" value-format="yyyy-MM-dd" class="picker")
        span 结束时间
        el-date-picker(v-model="searchBean.end_time" type="datetime" placeholder="选择时间" value-format="yyyy-MM-dd" class="picker")
        span 模块
        el-select(v-model="searchBean.module" placeholder="请选择" class="chooice_module")
          el-option(v-for="item in moduleTypes" :key="item.label" :label="item.label" :value="item.value")
        el-button(type="primary" style="width:100px;margin-right:20px;font-size:16px" @click="getLogList()") 搜索
        el-button(style="width:100px;margin-right:40px;font-size:16px" @click="resetSearchParams()") 重置
        el-button(type="primary" style="width:auto;font-size:16px" @click="getLogTableData()") 导出为Excel
    .body
      el-table(:id="tableId[0]" :data="tableData" style="width: 100%" :header-cell-style="headerStyle" :cell-style="cellStyle" :row-class-name="rowClassName" )
        el-table-column(type = "index" label="序号" width="200")
          template(slot-scope="scope")
            span {{scope.row.index + 1 + (page-1) * row}}
        el-table-column(prop="operator" label="操作人")
        el-table-column(prop="operation" label="内容")
        el-table-column(prop="result" label="结果")
        el-table-column(prop="module" label="模块")
        el-table-column(prop="ip" label="访问ip")
        el-table-column(prop="time" label="时间")
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
  import { getLogList,getLogTable } from '_api/log_manage'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  import {getTimestampByDate} from '_common/util'
  import Empty from '_components/empty'

  export default {
    components: {
      Empty,
    },
    data() {
      return {
        row:10,
        page:1,
        total: 0,
        searchBean: {
          operator:'',// 操作人
          start_time:'',// 开始时间
          end_time:'',// 结束时间
          module:'',// 模块
        },
        moduleTypes:[
          {
            value:'',
            label:'全部'
          },
          {
            value: '监控管理',
            label: '监控管理'
          }, {
            value: '设备管理',
            label: '设备管理'
          }, {
            value: '报警管理',
            label: '报警管理'
          }, {
            value: '客户管理',
            label: '客户管理'
          }, {
            value: '数据分析',
            label: '数据分析'
          }, {
            value: '历史数据',
            label: '历史数据'
          }, {
            value: '权限管理',
            label: '权限管理'
          }, {
            value: '系统设置',
            label: '系统设置'
          }, {
            value: '使用手册',
            label: '使用手册'
          }, {
            value: '操作日志',
            label: '操作日志'
          }
        ],
        tableId:['log_table'],
        tableData:[
          // {
          //   "operator": "harry",
          //   "operation": "登陆系统",
          //   "result": "成功",
          //   "module": "登陆模块",
          //   "ip":"192.168.0.1",
          //   "time": "2019-08-15 17:13"
          // },
          // {
          //   "operator": "haiphon",
          //   "operation": "修改头像",
          //   "result": "成功",
          //   "module": "系统设置",
          //   "ip":"192.168.0.2",
          //   "time": "2019-08-15 13:13"
          // }
        ],

        headerStyle() {
          return 'background-color:rgba(246,248,249,0.45);height:48px;border-radius:2px;text-align:center;font-size:16px;font-weight:500;color:#333333'
        },
        cellStyle() {
          return "text-align:center;height:56px"
        },
        rights:['监控中心', '设备管理', '报警管理', '客户管理', '数据分析', '权限管理', '系统设置'],
        isExportExcel: false
      }
    },
    created() {

    },
    mounted() {
      this.getLogList()
    },
    methods: {
      // 分页按钮事件回调
      handleCurrentChange(val){
        this.page = val
        this.getLogList()
      },
      // 重置搜索条件
      resetSearchParams() {
        this.searchBean.operator = ''
        this.searchBean.start_time = ''
        this.searchBean.end_time = ''
        this.searchBean.module = ''
        this.page = 1
        // 重刷日志列表
        this.getLogList()
      },
      // json导出excel
      exportExcell(jsonData) {
        // 测试数据
        // let aoa= [
        //   [ "id",   "name", "value","time" ], // 第一行的横向标题，一个bean的所有字段名字
        //   [    1, "sheetjs",    7262 , "2019-08-17 12:23:34"], // 每一行的内容，每一行包括一个bean的所有字段内容
        //   [    2, "js-xlsx",    6969 ,"2019-08-17 12:23:35"]
        // ]
        let ws = XLSX.utils.aoa_to_sheet(jsonData);
        let wb=XLSX.utils.book_new();
        wb.SheetNames.push('sheet1');
        wb.Sheets['sheet1'] = ws;
        // wb.row = true;// 转换成excel时，使用原始格式
        let wopts = { bookType:'xlsx', bookSST:false, type:'array' };
        let wbout = XLSX.write(wb,wopts);
        FileSaver.saveAs(new Blob([wbout],{type:"application/octet-stream"}), "日志管理.xlsx");
      },
      rowClassName({row, rowIndex}) {
        //把每一行的索引放进row
        row.index = rowIndex;
      },
      /**----服务调用----**/
      // 获取日志列表
      getLogList() {
        let body = {
          row:this.row,
          page:this.page,
          operator:this.searchBean.operator,
          start_time:getTimestampByDate(this.searchBean.start_time),
          end_time:getTimestampByDate(this.searchBean.end_time),
          module:this.searchBean.module,
        }
        console.log(JSON.stringify(body))
        getLogList(body).then((res)=>{
          if(res.data.code === 200) {
            this.tableData = res.data.data.list
            this.total = res.data.data.total
          } else {
            this.$message.error('获取列表数据失败')
          }
        }).catch(()=>{
          this.$message.error("获取列表数据失败")
        })
      },
      // 获取日志array，用于生产excel，不需要传row和page，直接查全部，后续如果数据过大要考虑获取json文本的方案
      getLogTableData() {
        if (this.isExportExcel) {
          console.log('正在导出，请稍候')
          return
        }
        try {
          this.isExportExcel = true
          let body = {
            operator: this.searchBean.operator,
            start_time:getTimestampByDate(this.searchBean.start_time),
            end_time:getTimestampByDate(this.searchBean.end_time),
            module: this.searchBean.module,
          }
          getLogTable(body).then((res) => {
            if (res.data.code === 200) {
              this.$message.info('正在导出')
              this.exportExcell(res.data.data)
            } else {
              this.$message.error('导出数据失败')
            }
          }).catch(() => {
            this.$message.error("导出数据失败")
          })
        } catch (e) {

        } finally {
          this.isExportExcel = false
        }
      },

    },
  }
</script>

<style scoped lang="stylus">
  .main
    padding 30px
    background #EBEFF2
    display flex
    flex-direction column
    wh 100% 100%
    .head
      padding 24px 30px
      background white
      display flex
      flex-direction column
      width 100%
      height auto
      margin-bottom 10px
      .search_condition
        display flex
        flex-direction row
        justify-content left
        height auto
        span
          fsc(16px, #666666)
          height:38px;
          line-height:38px;
          font-weight:400;
          margin-right 8px
          min-width 80px
          text-align center
        .el-input
          width 150px
          height 34px
          margin-right 30px
          border-radius 4px
        .picker
          width 150px
        .chooice_module
          width 110px
          margin-right 30px
    .body
      width 100%
      flex 1
      margin-bottom 10px
      background white
      display flex
      flex-direction column
    .pagination
      display flex
      flex-direction row
      justify-content center
      padding 20px 0
      width 100%
      height 74px
      margin-bottom 10px
      background white

</style>
