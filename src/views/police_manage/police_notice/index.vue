<template lang="pug">
  .notice.w1200.mgauto
    .menu_box
      .title_box
        .title
          el-breadcrumb(separator-class="el-icon-arrow-right")
            el-breadcrumb-item(:to="{ path: '/police/manage' }") 报警管理
            el-breadcrumb-item 报警通知
            el-breadcrumb-item 编辑报警通知
        .info
          .name 深圳大疆污水处理公司
          .start
            .tip 是否启用通知
            .switch
              span(:class="status==='1' ? 'active' : ''" @click="startClick('1')") 启用
              span(:class="status==='0' ? 'active' : ''" @click="startClick('0')") 停用
          .add_noticer
            button(@click="addNoticerClick") 新增通知人
      .table_list
        el-table(:data="listItem" v-loading="loading" )
          el-table-column(
          header-align="center"
          align="center"
          label="序号")
            template(slot-scope="scope")
              span {{(page-1)*10 + scope.$index+1}}
          el-table-column(
          header-align="center"
          align="center"
          prop="name"
          label="姓名")
          el-table-column(
          header-align="center"
          align="center"
          prop="phone"
          label="手机号")
          el-table-column(
          header-align="center"
          align="center"
          prop="level"
          label="等级")
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
                  el-button(@click="deleteClick(scope.$index,scope.row)" type="text" size="small") 删除
                  el-button(@click="editClick(scope.$index,scope.row)" type="text" size="small") 修改
      .pagination
        el-pagination(
        :background="false"
        :page-size="row"
        :total="total"
        :current-page.sync="page"
        @current-change="handleCurrentChange"
        layout="prev, pager, next,total,jumper")
      el-dialog(:title="editType ==='create'?'新增通知人':'修改通知人'" :visible.sync="dialogEdit")
        el-form(ref="form" :model="editData")
          el-form-item(label="姓名")
            el-input(v-model="editData.name" type="text" placeholder="填写姓名")
          el-form-item(label="手机号")
            el-input(v-model="editData.phone" type="text" placeholder="填写手机号")
          el-form-item(label="等级" style="margin-bottom: 0;")
            el-radio(v-model="editData.level" label="0") 员工
            el-radio(v-model="editData.level" label="1") 老板
          el-form-item(style="margin-bottom: 0;")
            span(style="font-size: 12px;color: #999999;") 若有报警信息会第一时间打电话给员工，若未接通则打电话给老板
          el-form-item(label="备注")
            el-input(v-model="editData.remark" type="text" placeholder="(选填)填写备注")
          el-form-item
            el-button(@click="cancelBtnClick") 取消
            el-button(@click="confirmBtnClick") 确定
</template>

