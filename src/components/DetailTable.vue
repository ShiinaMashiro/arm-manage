<template>
  <div>
    <div class="detail-table  border-all">
      <div class="detail-table-header">
        <span class="detail-table-header-name">{{$route.name}}</span>
        <!--<el-dropdown @command="handleCommand"  v-if="$store.getters.checkChangeAuth()">
          <span class="detail-table-setting">
            设置<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="networkSet">网络设置</el-dropdown-item>
            <el-dropdown-item command="nodeSet">分层设置</el-dropdown-item>
            <el-dropdown-item command="remarkChange">修改备注</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>-->
      </div>
      <div class="detail-table-body">
        <template v-for="(item, index) in list">
          <DetailTableItem class="detail-table-body-item" :key="index" :name="item.name" :param="item.value"></DetailTableItem>
        </template>
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
    <div class="detail-setting">
        <el-button type="info" plain size="small" @click="networkSetPop">网络设置</el-button>
        <el-button type="info" plain size="small" @click="nodeSetPop">分层设置</el-button>
        <el-button type="info" plain size="small" @click="ipSetPop">设备IP设置</el-button>
        <el-button type="info" plain size="small" @click="remarkChangePop">修改备注</el-button>
    </div>
  </div>
</template>

<script>
import DetailTableItem from "@/components/DetailTableItem"
export default {
  name: "DetailTable",
  components: {
    DetailTableItem
  },
  data () {
    return {
      networkPopShow: false,
      nodePopShow: false,
      ipPopShow: false,
      ipSuccessPopShow: false,
      remarkPopShow: false,
      caseInfo: {},
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
      list: []
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
    ipSet () {
      let that = this
      if (!/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|20\d|21[0-5])$/.test(this.ipChangeInfo.initialIp)){
        that.$message.error("初始IP末位请务必在1-215之间")
        return
      }
      let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
      if (!reg.test(this.ipChangeInfo.route) || !reg.test(this.ipChangeInfo.webIp) || !reg.test(this.ipChangeInfo.netmask)){
        that.$message.error("请填写正确的ip")
        return
      }

      this.$confirm('点击确定后将对设备IP进行自动填充修改，修改后设备会重启，如果输入有误，请点击取消返回修改，确定无误后，点击确认则对修改生效。', '提示', {
        confirmButtonText: '确定',
        confirmButtonClass: 'confirm-btn-red',
        iconClass: 'el-icon-c-red',
        cancelButtonText: '取消'
      }).then(() => {
        that.ipChangeInfo.caseId = that.caseInfo.id
        that.$post(that.$uri.device.updateDeviceIp, that.ipChangeInfo).then(res => {
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
    flex-direction: row;
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
</style>