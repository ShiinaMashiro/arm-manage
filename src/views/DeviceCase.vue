<template>
  <div>
    <div class="search-btn">
      <el-button size="small" type="primary" @click="scanCaseNode"  v-if="$store.getters.checkChangeAuth()">扫描分层处理器</el-button>
    </div>

    <div v-if="info.success" class="device-case border-all">
      <el-table ref="multipleTable" :data="info.list" :header-cell-style="{backgroundColor: '#efefef'}" stripe @row-click="goCaseDev" size="mini" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column prop="caseNo" label="设备池编号"></el-table-column>
        <el-table-column prop="deviceNum" label="设备数量"></el-table-column>
        <el-table-column prop="deviceNumIsDistributed" label="受控设备数量"></el-table-column>
        <el-table-column prop="deviceNumIsFault" label="故障设备数量"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--<el-button type="text" size="small" @click="goCaseDetail(scope.row)">管理</el-button>-->
            <el-button type="text" size="small" @click.stop="goCaseDetail(scope.row)">详情</el-button>
            <el-button type="text" size="small" @click.stop="scanDevice(scope.row.id)" v-if="$store.getters.checkChangeAuth()">扫描设备</el-button>
            <el-button type="text" size="small" @click.stop="deleteCase(scope.row.id)" v-if="$store.getters.checkChangeAuth()">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="list-bottom">
        <div></div>
        <el-pagination
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"
                :current-page="page.startPage"
                :page-sizes="[20, 50, 100]"
                :page-size="page.limit"
                layout="total, sizes, prev, pager, next"
                :total="info.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DeviceCase",
  data () {
    return {
      info: {
        success: false,
        caseList: [],
        total: 0
      },
      page: {
        startPage: 1,
        limit: 20
      },
      multipleSelection: []
    }
  },
  computed: {
    selectIds () {
      let list = []
      this.multipleSelection.forEach(v => {
        list.push(v.id)
      })
      return list
    }
  },
  methods: {
    /* 表单击行事件 */
    checkRow(r, c ,e) {
      this.$refs.multipleTable.toggleRowSelection(r)
    },
    /* 获取设备池列表 */
    getDeviceCaseList () {
      let that = this
      that.$post(that.$uri.device.caseList, that.page).then(res => {
        that.info = res
      })
    },
    /* 当前页改变 */
    currentChangeHandle (val) {
      this.page.startPage = val
      this.getDeviceCaseList()
    },
    /* 每页条数改变 */
    sizeChangeHandle (val) {
      this.page.limit = val
      this.getDeviceCaseList()
    },
    /* 获取选中的数据 */
    handleSelectionChange (val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    /* 扫描 */
    scan (uri, params) {
      let that = this
      that.$post(uri, params).then(res => {
        that.$message.success("扫描成功")
      })
    },
    /* 扫描分层处理器 */
    scanCaseNode () {
      this.$confirm("确认扫描分层处理器？", "提示", {
        confirmButtonText: '确定',
        confirmButtonClass: 'confirm-btn-blue',
        iconClass: 'el-icon-c-blue',
        cancelButtonText: '取消'
      }).then( () => {
        this.scan(this.$uri.device.scanNode, {})
      }).catch( () => {})
    },
    /* 扫描设备 */
    scanDevice (id) {
      this.$confirm("确认扫描设备？", "提示", {
        confirmButtonText: '确定',
        confirmButtonClass: 'confirm-btn-blue',
        iconClass: 'el-icon-c-blue',
        cancelButtonText: '取消'
      }).then( () => {
        this.scan(this.$uri.device.scanDevice, {caseIds: [id]})
      }).catch( () => {})
    },
    /* 删除设备池 */
    deleteCase (id) {
      this.$confirm("删除设备池后会导致设备池内的设备恢复出厂设置，清除数据，是否继续？", "提示", {
        confirmButtonText: '确定',
        confirmButtonClass: 'confirm-btn-red',
        iconClass: 'el-icon-c-red',
        cancelButtonText: '取消'
      }).then( () => {
        let that = this
        that.$post(that.$uri.device.caseDelete, {id}).then(res => {
          if (res.success) {
            setTimeout(() => {that.getDeviceCaseList()}, 1000)
          } else {
            that.$message.error("删除失败")
          }
        })

      }).catch( () => {})
    },
    /* 查看设备池详情 */
    goCaseDetail (info) {
      this.$store.dispatch(this.$action.GO_CASE_DETAIL, info)
    },
    /* 查看设备列表 */
    goCaseDev (info) {
      this.$store.dispatch(this.$action.GO_CASE_DEV, info)
    }
  },
  mounted () {
    this.getDeviceCaseList()
  }
};
</script>

<style lang="less" scoped>
.device-case {
  .list-bottom {
    padding: 10px 8px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .list-bottom-btn {
      display: flex;
      flex-direction: row;
    }
  }
}
</style>