<template>
  <div>
    <div class="search-btn">
      <div>
        <el-button size="small" type="primary" @click="addIpPopShow = true"  v-if="$store.getters.checkChangeAuth()">录入IP</el-button>
        <el-button size="small" type="primary" @click="uploadFilePop"  v-if="$store.getters.checkChangeAuth()">CA证书分发</el-button>
        <el-button size="small" type="text" @click="goFun"  v-if="$store.getters.checkChangeAuth()">OpenVPN搭建教程</el-button>
      </div>
    </div>

    <div v-if="info.success" class="device-case border-all">
      <el-table ref="multipleTable" :data="info.list" :header-cell-style="{backgroundColor: '#efefef'}" stripe size="mini"
                tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="id" label="ID" width="50px"></el-table-column>
        <el-table-column prop="name" label="名称" min-width="100px"></el-table-column>
        <el-table-column prop="ip" label="IP"></el-table-column>
        <el-table-column prop="dns" label="DNS"></el-table-column>
        <el-table-column prop="gateway" label="网关"></el-table-column>
        <el-table-column prop="port" label="端口"></el-table-column>
        <el-table-column prop="connectionMax" label="最大连接数"></el-table-column>
        <el-table-column prop="connectionLast" label="剩余连接数"></el-table-column>
        <el-table-column label="状态" width="80px">
          <template slot-scope="scope">
            {{scope.row.isUsable === 1 ? '可用' : '不可用'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.stop="scope.row.isUsable === 1 ? changeIpStatusPop(scope.row)
            : changeIpStatus(scope.row)" v-if="$store.getters.checkChangeAuth()">{{scope.row.isUsable === 1 ? '禁用' : '启用'}}</el-button>
            <el-button type="text" size="small" @click.stop="edit(scope.row)" v-if="$store.getters.checkChangeAuth()">编辑</el-button>
            <el-button type="text" size="small" @click.stop="connectionPop(scope.row)"
                       :disabled="!scope.row.isUsable || scope.row.connectionLast === scope.row.connectionMax"
                       v-if="$store.getters.checkChangeAuth()">管理连接</el-button>
            <el-button type="text" size="small" @click.stop="deleteIp(scope.row.id)" v-if="$store.getters.checkChangeAuth()">删除</el-button>
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
    <Drawer title="录入IP" :visible.sync="addIpPopShow" @handClick="addIpValid">
      <div style="font-size: 12px">
        <el-form ref="addForm" :model="addIpInfo" :rules="rules" label-width="130px" label-position="left" style="display: flex;flex-direction: column;height: 100%">
          <el-form-item size="mini" label="IP名称">
            <el-input size="mini" v-model="addIpInfo.name" style="width: auto"></el-input>
            <el-tooltip placement="top" style="padding: 0 5px">
              <div slot="content" style="max-width: 400px">
                当前IP节点的备注，在云机切换IP时展示。
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item size="mini" label="IP地址" prop="ip">
            <el-input size="mini" v-model="addIpInfo.ip" style="width: auto"></el-input>
            <el-tooltip placement="top" style="padding: 0 5px">
              <div slot="content" style="max-width: 400px">
                IP节点的服务器地址。
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item size="mini" label="DNS" prop="dns">
            <el-input size="mini" v-model="addIpInfo.dns" style="width: auto"></el-input>
            <el-tooltip placement="top" style="padding: 0 5px">
              <div slot="content" style="max-width: 400px">
                IP节点的服务器DNS。
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item size="mini" label="网关" prop="gateway">
            <el-input size="mini" v-model="addIpInfo.gateway" style="width: auto"></el-input>
            <el-tooltip placement="top" style="padding: 0 5px">
              <div slot="content" style="max-width: 400px">
                IP节点服务器的网关。
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item size="mini" label="端口" prop="port">
            <el-input-number size="mini" v-model="addIpInfo.port" :min="1" :max="65535" :controls="false" style="width: auto"></el-input-number>
            <el-tooltip placement="top" style="padding: 0 5px">
              <div slot="content" style="max-width: 400px">
                IP节点服务器的端口。
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item size="mini" label="用户名">
            <el-input size="mini" v-model="addIpInfo.username" style="width: auto"></el-input>
            <el-tooltip placement="top" style="padding: 0 5px">
              <div slot="content" style="max-width: 400px">
                登录IP节点服务器所需要的用户名。
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item size="mini" label="密码">
            <el-input size="mini" v-model="addIpInfo.password" style="width: auto"></el-input>
            <el-tooltip placement="top" style="padding: 0 5px">
              <div slot="content" style="max-width: 400px">
                登录IP节点服务器所需要的密码。
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item size="mini" label="最大连接数">
            <el-input-number size="mini" v-model="addIpInfo.connectionMax" :min="0" :max="100"></el-input-number>
            <el-tooltip placement="top" style="padding: 0 5px">
              <div slot="content" style="max-width: 400px">
                可同时分配给云机连接的最大数量。
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
        </el-form>
      </div>
    </Drawer>
    <!-- 修改IP弹窗 -->
    <Drawer title="修改IP" :visible.sync="changeIpPopShow" @handClick="changeIpValid">
      <div style="font-size: 12px" v-if="changeIpInfo">
        <el-form ref="changeForm" :model="changeIpInfo" :rules="rules" label-width="130px" label-position="left" style="display: flex;flex-direction: column;height: 100%">
          <el-form-item size="mini" label="IP名称">
            <el-input size="mini" v-model="changeIpInfo.name"></el-input>
          </el-form-item>
          <el-form-item size="mini" label="IP地址" prop="ip">
            <el-input size="mini" v-model="changeIpInfo.ip"></el-input>
          </el-form-item>
          <el-form-item size="mini" label="DNS" prop="dns">
            <el-input size="mini" v-model="changeIpInfo.dns"></el-input>
          </el-form-item>
          <el-form-item size="mini" label="网关" prop="gateway">
            <el-input size="mini" v-model="changeIpInfo.gateway"></el-input>
          </el-form-item>
          <el-form-item size="mini" label="端口" prop="port">
            <el-input-number size="mini" v-model="changeIpInfo.port" :min="1" :max="65535" :controls="false"></el-input-number>
          </el-form-item>
          <el-form-item size="mini" label="用户名">
            <el-input size="mini" v-model="changeIpInfo.username"></el-input>
          </el-form-item>
          <el-form-item size="mini" label="密码">
            <el-input size="mini" v-model="changeIpInfo.password"></el-input>
          </el-form-item>
          <el-form-item size="mini" label="最大连接数">
            <el-input-number size="mini" v-model="changeIpInfo.connectionMax" :min="0" :max="100" label="描述文字"></el-input-number>
          </el-form-item>
        </el-form>
      </div>
    </Drawer>

    <Drawer title="CA证书分发" :visible.sync="uploadFilePopShow" @handClick="submitUpload" :before-close="popClose">
      <div>
        <el-form ref="form" label-width="130px" label-position="left">
          <div style="font-size: 13px;color: #606266;margin-bottom: 30px">当前仅支持所有IP代理节点使用统一的CA证书，选择文件上传后 ，
          点击确定会在分组管理-文件分发中生成一条CA证书文件分发记录并分发至所有云机，如果需要重新分发，
          可在此页面重新上传或在文件分发页面重新分发。</div>
          <el-form-item size="mini" label="CA证书文件：">
            <el-upload
                    class="upload-demo"
                    ref="upload"
                    :headers="$store.getters.getHeaders"
                    :action="$uri.file.fileAdd"
                    :data="uploadFileExtraInfo"
                    :limit="1"
                    :multiple="false"
                    :file-list="fileList"
                    :on-success="handleSuccess"
                    :on-error="errorHandle"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-change="handleChange"
                    :before-upload="handleUpload"
                    :on-progress="handleProgress"
                    :auto-upload="false">
              <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
    </Drawer>

    <Drawer title="连接管理" :visible.sync="connectionPopShow" :opt="false">
      <div v-if="connectionPopShow">
        <el-form ref="form" label-position="left" size="mini">
          <el-form-item size="mini" style="margin-bottom: 8px!important;" label="IP名称：">{{connectionRow.name}}</el-form-item>
          <el-form-item size="mini" style="margin-bottom: 8px!important;" label="IP：">{{connectionRow.ip}}</el-form-item>
          <el-form-item size="mini" style="margin-bottom: 8px!important;" label="DNS：">{{connectionRow.dns}}</el-form-item>
          <el-form-item size="mini" style="margin-bottom: 8px!important;" label="网关：">{{connectionRow.gateway}}</el-form-item>
          <el-form-item size="mini" style="margin-bottom: 8px!important;" label="端口：">{{connectionRow.port}}</el-form-item>
          <el-form-item size="mini" style="margin-bottom: 8px!important;" label="最大连接数：">{{connectionRow.connectionMax}}</el-form-item>
          <div style="width: 100%;border-bottom: 1px solid #ddd;margin-top: 10px"></div>
          <el-form-item size="mini" style="margin-bottom: 8px!important;" label="已连接设备：">{{devList.length}}</el-form-item>
          <div style="display: flex;justify-content: stretch;font-size: 14px;color: #606266">
            <div style="width: 35%">设备IP</div>
            <div style="width: 35%">分组名</div>
            <div style="width: 30%">操作</div>
          </div>
          <div style="display: flex;justify-content: stretch;font-size: 14px;padding: 2px 0" v-for="dev in devList">
            <div style="width: 35%">{{dev.deviceIp}}</div>
            <div style="width: 35%">{{dev.groupName}}</div>
            <div style="width: 30%"><el-button type="text" size="mini" @click="stopProxy(dev.deviceIp)">断开</el-button></div>
          </div>
        </el-form>
      </div>
    </Drawer>

    <el-dialog
            title="禁用IP"
            :visible.sync="popShow"
            width="450px"
            :modal="true"
            :append-to-body="true">
      <div style="display: flex;margin-top: -20px">
        <i class="el-icon-warning" style="color: red;font-size: 28px;padding: 20px 5px"></i>
        <div style="font-size: 13px;flex-grow: 1">
          <div>禁用IP后新设备将无法切换至该IP，已有连接可根据下方选项决定是否断开，确认禁用？</div>
          <div style="color: red;font-size: 12px">仅禁用：已连接设备不断开，禁用IP，新设备无法连接该IP。</div>
          <div style="color: red;font-size: 12px">断开并禁用：断开所有已连接设备，禁用IP，新设备无法连接该IP。</div>
          <div style="display: flex;justify-content: flex-end;margin-top: 20px">
            <el-button type="danger" size="mini" @click="changeIpStatus">仅禁用</el-button>
            <el-button type="danger" size="mini" @click="changeIpStatusAndStop">断开并禁用</el-button>
            <el-button size="mini" @click="closePop()">取消</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Drawer from '@/components/Drawer'
  export default {
    name: "IpProxy",
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
        addIpInfo: {
          name: '',
          ip: '',
          dns: '',
          gateway: '',
          port: 0,
          username: '',
          password: '',
          connectionMax: 0
        },
        changeIpPopShow: false,
        changeIpInfo: null,
        uploadFilePopShow: false,
        uploadPopCloseTip: false,
        uploadFileExtraInfo: {
          issuePath: '/system/bin/',
          deviceIps: '',
        },
        fileList: [],
        row: null,
        popShow: false,
        connectionPopShow: false,
        connectionRow: null,
        devList: [],
        rules: {
          ip: [
            {required: true, message: 'ip不能为空', trigger: 'blur'}
            ,{type: 'string', pattern: /^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/, message: '请输入正确的ip', trigger: 'blur'}
          ],
          dns: [
            {required: true, message: 'dns不能为空', trigger: 'blur'}
            ,{type: 'string', pattern: /^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/, message: '请输入正确的dns', trigger: 'blur'}
          ],
          gateway: [
            {required: true, message: '网关不能为空', trigger: 'blur'}
            ,{type: 'string', pattern: /^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/, message: '请输入正确的网关', trigger: 'blur'}
          ],
          port: [
            {type: 'number', min: 1, max: 65535, message: '端口范围为1-65535', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {

    },
    methods: {
      goFun() {
        this.$store.dispatch(this.$action.GO_FUN, 'OpenVpn搭建')
      },
      uploadFilePop() {
        let that = this
        that.$post(that.$uri.device.deviceList).then(res => {
          if (res.success) {
            let ipList = []
            res.list.forEach(dev => {
              ipList.push(dev.deviceIp)
            })
            this.uploadFileExtraInfo.deviceIps = ipList.join(',')
            this.uploadFilePopShow = true
          } else {
            that.$message.error("系统异常")
          }
        })
      },
      popClose () {
        if (this.uploadPopCloseTip) {
          this.$confirm("文件正在上传中，确定关闭弹窗？", "提示", {
            confirmButtonText: '确定',
            confirmButtonClass: 'confirm-btn-blue',
            iconClass: 'el-icon-c-blue',
            cancelButtonText: '取消'
          }).then( () => {
            this.uploadFilePopShow = false
            this.uploadPopCloseTip = false
            this.$refs.upload.clearFiles()
          }).catch( () => {})
        } else {
          this.uploadFilePopShow = false
          this.uploadPopCloseTip = false
          this.$refs.upload.clearFiles()
        }
      },
      /* 上传文件 */
      submitUpload() {
        this.$loading()
        this.$refs.upload.submit();
      },
      handleSuccess(response, file, fileList) {
        this.$loading().close()
        if (response.success) {
          this.uploadFilePopShow = false
          this.uploadFilePopShow = false
          this.uploadPopCloseTip = false
          this.$refs.upload.clearFiles()
          this.$message.success("上传CA证书成功")
        } else {
          console.log(response)
          this.$message.error(response.message)
          this.$refs.upload.clearFiles()
        }
      },
      errorHandle() {
        this.$loading().close()
      },
      handleChange(file, fileList) {
        if (fileList.length) {
          console.log(fileList)
        }
      },
      handleUpload (f) {
        console.log('before')
        console.log(f)
        this.uploadPopCloseTip = true
        return Promise.resolve(new File([f], 'jdjy.ca'))
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleProgress (event, file, fileList) {
        if (!this.uploadFilePopShow) {
          this.$refs.upload.abort(file)
          this.$refs.upload.clearFiles()
        }
      },
      /* 获取ip列表 */
      getIpList () {
        let that = this
        that.$post(that.$uri.ipProxy.list, that.page).then(res => {
          that.info = res
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
        this.$confirm("删除IP后已连接至该IP的设备会关闭IP代理并连接至公网IP，是否继续？", "提示", {
          confirmButtonText: '确定',
          confirmButtonClass: 'confirm-btn-red',
          iconClass: 'el-icon-c-red',
          cancelButtonText: '取消'
        }).then( () => {
          let that = this
          that.$post(that.$uri.ipProxy.del, {id}).then(res => {
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
      },
      connectionPop(row) {
        this.connectionRow = row
        let that = this
        that.$post(that.$uri.device.deviceList, {proxyId: row.id}).then(res => {
          if (res.success) {
            that.devList = res.list
            that.connectionPopShow = true
          } else {
            that.$message('数据获取异常')
          }
        })
      },
      stopProxy(deviceIp) {
        let that = this
        that.$post(that.$uri.device.stopProxy, {deviceIp}).then(res => {
          if (res.success) {
            that.$message.success('断开成功')
            that.$post(that.$uri.device.deviceList, {proxyId: that.connectionRow.id}).then(res => {
              if (res.success) {
                that.devList = res.list
              }
            })
            this.getIpList()
          } else {
            that.$message.error('断开失败')
          }
        })
      },
      addIpValid() {
        this.$refs.addForm.validate(valid => {
          if (valid) {
            this.addIp()
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
      changeIpValid() {
        this.$refs.changeForm.validate(valid => {
          if (valid) {
            this.changeIp()
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
      changeIpStatusPop(row) {
        this.popShow = true
        this.row = row
      },
      closePop() {
        this.popShow = false
      },
      changeIpStatus(r) {
        // let loading = this.$loading()
        let that = this
        let row = this.row || r
        this.row = null
        let info = {...row}
        info.isUsable = row.isUsable === 1 ? 0 : 1
        console.log(row)
        that.$post(that.$uri.ipProxy.save, info).then(res => {
          if (res.success) {
            that.$message.success((row.isUsable === 1 ? '禁用' : '启用') + "成功")
            that.getIpList()
          } else {
            that.$message.error(res.msg)
          }
        }).finally(() => {
          that.popShow = false
          // loading.close()
        })
      },
      async changeIpStatusAndStop() {
        // let loading = this.$loading()
        let that = this
        let row = this.row
        let info = {...row}
        info.isUsable = row.isUsable === 1 ? 0 : 1
        let devData = await that.$post(that.$uri.device.deviceList, {proxyId: row.id})
        console.log(devData)
        if (devData.success) {
          devData.list.forEach(dev => {
            that.$post(that.$uri.device.stopProxy, {deviceIp: dev.deviceIp}).then(res => {}).catch(() => {})
          })
        }
        that.$post(that.$uri.ipProxy.save, info).then(res => {
          if (res.success) {
            that.$message.success((row.isUsable === 1 ? '禁用' : '启用') + "成功")
            setTimeout(that.getIpList, 1000)

          } else {
            that.$message.error(res.msg)
          }
        }).finally(() => {
          that.popShow = false
          // loading.close()
        })
      }
    },
    mounted () {
      this.getIpList()
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