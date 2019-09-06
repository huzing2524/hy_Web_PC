<template lang="pug">
  .police.w1200.mgauto
    .menu_box
      .tab_item
        el-tabs(v-model="activeName" @tab-click="handleClick")
          el-tab-pane(label="实时报警" name="first")
            .search_item
              el-form.border_top(:inline="true")
                el-form-item(label="所属客户")
                  el-select(v-model="searchItem.customer_id" placeholder="选择客户" clearable)
                    el-option(v-for="item in customerList" :key="item.customer_id" :label="item.name_cn" :value="item.customer_id")
                el-form-item(label="设备状态")
                  el-select(v-model="searchItem.status" placeholder="选择状态" clearable)
                    el-option(v-for="item in keywordList" :key="item.value" :label="item.label" :value="item.value")
                el-form-item(label="报警设备")
                  el-input(v-model="searchItem.device_name" placeholder="填写报警设备" clearable)
                el-form-item
                  el-button(type="primary" @click="searchRealClick") 搜索
                el-form-item
                  el-button(@click="resetRealClick") 重置
            el-table(v-if="realList.length" :data="realList" v-loading="loading" stripe)
              el-table-column(
              header-align="center"
              align="center"
              label="序号")
                template(slot-scope="scope")
                  span {{(page-1)*10 + scope.$index+1}}
              el-table-column(
              header-align="center"
              align="center"
              prop="id"
              label="编码")
              el-table-column(
              header-align="center"
              align="center"
              prop="name"
              label="名称")
              el-table-column(
              header-align="center"
              align="center"
              prop="status"
              label="状态")
                template(slot-scope="scope")
                  p {{scope.row.status | getState}}
              el-table-column(
              header-align="center"
              align="center"
              prop="value"
              label="值")
              el-table-column(
              header-align="center"
              align="center"
              prop="device_name"
              label="报警设备")
              el-table-column(
              header-align="center"
              align="center"
              prop="customer_name"
              label="所属客户")
              el-table-column(
              header-align="center"
              align="center"
              prop="time"
              label="发生时间")
              el-table-column(
              header-align="center"
              align="center"
              prop="confirm_person"
              label="确认人")
              el-table-column(
              header-align="center"
              align="center"
              prop="option"
              label="操作")
                template(slot-scope="scope")
                  el-row(:gutter="20")
                    el-col
                      el-button(v-if="scope.row.status==='0'" @click="policeClick(scope.$index,scope.row)" type="text" size="small") 确认
                      el-button(v-if="scope.row.status==='1'" @click="policeClick(scope.$index,scope.row)" type="text" size="small" style="color: #333333;") 已确认
                      el-button(@click="policeDetailClick(scope.$index,scope.row)" type="text" size="small") 查看详情
            <!--.table_empty(v-else)-->
            <!--.icon-->
            <!--svg.ali_icon(aria-hidden="true")-->
            <!--use(xlink:href="#iconEmpty_pt1")-->
            <!--p 暂无数据-->
            Empty(v-else)
          el-tab-pane(label="历史报警" name="second")
            .search_item
              el-form.border_top(:inline="true")
                el-form-item(label="报警编码")
                  el-input(v-model="searchItem.code" placeholder="填写报警编码" clearable)
                el-form-item(label="报警名称")
                  el-input(v-model="searchItem.name" placeholder="填写报警名称" clearable)
                el-form-item(label="报警设备")
                  el-input(v-model="searchItem.device_name" placeholder="填写报警设备" clearable)
                <br/>
                el-form-item(label="开始时间")
                  el-date-picker(
                  v-model="searchItem.start_time"
                  type="datetime"
                  placeholder="选择开始时间"
                  )
                el-form-item(label="结束时间")
                  el-date-picker(
                  v-model="searchItem.end_time"
                  type="datetime"
                  placeholder="选择结束时间"
                  )
                el-form-item
                  el-button(type="primary" @click="searchHistoryClick") 搜索
                el-form-item
                  el-button(@click="resetHistoryClick") 重置
                el-form-item
                  el-button(type="primary" @click="exportHistoryClick") 导出为Excel
            el-table(v-if="historyList.length" :data="historyList" v-loading="loading" stripe)
              el-table-column(
              header-align="center"
              align="center"
              label="序号")
                template(slot-scope="scope")
                  span {{(page-1)*10 + scope.$index+1}}
              el-table-column(
              header-align="center"
              align="center"
              prop="id"
              label="编码")
              el-table-column(
              header-align="center"
              align="center"
              prop="name"
              label="名称")
              el-table-column(
              header-align="center"
              align="center"
              prop="content"
              label="信息")
              el-table-column(
              header-align="center"
              align="center"
              prop="status"
              label="状态")
              el-table-column(
              header-align="center"
              align="center"
              prop="value"
              label="值")
              el-table-column(
              header-align="center"
              align="center"
              prop="device_id"
              label="报警设备")
              el-table-column(
              header-align="center"
              align="center"
              prop="customer_name"
              label="所属客户")
              el-table-column(
              header-align="center"
              align="center"
              prop="time"
              label="发生时间")
              el-table-column(
              header-align="center"
              align="center"
              prop="confirm_person"
              label="确认人")
              el-table-column(
              header-align="center"
              align="center"
              prop="confirm_time"
              label="确认时间")
              el-table-column(
              header-align="center"
              align="center"
              prop="remark"
              label="问题描述")
              el-table-column(
              header-align="center"
              align="center"
              prop="plan_description"
              label="解决方案")
            Empty(v-else)
          el-tab-pane(label="报警通知" name="third")
            .search_item
              el-form.border_top(:inline="true")
                el-form-item(label="所属客户")
                  el-select(v-model="searchItem.customer_id" placeholder="选择客户" clearable @change="changeSearchCustomer")
                    el-option(v-for="item in customerList" :key="item.customer_id" :label="item.name_cn" :value="item.customer_id")
            el-table(v-if="noticeList.length" :data="noticeList" v-loading="loading" stripe)
              el-table-column(
              header-align="center"
              align="center"
              label="序号")
                template(slot-scope="scope")
                  span {{(page-1)*10 + scope.$index+1}}
              el-table-column(
              header-align="center"
              align="center"
              prop="customer_name"
              label="所属客户")
              el-table-column(
              header-align="center"
              align="center"
              prop="noticer"
              label="通知人")
                template(slot-scope="scope")
                  el-col(:span="24" v-for="(item,index) in scope.row.notifier" :key="index")
                    span {{item}}
              el-table-column(
              header-align="center"
              align="center"
              prop="status"
              label="是否启用")
                template(slot-scope="scope")
                  p {{scope.row.status | policeState}}
              el-table-column(
              header-align="center"
              align="center"
              prop="option"
              label="操作")
                template(slot-scope="scope")
                  el-row(:gutter="20")
                    el-col
                      el-button(@click="policeNoticeClick(scope.$index,scope.row)" type="text" size="small") 编辑
            Empty(v-else)
          el-tab-pane(label="报警优先级" name="fourth")
            .search_item
              el-form.border_top(:inline="true")
                el-form-item(label="报警名称")
                  el-input(v-model="searchItem.name" placeholder="填写报警名称" clearable)
                el-form-item(label="所属客户")
                  el-select(v-model="searchItem.customer_id" placeholder="选择客户" clearable)
                    el-option(v-for="item in customerList" :key="item.customer_id" :label="item.name_cn" :value="item.customer_id")
                el-form-item
                  el-button(type="primary" @click="searchLevelClick") 搜索
                el-form-item
                  el-button(@click="resetLevelClick") 重置
            el-table(v-if="levelList.length" :data="levelList" v-loading="loading" stripe)
              el-table-column(
              header-align="center"
              align="center"
              label="序号")
                template(slot-scope="scope")
                  span {{(page-1)*10 + scope.$index+1}}
              el-table-column(
              header-align="center"
              align="center"
              prop="id"
              label="编码")
              el-table-column(
              header-align="center"
              align="center"
              prop="name"
              label="名称")
              el-table-column(
              header-align="center"
              align="center"
              prop="info"
              label="信息")
              el-table-column(
              header-align="center"
              align="center"
              prop="device_name"
              label="报警设备")
              el-table-column(
              header-align="center"
              align="center"
              prop="customer_name"
              label="所属客户")
              el-table-column(
              header-align="center"
              align="center"
              prop="level"
              label="优先级")
                template(slot-scope="scope")
                  p {{scope.row.level | levelState}}
              el-table-column(
              header-align="center"
              align="center"
              prop="remark"
              label="备注")
              el-table-column(
              header-align="center"
              align="center"
              prop="option"
              label="操作")
                template(slot-scope="scope")
                  el-row(:gutter="20")
                    el-col
                      el-button(@click="priorityClick(scope.$index,scope.row)" type="text" size="small") 修改优先级
            Empty(v-else)
          el-tab-pane(label="报警预测" name="fifth")
            .tab_tips
              span 报警预测是根据长短时神经网络(LSTM)、门控循环单元网络(GRU)等学习算法对历史数据的学习从而生成预测模型，再通过预测模型来预测未来的报警信息。预测结果的发生概率越高则在现实中越有可能发生，预测结果仅供参考
            .predict_content(v-if="predictList.length")
              .predict_item(v-for="(item,index) in predictList" :key="index")
                .probability
                  span {{item.probability}}
                  p 发生概率
                .item
                  span 编码
                  p {{item.id}}
                .item
                  span 名称
                  p {{item.name}}
                .item
                  span 信息
                  p {{item.content}}
                .item
                  span 值
                  p {{item.value}}
                .item
                  span 报警设备
                  p {{item.device_name}}
                .item
                  span 所属客户
                  p {{item.customer_name}}
                .item
                  span 预计发生时间
                  p {{item.time}}
            Empty(style="margin-top:10px;" v-else)
      .pagination(v-if="parseInt(index)!==4")
        el-pagination(
        :background="false"
        :page-size="row"
        :total="total"
        :current-page.sync="page"
        @current-change="handleCurrentChange"
        layout="prev, pager, next,total,jumper")
      el-dialog(title="确认报警" :visible.sync="dialogPolice")
        el-form(ref="form" :model="formData")
          el-form-item(label="问题描述")
            el-input(v-model="formData.problem" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="填写问题描述")
          el-form-item(label="处理方案")
            el-input(v-model="formData.plan_description" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="填写处理方案")
          el-form-item(label="确认人")
            span {{localStorage.getItem('UserName') || ''}}
          el-form-item(label="确认时间")
            span {{confirm_time}}
          el-form-item
            el-button(@click="cancelBtnClick") 取消
            el-button(@click="confirmClick") 确定
      el-dialog(title="设置报警优先级" :visible.sync="dialogPriority")
        el-form.dialog_width(ref="form" :model="PriorityData")
          el-form-item(label="编号")
            el-input(v-model="PriorityData.id" type="text" placeholder="填写编号" disabled)
          el-form-item(label="名称")
            el-input(v-model="PriorityData.name" type="text" placeholder="填写名称")
          el-form-item.text_left(label="优先级" style="margin-bottom: 0;")
            el-radio(v-model="PriorityData.level" label="0") 低
            el-radio(v-model="PriorityData.level" label="1") 高
          el-form-item.text_left(style="margin-bottom: 0;")
            span(style="font-size: 12px;color: #999999;") 优先级为高的报警会电话通知，优先级为低的报警不会电话通知
          el-form-item(label="备注")
            el-input(v-model="PriorityData.remark" type="text" placeholder="(选填)填写备注")
          el-form-item
            el-button(@click="cancelPriorityClick") 取消
            el-button(@click="confirmPriorityClick") 确定