<script>
  import { policeNotice, policeNoticer } from '_api/police_manage'

  export default {
    data() {
      return {
        customer_id: '',
        notice_id: '',
        status: '',
        editType: 'create',
        row: 10,
        page: 1,
        total: 0,
        loading: false,
        dialogEdit: false,
        editData: {
          level: '0',
        },
        listItem: [],
      }
    },
    filters: {
      levelState(val) {
        switch (parseInt(val)) {
          case 0:
            return '员工'
          case 1:
            return '老板'
          default:
            return ''
        }
      },
    },
    mounted() {
      this.getNoticer()
    },
    methods: {
      // ----------------  通知人列表 初始化列表  ---------------- //
      getNoticer() {
        this.customer_id = this.$route.query.id || ''
        this.status = this.$route.query.status || ''
        policeNoticer({
          row: this.row,
          page: this.page,
        }, 'get', this.customer_id).then((res) => {
          if (res.data.code === 200) {
            this.listItem = res.data.data.list
            this.total = res.data.data.total
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.$message.error('获取数据失败')
        })
      },

      // ----------------  新增通知人  ---------------- //
      addNoticerClick() {
        this.editData = {}
        this.editType = 'create'
        this.dialogEdit = true
      },

      // ----------------  开启、关闭通知  ---------------- //
      startClick(index) {
        if (!this.listItem.length) {
          this.$message.error('请先增加通知人')
          return
        }
        this.status = index
        policeNotice({ status: index }, 'post', this.customer_id).then((res) => {
          if (res.data.code === 200) {
            this.$message.success('操作成功')
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(() => {
          this.$message.error('操作失败')
        })
      },

      // ----------------  删除通知人  ---------------- //
      deleteClick(index, row) {
        this.$confirm('是否删除该条数据?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          let id = row.id
          policeNoticer({}, 'delete', id).then((res) => {
            if (res.data.code === 200) {
              this.$message.success('操作成功')
              this.getNoticer()
            } else {
              this.$message.error(res.data.msg)
            }
          }).catch(() => {
            this.$message.error('操作失败')
          })
        }).catch(() => {
          this.$message.error('操作失败')
        })

      },

      // ----------------  编辑通知人  ---------------- //
      editClick(index, row) {
        this.notice_id = row.id
        this.dialogEdit = true
        this.editType = 'edit'
        this.editData = this.$_.cloneDeep(row)
      },

      // ----------------  取消新增、编辑  ---------------- //
      cancelBtnClick() {
        this.dialogEdit = false
        this.editData = {}
      },

      // ----------------  确定新增、编辑  ---------------- //
      confirmBtnClick() {
        if (!this.editData.name.replace(/\s+/g, '') || !this.editData.phone || !this.editData.level) {
          this.$message.error('请完善通知人信息后提交')
          return
        }
        if (!(/^1[3456789]\d{9}$/.test(this.editData.phone))) {
          this.$message.error('请输入正确的手机号')
          return
        }
        if (this.editType === 'create') {
          let params = {
            name: this.editData.name.replace(/\s+/g, ''),
            phone: this.editData.phone,
            level: this.editData.level,
            remark: this.editData.remark,
          }
          policeNoticer(params, 'post', this.customer_id).then((res) => {
            if (res.data.code === 200) {
              this.$message.success('新增成功')
              this.dialogEdit = false
              this.getNoticer()
            } else {
              this.$message.error(res.data.msg)
            }
          }).catch(() => {
            this.$message.error('操作失败')
          })
        }
        if (this.editType === 'edit') {
          let params = {
            name: this.editData.name,
            phone: this.editData.phone,
            level: this.editData.level,
            remark: this.editData.remark,
          }
          policeNoticer(params, 'put', this.notice_id).then((res) => {
            if (res.data.code === 200) {
              this.$message.success('修改成功')
              this.dialogEdit = false
              this.getNoticer()
            } else {
              this.$message.error(res.data.msg)
            }
          }).catch(() => {
            this.$message.error('操作失败')
          })
        }
      },
      // ----------------  页码切换  ---------------- //
      handleCurrentChange() {
        this.getNoticer()
      },

    },
  }
</script>

<style scoped lang="stylus">
  .notice
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
          border-bottom 1px solid rgba(182, 189, 194, 0.5)
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
                  border 1px solid #19CCAE
                  background #19CCAE
                  color #fff
                &:first-child
                  border-right 0px
                &:last-child
                  border-left 0px
                  border-radius 0px 4px 4px 0px
          .add_noticer
            display flex
            margin-left 30px
            button
              display flex
              align-items center
              justify-content center
              wh 120px 34px
              fsc 16px #fff
              background #19CCAE
              border-radius 4px
      .table_list
        flex-direction column
        flex 1
        overflow-y scroll
      .pagination
        display flex
        flex-direction row
        justify-content center
        padding 20px 0
        background #fff
        margin-top 10px
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

  .el-tabs__header
    background #fff
    padding 14px 30px
    margin-bottom 0

  .el-table th
    color #333333
    background rgba(246,248,249,0.45)

  .el-form-item__label
    display flex
    width 80px

  .el-form-item__content
    flex 1
    text-align left

  .el-select
    width 100%

  .el-breadcrumb span
    fsc 16px #666666

  .el-dialog__headerbtn
    display none
</style>
