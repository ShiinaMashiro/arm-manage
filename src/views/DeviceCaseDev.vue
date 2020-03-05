<template>
  <div class="device-case-dev border-all">
    <el-table ref="multipleTable" :data="info.list" @row-click="checkRow" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" :selectable="isCommonCard"></el-table-column>
      <el-table-column prop="id" label="ID" min-width="50px">
        <template slot-scope="scope">
          {{scope.row.cardType === 1 ? scope.row.id : "分层"}}
        </template>
      </el-table-column>
      <el-table-column prop="slotNo" label="槽位号"></el-table-column>
      <el-table-column prop="deviceIp" label="设备IP"></el-table-column>
      <el-table-column prop="deviceNo" label="设备编号"></el-table-column>
      <el-table-column prop="version" label="设备版本"></el-table-column>
      <el-table-column prop="softinstalled" label="应用安装数量"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span :style="scope.row | statusClassFilter">
            {{scope.row | statusStr}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="groupName" label="分组"></el-table-column>
      <el-table-column prop="disk" label="空间">
        <template slot-scope="scope">
          {{scope.row.disk}}/{{scope.row.diskSd}}
        </template>
      </el-table-column>
      <el-table-column min-width="120px" label="操作">
        <template slot-scope="scope">
          <!--<el-button type="text" size="small" :disabled="scope.row.isDistributed === 0" @click="recoverDev(scope.row.deviceIp)">回收</el-button>-->
          <el-button type="text" size="small" :disabled="scope.row.deviceStatus !== 0" @click="initDev(scope.row.deviceIp)"
                     v-if="$store.getters.checkChangeAuth() && scope.row.cardType !== 2">恢复出厂</el-button>
          <el-button type="text" size="small" slot="reference" @click="groupDevPop(scope.row.deviceIp)"
                     v-if="$store.getters.checkChangeAuth() && scope.row.cardType !== 2">分组</el-button>
          <el-button type="text" size="small" :disabled="scope.row.deviceStatus !== 0" slot="reference"
                     @click="h5Test(scope.row.deviceNo)"  v-if="$store.getters.checkChangeAuth() && scope.row.cardType !== 2">控制</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="list-bottom">
      <div class="list-bottom-btn">
        <el-button size="small" plain :disabled="multipleSelection.length === 0" @click="rebootDevBatch" v-if="$store.getters.checkChangeAuth()">重启</el-button>
        <el-button size="small" plain :disabled="multipleSelection.length === 0" @click="deleteDevBatch" v-if="$store.getters.checkChangeAuth()">删除</el-button>
      </div>
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
    <el-dialog title="设备分组" :append-to-body="true" :visible.sync="groupDevPopShow"  width="500px" top="15vh">
      <el-select v-model="groupInfo.groupId" placeholder="请选择">
        <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
        </el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="groupDevPopShow = false">取 消</el-button>
        <el-button type="primary" @click="groupDev">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "DeviceCaseDev",
  data () {
    return {
      info: {
        success: false,
        caseList: [],
        total: 0
      },
      page: { // 分页参数
        startPage: 1,
        limit: 20,
        caseNo: this.$store.state.caseInfo.caseNo
      },
      multipleSelection: [], // 选中的对象列表
      groupDevPopShow: false, // 是否显示分组弹窗
      formLabelWidth: '120px',
      groupInfo: {
        groupId: '',
        deviceIp: ''
      },
      options: [],
      timeoutId: 0
    }
  },
  methods: {
    /* 表单击行事件 */
    checkRow(r, c ,e) {
      if (r.cardType === 1) this.$refs.multipleTable.toggleRowSelection(r)
    },
    /* 获取设备列表 */
    getDeviceList () {
      let that = this
      that.$post(that.$uri.device.deviceList, that.page).then(res => {
        that.info = res
      })
    },
    /* 获取设备列表 */
    getDeviceList2Refresh () {
      let that = this
      that.$post(that.$uri.device.deviceList, that.page).then(res => {
        this.info.list.forEach(v => {
          res.list.forEach(i => {
            if (v.id === i.id) {
              v.deviceStatus = i.deviceStatus
            }
          })
        })
      })
    },
    /* 推流 */
    h5Test (deviceNo) {
      console.log("aasdasfas")
      let tempwindow = window.open()
      tempwindow.location = this.$store.getters.h5TestUrl(deviceNo)
    },
    isCommonCard (row, index) {
      return row.cardType === 1
    },
    /* 当前页改变 */
    currentChangeHandle (val) {
      this.page.startPage = val
      this.getDeviceList()
    },
    /* 每页条数改变 */
    sizeChangeHandle (val) {
      this.page.limit = val
      this.getDeviceList()
    },
    /* 获取选中的数据 */
    handleSelectionChange (val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    /* 删除设备 */
    async deleteDev (deviceIp) {
      let that = this
      await that.$post(that.$uri.device.deviceDelete, {deviceIp})
    },
    /* 批量删除设备 */
    deleteDevBatch () {
      this.$confirm("删除设备会导致设备恢复出厂设置，清除数据，是否继续？", "提示", {
        confirmButtonText: '确定',
        confirmButtonClass: 'confirm-btn-red',
        iconClass: 'el-icon-c-red',
        cancelButtonText: '取消'
      }).then( () => {
        let deviceIps = []
        this.multipleSelection.forEach(v => {
          deviceIps.push(v.deviceIp)
        })
        let that = this
        that.$post(that.$uri.device.deviceDelete, {deviceIps}).then(res => {
          this.$message.success("删除完成")
          this.getDeviceList()
        })
      }).catch( () => {})
    },
    /* 设备重启 */
    async rebootDev (deviceIp) {
      let that = this
      await that.$post(that.$uri.device.deviceReboot, {deviceIp})
    },
    /* 设备批量重启 */
    rebootDevBatch () {
      this.$confirm("重启设备会导致当前应用缓存丢失，是否继续？", "提示", {
        confirmButtonText: '确定',
        confirmButtonClass: 'confirm-btn-yellow',
        iconClass: 'el-icon-c-yellow',
        cancelButtonText: '取消'
      }).then( () => {
        let deviceIps = []
        this.multipleSelection.forEach(v => {
          deviceIps.push(v.deviceIp)
        })
        let that = this
        that.$post(that.$uri.device.deviceReboot, {deviceIps}).then(res => {
          this.$message.success("重启完成")
          this.getDeviceList()
        })
      }).catch( () => {})
    },
    /* 恢复出厂设置 */
    initDev (deviceIp) {
      this.$confirm("恢复出厂后设备的应用和数据都会被清除， 是否继续？", "提示", {
        confirmButtonText: '确定',
        confirmButtonClass: 'confirm-btn-red',
        iconClass: 'el-icon-c-red',
        cancelButtonText: '取消'
      }).then( () => {
        let that = this
        that.$post(that.$uri.device.deviceRestore, {deviceIp}).then(res => {
          that.$message.success("恢复出厂设置成功")
        })
      }).catch( () => {})
    },
    /* 设备回收 */
    recoverDev (deviceIp) {
      let that = this
      that.$post(that.$uri.device.deviceRecover, {deviceIp}).then(res => {
        that.$message.success("回收成功")
      })
    },
    /* 获得分组信息 */
    getGroupList () {
      let that = this
      that.$post(that.$uri.group.list, {}).then(res => {
        let options = []
        res.list.forEach(v => {
          options.push({
            value: v.id,
            label: v.groupName
          })
        })
        this.options = options
      })
    },
    /* 设备分组 */
    groupDev () {
      let that = this
      that.$post(that.$uri.device.deviceGrouping, that.groupInfo).then(res => {
        that.$message.success("分组成功")
        this.groupDevPopShow = false
        this.getDeviceList()
      })
    },
    /* 弹出分组弹框 */
    groupDevPop (deviceIp) {
      this.groupDevPopShow = true
      this.groupInfo.deviceIp = deviceIp
    },
    /* 10s刷新一次数据 */
    refreshDevList () {
      if (this.$route.meta.refresh) {
        this.getDeviceList2Refresh()
        setTimeout(() => {
          this.refreshDevList()
        }, 5000)
      }
    }
  },
  filters: {
    statusStr (row) {
      if (row.isFlow === 1) return "推流中"
      switch (row.deviceStatus) {
        case 0: return "正常";
        case 1: return "未更新";
        case 2: return "应用安装中";
        case 3: return "故障";
        case 4: return "预启动";
        case 5: return "清理中";
        case 6: return "升级中";
        case 7: return "应用结束中";
      }
    },
    statusClassFilter (row) {
      if (row.isFlow === 1) return {color: "green"}
      switch (row.deviceStatus) {
        case 0: return {color: "#333"};
        case 3: return {color: "red"};
        default: return {color: "#eab820"}
      }
    }
  },
  mounted () {
    this.getDeviceList()
    this.getGroupList()
    this.refreshDevList()
  }
};
</script>

<style lang="less" scoped>
.device-case-dev {
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