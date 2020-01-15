<template>
  <div class="detail-table">
    <div class="detail-table-header">
      <span class="detail-table-header-name">{{$route.name}}</span>
      <!--<el-dropdown @command="handleCommand"  v-if="$store.getters.checkChangeAuth()">
        <span class="detail-table-setting">
          设置<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="change">修改设置</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>-->
    </div>
    <div class="detail-table-body">
      <template v-for="(item, index) in list">
        <DetailTableItem class="detail-table-body-item" :key="index" :name="item.name" :param="item.value">
        </DetailTableItem>
      </template>
    </div>
    <!-- 网络设置 -->
    <el-dialog title="修改设置" :append-to-body="true" :visible.sync="changePopShow" width="500px" top="15vh">
      <div>
        <el-form ref="form" :model="appInfo" :rules="rules" label-width="180px" label-position="left">
          <el-form-item label="类名" prop="activity">
            <el-input v-model="appInfo.activity"></el-input>
          </el-form-item>
          <el-form-item label="推流最大码率" prop="encodeRateMax">
            <div class="test">
              <el-input v-model="appInfo.encodeRateMax" :placeholder="rateTip">
                <div slot="suffix">kb/s</div>
              </el-input>
              <el-tooltip effect="dark" content="推流最大码率主要用于调节推流清晰度，根据网络实时进行适配，保证良好的推流体验，设置建议值1000-6000" placement="top-start">
                <i class="el-icon-question" style="margin-left: 5px" ></i>
              </el-tooltip>
            </div>
          </el-form-item>
          <el-form-item label="推流帧率" prop="framerate">
            <div class="test">
              <el-input v-model="appInfo.framerate" :placeholder="frameTip">
              </el-input>
              <el-tooltip effect="dark" content="推流帧率为应用推流时的最大帧数，建议值为1-60." placement="top-start">
                <i class="el-icon-question" style="margin-left: 5px" ></i>
              </el-tooltip>
            </div>
          </el-form-item>
          <el-form-item label="是否授权">
            <el-switch v-model="appInfo.isRoot"
                       active-value="1"
                       inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="是否预启动">
            <el-switch v-model="appInfo.isPrestart"
                       active-value="1"
                       inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="是否上传定位信息">
            <el-switch v-model="appInfo.isUploadLocationInfo"
                       active-value="1"
                       inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="是否开启传感器">
            <el-switch v-model="appInfo.isSensor"
                       active-value="1"
                       inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="推出是否清理用户数据">
            <el-switch v-model="appInfo.isClean"
                       active-value="1"
                       inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="退出后是否重启设备">
            <el-switch v-model="appInfo.isReboot"
                       active-value="1"
                       inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="退出后是否关闭应用" prop="isStopApp">
            <el-select v-model="appInfo.isStopApp" placeholder="请选择" size="small">
              <el-option label="关闭应用" value="0"></el-option>
              <el-option label="不关闭并放入后台" value="1"></el-option>
              <el-option label="不关闭并留在前台" value="2"></el-option>
            </el-select>
          </el-form-item>
          <div class="popup-flex">
            <div>
              <el-button type="primary" @click="saveAppInfo">确定</el-button>
              <el-button @click="changePopShow = false">取消</el-button>
            </div>
          </div>
        </el-form>
      </div>
    </el-dialog>
    <!-- 白名单配置 -->
    <el-dialog title="应用白名单" :append-to-body="true" :visible.sync="changeWhitePopShow" width="500px" top="15vh">
      <div>
        <el-form ref="form" :model="appInfo" label-width="130px" label-position="left">
          <el-form-item label="">
            <el-button type="text" @click="addWhiteShow = true" v-if="!addWhiteShow">新增白名单</el-button>
          </el-form-item>
          <el-form-item label="">
            <div style="display: flex;flex-direction: column;max-height: 400px;overflow-y: auto">
              <template v-for="(item, index) in whiteList">
                <div style="display: flex;flex-direction: row;justify-content: space-between">
                  <span :key="index">{{item}}</span>
                  <el-button type="text" @click="whiteDel(index)">删除</el-button>
                </div>
              </template>
            </div>
          </el-form-item>
          <el-form-item label="包名" v-if="addWhiteShow">
            <el-input v-model="addWhiteName"></el-input>
          </el-form-item>
          <el-form-item  v-if="addWhiteShow">
            <el-button type="primary" @click="whiteAdd">确定</el-button>
            <el-button @click="addWhiteShow = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <div class="detail-setting">
      <el-button type="info" plain size="small" @click="changePop">修改设置</el-button>
      <el-button type="info" plain size="small" @click="changeWhitePop">白名单设置</el-button>
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
        changeWhitePopShow: false,
        addWhiteShow: false,
        addWhiteName: '',
        whiteList: [],
        appInfo: {},
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
      }
    },
    methods: {
      /* 修改设备池信息 */
      saveAppInfo () {
        let that = this
        that.loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        that.$refs.form.validate(valid => {
          if (valid) {
            if (!that.appInfo.framerate) {
              that.appInfo.framerate = 0
            }
            if (!that.appInfo.encodeRateMax) {
              that.appInfo.encodeRateMax = 0
            }
            that.$post(that.$uri.apk.apkInfoSave, that.appInfo).then(res => {
              that.changePopShow = false
              that.loading.close()
              that.$message.success("修改成功")
              // 刷新数据
              that.getDetailList()
            })
          }
        })
      },
      /* 修改弹窗 */
      changePop () {
        for (let k in this.appInfo) {
          this.appInfo[k] += ''
        }
        if (this.appInfo.framerate == '0') {
          this.appInfo.framerate = ''
        }
        if (this.appInfo.encodeRateMax == '0') {
          this.appInfo.encodeRateMax = ''
        }
        this.changePopShow = true
      },
      /* 白名单弹窗 */
      changeWhitePop () {
        if (this.appInfo.whiteList) {
          this.whiteList = this.appInfo.whiteList.split(';')
        }
        this.changeWhitePopShow = true
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
        console.log(that.addWhiteName)
        if (!/^[a-zA-Z0-9.]{1,150}$/.test(that.addWhiteName)) {
          that.$message.warning("包名只允许字母数字和小数点")
          return
        }
        that.whiteList.push(that.addWhiteName)
        this.appInfo.whiteList = this.whiteList.join(";")
        that.$post(that.$uri.apk.apkInfoSave, that.appInfo).then(res => {

        })
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
          v.apkStatus += ""
          v.versionCode += ""
          v.appId += ""
          v.isRoot += ""
          v.isPrestart += ""
          that.appInfo = v
          that.appInfo.isStopApp = that.appInfo.isStopApp + ""
          let list = []
          list.push({
            name: "应用名称",
            value: v.appName
          })
          list.push({
            name: "文件名",
            value: v.apkName
          })
          list.push({
            name: "版本",
            value: v.versionName
          })
          list.push({
            name: "版本号",
            value: v.versionCode
          })
          list.push({
            name: "包名",
            value: v.packageName
          })
          list.push({
            name: "应用状态",
            value: v.apkStatus === "1" ? "正常" : "下架"
          })
          list.push({
            name: "APPID",
            value: v.appId
          })
          list.push({
            name: "类名",
            value: v.activity
          })
          list.push({
            name: "是否授权",
            value: v.isRoot == "1" ? "是" : "否"
          })
          list.push({
            name: "是否预启动",
            value: v.isPrestart == "1" ? "是" : "否"
          })
          list.push({
            name: "是否清理用户数据",
            value: v.isClean == "1" ? "是" : "否"
          })
          list.push({
            name: "应用退出后是否重启设备",
            value: v.isReboot == "1" ? "是" : "否"
          })
          list.push({
            name: "是否上传定位信息",
            value: v.isUploadLocationInfo == "1" ? "是" : "否"
          })
          list.push({
            name: "是否开启传感器",
            value: v.isSensor == "1" ? "是" : "否"
          })
          list.push({
            name: "应用退出后是否关闭",
            value: v.isStopApp == "0" ? "关闭应用" : (v.isStopApp == "1" ? "不关闭并放入后台" : "不关闭并留在前台")
          })
          list.push({
            name: "推流帧率",
            value: (v.framerate || this.frameRate) + ""
          })
          if (v.encodeRateMax > 0) {
            list.push({
              name: "推流最大码率",
              value: v.encodeRateMax + ""
            })
            that.list = list
          } else {
            that.$post(that.$uri.system.paramGet, {paramName: 'encodeRateMax'}).then(res => {
              that.maxRate = v.encodeRateMax
              if (res.success) {
                that.maxRate = res.data.paramValue
              }
              list.push({
                name: "推流最大码率",
                value: that.maxRate + ""
              })
              that.list = list

            })
          }
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
</style>