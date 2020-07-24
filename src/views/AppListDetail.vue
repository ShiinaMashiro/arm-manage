<template>
  <div class="detail-table">
    <div>
      <div class="info-view">
        <div class="info-view-title">应用信息</div>
        <div class="info-view-main">
          <div class="info-view-item"><span>APPID：</span><span>{{appInfo.appId}}</span></div>
          <div class="info-view-item"><span>文件名：</span><span>{{appInfo.apkName}}</span></div>
          <div class="info-view-item"><span>版本：</span><span>{{appInfo.versionName}}</span></div>
          <div class="info-view-item"><span>版本号：</span><span>{{appInfo.versionCode}}</span></div>
          <div class="info-view-item"><span>包名：</span><span>{{appInfo.packageName}}</span></div>
          <div class="info-view-item"><span>应用状态：</span><span>{{appInfo.apkStatus === 1 ? '正常' : '下架'}}</span></div>
        </div>
      </div>
      <div class="info-view" @keyup.enter="saveAppInfo(changePopInfo)">
        <div class="info-view-title">应用设置</div>
        <div class="info-view-main">
          <span class="info-view-item" style="font-size: 12px">基础设置，用于设置应用在推流时的表现</span>
            <div class="info-view-item">
              <span style="color: red;" v-if="changePopShow">*</span>
              <span>类名：</span>
              <span v-if="!changePopShow">{{appInfo.activity}}</span>
              <el-input v-else size="mini" v-model="changePopInfo.activity" style="width: 150px"></el-input>
            </div>

            <div class="info-view-item">
              <span>推流最小码率<span v-show="changePopShow" style="color: red;">*</span>：</span>
              <span v-if="!changePopShow">{{appInfo.encodeRateMin}} kb/s<el-tooltip placement="top" style="padding: 0 5px">
              <div slot="content" style="max-width: 400px">
                调整云机推流时画面的最小码率，需输入100~8000的数字，默认为1000，必须小于等于推流最大码率。
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip></span>
              <div v-else>
                <el-input size="mini" v-model="changePopInfo.encodeRateMin" :style="{width: '150px', border: checkInfo.encodeRateMin ? '1px solid red' : ''}"></el-input>
                <el-tooltip placement="top" style="padding: 0 5px">
                  <div slot="content" style="max-width: 400px">
                    调整云机推流时画面的最小码率，需输入100~8000的数字，默认为1000，必须小于等于推流最大码率。
                  </div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
                <span v-show="checkInfo.encodeRateMin" style="color: red;padding-left: 10px">请输入大于100并且小于推流最大码率和8000的数值。</span>
              </div>
            </div>
            <div class="info-view-item">
              <span>推流最大码率<span v-show="changePopShow" style="color: red;">*</span>：</span>
              <span v-if="!changePopShow">{{appInfo.encodeRateMax}} kb/s<el-tooltip placement="top" style="padding: 0 5px">
              <div slot="content" style="max-width: 400px">
                调整云机推流时画面的最打码率，需输入1000~40000的整数，默认为2000，必须大于等于推流最小码率。
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip></span>
              <div v-else>
                <el-input size="mini" v-model="changePopInfo.encodeRateMax" :style="{width: '150px', border: checkInfo.encodeRateMax ? '1px solid red' : ''}"></el-input>
                <el-tooltip placement="top" style="padding: 0 5px">
                  <div slot="content" style="max-width: 400px">
                    调整云机推流时画面的最打码率，需输入1000~40000的整数，默认为2000，必须大于等于推流最小码率。
                  </div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
                <span v-show="checkInfo.encodeRateMax" style="color: red;padding-left: 10px">请输入大于1000和最小推流码率并且小于40000的数值。</span>
              </div>
            </div>
            <div class="info-view-item">
              <span>推流帧率<span v-show="changePopShow" style="color: red;">*</span>：</span>
              <span v-if="!changePopShow">{{appInfo.framerate}}<el-tooltip placement="top" style="padding: 0 5px">
              <div slot="content" style="max-width: 400px">
                调整云机推流时画面的帧率，需输入1-60的整数，默认为30。
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip></span>
              <div v-else>
                <el-input size="mini" v-model="changePopInfo.framerate" :style="{width: '150px', border: checkInfo.framerate ? '1px solid red' : ''}"></el-input>
                <el-tooltip placement="top" style="padding: 0 5px">
                  <div slot="content" style="max-width: 400px">
                    调整云机推流时画面的帧率，需输入1-60的整数，默认为30。
                  </div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
                <span v-show="checkInfo.framerate" style="color: red;padding-left: 10px">请输入1-60的整数。</span>
              </div>
            </div>
          <div class="info-view-item-btn">
            <el-button size="small" type="primary" v-if="!changePopShow && $store.getters.checkChangeAuth()" @click="changePop()">设置</el-button>
            <el-button size="small" type="primary" :disabled="!canChangePop" v-if="changePopShow" @click="saveAppInfo(changePopInfo)">保存</el-button>
            <el-button size="small" type="info" v-if="changePopShow" @click="changePopShow = false">取消</el-button>
          </div>
        </div>
      </div>
      <div class="info-view" @keyup.enter="saveAppInfo(switchPopInfo)">
        <div class="info-view-title">功能开关</div>
        <div class="info-view-main">
          <span class="info-view-item" style="font-size: 12px">设置应用在推流时拥有的设备功能及退出后是否保留数据和应用进程</span>
          <div class="info-view-item">
            <span>ROOT授权：</span>
            <span v-if="!switchPopShow">{{appInfo.isRoot === 0 ? '关' : '开'}}</span>
            <el-switch v-else v-model="switchPopInfo.isRoot" :active-value="1" :inactive-value="0"></el-switch>
          </div>
          <div class="info-view-item">
            <span>预启动：</span>
            <span v-if="!switchPopShow">{{appInfo.isPrestart === 0 ? '关' : '开'}}</span>
            <el-switch v-else v-model="switchPopInfo.isPrestart" :active-value="1" :inactive-value="0"></el-switch>
          </div>
          <div class="info-view-item">
            <span>上传定位信息：</span>
            <span v-if="!switchPopShow">{{appInfo.isUploadLocationInfo === 0 ? '关' : '开'}}</span>
            <el-switch v-else v-model="switchPopInfo.isUploadLocationInfo" :active-value="1" :inactive-value="0"></el-switch>
          </div>
          <div class="info-view-item">
            <span>传感器：</span>
            <span v-if="!switchPopShow">{{appInfo.isSensor === 0 ? '关' : '开'}}</span>
            <el-switch v-else v-model="switchPopInfo.isSensor" :active-value="1" :inactive-value="0"></el-switch>
          </div>
          <div class="info-view-item">
            <span>清理用户数据：</span>
            <span v-if="!switchPopShow">{{appInfo.isClean === 0 ? '关' : '开'}}</span>
            <el-switch v-else v-model="switchPopInfo.isClean" :active-value="1" :inactive-value="0"></el-switch>
          </div>
          <div class="info-view-item">
            <span>退出后重启设备：</span>
            <span v-if="!switchPopShow">{{appInfo.isReboot === 0 ? '关' : '开'}}</span>
            <el-switch v-else v-model="switchPopInfo.isReboot" :active-value="1" :inactive-value="0"></el-switch>
          </div>
          <div class="info-view-item">
            <span>退出后关闭应用：</span>
            <span v-if="!switchPopShow">{{appInfo.isStopApp === 0 ? '关闭应用' : (appInfo.isStopApp === 1 ? '不关闭并放入后台' : '不关闭并留在前台')}}</span>
            <el-select v-else v-model="switchPopInfo.isStopApp" placeholder="请选择" size="small">
              <el-option label="关闭应用" :value="0"></el-option>
              <el-option label="不关闭并放入后台" :value="1"></el-option>
              <el-option label="不关闭并留在前台" :value="2"></el-option>
            </el-select>
          </div>
          <div class="info-view-item-btn">
            <el-button size="small" type="primary" v-if="!switchPopShow && $store.getters.checkChangeAuth()" @click="switchPop()">设置</el-button>
            <el-button size="small" type="primary" v-if="switchPopShow" @click="saveAppInfo(switchPopInfo)">保存</el-button>
            <el-button size="small" type="info" v-if="switchPopShow" @click="switchPopShow = false">取消</el-button>
          </div>
        </div>
      </div>
      <div class="info-view" @keyup.enter="whiteAddSave()">
        <div class="info-view-title">白名单设置</div>
        <div class="info-view-main">
          <span class="info-view-item" style="font-size: 12px">设置应用推流时可以同步启动的其他apk包名，推流时未在白名单内的包名启动时会退出推流</span>
          <div class="info-view-item" style="align-items: flex-start;height: auto">
            <span style="height: 30px;line-height: 30px">当前白名单：</span>
            <div style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start">
              <div v-for="(white, index) in whiteList" :key="index" style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start;height: 30px">
                <span v-if="!whitePopShow">{{white}}</span>
                <div v-else style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
                  <el-input size="mini" v-model="whiteList[index]" style="width: 150px"></el-input>
                  <i v-if="(index + 1) === whiteList.length" class="iconfont" style="color: gray;margin-left: 3px;font-size: 18px" @click="whiteAdd()">&#xe631;</i>
                  <i v-if="whiteList.length !== 1" class="iconfont" style="color: gray;margin-left: 3px;font-size: 18px" @click="deleteWhite(index)">&#xe630;</i>
                </div>
              </div>

            </div>
          </div>
          <div class="info-view-item-btn">
            <el-button size="small" type="primary" v-if="!whitePopShow && $store.getters.checkChangeAuth()" @click="whitePop()">设置</el-button>
            <el-button size="small" type="primary" v-if="whitePopShow" @click="whiteAddSave()">保存</el-button>
            <el-button size="small" type="info" v-if="whitePopShow" @click="cancelWhitePop()">取消</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import DetailTableItem from "@/components/DetailTableItem"
  export default {
    name: "AppListDetail",
    components: {
      DetailTableItem
    },
    data () {
      return {
        id: -1,
        loading: null,
        frameRate: 0,
        maxRate: 0,
        changePopShow: false,
        changePopInfo: {},
        switchPopShow: false,
        switchPopInfo: {},
        whitePopShow: false,
        whitePopInfo: {},
        changeWhitePopShow: false,
        addWhiteShow: false,
        addWhiteName: '',
        whiteList: [],
        whiteAddValue: '',
        appInfo: {},
        regexMap: {
          webIp: /^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/,
          webMask: /^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/,
          email: /^$/,
          phone: /^$/,
          // ntpAddress: '/^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)($|(?!\\.$)\\.)){4}$/',
          encodeRateMax: /^([1-3]\d{3,4}|[4-9]\d{3})$/,
          extranetIp: /^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/,
          framerate: /^([0-5]\d|60|[1-9])$/,
          // mediaServerWan: '/^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)($|(?!\\.$)\\.)){4}$/',
          // mediaServerLan: '/^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)($|(?!\\.$)\\.)){4}$/',
          webPort: /^[0-9]{1,5}$/,
          encodeRateMin: /^([1-7][0-9]{2,3}|[89]\d{2})$/,
          cameraUpFrameRate: /^([0-5]\d|60|[1-9])$/,
          cameraUpCodeRate: /^([1-3]\d{3,4}|[4-9]\d{3})$/,
          isVolume: /^[12]$/
        },
        checkInfo: null,
        list: [],
        rules: {
          activity: [
            {required: true, message: "请输入类名", trigger: "blur"},
            {min: 1, max: 200, message: "长度为1-200个字符", trigger: "blur"}
          ],
          encodeRateMax: [
            {validator: (rule, value, callback) => {
                value = parseInt(value)
                if (!value) {
                  return callback();
                }
                setTimeout(() => {
                  if (!Number.isInteger(value)) {
                    callback(new Error('请输入整数'));
                  } else {
                    if (value < 1000 || value > 6000) {
                      callback(new Error('1000-6000'));
                    } else {
                      callback();
                    }
                  }
                }, 1000);
              }, trigger: "blur"}
          ],
          framerate: [
            {validator: (rule, value, callback) => {
                value = parseInt(value)
                if (!value) {
                  return callback();
                }
                setTimeout(() => {
                  if (!Number.isInteger(value)) {
                    callback(new Error('请输入整数'));
                  } else {
                    if (value < 1 || value > 60) {
                      callback(new Error('1-60'));
                    } else {
                      callback();
                    }
                  }
                }, 1000);
              }, trigger: "blur"}
          ],
          isStopApp: [
            {required: true, message: "不能为空", trigger: "change"}
          ]
        }
      }
    },
    computed: {
      frameTip() {
        return "默认系统设置的帧率(" + this.frameRate + ")"
      },
      rateTip() {
        return "默认系统设置的码率(" + this.maxRate + ")"
      },
      canChangePop() {
        return this.changePopInfo.activity && this.changePopInfo.encodeRateMax && this.changePopInfo.framerate
      }
    },
    methods: {
      deleteWhite(index) {
        this.whiteList.splice(index, 1)
      },
      /* 修改设备池信息 */
      saveAppInfo (info) {
        let that = this
        let sign = false
        if (!that.regexMap.encodeRateMax.test(info.encodeRateMax) || parseInt(info.encodeRateMax) < parseInt(info.encodeRateMin)) {
          that.checkInfo['encodeRateMax'] = true
          sign = true
        }
        if (!that.regexMap.encodeRateMin.test(info.encodeRateMin) || parseInt(info.encodeRateMax) < parseInt(info.encodeRateMin)) {
          that.checkInfo['encodeRateMin'] = true
          sign = true
        }
        if (!that.regexMap.framerate.test(info.framerate)) {
          that.checkInfo['framerate'] = true
          sign = true
        }
        if (sign) {
          return
        }
        that.loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        that.$post(that.$uri.apk.apkInfoSave, info).then(res => {
          that.changePopShow = false
          that.switchPopShow = false
          that.whitePopShow = false
          that.loading.close()
          that.$message.success("修改成功")
          // 刷新数据
          that.getDetailList()
        })
      },
      /* 修改弹窗 */
      changePop () {
        this.changePopInfo = JSON.parse(JSON.stringify(this.appInfo))
        this.changePopShow = true
      },
      /* 修改弹窗 */
      switchPop () {
        this.switchPopInfo = JSON.parse(JSON.stringify(this.appInfo))
        this.switchPopShow = true
      },
      /* 修改弹窗 */
      whitePop () {
        this.whitePopInfo = JSON.parse(JSON.stringify(this.appInfo))
        this.whitePopShow = true
      },
      cancelWhitePop() {
        this.whiteList = this.appInfo.whiteList.split(';')
        this.whitePopShow = false
      },
      /* 白名单删除 */
      whiteDel (index) {
        let that = this
        this.$confirm('确认删除这条记录?', '提示', {
          confirmButtonText: '确定',
          confirmButtonClass: 'confirm-btn-blue',
          iconClass: 'el-icon-c-blue',
          cancelButtonText: '取消'
        }).then(() => {
          that.whiteList.splice(index, 1)
          this.appInfo.whiteList = this.whiteList.join(";")
          that.$post(that.$uri.apk.apkInfoSave, that.appInfo).then(res => {

          })
        }).catch(() => {});

      },
      /* 白名单新增 */
      whiteAdd () {
        let that = this
        that.whiteList.push('')
      },
      whiteAddSave() {
        for(let i = 0; i < this.whiteList.length; i++) {
          if (!/^[a-zA-Z0-9.]{1,150}$/.test(this.whiteList[i])) {
            this.$message.warning("包名只允许字母数字和小数点")
            return
          }
        }
        this.whitePopInfo.whiteList = this.whiteList.join(";")
        this.saveAppInfo(this.whitePopInfo)
      },
      /* 下拉菜单事件 */
      handleCommand (command) {
        this.changePop()
      },
      /* 获取应用详细信息并组装 */
      getDetailList () {
        let that = this
        that.$post(that.$uri.apk.apkInfo, {id: that.id}).then(res => {
          let v = res.data
          that.appInfo = v
          that.checkInfo = {
            encodeRateMin: false,
            encodeRateMax: false,
            framerate: false
          }
          that.whiteList = that.appInfo.whiteList.split(';')
        })
      }
    },
    created () {
      this.id = this.$store.state.appInfo.id

      this.$post(this.$uri.system.paramGet, {paramName: "framerate"}).then(res => {
        if (res.success) {
          this.frameRate = res.data.paramValue
        }
        this.getDetailList()
      })
    }
  };
</script>

<style lang="less" scoped>

  .detail-table {
    padding-bottom: 80px;
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
  .test {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
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