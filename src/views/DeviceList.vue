<template>
  <div class="dev-list">
    <div class="dev-list-search">
      <div class="search-btn">
        <el-button size="small" type="primary" @click="addDevicePopShow = true" v-if="$store.getters.checkChangeAuth()">手动添加</el-button>
        <el-button type="text" size="small" @click="advancedShow = !advancedShow">高级搜索</el-button>
      </div>
      <div class="search-advanced" v-show="advancedShow">
        <div class="search-main">
          <div class="search-main-item">
            <span>选择分组:</span>
            <div class="item-input">
              <el-select v-model="searchInfo.groupId" size="mini" placeholder="分组">
                <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="search-main-item">
            <span>设备状态:</span>
            <div class="item-input">
              <el-select v-model="searchInfo.deviceStatus" size="mini" placeholder="状态">
                <el-option
                        v-for="item in searchOptions.status"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="search-main-item">
            <span>选择空间:</span>
            <div class="item-input">
              <el-select v-model="searchInfo.isDiskFull" size="mini" placeholder="空间">
                <el-option
                        v-for="item in searchOptions.space"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="search-main-item">
            <span>选择引擎版本:</span>
            <div class="item-input">
              <el-select v-model="searchInfo.engineType" size="mini" placeholder="引擎版本">
                <el-option
                        v-for="item in searchOptions.version"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="search-main-item">
            <span>设备池编号:</span>
            <div class="item-input">
              <el-input v-model="searchInfo.caseNo" size="mini"></el-input>
            </div>
          </div>
          <div class="search-main-item">
            <span>设备IP:</span>
            <div class="item-input">
              <el-input v-model="searchInfo.deviceIp" size="mini"></el-input>
            </div>
          </div>
          <div class="search-main-item">
            <span>设备编号:</span>
            <div class="item-input">
              <el-input v-model="searchInfo.deviceNo" size="mini"></el-input>
            </div>
          </div>
        </div>
        <div class="search-btn">
          <el-button type="primary" size="mini" @click="getDeviceList">搜索</el-button>
          <el-button size="mini" @click="advancedShow = false">取消</el-button>
        </div>
      </div>
    </div>
    <div class="device-case-dev border-all">
      <el-table ref="multipleTable" :data="info.list" @row-click="checkRow" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" :selectable="isCommonCard"></el-table-column>
        <el-table-column prop="id" label="ID" min-width="50px">
          <template slot-scope="scope">
            {{scope.row.cardType === 1 ? scope.row.id : "分层"}}
          </template>
        </el-table-column>
        <el-table-column prop="slotNo" label="槽位号"></el-table-column>
        <el-table-column prop="slotNo" label="终端标志"></el-table-column>
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
      <el-dialog title="手动添加" :append-to-body="true" :visible.sync="addDevicePopShow" width="500px" top="15vh">
        <div>
          <el-form ref="form" :model="addDevInfo" label-width="150px" label-position="left">
            <el-form-item label="分层处理器选择">
              <el-select v-model="addDevInfo.caseId" placeholder="请选择">
                <el-option
                        v-for="item in addDevOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="IP">
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
  </div>

</template>

<script>
  export default {
    name: "DeviceList",
    data () {
      return {
        info: {
          success: false,
          list: [],
          total: 0
        },
        page: { // 分页参数
          startPage: 1,
          limit: 20
        },
        multipleSelection: [], // 选中的对象列表
        groupDevPopShow: false, // 是否显示分组弹窗
        formLabelWidth: '120px',
        groupInfo: {
          groupId: '',
          deviceIp: ''
        },
        options: [],
        caseOptions: [],
        addDevicePopShow: false, // 显示手动添加弹窗
        addDevInfo: {
          caseId: "",
          deviceIp: ""
        },
        advancedShow: false,
        searchInfo: {
          deviceIp: "",
          caseNo: "",
          deviceStatus: "",
          engineType: "",
          groupId: "",
          deviceNo: "",
          isDiskFull: ""
        },
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
          }, ...this.caseOptions
        ]
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
        that.$post(that.$uri.device.deviceList, {...that.page, ...that.searchInfo}).then(res => {
          that.info = res
        })
      },
      /* 获取设备列表 */
      getDeviceList2Refresh () {
        let that = this
        that.$post(that.$uri.device.deviceList, that.page).then(res => {
          that.info.list.forEach(v => {
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
        this.$confirm("确认批量删除设备？", "提示", {
          type: "warning"
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
        this.$confirm("确认批量重启？", "提示", {
          type: "warning"
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
        this.$confirm("确认恢复出厂设置？", "提示", {
          type: "warning"
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
      /* 获得设备池信息 */
      getDevGroupList () {
        let that = this
        that.$post(that.$uri.device.caseList, {}).then(res => {
          let options = []
          res.list.forEach(v => {
            options.push({
              value: v.id,
              label: v.caseNo
            })
          })
          this.caseOptions = options
        })
      },
      /* 设备分组 */
      groupDev () {
        let that = this
        that.$post(that.$uri.device.deviceGrouping, that.groupInfo).then(res => {
          that.$message.success("分组成功")
          that.groupDevPopShow = false
          that.getDeviceList()
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
          that.getDeviceList()
        })
      },
      /* 10s刷新一次数据 */
      refreshDevList () {
        console.log("---------------------------aaaaaaaaa")
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
      this.getDevGroupList()
      this.getGroupList()
      this.getEngineVersion()
      this.refreshDevList()
    }
  };
</script>

<style lang="less" scoped>
.dev-list {
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