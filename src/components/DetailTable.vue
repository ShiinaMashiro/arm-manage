<template>
  <div>
    <div class="detail-table">

      <div v-if="caseInfo">
        <!--<template v-for="(item, index) in list">
          <DetailTableItem class="detail-table-body-item" :key="index" :name="item.name" :param="item.value"></DetailTableItem>
        </template>-->
        <InfoView ref="v1" refName="v1" title="设备池名称" msg="" :list="nameList" :info="caseInfo" :save="saveCaseInfoNew" editBtnName="修改备注"></InfoView>
        <InfoView ref="v2" refName="v2" title="网络设置" msg="设备池的网络，NTP服务器地址等相关内容" :list="netList" :info="caseInfo" :save="saveCaseInfoNew" editBtnName="设置"></InfoView>
        <!--<div class="info-view">
          <div class="info-view-title">网络设置</div>
          <div class="info-view-main">
            <span class="info-view-item" style="font-size: 12px">设备池的网络，NTP服务器地址等相关内容</span>
            <template v-for="(item, index) in netList">
              <div class="info-view-item" :key="index">
                <span style="color: red;" v-if="enginePopShow && item.notNull">*</span>
                <span>{{item.name}}：</span>
                <span v-if="!enginePopShow || !item.edit">{{caseInfo[item.key]}}</span>
                <el-input v-else size="mini" v-model="item.value" style="width: 150px"></el-input>
              </div>
            </template>
            <div class="info-view-item-btn">
              <el-button size="small" type="info" v-if="!enginePopShow" @click="enginePopShow = true">设置</el-button>
              <el-button size="small" type="info" :disabled="!canSave" v-if="enginePopShow" @click="saveCaseInfoNew(caseInfo)">保存</el-button>
              <el-button size="small" type="info" v-if="enginePopShow" @click="enginePopShow = false">取消</el-button>
            </div>
          </div>
        </div>-->
        <InfoView ref="v3" refName="v3" title="分层设置" msg="设备池的分层处理器IP，用于管理应用分发等" :list="cenList" :info="caseInfo" :save="saveCaseInfoNew" editBtnName="设置"></InfoView>
        <InfoView ref="v4" refName="v4" title="IP设置" msg="设备池内设备的起始IP，设置后设备池内的设备IP会根据起始IP自动递增" :list="ipList" :info="ipSetInfo" :save="ipSet" editBtnName="设置"></InfoView>
      </div>

      <!-- 网络设置 -->
      <el-dialog title="网络设置" :append-to-body="true" :visible.sync="networkPopShow" width="500px" top="15vh">
        <div>
          <el-form ref="form" :model="caseInfo" label-width="130px" label-position="left">
            <el-form-item label="网关">
              <el-input v-model="caseInfo.route"></el-input>
            </el-form-item>
            <el-form-item label="子网掩码">
              <el-input v-model="caseInfo.netmask"></el-input>
            </el-form-item>
            <el-form-item label="DNS">
              <el-input v-model="caseInfo.dns"></el-input>
            </el-form-item>
            <el-form-item label="NTP地址">
              <el-input v-model="caseInfo.ntpAddress"></el-input>
            </el-form-item>
            <el-form-item label="初始端口">
              <el-input v-model="caseInfo.initialPort"></el-input>
            </el-form-item>
            <el-form-item label="ADB端口">
              <el-input v-model="caseInfo.adbPort"></el-input>
            </el-form-item>
            <el-form-item label="是否有状态">
              <el-switch v-model="caseInfo.isStatus"
                         active-value="1"
                         inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item label="IP是否锁定">
              <el-switch v-model="caseInfo.isLock"
                         active-value="2"
                         inactive-value="1"></el-switch>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="networkSet">确定</el-button>
              <el-button @click="networkPopShow = false">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
      <!-- 分层设置 -->
      <el-dialog title="分层设置" :append-to-body="true" :visible.sync="nodePopShow" width="500px" top="15vh">
        <div>
          <el-form ref="form" :model="caseInfo" label-width="150px" label-position="left">
            <el-form-item label="分层处理器IP">
              <el-input v-model="caseInfo.nodeIp"></el-input>
            </el-form-item>
            <el-form-item label="备用分层处理器IP">
              <el-input v-model="caseInfo.nodeIpBak"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="nodeSet">确定</el-button>
              <el-button @click="nodePopShow = false">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
      <!-- ip设置 -->
      <el-dialog title="修改设备IP" :append-to-body="true" :visible.sync="ipPopShow" width="500px" top="15vh">
        <div>
          <el-form ref="form" :model="ipChangeInfo" label-width="130px" label-position="left">
            <el-form-item label="设备起始IP">
              <el-input v-model="ipChangeInfo.initialIp"></el-input>
            </el-form-item>
            <el-form-item label="网关">
              <el-input v-model="ipChangeInfo.route"></el-input>
            </el-form-item>
            <el-form-item label="子网掩码">
              <el-input v-model="ipChangeInfo.netmask"></el-input>
            </el-form-item>
            <el-form-item label="网管IP">
              <el-input v-model="ipChangeInfo.webIp"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="ipSet">确定</el-button>
              <el-button @click="ipPopShow = false">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
      <!-- ip设置成功 -->
      <el-dialog title="IP批量修改成功" :append-to-body="true" :visible.sync="ipSuccessPopShow" width="500px" top="15vh">
        <div>
          <el-table :data="ipSuccessList">
            <el-table-column type="index" label="ID"></el-table-column>
            <el-table-column property="deviceIpBefore" label="修改前IP"></el-table-column>
            <el-table-column label="修改后IP">
              <template slot-scope="scope">
                <div v-if="scope.row.isSuccess">{{scope.row.deviceIpAfter}}</div>
                <div v-else style="color: red">失败</div>
              </template>
            </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="ipSuccessPopShow = false">确 定</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 备注设置 -->
      <el-dialog title="修改备注" :append-to-body="true" :visible.sync="remarkPopShow" width="500px" top="15vh">
        <div>
          <el-form ref="form" :model="caseInfo" label-width="130px" label-position="left">
            <el-form-item label="备注">
              <el-input v-model="caseInfo.remark"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="remarkChange">确定</el-button>
              <el-button @click="remarkPopShow = false">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </div>
    <!--<div class="detail-setting">
        <el-button type="info" plain size="small" @click="networkSetPop">网络设置</el-button>
        <el-button type="info" plain size="small" @click="nodeSetPop">分层设置</el-button>
        <el-button type="info" plain size="small" @click="ipSetPop">设备IP设置</el-button>
        <el-button type="info" plain size="small" @click="remarkChangePop">修改备注</el-button>
    </div>-->
  </div>
