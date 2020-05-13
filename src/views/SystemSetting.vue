<template>
  <div style="padding-bottom: 40px">
    <div class="info-view">
      <div class="info-view-title">设备引擎升级</div>
      <div class="info-view-main">
        <span class="info-view-item" style="font-size: 12px">检查当前版本并对设备引擎进行升级</span>
        <div class="info-view-item-btn">
          <el-button size="small" type="primary" @click="engineUpdatePopShow = true">引擎升级</el-button>
          <el-button size="small" type="primary" @click="checkVersion()">版本检查</el-button>
        </div>
      </div>
    </div>
    <div class="info-view">
      <div class="info-view-title">设备引擎版本管理</div>
      <div class="info-view-main">
        <span class="info-view-item" style="font-size: 12px">设备引擎版本对应的引擎版本</span>
        <div class="info-view-item" style="align-items: flex-start;height: auto">
          <span style="height: 30px;line-height: 30px">当前引擎版本：</span>
          <div style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start">
            <div v-for="(version, index) in engineVersionList" :key="index" style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start;height: 30px">
              <span v-if="!enginePopShow">{{'引擎编码：' + version.code + '   引擎版本：' + version.content}}</span>
              <div v-else style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
                引擎编码：<el-input :disabled="true" size="mini" v-model="engineVersionList[index].code" style="width: 80px;margin-right: 10px"></el-input>
                引擎版本：<el-input size="mini" v-model="engineVersionList[index].content" style="width: 80px"></el-input>
                <i v-if="engineVersionAddList.length === 0 && (index + 1) === engineVersionList.length" class="iconfont" style="color: gray;margin-left: 3px;font-size: 18px" @click="versionAddList()">&#xe631;</i>
                <i class="iconfont" style="color: gray;margin-left: 3px;font-size: 18px" @click="versionDelList(index)">&#xe630;</i>
              </div>
            </div>
            <div v-for="(version, index) in engineVersionAddList" style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start;height: 30px">
              <div style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
                 引擎编码：<el-input size="mini" v-model="version.code" style="width: 80px;margin-right: 10px"></el-input>
                 引擎版本：<el-input size="mini" v-model="version.content" style="width: 80px;"></el-input>
                <i v-if="engineVersionAddList.length === (index + 1)" class="iconfont" style="color: gray;margin-left: 3px;font-size: 18px" @click="versionAddList()">&#xe631;</i>
                <i class="iconfont" style="color: gray;margin-left: 3px;font-size: 18px" @click="versionAddDelList(index)">&#xe630;</i>
              </div>
            </div>
          </div>
        </div>
        <div class="info-view-item-btn">
          <el-button size="small" type="primary" v-if="!enginePopShow" @click="enginePopShow = true">设置</el-button>
          <el-button size="small" type="primary" v-if="enginePopShow" @click="versionAdd()">完成</el-button>
          <el-button size="small" type="info" v-if="enginePopShow" @click="versionAddCancel()">取消</el-button>
        </div>
      </div>
    </div>
    <div class="info-view">
      <div class="info-view-title">管理系统升级</div>
      <div class="info-view-main">
        <span class="info-view-item" style="font-size: 12px">检查当前版本并对管理系统进行升级</span>
        <div class="info-view-item">
          <span>前端版本：</span>
          <span>2.0.0</span>
        </div>
        <div class="info-view-item">
          <span>后台版本：</span>
          <span>{{systemVersion}}</span>
        </div>
        <div class="info-view-item-btn">
          <el-button size="small" type="primary" @click="systemUpdatePopShow = true">升级</el-button>
        </div>
      </div>
    </div>
    <div v-if="sysInfo" class="info-view" @keyup.enter="saveSysInfo(changePopInfo)">
      <div class="info-view-title">系统网络设置</div>
      <div class="info-view-main">
        <span class="info-view-item" style="font-size: 12px">配置管理中心网络及远程相机服务网络</span>
        <div class="info-view-item">
          <span>管理中心网络IP：</span>
          <span v-if="!changePopShow">{{sysInfo.webIp}}</span>
          <el-input v-else size="mini" v-model="changePopInfo.webIp" style="width: 150px"></el-input>
        </div>
        <div class="info-view-item">
          <span>管理中心网络端口：</span>
          <span v-if="!changePopShow">{{sysInfo.webPort}}</span>
          <el-input v-else size="mini" v-model="changePopInfo.webPort" style="width: 150px"></el-input>
        </div>
        <div class="info-view-item">
          <span>管理中心网络子网掩码：</span>
          <span v-if="!changePopShow">{{sysInfo.webMask}}</span>
          <el-input v-else size="mini" v-model="changePopInfo.webMask" style="width: 150px"></el-input>
        </div>
        <div class="info-view-item">
          <span>公网IP：</span>
          <span v-if="!changePopShow">{{sysInfo.extranetIp}}</span>
          <el-input v-else size="mini" v-model="changePopInfo.extranetIp" style="width: 150px"></el-input>
        </div>
        <div class="info-view-item">
          <span>NTP服务器地址：</span>
          <span v-if="!changePopShow">{{sysInfo.ntpAddress}}</span>
          <el-input v-else size="mini" v-model="changePopInfo.ntpAddress" style="width: 150px"></el-input>
        </div>
        <div class="info-view-item">
          <span>媒体服务器外网地址：</span>
          <span v-if="!changePopShow">{{sysInfo.mediaServerWan}}</span>
          <el-input v-else size="mini" v-model="changePopInfo.mediaServerWan" style="width: 150px"></el-input>
        </div>
        <div class="info-view-item">
          <span>媒体服务器内网地址：</span>
          <span v-if="!changePopShow">{{sysInfo.mediaServerLan}}</span>
          <el-input v-else size="mini" v-model="changePopInfo.mediaServerLan" style="width: 150px"></el-input>
        </div>
        <div class="info-view-item-btn">
          <el-button size="small" type="primary" v-if="!changePopShow" @click="changePop()">设置</el-button>
          <el-button size="small" type="primary" v-if="changePopShow" @click="saveSysInfo(changePopInfo)">保存</el-button>
          <el-button size="small" type="info" v-if="changePopShow" @click="changePopShow = false">取消</el-button>
        </div>
      </div>
    </div>
    <div v-if="sysInfo" class="info-view" @keyup.enter="saveSysInfo(changePopInfo)">
      <div class="info-view-title">默认推流参数</div>
      <div class="info-view-main">
        <span class="info-view-item" style="font-size: 12px">配置应用默认推流参数</span>
        <div class="info-view-item">
          <span>推流最大码率：</span>
          <span v-if="!streamPopShow">{{sysInfo.encodeRateMax}} kb/s</span>
          <el-input v-else size="mini" v-model="changePopInfo.encodeRateMax" style="width: 150px"></el-input>
        </div>
        <div class="info-view-item">
          <span>推流帧率：</span>
          <span v-if="!streamPopShow">{{sysInfo.framerate}}</span>
          <el-input v-else size="mini" v-model="changePopInfo.framerate" style="width: 150px"></el-input>
        </div>
        <div class="info-view-item-btn">
          <el-button size="small" type="primary" v-if="!streamPopShow" @click="streamPop()">设置</el-button>
          <el-button size="small" type="primary" v-if="streamPopShow" @click="saveSysInfo(changePopInfo)">保存</el-button>
          <el-button size="small" type="info" v-if="streamPopShow" @click="streamPopShow = false">取消</el-button>
        </div>
      </div>
    </div>
    <div v-if="sysInfo" class="info-view">
      <div class="info-view-title">运维信息</div>
      <div class="info-view-main">
        <span class="info-view-item" style="font-size: 12px">配置运维邮箱和电话，接受预警信息</span>
        <div class="info-view-item" style="align-items: flex-start;height: auto">
          <span style="height: 30px;line-height: 30px">运维邮箱：</span>
          <div style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start">
            <div v-for="(email, index) in emailList" :key="index" style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start;height: 30px">
              <span v-if="!emailPopShow">{{email}}</span>
              <div v-else style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
                <el-input size="mini" v-model="emailList[index]" style="width: 150px"></el-input>
                <i v-if="(index + 1) === emailList.length" class="iconfont" style="color: gray;margin-left: 3px;font-size: 18px" @click="emailAdd()">&#xe631;</i>
                <i v-if="emailList.length !== 1" class="iconfont" style="color: gray;margin-left: 3px;font-size: 18px" @click="deleteEmail(index)">&#xe630;</i>
              </div>
            </div>
            <!--<div style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start;height: 30px">
              <div v-if="emailPopShow" style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
                <el-input size="mini" v-model="emailAddValue" style="width: 150px"></el-input><i class="iconfont" style="color: gray;margin-left: 3px;font-size: 18px" @click="emailAdd()">&#xe631;</i>
              </div>
            </div>-->
          </div>
        </div>
        <div class="info-view-item-btn">
          <el-button size="small" type="primary" v-if="!emailPopShow" @click="emailPop()">设置</el-button>
          <el-button size="small" type="primary" v-if="emailPopShow" @click="emailAddSave()">保存</el-button>
          <el-button size="small" type="info" v-if="emailPopShow" @click="emailCancel()">取消</el-button>
        </div>
        <div class="info-view-item" style="align-items: flex-start;height: auto">
          <span style="height: 30px;line-height: 30px">运维电话：</span>
          <div style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start">
            <div v-for="(phone, index) in phoneList" :key="index" style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start;height: 30px">
              <span v-if="!phonePopShow">{{phone}}</span>
              <div v-else style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
                <el-input size="mini" v-model="phoneList[index]" style="width: 150px"></el-input>
                <i v-if="(index + 1) === phoneList.length" class="iconfont" style="color: gray;margin-left: 3px;font-size: 18px" @click="phoneAdd()">&#xe631;</i>
                <i v-if="phoneList.length !== 1" class="iconfont" style="color: gray;margin-left: 3px;font-size: 18px" @click="deletePhone(index)">&#xe630;</i>
              </div>
            </div>
            <!--<div style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start;height: 30px">
              <div v-if="phonePopShow" style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
                <el-input size="mini" v-model="phoneAddValue" style="width: 150px"></el-input><i class="iconfont" style="color: gray;margin-left: 3px;font-size: 18px" @click="phoneAdd()">&#xe631;</i>
              </div>
            </div>-->
          </div>
        </div>
        <div class="info-view-item-btn">
          <el-button size="small" type="primary" v-if="!phonePopShow" @click="phonePop()">设置</el-button>
          <el-button size="small" type="primary" v-if="phonePopShow" @click="phoneAddSave()">保存</el-button>
          <el-button size="small" type="info" v-if="phonePopShow" @click="phoneCancel()">取消</el-button>
        </div>
      </div>
    </div>
    <div v-if="licenseInfo" class="info-view">
      <div class="info-view-title">License信息</div>
      <div class="info-view-main">
        <span class="info-view-item" style="font-size: 12px">查看和管理您的license凭证</span>
        <div class="info-view-item">
          <span>license码：</span>
          <span>{{licenseInfo.code}}</span>
        </div>
        <div class="info-view-item">
          <span>有效期：</span>
          <span>{{licenseInfo.seconds | secondsFilter}}</span>
        </div>
        <div class="info-view-item">
          <span>设备数量：</span>
          <span>{{licenseInfo.deviceNum}}</span>
        </div>
        <div class="info-view-item-btn">
          <el-button size="small" type="primary" @click="license()">升级</el-button>
        </div>
      </div>
    </div>

    <!-- 引擎升级 -->
    <Drawer title="引擎升级" :visible.sync="engineUpdatePopShow" @handClick="submitUpload" :before-close="engineUploadPopClose">
    <!--<el-dialog title="引擎升级" :append-to-body="true"
               :close-on-click-modal="false" :show-close="false" top="15vh"
               :visible.sync="engineUpdatePopShow" width="500px">-->
      <div>
        <el-form ref="form" :model="engineUpdateExtraInfo" label-width="130px" label-position="left">
          <!--<el-form-item size="mini" label="系统当前版本">
            <div style="display: flex;flex-direction: column;justify-content: flex-start">
              <template v-for="(item, index) in engineList">
                <span style="line-height: normal" :key="index">{{item.engineTypeName}}: {{item.versionName}}-{{item.versionCode}}</span>
              </template>
            </div>
          </el-form-item>-->
          <el-form-item size="mini" label="类型">
            <div class="item-input">
              <el-select v-model="engineUpdateExtraInfo.engineType" size="samll" placeholder="引擎版本">
                <el-option
                        v-for="item in engineOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item size="mini" label="升级文件">
            <el-upload
                    class="upload-demo"
                    ref="upload"
                    :headers="$store.getters.getHeaders"
                    :action="$uri.system.engineUpdate"
                    :data="engineUpdateExtraInfo"
                    :file-list="fileList"
                    accept="apk"
                    :limit="1"
                    :multiple="false"
                    :on-change="handleChange"
                    :on-success="handleSuccess"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-upload="handleUploadEngine"
                    :on-progress="handleProgressEngine"
                    :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item size="mini" label="版本号" v-if="fileList.length">
            <el-input v-model="engineUpdateExtraInfo.versionName"></el-input>
          </el-form-item>
          <el-form-item size="mini" label="版本序号" v-if="fileList.length">
            <el-input v-model="engineUpdateExtraInfo.versionCode"></el-input>
          </el-form-item>
          <el-form-item size="mini" label="MD5" v-if="fileList.length">
            <el-input v-model="engineUpdateExtraInfo.md5"></el-input>
          </el-form-item>
          <!--<el-form-item>
            <el-button type="primary" :disabled="engineUploadTip" @click="submitUpload">确定</el-button>
            <el-button @click="engineUploadPopClose">取消</el-button>
          </el-form-item>-->
        </el-form>
      </div>
    </Drawer>

    <!-- 管理系统升级 -->
    <Drawer title="管理系统升级" :visible.sync="systemUpdatePopShow" @handClick="systemUpdate" :before-close="systemUploadPopClose">
    <!--<el-dialog title="管理系统升级" :append-to-body="true"
               :close-on-click-modal="false" :show-close="false" top="15vh"
               :visible.sync="systemUpdatePopShow" width="500px">-->
      <div>
        <el-form ref="form" label-width="130px" label-position="left">
          <el-form-item size="mini" label="系统当前版本">
            <span>{{systemVersion}}</span>
          </el-form-item>
          <el-form-item size="mini" label="升级文件">
            <el-upload
                    class="upload-demo"
                    ref="systemUpdate"
                    :headers="$store.getters.getHeaders"
                    :action="$uri.system.update"
                    :limit="1"
                    :multiple="false"
                    :on-success="handleSuccess2"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-upload="handleUploadSystem"
                    :on-progress="handleProgressSystem"
                    :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            </el-upload>
          </el-form-item>
          <!--<el-form-item>
            <el-button type="primary" :disabled="systemUploadTip" @click="systemUpdate">确定</el-button>
            <el-button @click="systemUploadPopClose">取消</el-button>
          </el-form-item>-->
        </el-form>
      </div>
    </Drawer>
  </div>
