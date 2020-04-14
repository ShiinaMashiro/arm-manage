<template>
  <div class="dev-list">
    <div class="preview-bar" style="position: fixed; top: 121px; width: 100%; z-index: 2000;background-color: white;height: 100px">
      <div class="preview-bar-operate" v-if="!viewMode">
        <el-checkbox v-model="allChecked" @change="allCheckedChange" style="margin-right: 10px">全选</el-checkbox>
        <el-button type="primary" size="mini" :disabled="!hasSelect" @click="rebootOne">重启设备</el-button>
        <el-button type="primary" size="mini" :disabled="!hasSelect" @click="homeOne">一键HOME</el-button>
        <el-button type="primary" size="mini" :disabled="!hasSelect" @click="recoverOne">恢复出厂设置</el-button>
        <el-button type="primary" size="mini" :disabled="!hasSelect || !snapshotComplete" @click="snapshotOne">刷新截图</el-button>
      </div>
      <div class="preview-bar-operate" v-else>
      </div>
      <div style="margin-right: 300px">
        <span>切换视图：</span>
        <el-button type="text" :disabled="!viewMode" @click="changeMode(false)">预览图</el-button>
        <el-button type="text" :disabled="viewMode"  @click="changeMode(true)">列表</el-button>
      </div>
    </div>
    <div class="device-case-dev border-all" v-if="viewMode" style="margin-top: 110px">
      <el-table ref="multipleTable" :data="info.list" size="mini" @row-click="checkRow" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
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
                       v-if="$store.state.isAdmin && scope.row.cardType !== 2">分组</el-button>
            <el-button type="text" size="small" :disabled="scope.row.deviceStatus !== 0" slot="reference"
                       @click="deviceWindowOpen(scope.row.id, scope.row.deviceNo)"  v-if="$store.getters.checkChangeAuth() && scope.row.cardType !== 2">控制</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="list-bottom">
        <div class="list-bottom-btn">
          <el-button size="small" plain :disabled="multipleSelection.length === 0" @click="rebootDevBatch" v-if="$store.getters.checkChangeAuth()">重启</el-button>
          <!--<el-button size="small" plain :disabled="multipleSelection.length === 0" @click="deleteDevBatch" v-if="$store.getters.checkChangeAuth()">删除</el-button>-->
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
      <el-dialog title="手动添加" :append-to-body="true" :visible.sync="addDevicePopShow" width="500px" top="15vh">
        <div>
          <el-form ref="form" :model="addDevInfo" label-width="130px" label-position="left">
            <el-form-item label="分层处理器IP">
              <el-select v-model="addDevInfo.caseId" placeholder="请选择">
                <el-option
                        v-for="item in addDevOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备用处理器IP">
              <el-input v-model="addDevInfo.deviceIp"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addDev">确定</el-button>
              <el-button @click="addDevicePopShow = false">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </div>
    <div class="preview-main" v-else  style="margin-top: 110px">
      <template v-for="(item, index) in info.list">
        <div :key="item.id" class="snapshot-main" :style="{'margin-right': '15px', 'margin-top': '20px', border: aaa === index ? '1px solid #409eff' : '1px solid #DDD'}">
          <el-tooltip class="item" effect="dark" :content="item.deviceIp + ' adb端口：' + adbPortFilter(item)" placement="top-start">
          <div style="text-align: left;display: flex;flex-direction: row;justify-content: space-between" class="snapshot-main-head">
            <el-checkbox v-model="test[index]" @change="itemCheckedChange" style="flex-grow: 1">
                <span>{{item.id}}</span>
            </el-checkbox>
            <span :style="item | statusClassFilter" style="padding-right: 5px;font-size: 12px">
            {{deviceStatusStr[item.deviceIp]}}
          </span>
          </div>
          </el-tooltip>
          <div class="snapshot-main-img" style="position: relative;" @mouseenter="mouseEnter(index)"
               @mouseleave="mouseLeave(index)">
            <div v-show="aaa === index" style="position: absolute;left: 0;top: 5px;z-index: 1111;display: flex;flex-direction: column;align-items: flex-start;">
              <div style="margin-bottom: 5px"><el-button type="primary" size="mini" @click="rebootOneOne(item.deviceIp)">重启云机</el-button></div>
              <div style="margin-bottom: 5px"><el-button type="primary" size="mini" @click="downloadSnapshot(index)">下载截图</el-button></div>
              <div style="margin-bottom: 5px"><el-button type="primary" size="mini" @click="showQrCode(item.deviceIp)">云机识别码</el-button></div>
              <div style="margin-bottom: 5px"><el-button type="primary" size="mini" @click="adbOpt(item.deviceIp, 1)">打开ADB</el-button></div>
              <div style="margin-bottom: 5px"><el-button type="primary" size="mini" @click="adbOpt(item.deviceIp, 0)">关闭ADB</el-button></div>
            </div>
            <el-image @click="deviceWindowOpen(item.id, item.deviceNo)"
                      v-loading="snapshotImgLoading[item.deviceIp]"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)"
                    style="width: 144px;"
                    :src="statusImg(item.deviceStatus) || snapshotImg[item.deviceIp]"
                    fit="cover"></el-image>
            <!--<img @click="h5Test(item.deviceNo)" style="width: 200px" :src="statusImg(item.deviceStatus) || snapshotImg[item.deviceIp]"/>-->
          </div>
        </div>
      </template>
    </div>

    <el-dialog
            title="云机识别码"
            :visible.sync="qrCodeShow"
            :modal="false"
            width="20%">
            <!--<img :src="qrCodeUrl"/>-->
            <el-image
              :src="qrCodeUrl"
              fit="cover"></el-image>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "GroupListDevShow",
  data () {
    return {
      adbPort:{},
      snapFail: require('../assets/snapfail.png'),
      snapNotUpdate: require('../assets/notupdate.png'),
      snapError: require('../assets/snaperror.png'),
      snapRestart: require('../assets/snaprestart.png'),
      snapshotImg: {},
      snapshotImgLoading: {},
      deviceStatusStr: {},
      downloadHref: '',
      filename: '',
      qrCodeShow: false,
      qrCodeUrl: '',
      aaa: -1,
      test: [],
      oprShowList: [],
      allChecked: false,
      viewMode: false, // true为列表，false为预览
      snapshotSuccess: false,
      info: {
        success: false,
        list: [],
        total: 0
      },
      page: { // 分页参数
        startPage: 1,
        limit: 20
      },
      oldLimit: 20,
      multipleSelection: [], // 选中的对象列表
      groupDevPopShow: false, // 是否显示分组弹窗
      formLabelWidth: '120px',
      groupInfo: {
        groupId: '',
        deviceIp: ''
      },
      options: [],
      addDevicePopShow: false, // 显示手动添加弹窗
      addDevInfo: {
        caseId: "",
        deviceIp: ""
      },
      advancedShow: false,
      searchOptions: {
        status: [
          {
            label: "正常",
            value: 0
          }, {
            label: "未更新",
            value: 1
          }, {
            label: "应用安装中",
            value: 2
          }, {
            label: "故障",
            value: 3
          }, {
            label: "预启动",
            value: 4
          }, {
            label: "清理中",
            value: 5
          }, {
            label: "升级中",
            value: 6
          }, {
            label: "应用结束中",
            value: 7
          }
        ],
        space: [
          {
            label: "充足",
            value: 0
          }, {
            label: "不足",
            value: 1
          }
        ],
        version: []
      },
      timeoutId: 0
    }
  },
  computed: {
    addDevOptions () {
      return [
        {
          label: "分层处理器",
          value: 0
        }, ...this.options
      ]
    },
    hasSelect() {
      for(let i = 0; i < this.test.length; i++) {
        if (this.test[i] === true) {
          return true
        }
      }
      return false
    },
    imgUrl() {
      return this.snapshotSuccess ? '.jpg?temp=' + new Date().getTime() : ''
    },
    selectIps() {
      let ips = []
      for(let i = 0; i < this.info.list.length; i++) {
        if (this.test[i] === true) {
          ips.push(this.info.list[i].deviceIp)
        }
      }
      return ips
    },
    snapshotComplete() {
      let success = false
      for (let k in this.snapshotImgLoading) {
        success = success || this.snapshotImgLoading[k]
      }
      return !success
    }
  },
  methods: {
    adbOpt(deviceIp, on) {
      let that = this
      that.$post(that.$uri.device.turnAdb, {deviceIp, on}).then(res => {
        if (res.success) {
          that.$message.success((on === 1 ? '开启' : '关闭') + '成功！')
        } else {
          that.$message.error((on === 1 ? '开启' : '关闭') + '失败！' + res.message)
        }
      })
    },
    statusImg(status) {
      return status === 1 ? this.snapNotUpdate :
        (status === 3 ? this.snapError : null)
    },
    downloadSnapshot(index) {
      let that = this
      that.$post(that.$uri.device.snapshot, {deviceIp: [that.info.list[index].deviceIp], isSave: 1}).then(res => {
        if (res.success) {
          that.downloadHref = '/snapshot/' + that.info.list[index].deviceNo + '.png?temp=' + Math.random()
          that.filename = that.info.list[index].deviceNo + '.png'
          let a = document.createElement('a')
          a.href = that.downloadHref
          a.download = that.filename
          a.click()
        }
      })
    },
    showQrCode(ip) {
      let that = this
      that.$post(that.$uri.device.qrCode, {deviceIp: ip}).then(res => {
        that.qrCodeUrl = res.data
        that.qrCodeShow = true
      })
    },
    getImgUrl(no) {
      return '/snapshot/' + no + '.jpg?temp=' + new Date().getTime()
    },
    itemCheckedChange(checked) {
      if (!checked) {
        this.allChecked = false
      }
    },
    rebootOne() {
      this.$confirm("重启设备会导致当前应用缓存丢失，是否继续？", "提示", {
        confirmButtonText: '确定',
        confirmButtonClass: 'confirm-btn-red',
        iconClass: 'el-icon-c-red',
        cancelButtonText: '取消'
      }).then( () => {
        let that = this
        that.$post(that.$uri.device.deviceReboot, {deviceIps: that.selectIps}).then(res => {
          this.$message.success("重启完成")
        })
      }).catch( () => {})
    },
    rebootOneOne(ip) {
      this.$confirm("重启设备会导致当前应用缓存丢失，是否继续？", "提示", {
        confirmButtonText: '确定',
        confirmButtonClass: 'confirm-btn-red',
        iconClass: 'el-icon-c-red',
        cancelButtonText: '取消'
      }).then( () => {
        let that = this
        that.$post(that.$uri.device.deviceReboot, {deviceIps: [ip]}).then(res => {
          this.$message.success("重启完成")
        })
      }).catch( () => {})
    },
    homeOne() {
      this.$confirm("所有设备返回桌面，是否继续？", "提示", {
        confirmButtonText: '确定',
        confirmButtonClass: 'confirm-btn-red',
        iconClass: 'el-icon-c-red',
        cancelButtonText: '取消'
      }).then( () => {
        let that = this
        that.$post(that.$uri.device.backHome, {deviceIps: that.selectIps}).then(res => {
          this.$message.success("返回成功")
          setTimeout(() => {
            this.snapshotOne()
          }, 1000)

        })
      }).catch( () => {})
    },
    recoverOne() {
      this.$confirm("恢复出厂后设备的应用和数据都会被清除， 是否继续？", "提示", {
        confirmButtonText: '确定',
        confirmButtonClass: 'confirm-btn-red',
        iconClass: 'el-icon-c-red',
        cancelButtonText: '取消'
      }).then( () => {
        let that = this
        that.selectIps.forEach(ip => {
          that.$post(that.$uri.device.deviceRestore, {deviceIp: ip}).then(res => {
            that.$message.success("恢复出厂命令已发送")
          })
        })
      }).catch( () => {})
    },
    snapshotOne() {
      let that = this
      that.snapshotSuccess = false
      that.selectIps.forEach(ip => {
        that.$set(that.snapshotImgLoading, ip, true)
        that.$post(that.$uri.device.snapshot, {deviceIp: ip, isSave: 0}).then(res => {
          if (res.success) {
            that.$set(that.snapshotImg, ip, res.data)
          }
          that.$set(that.snapshotImgLoading, ip, false)
        })
      })
    },
    mouseEnter(index) {
      this.aaa = index
    },
    mouseLeave(index) {
      this.aaa = -1
    },
    /* 切换视图模式 */
    changeMode(mode) {
      this.snapshotSuccess = false
      this.viewMode = mode
      this.$store.commit(this.$mutation.GROUP_DEV_SHOW_MODE, mode)
      if (!this.viewMode) {
        this.allChecked = false
        this.oldLimit = this.page.limit
        this.page.limit = 1000
        let that = this
        that.$post(that.$uri.device.deviceList, {...that.page, groupId: that.$store.state.groupInfo.id}).then(res => {
          that.info = res
          that.test = []
          that.info.list.forEach(v => {
            if (that.adbPort[v.caseNo] == null) {
              that.adbPort[v.caseNo] = 0
              that.$post(that.$uri.device.caseInfoByCaseNo, {caseNo: v.caseNo}).then(res => {
                if (res.success) {
                  that.adbPort[v.caseNo] = res.data.adbPort
                } else {
                  that.adbPort[v.caseNo] = null
                }
              })
            }

            that.test.push(false)
            that.oprShowList.push(false)
            that.deviceStatusStr[v.deviceIp] = that.statusStrM(v)

            that.$post(that.$uri.device.snapshot, {deviceIp: v.deviceIp, isSave: 0}).then(res => {
              if (res.success) {
                that.$set(that.snapshotImg, v.deviceIp, res.data)
              }
            })
          })
        })
      } else {
        this.page.limit = this.oldLimit
        this.getDeviceList()
      }
    },
    allCheckedChange(checked) {
      for(let i = 0; i < this.test.length; i++) {
        this.test.splice(i, 1, checked)
      }
    },
    /* 表单击行事件 */
    checkRow(r, c ,e) {
      this.$refs.multipleTable.toggleRowSelection(r)
    },
    /* 获取设备列表 */
    getDeviceList () {
      let that = this
      that.$post(that.$uri.device.deviceList, {...that.page, groupId: that.$store.state.groupInfo.id}).then(res => {
        that.info = res
        that.test = []
        that.info.list.forEach(v => {
          that.test.push(false)
          that.oprShowList.push(false)
          // that.snapshotImg[v.deviceIp] = ''
          that.deviceStatusStr[v.deviceIp] = that.statusStrM(v)
        })
      })
    },
    /* 获取设备列表 */
    getDeviceList2Refresh () {
      let that = this
      that.$post(that.$uri.device.deviceList, {...that.page, groupId: that.$store.state.groupInfo.id}).then(res => {
        that.info.list.forEach(v => {

          res.list.forEach(i => {
            if (v.id === i.id && v.deviceStatus === 1 && i.deviceStatus !== 1) {
              setTimeout(() => {
                that.$post(that.$uri.device.snapshot, {deviceIp: v.deviceIp, isSave: 0}).then(res => {
                  if (res.success) {
                    that.$set(that.snapshotImg, v.deviceIp, res.data)
                  }
                })
              }, 1000)
            }
          })
        })
        that.info.list = res.list
        res.list.forEach(i => {
            that.$set(that.deviceStatusStr, i.deviceIp, that.statusStrM(i))
        })
      })
    },
    /* 推流 */
    /*
    h5Test (deviceNo) {
      let tempwindow = window.open()
      tempwindow.location = this.$store.getters.h5TestUrl(deviceNo)
    },
    */
    deviceWindowOpen (id, deviceNo) {
      if (this.$store.state.deviceWindowMode.show) {
        this.$message.error("同时只能控制一台设备！")
      } else {
        this.$store.commit(this.$mutation.DEVICE_WINDOW_SHOW_MODE, {
          show: true,
          id,
          deviceNo
        });
      }
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
        confirmButtonClass: 'confirm-btn-red',
        iconClass: 'el-icon-c-red',
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
      })
    },
    /* 弹出分组弹框 */
    groupDevPop (deviceIp) {
      this.groupDevPopShow = true
      this.groupInfo.deviceIp = deviceIp
    },
    /* 获取所有引擎版本信息 */
    getEngineVersion () {
      let that = this
      that.$post(that.$uri.system.engineList, {}).then(res => {
        let list = []
        res.data.forEach(v => {
          list.push({
            label: v.engineTypeName,
            value: v.engineType
          })
        })
        that.searchOptions.version = list
      })
    },
    /* 手动添加设备 */
    addDev () {
      let that = this
      that.$post(that.$uri.device.addDevice, that.addDevInfo).then(res => {
        that.$message.success("添加成功")
        that.addDevicePopShow = false
      })
    },
    /* 10s刷新一次数据 */
    refreshDevList () {
      if (this.$route.meta.refresh) {
        this.getDeviceList2Refresh()
        setTimeout(() => {
          this.refreshDevList()
        }, 5000)
      }
    },
    statusStrM (row) {
      if (row.isFlow === 1) return "推流中"
      switch (row.deviceStatus) {
        case 0: return "";
        case 1: return "未更新";
        case 2: return "应用安装中";
        case 3: return "故障";
        case 4: return "预启动";
        case 5: return "清理中";
        case 6: return "升级中";
        case 7: return "应用结束中";
      }
    },
    adbPortFilter (row) {
      let port = this.adbPort[row.caseNo] || 0
      let num1 = parseInt(row.slotNo.substr(0, row.slotNo.indexOf('.')))
      let num2 = parseInt(row.slotNo.substr(row.slotNo.indexOf('.') + 1))
      return port + num1 * 2 + num2
    },
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
    statusStrPre (row) {
      if (row.isFlow === 1) return "推流中"
      switch (row.deviceStatus) {
        case 0: return "";
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
    this.changeMode(this.$store.state.groupDevShowMode)
    this.getGroupList()
    this.getEngineVersion()
    this.refreshDevList()
  }
};
</script>