</template>

<script>
  import DetailTableItem from "@/components/DetailTableItem"
  import InfoView from "@/components/InfoView"

  export default {
  name: "DetailTable",
  components: {
    DetailTableItem,
    InfoView
  },
  data () {
    return {
      enginePopShow: false,
      networkPopShow: false,
      nodePopShow: false,
      ipPopShow: false,
      ipSuccessPopShow: false,
      remarkPopShow: false,
      caseInfo: null,
      ipSuccessList: [
        {
          deviceIpBefore: '1.1.1.1',
          deviceIpAfter: '1.1.2.4',
          isSuccess: true
        },
        {
          deviceIpBefore: '1.1.1.2',
          deviceIpAfter: '1.1.2.5',
          isSuccess: false
        },
        {
          deviceIpBefore: '1.1.1.3',
          deviceIpAfter: '1.1.2.6',
          isSuccess: true
        },
        {
          deviceIpBefore: '1.1.1.4',
          deviceIpAfter: '1.1.2.7',
          isSuccess: true
        }
      ],
      ipChangeInfo: {
        caseId: "",
        initialIp: "",
        route: "",
        netmask: "255.255.0.0",
        webIp: "",
        webPort: ""
      },
      list: [],
      nameList: [
        {
          name: 'ID',
          key: 'id',
          edit: false,
        },{
          name: '备注',
          key: 'remark',
          edit: true,
          notNull: false,
          value: ''
        }
      ],
      netList: [
        {
          name: '网关',
          key: 'route',
          edit: true,
          notNull: true,
          value: ''
        },{
          name: '子网掩码',
          key: 'netmask',
          edit: true,
          notNull: true,
          value: ''
        },{
          name: 'DNS',
          key: 'dns',
          edit: true,
          notNull: true,
          value: ''
        },{
          name: 'NTP地址',
          key: 'ntpAddress',
          edit: true,
          // notNull: true,
          value: ''
        },{
          name: '初始端口',
          key: 'initialPort',
          edit: true,
          // notNull: true,
          value: ''
        },{
          name: 'ADB端口',
          key: 'adbPort',
          edit: true,
          // notNull: true,
          value: ''
        },{
          name: '是否有状态',
          key: 'isStatus',
          edit: true,
          notNull: true,
          value: '',
          type: 'switch',
          active: '1',
          inactive: '0',
          show: (status) => {
            return status == 1 ? '是' : '否'
          }
        },{
          name: '是否锁定',
          key: 'isLock',
          edit: true,
          notNull: true,
          value: '',
          type: 'switch',
          active: '2',
          inactive: '1',
          show: (status) => {
            return status == 2 ? '是' : '否'
          }
        }
      ],
      cenList: [
        {
          name: '分层处理器IP',
          key: 'nodeIp',
          edit: true,
          notNull: true,
          value: ''
        },{
          name: '备用分层处理器IP',
          key: 'nodeIpBak',
          edit: true,
          notNull: true,
          value: ''
        }
      ],
      ipList: [
        {
          name: '设备池起始IP',
          key: 'initialIp',
          edit: true,
          notNull: true,
          value: ''
        },{
          name: '网关',
          key: 'route',
          edit: true,
          notNull: true,
          value: ''
        },{
          name: '子网掩码',
          key: 'netmask',
          edit: true,
          notNull: true,
          value: ''
        },{
          name: '网管IP',
          key: 'webIp',
          edit: true,
          notNull: true,
          value: ''
        }
      ]
    }
  },
  computed: {
    canSave() {
      for (let item of this.netList) {
        if (item.notNull && !item.value) {
          return false
        }
      }
      return true
    },
    ipSetInfo() {
      return {
        caseId: this.caseInfo.id,
        initialIp: this.caseInfo.nodeIp,
        route: this.caseInfo.route,
        netmask: "255.255.0.0",
        webIp: "",
        webPort: ""
      }
    }

  },
  methods: {
    /* 修改设备池信息 */
    saveCaseInfo () {
      let that = this
      that.$post(that.$uri.device.caseInfoSave, that.caseInfo).then(res => {
        that.networkPopShow = false
        that.nodePopShow = false
        that.remarkPopShow = false
        that.$message.success("修改成功")
        // 把修改保存到store
        that.$store.commit(that.$mutation.CASE_DETAIL, that.caseInfo)
        // 刷新数据
        this.list = this.$store.getters.detailTableList
      })
    },
    /* 修改设备池信息 */
    saveCaseInfoNew (info, refName) {
      console.log('saveCaseInfoNew')
      console.log(info)
      let that = this
      that.$post(that.$uri.device.caseInfoSave, info).then(res => {
        that.networkPopShow = false
        that.nodePopShow = false
        that.remarkPopShow = false
        that.$message.success("修改成功")
        that.$refs[refName].isEdit = false
        // 把修改保存到store
        that.$store.commit(that.$mutation.CASE_DETAIL, that.info)
        // 刷新数据
        this.list = this.$store.getters.detailTableList
      })
    },
    /* 网络设置 */
    networkSet () {
      this.saveCaseInfo()
    },
    /* 网络设置弹窗 */
    networkSetPop () {
      this.networkPopShow = true
    },
    /* 分层设置 */
    nodeSet () {
      this.saveCaseInfo()
    },
    /* ip设置 */
    ipSet (info, refName) {
      let that = this
      if (!/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|20\d|21[0-5])$/.test(info.initialIp)){
        that.$message.error("初始IP末位请务必在1-215之间")
        return
      }
      let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
      if (!reg.test(info.route) || !reg.test(info.webIp) || !reg.test(info.netmask)){
        that.$message.error("请填写正确的ip")
        return
      }

      this.$confirm('点击确定后将对设备IP进行自动填充修改，修改后设备会重启，如果输入有误，请点击取消返回修改，确定无误后，点击确认则对修改生效。', '提示', {
        confirmButtonText: '确定',
        confirmButtonClass: 'confirm-btn-red',
        iconClass: 'el-icon-c-red',
        cancelButtonText: '取消'
      }).then(() => {
        that.$post(that.$uri.device.updateDeviceIp, info).then(res => {
          if (res.success) {
            that.ipSuccessList = res.list
            that.ipSuccessPopShow = true
          } else {
            that.$message.error(res.message)
          }
        })
      }).catch(() => {});
    },
    /* 分层设置弹窗 */
    nodeSetPop () {
      this.nodePopShow = true
    },
    /* 设备IP设置弹窗 */
    ipSetPop () {
      /*let that = this
      that.$post(that.$uri.device.deviceList, {caseNo: that.caseInfo.caseNo}).then(res => {
        if (res.success) {
          for (let i in res.list) {
            if (res.list[i].cardType === 2) {
              that.ipChangeInfo.webIp = res.list[i].nodeIp
            }
          }
        }
      })*/
      this.ipChangeInfo.route = this.caseInfo.route
      this.ipChangeInfo.initialIp = this.caseInfo.nodeIp
      this.ipPopShow = true
    },
    /* 修改备注 */
    remarkChange () {
      this.saveCaseInfo()
    },
    /* 修改备注弹窗 */
    remarkChangePop () {
      this.remarkPopShow = true
    },
    /* 下拉菜单事件 */
    handleCommand (command) {
      switch (command) {
        case "networkSet": this.networkSetPop(); break;
        case "nodeSet": this.nodeSetPop(); break;
        case "remarkChange": this.remarkChangePop(); break
      }
    }
  },
  created () {
    this.caseInfo = this.$store.state.caseInfo
    this.caseInfo.isStatus += ""
    this.caseInfo.isLock += ""
    this.list = this.$store.getters.detailTableList
    // console.log(this.$store.state.caseInfo)
  }
};
</script>