</template>

<script>
  import Drawer from '@/components/Drawer'
  let that
  export default {
    name: "SystemSetting",
    components: {
      Drawer
    },
    data() {
      return {
        sysInfo: null,
        idInfo: null,
        changePopShow: false,
        streamPopShow: false,
        emailPopShow: false,
        emailList: [],
        emailAddValue: '',
        phonePopShow: false,
        phoneList: [],
        phoneAddValue: '',
        changePopInfo: null,
        licenseInfo: null,
        systemVersion: '',
        engineVersionList: [],
        engineVersionDelList: [],
        engineVersionAddList: [],
        enginePopShow: false,
        versionAddInfo: {
          code: '',
          content: ''
        },
        engineUpdatePopShow: false,
        engineUploadTip: false,
        engineList: [],
        engineUpdateExtraInfo: {
          engineType: "",
          versionName: "",
          versionCode: "",
          md5: ""
        },
        systemUpdatePopShow: false,
        fileList: []
      }
    },
    computed: {
      engineOptions () {
        let list = []
        this.engineList.forEach(v => {
          list.push({
            label: v.engineTypeName,
            value: v.engineType
          })
        })
        console.log("dddsdfadf")
        return list
      },
    },
    watch: {
      fileList() {
        if (this.fileList.length) {
          let name = this.fileList[0].name
          let s = name.indexOf('__')
          let e = name.indexOf('.')
          let version = name.substr(s + 2, e - s - 2)
          this.engineUpdateExtraInfo.versionCode = version
          this.engineUpdateExtraInfo.versionName = version
        }
      }
    },
    filters: {
      secondsFilter (s) {
        if (s === -1) {
          return '永久'
        }
        let time = ''
        let day = parseInt(s/(60 * 60 * 24))
        if (day > 0) {
          time += day + '天'
        }
        s = s - day * (60 * 60 * 24)
        let hour = parseInt(s/(60 * 60))
        if (hour > 0) {
          time += hour + '小时'
        }
        return time
      }
    },
    methods: {
      handleProgressSystem (event, file, fileList) {
        if (!this.systemUploadTip) {
          this.$refs.systemUpdate.abort(file)
          this.$refs.systemUpdate.clearFiles()
        }
      },
      handleUploadSystem () {
        this.systemUploadTip = true
      },
      /* 系统升级 */
      systemUpdate() {
        this.$refs.systemUpdate.submit();
      },
      handleSuccess2 (response, file, fileList) {
        if (response.success) {
          this.systemUpdatePopShow = false
          this.systemUpdatePopShow = false
          this.systemUploadTip = false
          this.$refs.systemUpdate.clearFiles()
          this.$message.success("升级成功")
        } else {
          console.log(response)
          this.$message.error(response.message)
          this.$refs.systemUpdate.clearFiles()
        }
      },
      systemUploadPopClose () {
        if (this.systemUploadTip) {
          this.$confirm("文件正在上传中，确定关闭弹窗？", "提示", {
            confirmButtonText: '确定',
            confirmButtonClass: 'confirm-btn-blue',
            iconClass: 'el-icon-c-blue',
            cancelButtonText: '取消'
          }).then( () => {
            this.systemUpdatePopShow = false
            this.systemUploadTip = false
            this.$refs.systemUpdate.clearFiles()
          }).catch( () => {})
        } else {
          this.systemUpdatePopShow = false
          this.systemUploadTip = false
          this.$refs.systemUpdate.clearFiles()
        }
      },
      engineUploadPopClose () {
        if (this.engineUploadTip) {
          this.$confirm("文件正在上传中，确定关闭弹窗？", "提示", {
            confirmButtonText: '确定',
            confirmButtonClass: 'confirm-btn-blue',
            iconClass: 'el-icon-c-blue',
            cancelButtonText: '取消'
          }).then( () => {
            this.engineUpdatePopShow = false
            this.engineUploadTip = false
            this.$refs.upload.clearFiles()
          }).catch( () => {})
        } else {
          this.engineUpdatePopShow = false
          this.engineUploadTip = false
          this.$refs.upload.clearFiles()
        }
      },
      /* 上传文件 */
      submitUpload() {
        let that = this
        this.$post(that.$uri.system.engineCheckVersionCode, that.engineUpdateExtraInfo).then(res => {
          let msg = res.success ? "" : res.message
          msg += "\n如果确认无误，请点击确认按钮进行升级。"
          this.$confirm(msg, "提示", {
            confirmButtonText: '确定',
            confirmButtonClass: 'confirm-btn-blue',
            iconClass: 'el-icon-c-blue',
            cancelButtonText: '取消'
          }).then(() => {
            this.$refs.upload.submit();
          }).catch(() => {});
        })
      },
      handleProgressEngine (event, file, fileList) {
        if (!this.engineUploadTip) {
          this.$refs.upload.abort(file)
          this.$refs.upload.clearFiles()
        }
      },
      handleChange(file, fileList) {
        this.fileList = fileList
      },
      handleSuccess(response, file, fileList) {
        if (response.success) {
          this.engineUpdatePopShow = false
          this.engineUpdatePopShow = false
          this.engineUploadTip = false
          this.$refs.upload.clearFiles()
          this.$message.success("升级成功")
        } else {
          console.log(response)
          this.$message.error(response.message)
          this.$refs.upload.clearFiles()
        }
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleUploadEngine () {
        this.engineUploadTip = true
      },
      /* 获取引擎列表 */
      getEngineList () {
        let that = this
        that.$post(that.$uri.system.engineList, {}).then(res => {
          that.engineList = res.data
        })
      },
      /* 版本检查 */
      checkVersion () {
        this.$confirm("开始检查设备版本，低版本将自动升级？", "提示", {
          confirmButtonText: '确定',
          confirmButtonClass: 'confirm-btn-blue',
          iconClass: 'el-icon-c-blue',
          cancelButtonText: '取消'
        }).then( () => {
          let that = this
          that.$post(that.$uri.system.engineVersionCheck, {}).then(res => {
            that.$message.success("设备版本检查成功")
          })
        }).catch( () => {})
      },
      deleteVersion(index) {
        let that = this
        this.$confirm('删除后引擎版本将无法识别，是否继续?', '提示', {
          confirmButtonText: '确定',
          confirmButtonClass: 'confirm-btn-yellow',
          iconClass: 'el-icon-c-yellow',
          cancelButtonText: '取消'
        }).then(() => {
          that.$post(that.$uri.system.engineCodeDelete, {code: that.engineVersionList[index].code}).then(res => {
            if (res.success) {
              that.$message.success("删除成功")
              that.engineVersionList.splice(index, 1)
            } else {
              that.$message.error("删除失败，错误信息：" + res.message + "，错误码：" + res.code)
            }
          })
        }).catch(() => {})
      },
      versionAddList() {
        this.engineVersionAddList.push({
          code: '',
          content: ''
        })
      },
      versionDelList(index) {
        this.engineVersionDelList.push(this.engineVersionList[index])
        this.engineVersionList.splice(index, 1)
      },
      versionAddDelList(index) {
        this.engineVersionAddList.splice(index, 1)
      },
      versionAdd () {
        let that = this
        for (let i = 0; i < this.engineVersionAddList.length; i++) {
          if (!/^[0-9]{1,4}$/.test(this.engineVersionAddList[i].code) || !/^[0-9a-zA-Z_]{1,20}$/.test(this.engineVersionAddList[i].content)) {
            that.$message.error("请按正确的格式输入参数")
            return
          }
        }

        this.engineVersionList.forEach(version => {
          that.$post(that.$uri.system.engineCodeChange, version).then(res => {
            if (res.success) {
              this.getEngineVersionList()
              this.getEngineList()
            } else {
              // that.$message.error("添加失败，错误信息：" + res.message + "，错误码： " + res.code)
            }
          })
        })

        this.engineVersionAddList.forEach(version => {
          that.$post(that.$uri.system.engineCodeAdd, version).then(res => {
            if (res.success) {
              this.getEngineVersionList()
              this.getEngineList()
            } else {
              // that.$message.error("添加失败，错误信息：" + res.message + "，错误码： " + res.code)
            }
          })
          this.engineVersionAddList = []
        })

        this.engineVersionDelList.forEach(version => {
          that.$post(that.$uri.system.engineCodeDelete, version).then(res => {
            if (res.success) {
              this.getEngineVersionList()
              this.getEngineList()
            } else {
              // that.$message.error("删除失败，错误信息：" + res.message + "，错误码： " + res.code)
            }
          })
          this.engineVersionDelList = []
        })
        this.$message.success("修改完成")
        this.enginePopShow = false
      },
      versionAddCancel() {
        this.enginePopShow = false
        this.getEngineVersionList()
        this.engineVersionAddList = []
        this.engineVersionDelList = []
      },
      getEngineVersionList() {
        that.$post(that.$uri.system.engineCodeList).then(res => {
          if (res.success) {
            that.engineVersionList = res.list
          }
        })
      },
      license() {
        this.$store.commit(this.$mutation.LICENSE_UPDATE, true)
      },
      getSystemVersion() {
        that.$post(that.$uri.system.paramVersion, {}).then(res => {
          that.systemVersion = res.data
        })
      },
      getSysInfo() {
        that.$post(that.$uri.system.paramList, {}).then(res => {
          if (res.success) {
            let idInf = {}
            let paramInf = {}
            res.list.forEach(item => {
              idInf[item.paramName] = item.id
              paramInf[item.paramName] = item.paramValue
            })
            that.sysInfo = paramInf
            that.idInfo = idInf
            that.emailList = that.sysInfo.email.split(',')
            that.phoneList = that.sysInfo.phone.split(',')
          }
        })
      },
      getLicenseInfo() {
        that.$post(that.$uri.system.licenseGet, {}).then(res => {
          if (res.success) {
            that.licenseInfo = res.data
          }
        })
      },
      changePop() {
        that.changePopInfo = JSON.parse(JSON.stringify(that.sysInfo))
        that.changePopShow = true
      },
      streamPop() {
        that.changePopInfo = JSON.parse(JSON.stringify(that.sysInfo))
        that.streamPopShow = true
      },
      saveSysInfo(info) {
        for (let key in info) {
          if (info[key] !== that.sysInfo[key]) {
            let temp = {
              id: that.idInfo[key],
              paramName: key,
              paramValue: info[key]
            }
            that.$post(that.$uri.system.paramSave, temp).then(res => {})
          }
          that.getSysInfo()
          that.changePopShow = false
          that.streamPopShow = false
        }
      },
      deleteEmail(index) {
        that.emailList.splice(index, 1)
      },
      deletePhone(index) {
        that.phoneList.splice(index, 1)
      },
      emailPop() {
        that.emailList = that.sysInfo.email.split(',')
        that.emailPopShow = true
      },
      emailAdd() {
        that.emailList.push('')
      },
      emailAddSave() {
        let check = false
        that.emailList.forEach(phone => {
          if (!phone) {
            check = true
          }
        })
        if (check) {
          that.$message.warning("邮箱不能为空")
          return
        }
        let temp = {
          id: that.idInfo.email,
          paramName: 'email',
          paramValue: that.emailList.join(',')
        }
        that.$post(that.$uri.system.paramSave, temp).then(res => {
          if (res.success) {
            that.$message.success("修改成功")
            that.getSysInfo()
            that.emailPopShow = false
          } else {
            that.$message.error("修改失败")
          }
        })
      },
      phonePop() {
        that.phoneList = that.sysInfo.phone.split(',')
        that.phonePopShow = true
      },
      phoneAdd() {
        that.phoneList.push('')
      },
      phoneCancel() {
        that.getSysInfo()
        that.phonePopShow = false
      },
      emailCancel() {
        that.getSysInfo()
        that.emailPopShow = false
      },
      phoneAddSave() {
        let check = false
        that.phoneList.forEach(phone => {
          if (!phone) {
            check = true
          }
        })
        if (check) {
          that.$message.warning("电话不能为空")
          return
        }
        let temp = {
          id: that.idInfo.phone,
          paramName: 'phone',
          paramValue: that.phoneList.join(',')
        }
        that.$post(that.$uri.system.paramSave, temp).then(res => {
          if (res.success) {
            that.$message.success("修改成功")
            that.getSysInfo()
            that.phonePopShow = false
          } else {
            that.$message.error("修改失败")
          }
        })
      }
    },
    beforeCreate() {
      that = this
    },
    mounted() {
      that.getSysInfo()
      that.getLicenseInfo()
      that.getSystemVersion()
      that.getEngineVersionList()
      that.getEngineList()
    }
  };
</script>

<style lang="less" scoped>
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