<template>
  <div style="display: flex;flex-direction: row;">
    <el-form ref="form" :model="info" label-width="130px" label-position="left" style="width: 500px;">
      <el-button type="primary" size="small" @click="save()" style="margin-left: -400px;margin-bottom: 20px"  v-if="$store.state.isAdmin">保存修改</el-button>
      <el-form-item label="安装应用">
        <div class="test">
          <el-switch
                  v-model="info.isInstallApp"
                  :active-value="1"
                  :inactive-value="0">
          </el-switch>
          <el-tooltip effect="dark" content="设备推流时是否允许安装应用不被卸载，开启后用户可在推流时安装的应用可在结束后保留，关闭时推流时安装的应用会被立即卸载。" placement="top-start">
            <i class="el-icon-question" style="margin-left: 5px" ></i>
          </el-tooltip>
        </div>
      </el-form-item>
      <el-form-item label="卸载应用">
        <div class="test">
          <el-switch
                  v-model="info.isUninstallApp"
                  :active-value="1"
                  :inactive-value="0">
          </el-switch>
          <el-tooltip effect="dark" content="设备推流时是否允许用户卸载应用，开启后用户无法在推流的时候进行卸载操作，关闭时用户可以正常进行卸载操作。" placement="top-start">
            <i class="el-icon-question" style="margin-left: 5px" ></i>
          </el-tooltip>
        </div>
      </el-form-item>
      <el-form-item label="返回桌面">
        <div class="test">
          <el-switch
                  v-model="info.isHome"
                  :active-value="1"
                  :inactive-value="0">
          </el-switch>
          <el-tooltip effect="dark" content="设备推流时是否允许返回到桌面，关闭后用户推流时返回桌面会立即结束推流，并且无法以APPID为0的形式进行推流。" placement="top-start">
            <i class="el-icon-question" style="margin-left: 5px" ></i>
          </el-tooltip>
        </div>
      </el-form-item>
      <!--<el-form-item label="网络限制">
        <div class="test">
          <el-switch
                  v-model="info.isNetLimit"
                  :active-value="1"
                  :inactive-value="0">
          </el-switch>
          <el-tooltip effect="dark" content="对设备推流时可访问的网络进行限制" placement="top-start">
            <i class="el-icon-question" style="margin-left: 5px" ></i>
          </el-tooltip>
        </div>
      </el-form-item>
      <div v-show="info.isNetLimit != 0">
        <div style="display: flex;flex-direction: row">
          <div class="test" style="margin-right: 30px">
            <el-radio v-model="info.isNetLimit" :label="1">白名单模式
            <el-tooltip effect="dark" content="除了白名单内IP，其他IP皆无法连接" placement="top-start">
              <i class="el-icon-question" style="margin-left: 5px" ></i>
            </el-tooltip>
            </el-radio>
          </div>
          <div class="test">
            <el-radio v-model="info.isNetLimit" :label="2">黑名单模式
            <el-tooltip effect="dark" content="除了黑名单内IP，其他IP皆可连接" placement="top-start">
              <i class="el-icon-question" style="margin-left: 5px" ></i>
            </el-tooltip>
            </el-radio>
          </div>
        </div>
        <el-input
                style="margin: 10px 0;"
                type="textarea"
                autosize
                placeholder="请输入内容"
                v-model="info.netList">
        </el-input>
      </div>
      <el-form-item label="推流时间限制">
        <div class="test">
          <el-switch
                  v-model="info.isFlowTimeLimit"
                  :active-value="1"
                  :inactive-value="0">
          </el-switch>
          <el-tooltip effect="dark" content="只允许设备在限定的时间内通过外部设备进行推流。并且可以对单次推流时间进行限制" placement="top-start">
            <i class="el-icon-question" style="margin-left: 5px" ></i>
          </el-tooltip>
        </div>
      </el-form-item>
      <div v-show="info.isFlowTimeLimit == 1">
        <el-form-item label="每日可推流时间段">
          <el-time-picker
                  is-range
                  v-model="range"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="单次可推流时长">
          <el-time-picker
                  v-model="info.flowTimeOnce"
                  placeholder="时长">
          </el-time-picker>
        </el-form-item>
      </div>-->
    </el-form>
    <div style="flex-grow: 1"></div>
    <div style="text-align: left;width: 400px">
      <span>权限控制说明：</span>
      <br/>
      <br/>
      <span><b>安装应用：</b>设备推流时是否可以安装应用</span>
      <br/>
      <br/>
      <span><b>卸载应用：</b>设备推流时是否允许用户卸载应用，开启后用户无法在推流的时候进行卸载操作，关闭时用户可以正常进行卸载操作。</span>
      <br/>
      <br/>
      <span><b>返回桌面：</b>设备推流时是否允许返回到桌面，关闭后用户推流时返回桌面会立即结束推流，并且无法以APPID为0的形式进行推流。</span>
      <!--<br/>-->
      <!--<br/>-->
      <!--<span><b>网络限制：</b>对设备推流时可访问的网络进行限制。白名单模式：除了白名单内IP，其他IP皆无法连接。黑名单模式：除了黑名单内IP，其他IP皆可连接。</span>-->
      <!--<br/>-->
      <!--<br/>-->
      <!--<span><b>推流时间限制：</b>只允许设备在限定的时间内通过外部设备进行推流。并且可以对单次推流时间进行限制。</span>-->
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <span>权限控制其他功能：<br/><el-button type="text" @click="$router.push('/home/log/group')">分组日志监控</el-button></span>
    </div>
  </div>
</template>

<script>
  let that
  export default {
    name: "GroupListAuth",
    data() {
      return {
        id: 0,
        range: [null, null],
        info: {}
      }
    },
    methods: {
      save() {
        if (this.info.isFlowTimeLimit == 0) {
          this.info.flowTimeDayStart = ''
          this.info.flowTimeDayEnd = ''
          this.info.flowTimeOnce = 0
        } else {
          if (this.range[0]) {
            let start = this.range[0]
            this.info.flowTimeDayStart = start.getHours() + ':' + start.getMinutes() + ':' + start.getSeconds()
          }
          if (this.range[1]) {
            let end = this.range[1]
            this.info.flowTimeDayEnd = end.getHours() + ':' + end.getMinutes() + ':' + end.getSeconds()
          }
          if (this.info.flowTimeOnce != 0) {
            let once = this.info.flowTimeOnce
            this.info.flowTimeOnce = once.getSeconds() + once.getMinutes() * 60 + once.getHours() * 60 * 60
          }
        }
        that.$post(that.$uri.group.infoSave, that.info).then(res => {
          that.$message.success("修改成功")
        })
      }
    },
    beforeCreate() {
      that = this
      that.id = that.$store.state.groupInfo.id
      that.$post(that.$uri.group.info, {id: that.id}).then(res => {
        that.info = res.data
        that.range.splice(0, 1, new Date('01 01,2020 ' + that.info.flowTimeDayStart))
        that.range.splice(1, 1, new Date('01 01,2020 ' + that.info.flowTimeDayEnd))
        let s = that.info.flowTimeOnce
        that.info.flowTimeOnce = new Date(new Date(2020, 1, 1).getTime() + s * 1000)
        console.log(that.range)
        console.log(that.info.flowTimeOnce)
      })
    }
  };
</script>

<style lang="scss" scoped>

</style>