<style lang="less" scoped>
.detail-table {
  padding-bottom: 50px;
  .detail-table-header {
    padding-left: 12px;
    background: #f5f6fa;
    border-bottom: 1px solid #ebeef5;
    border-left: 4px solid #6d7781;
    cursor: pointer;
    height: 38px;
    -webkit-transition: border-bottom-color 0.3s;
    transition: border-bottom-color 0.3s;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .detail-table-header-name {
      line-height: 38px;
      color: #303133;
      font-size: 13px;
      font-weight: 500;
      outline: 0;
      text-align: left;
    }
    .detail-table-setting {
      font-size: 12px;
      color: #606266;
      margin-right: 10px;
    }
  }
  .detail-table-body {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    .detail-table-body-item {
      flex-grow: 1;
      width: 40%;
    }
  }
}
.detail-setting {
  margin-top: 20px;
  text-align: left;
}
.dialog-footer {
  text-align: center;
  margin-top: 20px;
}
.info-view {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 10px;
  border-bottom: 1px solid #E1E6EB;
  .info-view-title {
    text-align: left;
    font-size: 14px;
    font-weight: 600;
    padding: 5px 10px;
  }
  .info-view-main {
    padding: 10px 10px 10px 120px;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: flex-start;
    .info-view-item {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      padding: 2px 0;
      height: 30px;
    }
    .info-view-item-btn {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
      padding: 5px 0;
    }
  }
}
</style>