</template>

<script>
  import Empty from '_components/empty'
  import { parseDate, getFullDate } from '_common/util'
  import { regionCustomer } from '_api/client_manage'
  import FileSaver from 'file-saver'
  import XLSX from 'xlsx'
  import {
    policeReal,
    policeConfirm,
    policeHistory,
    policeHistoryExcel,
    policeNotice,
    policeLevel,
    policePredict,
  } from '_api/police_manage'

  export default {
    components: {
      Empty,
    },
    data() {
      return {
        id: '',
        level_id: '',
        localStorage: window.localStorage,
        getFullDate,
        activeName: 'first',
        index: '0',
        radio: '0',
        confirm_time: 0,
        confirmTime: 0,
        loading: false,
        dialogPolice: false,
        dialogPriority: false,
        row: 10,
        page: 1,
        total: 0,
        indexs: 0,
        searchItem: {
          start_time: null,
          end_time: null,
        },
        listItem: [],
        customerList: [],
        realList: [],
        historyList: [],
        noticeList: [],
        levelList: [],
        predictList: [],
        formData: {},
        PriorityData: {
          level: '0',
        },
        keywordList: [
          {
            value: '0',
            label: '触发',
          },
          {
            value: '1',
            label: '确认',
          },
        ],
      }
    },
    filters: {
      getState(val) {
        switch (parseInt(val)) {
          case 0:
            return '触发'
          case 1:
            return '确认'
          default:
            return ''
        }
      },
      policeState(val) {
        switch (parseInt(val)) {
          case 0:
            return '停用'
          case 1:
            return '启用'
          default:
            return ''
        }
      },
      levelState(val) {
        switch (parseInt(val)) {
          case 0:
            return '低'
          case 1:
            return '高'
          default:
            return ''
        }
      },
    },
    mounted() {
      this.initData()
    },
    methods: {
      // ----------------  客户列表 初始化列表  ---------------- //
      initData() {
        regionCustomer({}, 'get').then((res) => {
          if (res.data.code === 200) {
            this.loading = false
            this.customerList = res.data.data
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.loading = false
          this.$message.error('获取数据失败')
        })
        this.handleClick({ index: '0' })
      },

      // ----------------  实时报警  ---------------- //
      getPoliceReal() {
        let params = {
          device_name: this.searchItem.device_name,
          customer_id: this.searchItem.customer_id,
          status: this.searchItem.status,
          page: this.page,
          row: this.row,
        }
        policeReal(params, 'get').then((res) => {
          if (res.data.code === 200) {
            this.loading = false
            this.realList = res.data.data.list
            this.total = res.data.data.total
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.loading = false
          this.$message.error('获取数据失败')
        })
      },
      searchRealClick() {
        this.getPoliceReal()
      },
      resetRealClick() {
        this.searchItem = {
          device_name: '',
          customer_id: '',
          status: '',
        }
        this.getPoliceReal()
      },
      policeClick(index, row) {
        this.dialogPolice = true
        this.confirm_time = getFullDate((new Date()).getTime() / 1000)
        this.confirmTime = Math.floor((new Date()).getTime() / 1000)
        this.id = row.id
      },
      policeDetailClick(index, row) {
        this.$router.push(`/police/manage/detail?id=${row.id}`)
      },
      cancelBtnClick() {
        this.dialogPolice = false
        this.formData = {
          remark: '',
          plan_description: '',
        }
      },
      confirmClick() {
        let params = {
          problem: this.formData.problem,
          plan_description: this.formData.plan_description,
          confirm_person: localStorage.getItem('UserName'),
          confirm_time: this.confirmTime,
        }
        policeConfirm(params, 'post', this.id).then((res) => {
          if (res.data.code === 200) {
            this.loading = false
            this.dialogPolice = false
            this.getPoliceReal()
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.loading = false
          this.$message.error('获取数据失败')
        })
      },

      // ----------------  历史报警  ---------------- //
      getPoliceHistory() {
        let params = {
          id: this.searchItem.code,
          name: this.searchItem.name,
          device_name: this.searchItem.device_name,
          start_time: parseDate(this.searchItem.start_time),
          end_time: parseDate(this.searchItem.end_time),
          page: this.page,
          row: this.row,
        }
        policeHistory(params, 'get').then((res) => {
          if (res.data.code === 200) {
            this.loading = false
            this.historyList = res.data.data.list
            this.total = res.data.data.total
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.loading = false
          this.$message.error('获取数据失败')
        })
      },
      searchHistoryClick() {
        this.getPoliceHistory()
      },
      resetHistoryClick() {
        this.searchItem = {
          id: '',
          name: '',
          device_name: '',
          start_time: '',
          end_time: '',
        }
        this.getPoliceHistory()
      },
      exportExcell(data) {
        let ws = XLSX.utils.aoa_to_sheet(data)
        let wb = XLSX.utils.book_new()
        wb.SheetNames.push('sheet1')
        wb.Sheets['sheet1'] = ws
        // wb.row = true;// 转换成excel时，使用原始格式
        let wopts = { bookType: 'xlsx', bookSST: false, type: 'array' }
        let wbout = XLSX.write(wb, wopts)
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '历史报警记录.xlsx')
      },
      exportHistoryClick() {
        let params = {
          id: this.searchItem.code,
          name: this.searchItem.name,
          device_name: this.searchItem.device_name,
          start_time: parseDate(this.searchItem.start_time),
          end_time: parseDate(this.searchItem.end_time),
          page: this.page,
          row: this.row,
        }
        policeHistoryExcel(params, 'get').then((res) => {
          if (res.data.code === 200) {
            this.loading = false
            this.historyExcelList = res.data.data
            if (!this.historyExcelList.length) {
              this.$message.error('暂无导出数据')
              return
            }
            this.exportExcell(this.historyExcelList)
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.loading = false
          this.$message.error('获取数据失败')
        })
      },

      // ----------------  报警通知  ---------------- //
      getPoliceNotice() {
        let params = {
          customer_id: this.searchItem.customer_id,
          page: this.page,
          row: this.row,
        }
        policeNotice(params, 'get').then((res) => {
          if (res.data.code === 200) {
            this.loading = false
            this.noticeList = res.data.data.list
            this.total = res.data.data.total
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.loading = false
          this.$message.error('获取数据失败')
        })
      },
      changeSearchCustomer() {
        this.customer_id = this.searchItem.customer_id
        this.getPoliceNotice()
      },
      policeNoticeClick(index, row) {
        this.$router.push(`/police/manage/notice?id=${row.customer_id}&status=${row.status}`)
      },

      // ----------------  报警优先级  ---------------- //
      getPoliceLevel() {
        let params = {
          name: this.searchItem.name,
          customer_id: this.searchItem.customer_id,
          page: this.page,
          row: this.row,
        }
        policeLevel(params, 'get').then((res) => {
          if (res.data.code === 200) {
            this.loading = false
            this.levelList = res.data.data.list
            this.total = res.data.data.total
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.loading = false
          this.$message.error('获取数据失败')
        })
      },
      searchLevelClick() {
        this.getPoliceLevel()
      },
      resetLevelClick() {
        this.searchItem = {
          name: '',
          customer_id: '',
        }
        this.getPoliceLevel()
      },
      priorityClick(index, row) {
        this.dialogPriority = true
        this.level_id = row.id
        this.PriorityData = this.$_.cloneDeep(row)
      },
      cancelPriorityClick() {
        this.PriorityData = {}
        this.dialogPriority = false
      },
      confirmPriorityClick() {
        if (!this.PriorityData.id || !this.PriorityData.name || !this.PriorityData.level) {
          this.$message.error('请完善报警内容后提交')
          return
        }
        let params = {
          id: this.PriorityData.id,
          name: this.PriorityData.name,
          level: this.PriorityData.level,
          remark: this.PriorityData.remark,
        }
        policeLevel(params, 'post', this.level_id).then((res) => {
          if (res.data.code === 200) {
            this.$message.success('修改成功')
            this.dialogPriority = false
            this.getPoliceLevel()
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.loading = false
          this.$message.error('获取数据失败')
        })
      },

      // ----------------  报警预测  ---------------- //
      getPolicePredict() {
        policePredict({}, 'get').then((res) => {
          if (res.data.code === 200) {
            this.loading = false
            this.predictList = res.data.data.list
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.loading = false
          this.$message.error('获取数据失败')
        })
      },

      // ----------------  tab切换  ---------------- //
      handleClick(tab) {
        this.page = 1
        this.index = tab.index || '0'
        this.indexs = this.index || tab.index
        this.loading = true
        if (this.indexs === '0') {
          this.getPoliceReal()
        }
        if (this.indexs === '1') {
          this.getPoliceHistory()
        }
        if (this.indexs === '2') {
          this.searchItem.customer_id = ''
          this.getPoliceNotice()
        }
        if (this.indexs === '3') {
          this.getPoliceLevel()
        }
        if (this.indexs === '4') {
          this.getPolicePredict()
        }
      },

      // ----------------  页码切换  ---------------- //
      handleCurrentChange() {
        if (this.indexs === '0') {
          this.getPoliceReal()
        }
        if (this.indexs === '1') {
          this.getPoliceHistory()
        }
        if (this.indexs === '2') {
          this.searchItem.customer_id = ''
          this.getPoliceNotice()
        }
        if (this.indexs === '3') {
          this.getPoliceLevel()
        }
        if (this.indexs === '4') {
          this.getPolicePredict()
        }
      },
    },
  }
</script>

<style scoped lang="stylus">
  .police
    wh 100% 100%
    display flex
    padding 30px 30px 12px
    .menu_box
      display flex
      flex 1
      flex-direction column
      .tab_item
        display flex
        flex 1
        flex-direction column
        overflow-y scroll
        /*padding-bottom 70px*/
        .search_item
          background #fff
          padding 0px 30px
          margin-bottom 10px
          border 1px solid #DBE3E8
          box-shadow 0px 0px 5px 0px rgba(219, 227, 232, 1)
          border-radius 2px
          border-top 0
        .tab_tips
          display flex
          flex-direction row
          padding 0 30px
          background #fff
          border 1px solid #DBE3E8
          box-shadow 0px 0px 5px 0px rgba(219, 227, 232, 1)
          border-radius 2px
          border-top 0
          span
            width 100%
            display flex
            padding 10px 0px 24px
            fsc 16px #333333
            margin-bottom 10px
            border-top 1px solid #B6BDC2
        .predict_content
          /*min-width 1690px*/
          min-width 1200px
          display flex
          flex-wrap wrap
          .predict_item
            width 32.66%
            /*width 548px*/
            flex-direction column
            background #fff
            margin-top 90px
            padding 90px 40px 10px
            position relative
            &:nth-of-type(3n-1)
              margin-left 1%
              margin-right 1%
            .probability
              position absolute
              left 50%
              top 0
              wh 120px 120px
              display flex
              flex-direction column
              justify-content center
              align-items center
              background #fff
              margin-left -60px
              margin-top -60px
              border-radius 50%
              box-shadow 0px 2px 6px 0px rgba(220, 233, 243, 1)
              span
                fsc 20px #19CCAE
              p
                fsc 12px #19CCAE
            .item
              display flex
              flex-direction row
              justify-content space-between
              align-items center
              margin-bottom 20px
              span
                display flex
              p
                display flex
      .pagination
        display flex
        flex-direction row
        justify-content center
        padding 20px 0
        background #fff
        margin-top 10px
        border 1px solid #DBE3E8
        box-shadow 0px 0px 5px 0px rgba(219, 227, 232, 1)
        border-radius 2px
</style>
<style lang="stylus">
  .el-dialog
    width 550px
    .el-dialog__header
      text-align center
      font-weight 500
    .el-dialog__body
      padding 30px 60px
      .el-form
        text-align center
        .el-form-item
          display flex
          flex-direction row
          margin-bottom 24px
          button
            width 140px
            margin 0 20px
            fsc 16px #fff
            &:first-child
              background #B8C5D0
            &:last-child
              background #19CCAE

  .border_top
    padding-top 24px
    border-top 1px solid #B6BDC2

  .el-tabs__nav-wrap::after
    height 0

  .el-tabs__header
    background #fff
    padding 14px 0 14px 30px
    margin-bottom 0

  .el-table th
    color #333333
    background rgba(246,248,249,0.45)

  .el-form-item__label
    fsc 16px #666666
    display flex

  .el-form-item__content
    flex 1

  .el-select
    width 100%

  .dialog_width
    .el-form-item__label
      width 80px

  .text_left
    .el-form-item__content
      text-align left

  .el-table
    border 1px solid #DBE3E8
    box-shadow 0px 0px 5px 0px rgba(219, 227, 232, 1)
    border-radius 2px
    overflow-y scroll

  .el-form-item__content
    flex 1
    text-align left

  .el-form-item__label
    display flex

  .el-tabs
    display flex
    flex-direction column
    flex 1

  .el-tabs__content
    display flex
    flex-direction column
    flex 1

  .el-tab-pane
    display flex
    flex-direction column
    flex 1
    overflow-y scroll

  .el-tabs__header
    border 1px solid #DBE3E8
    box-shadow 0px 0px 5px 0px rgba(219, 227, 232, 1)
    border-radius 2px
    border-bottom 0

  .el-tabs__item
    fsc 20px #333333

  .el-dialog__headerbtn
    display none
</style>