<style lang="less" scoped>
  .dev-list {
    .preview-bar {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      .preview-bar-operate {
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
      }
      .preview-bar-cut {
        font-size: 16px;
      }
    }
    .preview-main {
      display: flex;
      flex-direction: row;
      /*justify-content: space-between;*/
      flex-wrap: wrap;
      .snapshot-main {
        border: 1px solid #DDD;
        border-radius: 6px;
        .snapshot-main-head {
          padding: 0 5px;
          width: 100%;
        }
        .snapshot-main-img {

        }
      }
      #snapshot-main :hover {
        border: 1px solid #409eff;
        border-radius: 6px;
      }
    }
    .preview-main :after {
      content: '';
      /*width: 200px;*/
    }
    .dev-list-search {
      width: 100%;
      display: flex;
      flex-direction: column;
      .search-btn {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      .search-advanced {
        display: flex;
        flex-direction: column;
        .search-main {
          margin-top: 10px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          flex-wrap: wrap;
          .search-main-item {
            width: 24%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            /*flex-grow: 1;*/
            padding: 5px 10px;
            span {
              font-size: 12px;
            }
            .item-input {
              width: 180px;
            }
          }
        }
        .search-btn {
          padding: 0 10px;
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          align-items: center;
        }
      }
    }
    .device-case-dev {
      margin-top: 10px;
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
  }
</style>
