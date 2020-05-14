<template>
  <div>
    <div class="search-btn">
      <div style="display: flex;flex-direction: row">
        <el-button size="small" type="primary" @click="$router.push('/home/group/devMaster/new')"  v-if="$store.getters.checkChangeAuth()">新建备份</el-button>
        <div>
          <span style="font-size: 12px;padding: 0 10px">FTP服务器：{{ftpHost.paramValue}}:{{ftpPort.paramValue}}</span>
          <el-button size="small" type="text" @click="ftpPopShow = true"  v-if="$store.getters.checkChangeAuth()">修改</el-button>
        </div>
      </div>
      <div @keyup.enter="getLogList">
        <el-input size="small" placeholder="输入应用名称 搜索" v-model="searchInfo.queryParam" style="width: 320px">
          <el-button slot="append" icon="el-icon-search" @click="getIpList"></el-button>
        </el-input>
      </div>
    </div>

    <div v-if="info.success" class="device-case border-all">
      <el-table ref="multipleTable" :data="info.list" :header-cell-style="{backgroundColor: '#efefef'}" stripe size="mini"
                tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="appName" label="应用" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="createTime" label="备份时间" width="200">
          <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column prop="deviceIp" label="上传云机" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="operationStatus" label="备份状态" width="120">
          <template slot-scope="scope">{{scope.row.operationStatus | statusFilter}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button v-if="[2,-5,6].indexOf(scope.row.operationStatus) !== -1 && $store.getters.checkChangeAuth()" :disabled="scope.row.isDel === 1" type="text" size="small" @click.stop="uploadBackup(scope.row)">上传</el-button>
            <el-button v-if="scope.row.operationStatus !== 1 && scope.row.operationStatus !== -1 && $store.getters.checkChangeAuth()" :disabled="scope.row.isDel === 1" type="text" size="small" @click.stop="restorePop(scope.row)">恢复</el-button>
            <el-button v-if="scope.row.operationStatus !== 1 && scope.row.operationStatus !== -1" type="text" size="small" @click.stop="edit(scope.row)">操作记录</el-button>
            <el-button type="text" size="small" v-if="$store.getters.checkChangeAuth()" :disabled="scope.row.isDel === 1" @click.stop="deleteIp(scope.row.id)">删除</el-button>
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

    <!-- 录入IP弹窗 -->
    <Drawer title="FTP信息修改" :visible.sync="ftpPopShow" @handClick="saveFtpInfo">
      <div style="font-size: 12px">
        <el-form ref="form" label-width="130px" label-position="left" style="display: flex;flex-direction: column;height: 100%">
          <el-form-item size="mini" label="FTP服务器地址">
            <el-input size="mini" v-model="ftpHost.paramValue"></el-input>
          </el-form-item>
          <el-form-item size="mini" label="用户名">
            <el-input size="mini" v-model="ftpUsername.paramValue"></el-input>
          </el-form-item>
          <el-form-item size="mini" label="密码">
            <el-input size="mini" v-model="ftpPassword.paramValue"></el-input>
          </el-form-item>
          <el-form-item size="mini" label="端口">
            <el-input size="mini" v-model="ftpPort.paramValue"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </Drawer>
    <!-- 录入IP弹窗 -->
    <Drawer title="备份恢复" :visible.sync="addIpPopShow" @handClick="restore">
      <div style="font-size: 12px" v-if="addIpInfo">
        <el-form ref="form" label-width="130px" label-position="left" style="display: flex;flex-direction: column;height: 100%">
          <div style="font-size: 16px;margin-bottom: 5px">备份信息</div>
          <el-form-item size="mini" label="备份ID">{{addIpInfo.id}}</el-form-item>
          <el-form-item size="mini" label="备份应用">{{addIpInfo.appName}}</el-form-item>
          <el-form-item size="mini" label="备份来源云机">{{addIpInfo.deviceIp}}</el-form-item>
          <el-form-item size="mini" label="备份备注">{{addIpInfo.remark}}</el-form-item>
          <div style="width: 100%;border-bottom: 1px solid #ddd"></div>
          <el-form-item size="mini" label="选择云机" v-if="addIpInfo.operationStatus !== 2">
            <el-tree
                    :props="props"
                    :load="loadNode"
                    style="margin-top: 10px"
                    lazy
                    show-checkbox
                    @check-change="handleCheckChange">
            </el-tree>
          </el-form-item>
        </el-form>
      </div>
    </Drawer>
    <!-- 修改IP弹窗 -->
    <Drawer title="恢复记录" :visible.sync="changeIpPopShow" :opt="false">
      <div style="font-size: 12px" v-if="changeIpInfo">
        <el-form ref="form" label-width="130px" label-position="left" style="display: flex;flex-direction: column;height: 100%">
          <div style="font-size: 16px;margin-bottom: 5px">备份信息</div>
          <el-form-item size="mini" label="备份ID">{{changeIpInfo.id}}</el-form-item>
          <el-form-item size="mini" label="备份应用">{{changeIpInfo.appName}}</el-form-item>
          <el-form-item size="mini" label="备份来源云机">{{changeIpInfo.deviceIp}}</el-form-item>
          <el-form-item size="mini" label="备份备注">{{changeIpInfo.remark}}</el-form-item>
          <div style="width: 100%;border-bottom: 1px solid #ddd"></div>
          <el-table :data="restoreList" style="width: 100%">
            <el-table-column prop="createTime" label="日期">
              <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
            </el-table-column>
            <el-table-column prop="deviceIp" label="设备IP"></el-table-column>
            <el-table-column prop="operationStatus" label="状态">
              <template slot-scope="scope">{{scope.row.operationStatus | recordStatusFilter}}</template>
            </el-table-column>
          </el-table>

        </el-form>
      </div>
    </Drawer>
  </div>
</template>

<script>
  import Drawer from '@/components/Drawer'
  export default {
    name: "GroupDevMaster",
    components: {
      Drawer
    },
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
        addIpPopShow: false,
        addIpInfo: null,
        changeIpPopShow: false,
        row: {},
        changeIpInfo: null,
        ftpHost: {
          id: 0,
          paramName: '',
          paramValue: ''
        },
        ftpPort: {
          id: 0,
          paramName: '',
          paramValue: ''
        },
        ftpUsername: {
          id: 0,
          paramName: '',
          paramValue: ''
        },
        ftpPassword: {
          id: 0,
          paramName: '',
          paramValue: ''
        },
        searchInfo: {
          queryParam: '',
          groupId: 0
        },
        ftpPopShow: false,
        props: {
          label: 'deviceIp',
          isLeaf: 'leaf'
        },
        groupList: [],
        deviceIps: [],
        restoreList: []
      }
    },
    computed: {

    },
    filters: {
      statusFilter(status) {
        switch (status) {
          case -5: return '上传失败'
          case -1: return '备份失败'
          case 1: return '备份中'
          case 2: return '备份完成'
          case 5: return '上传中'
          case 6: return '上传完成'
          default: return '未知'
        }
      },
      recordStatusFilter(status) {
        switch (status) {
          case -1: return '备份失败'
          case -3: return '恢复失败'
          case -5: return '上传失败'
          case -7: return '下载失败'
          case 1: return '备份中'
          case 2: return '备份完成'
          case 3: return '恢复中'
          case 4: return '恢复完成'
          case 5: return '上传中'
          case 6: return '上传完成'
          case 7: return '下载中'
          case 8: return '下载成功'
          default: return '未知'
        }
      }
    },
    methods: {
      handleCheckChange(data, checked, indeterminate) {
        data.checked = checked
        let s = []
        this.groupList.forEach(g => {
          if (g.checked) {
            s.push(g.deviceIp)
          }
        })
        this.deviceIps = s
      },
      loadNode(node, resolve) {
        let that = this
        if (node.level === 0) {
          return resolve(this.groupList);
        }
        if (node.level = 1) return resolve(node.data.children);
        if (node.level > 1) return resolve([]);
      },
      /* 获取ip列表 */
      getIpList () {
        let that = this
        that.$post(that.$uri.devMaster.list, {...that.page, ...that.searchInfo}).then(res => {
          that.info = res
          if (that.$route.path === '/home/group/devMaster') {
            setTimeout(() => {that.getIpList()}, 5000)
          }
        })
      },
      /* 当前页改变 */
      currentChangeHandle (val) {
        this.page.startPage = val
        this.getIpList()
      },
      /* 每页条数改变 */
      sizeChangeHandle (val) {
        this.page.limit = val
        this.getIpList()
      },
      /* 删除IP */
      deleteIp (id) {
        this.$confirm("备份删除后管理界面无法再对备份进行恢复操作，备份设备和已恢复设备会对备份进行删除，备份文件仅可能在FTP服务器上保留，是否继续？", "提示", {
          confirmButtonText: '确定',
          confirmButtonClass: 'confirm-btn-red',
          iconClass: 'el-icon-c-red',
          cancelButtonText: '取消'
        }).then( () => {
          let that = this
          that.$post(that.$uri.devMaster.del, {id}).then(res => {
            if (res.success) {
              setTimeout(() => {that.getIpList()}, 1000)
            } else {
              that.$message.error("删除失败")
            }
          })

        }).catch( () => {})
      },
      edit(row) {
        this.changeIpInfo = row
        this.changeIpPopShow = true
        this.row = row
        this.getRecordList(row)
      },
      getRecordList(row) {
        let that = this
        if(row.id !== this.row.id) {
          return
        }
        that.$post(that.$uri.devMaster.record, {operationId: row.operationId}).then(res => {
          if (res.success) {
            that.restoreList = res.list
            if (that.$route.path === '/home/group/devMaster' && this.changeIpPopShow) {
              setTimeout(() => {that.getRecordList(row)}, 5000)
            }
          }
        })
      },
      restorePop(row) {
        this.addIpInfo = row
        this.addIpPopShow = true
      },
      restore() {
        let that = this
        if (that.addIpInfo.operationStatus === 2) {
          that.deviceIps = [that.addIpInfo.deviceIp]
        }
        that.deviceIps.forEach(deviceIp => {
          that.$post(that.$uri.devMaster.restore, {id: that.addIpInfo.id, deviceIp}).then()
        })
        that.addIpPopShow = false
        that.$message.success('开始恢复，请稍后查看恢复记录')
      },
      uploadBackup(row) {
        let that = this
        that.$post(that.$uri.devMaster.upload, {id: row.id}).then(res => {
          if (res.success) {
            that.$message.success("上传中...")
          } else {
            that.$message.success("上传失败")
          }
        })
      },
      addIp() {
        let that = this
        that.$post(that.$uri.ipProxy.add, that.addIpInfo).then(res => {
          if (res.success) {
            that.$message.success("录入成功")
            that.addIpPopShow = false
            that.getIpList()
          } else {
            that.$message.error(res.msg)
          }
        })
      },
      changeIp() {
        let that = this
        that.$post(that.$uri.ipProxy.save, that.changeIpInfo).then(res => {
          if (res.success) {
            that.$message.success("修改成功")
            that.changeIpPopShow = false
            that.getIpList()
          } else {
            that.$message.error(res.msg)
          }
        })
      },
      getFtpInfo() {
        let params = ['ftpHost', 'ftpPort', 'ftpUsername', 'ftpPassword']
        let that = this
        params.forEach(key => {
          that.$post(that.$uri.system.paramGet, {paramName: key}).then(res => {
            if (res.success) {
              that[key].id = res.data.id
              that[key].paramName = res.data.paramName
              that[key].paramValue = res.data.paramValue
            }
          })
        })
      },
      saveFtpInfo() {
        let params = ['ftpHost', 'ftpPort', 'ftpUsername', 'ftpPassword']
        let that = this
        params.forEach(key => {
          that.$post(that.$uri.system.paramSave, that[key]).then(res => {
          })
        })
        that.$message.success("修改成功")
        that.ftpPopShow = false
      },
      getDevList() {
        let that = this
        that.$post(that.$uri.device.deviceList, {groupId: that.$store.state.groupInfo.id}).then(res => {
          if (res.success) {
            res.list.forEach(dev => {
              dev.checked = false
              dev.leaf = true
            })
            this.groupList = res.list

          }
        })
      }
    },
    mounted () {
      this.searchInfo.groupId = this.$store.state.groupInfo.id
      this.getIpList()
      this.getFtpInfo()
      this.getDevList()
    }
  };
</script>

<style lang="less" scoped>
  .search-btn {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
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