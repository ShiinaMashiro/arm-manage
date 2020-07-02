<template>
  <div class="device">
    <vue-draggable-resizable :parent="true" :resizable="false" drag-handle=".header" :x="left" :y="top">
      <div class="window">
        <div class="header" :style="{ width: deviceWidth + 'px' }">
          <span class="id">{{ id }}</span>
          <div v-show="camera || video" style="color: #409EFF;font-size: 12px;padding-right: 5px">{{camera ? '摄像头同步中' : '视频同步中'}}</div>
          <el-button style="margin-right: 5px"
                     v-show="(camera && !$store.state.cameraShow) || (video && !$store.getters.videoDisplay(localId))"
                     type="primary" size="mini" @click="showLocal(true)">打开预览</el-button>
          <el-button style="margin-left: 0!important;margin-right: 5px"
                     v-show="(camera && $store.state.cameraShow) || (video && $store.getters.videoDisplay(localId))"
                     type="primary" size="mini" @click="showLocal(false)">关闭预览</el-button>
          <div  v-show="!camera && !video" style="float: right;display: flex;flex-direction: row;align-items: center" v-if="$isEnable($enableKey.remoteCamera)">
            <el-button :disabled="video || !status" size="mini" type="primary" @click="openLocalCamera">摄像头</el-button>
            <!--<el-button v-if="camera" size="mini" type="primary" @click="closeLocalCamera">关闭本地摄像头</el-button>-->
            <el-tooltip placement="top" style="padding: 0 5px">
              <div slot="content" style="max-width: 400px">将本地PC摄像头与云机摄像头同步，延迟约在200ms以内，可查看本地画面进行实时对比。当前最多支持10台云机进行同步。目前仅支持最新版chrome浏览器。</div>
              <i class="el-icon-question"></i>
            </el-tooltip>
            <el-button :disabled="camera || !status"  size="mini" type="primary" @click="openLocalVideo">视频导入</el-button>
            <!--<el-button v-if="video" size="mini" type="primary" @click="closeLocalVideo">关闭视频导入</el-button>-->
            <el-tooltip placement="top" style="padding: 0 5px">
              <div slot="content" style="max-width: 400px">上传本地视频文件至云机并作为云机摄像头获取画面进行播放。当前最多支持10台云机进行同步。目前仅支持最新版chrome浏览器。</div>
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
          <i v-if="!video && !camera" class="close el-icon-close" @click="closeClick"></i>
          <i v-else class="close el-icon-switch-button" style="color: red" @click="closeLocal()"></i>
        </div>
        <div class="body" :style="{ width: deviceWidth + 'px', height: deviceHeight + 'px' }">
          <div v-if="deviceMessage" class="message"> {{ deviceMessage }} </div>
          <div :id="'target' + id" :style="{ width: deviceWidth + 'px', height: deviceHeight + 'px' }"></div>
        </div>
        <div class="footer" :style="{ width: deviceWidth + 'px' }">
          <el-tooltip class="tooltip" effect="dark" content="返回键" placement="top-start">
            <div class="return" @click="returnClick"></div>
          </el-tooltip>
          <el-tooltip class="tooltip" effect="dark" content="主页键" placement="top">
            <div class="home" @click="homeClick"></div>
          </el-tooltip>
          <el-tooltip class="tooltip" effect="dark" content="截图" placement="top">
            <div class="snapshot" @click="snapshotClick"></div>
          </el-tooltip>
          <el-tooltip class="tooltip" effect="dark" content="任务键" placement="top">
            <div class="recent" @click="recentClick"></div>
          </el-tooltip>
          <el-tooltip class="tooltip" effect="dark" content="音量+" placement="top">
            <div class="vol-up" @click="volUpClick"></div>
          </el-tooltip>
          <el-tooltip class="tooltip" effect="dark" content="音量-" placement="top">
            <div class="vol-down" @click="volDownClick"></div>
          </el-tooltip>
          <el-tooltip class="tooltip" effect="dark" content="切换横竖屏" placement="top-end">
            <div class="toogle-orientation" @click="toogleOrientationClick"></div>
          </el-tooltip>
        </div>
      </div>
    </vue-draggable-resizable>
    <el-dialog
            title="设备截图"
            :visible.sync="dialogVisible"
            :modal="false"
            :append-to-body="true"
            width="30%">
      <div style="display: flex;flex-direction: column;">
        <el-image v-if="url"
                  style="width: 100%;"
                  :src="url"
                  fit="cover"></el-image>
        <el-button type="primary" size="medium" style="margin: 10px 0" @click="downloadPng">下载图片</el-button>
        <span style="font-size: 12px;color: red">如无法下载，可右键-图片另存为(图片已默认保存至云机相册内)</span>
      </div>
    </el-dialog>

    <el-dialog
            title="提示"
            :visible.sync="cameraErrorVisible"
            :append-to-body="true"
            width="400">
      <div>检测到您未对chrome浏览器打开摄像头权限</div>
      <br/>
      <div>解决方法如下：</div><br/>
      <div style="padding-left: 20px">1.浏览器进入地址：chrome://flags/#unsafely-treat-insecure-origin-as-secure<el-button type="text" @click="copyLink">复制</el-button>，设置
        为enable，并将当前页面域名（http://<span>{{$store.state.orekiIp || $store.state.webIp}}<el-button type="text" @click="copyIp">复制</el-button></span>）添加至文本框后重启浏览器。</div><br/>
      <div style="padding-left: 20px">2.点击浏览器地址栏连接左方感叹号按钮，设置摄像头权限为允许。</div><br/>
      <div>如有问题，可查看<el-button type="text" @click="goFun">帮助文档-chrome浏览器打开摄像头权限</el-button>。</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cameraErrorVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import VueDraggableResizable from 'vue-draggable-resizable'

export default {
  name: "DeviceWindow",
  props: {
    id: Number,
    index: Number,
    deviceId: Number,
    appid: {
      type: String,
      default: "0"
    },
    ip: String
  },
  data () {
    return {
      appkey: 'ffffccec3c124642967fe476cef558c4',
      requestUrl: '/mosico/player/bootstrap',
      reportUrl: '/mosico/player/terminate',

      player: null,
      deviceWidth: 288,
      deviceHeight: 512,
      deviceMessage: "",
      dialogVisible: false,
      url: '',
      camera: false,
      video: false,
      status: false,
      localId: null,
      openVideo: null,
      many: false,
      cameraErrorVisible: false,
      left: 0,
      top: 0
    }
  },
  beforeMount () {
    // window.addEventListener('resize', this.computeDeviceSize);
    // this.computeDeviceSize();
  },
  mounted () {
    this.left = this.windowLeft
    this.top = this.windowTop

    LongeneClient.LoggingControl.setLogLevel('info');

    let shinoIp = this.$store.getters.shinoIp();
    this.player = LongeneClient.createAppPlayer('target' + this.id, {
      keyboard: true,
      orientation: 'portrait',
      // enableRemoteCamera: true
    });
    this.player.open({
      appkey: this.appkey,
      appid: this.appid,
      ljyip: shinoIp,
      deviceId: this.deviceId,
      requestUrl: window.location.host + '/' + this.requestUrl,
      reportUrl: window.location.host + '/' + this.reportUrl
    });
    this.player.on('error', (error) => {
      if (error && error.message && error.code) {
        this.deviceMessage = error.message + '(' + error.code + ')';
      }
    })
    this.deviceMessage = '正在连接中...';
    this.player.on('statechange', () => {
      if (this.player.state == 'playing') {
        this.deviceMessage = '';
        this.status = true
        if (this.openVideo){
          this.player.openLocalVideo(this.openVideo)
        }
      }
    })
    this.player.on('networkinfo', network => {
      // console.log(network)
    })
  },
  beforeDestroy () {
    this.player.close();
  },
  computed: {
    windowLeft () {
      let index = this.index + this.$store.state.videoInfo.length + (this.$store.state.cameraWeight > 0 ? 1 : 0)
      let clientWidth = document.documentElement.clientWidth;
      let windowLeft = Math.floor((clientWidth - this.deviceWidth) / 2) + 20 * this.index;
      if (this.$isEnable(this.$enableKey.flowSync)) {
        windowLeft = this.deviceWidth * (index % Math.floor(clientWidth / this.deviceWidth));
      }
      return windowLeft > 0 ? windowLeft : 0;
    },
    windowTop () {
      let index = this.index + this.$store.state.videoInfo.length + (this.$store.state.cameraWeight > 0 ? 1 : 0)
      let clientHeight = document.documentElement.clientHeight;
      let windowTop = Math.floor((clientHeight - this.deviceHeight - 36 * 2) / 2) ;
      if (this.$isEnable(this.$enableKey.flowSync)) {
        windowTop = 80 * Math.floor(index / Math.floor(document.documentElement.clientWidth / this.deviceWidth))
      }
      return windowTop > 0 ? windowTop : 0;
    }
  },
  methods: {
    copyLink() {
      this.$copyText('chrome://flags/#unsafely-treat-insecure-origin-as-secure').then(res => {
        this.$message.success("复制成功")
      }, res => {
        this.$message.error("复制失败")
      })
    },
    copyIp() {
      this.$copyText('http://' + (this.$store.state.orekiIp || this.$store.state.webIp)).then(res => {
        this.$message.success("复制成功")
      }, res => {
        this.$message.error("复制失败")
      })
    },
    goFun() {
      this.cameraErrorVisible = false
      this.$store.dispatch(this.$action.GO_FUN, '浏览器摄像头权限获取')
    },
    downloadPng() {
      let downloadHref = '/snapshot/' + this.deviceId + '.png?temp=' + Math.random()
      let filename = this.deviceId + '.png'
      let a = document.createElement('a')
      a.href = downloadHref
      a.download = filename
      a.click()
    },
    computeDeviceSize () {
      let clientWidth = document.documentElement.clientWidth;

      this.deviceWidth = Math.floor(clientWidth * 0.25);
      this.deviceHeight = Math.floor(this.deviceWidth * 16 / 9);

      if (this.player) {
        let orientation = this.player.orientation;
        if (orientation == 'landscape') {
          let width = this.deviceWidth;
          this.deviceWidth = this.deviceHeight;
          this.deviceHeight = width;
        }
        setTimeout(() => {
          this.player.updateInterface();
        }, 50)
      }
    },

    closeClick () {
      if (this.player) {
        this.player.close();
      }
      this.$emit('close')
    },
    openLocalCamera() {
      this.$store.commit(this.$mutation.CAMERA_SHOW_MODE, {show: true, left: this.left + this.deviceWidth, top: this.top})
      this.camera = true
      let promise
      if (this.$store.state.cameraWeight > 1) {
        promise = this.player.openLocalCamera()
      } else {
        let cameraMedia = document.getElementById('localCamera')
        promise = this.player.openLocalCamera(cameraMedia)
      }
      promise.then(() => {
        console.log('camera success!')
      }).catch(err => {
        this.cameraErrorVisible = true
        console.log(err)
      })
    },
    closeLocal() {
      this.camera ? this.closeLocalCamera() : this.closeLocalVideo()
    },
    closeLocalCamera() {
      this.$store.commit(this.$mutation.CAMERA_SHOW_MODE, {show: false})
      this.camera = false
      this.player.closeLocalCamera()
    },
    openLocalVideo() {
      this.video = true
      this.localId = new Date().getTime()
      this.$parent.video.id = this.localId
      this.$parent.video.players = [this.player]
      this.$parent.video.left = this.left + this.deviceWidth
      this.$parent.video.top = this.top
      this.$parent.video.many = false
      this.$parent.video.show = true
      this.$parent.selectShow = true
      this.$parent.$nextTick().then(() => {
        document.getElementById('selectFile').click()
      })
    },
    closeLocalVideo() {
      this.video = false
      this.$store.commit(this.$mutation.VIDEO_SHOW_MODE, {show: false, player: this.player, ref: this.many ? 'ref' + this.id : null})
      this.player.closeLocalVideo()
    },
    showLocal(show) {
      if(this.camera) {
        this.$store.commit(this.$mutation.CAMERA_SHOW_MODE, {display: true, show})
      } else {
        this.$store.commit(this.$mutation.VIDEO_SHOW_MODE, {display: true, show, id: this.localId})
      }
    },
    returnClick () {
      if (this.player) {
        this.player.emitBack();
      }
    },

    homeClick () {
      if (this.player) {
        this.player.emitHome();
      }
    },
    snapshotClick() {
      let that = this
      that.$post(that.$uri.device.snapshot, {deviceIp: that.ip, isSave: 1}).then(res => {
        that.url = res.data
        that.dialogVisible = true
      })
    },

    recentClick () {
      if (this.player) {
        this.player.openRecent();
      }
    },

    volUpClick () {
      if (this.player) {
        this.player.emitVolumeUp();
      }
    },

    volDownClick () {
      if (this.player) {
        this.player.emitVolumeDown();
      }
    },

    toogleOrientationClick () {
      if (this.player) {
        let width = this.deviceWidth;
        this.deviceWidth = this.deviceHeight;
        this.deviceHeight = width;

        let orientation = this.player.orientation;
        if (orientation == 'portrait') {
          this.player.setOrientation('landscape');
        } else {
          this.player.setOrientation('portrait');
        }

        setTimeout(() => {
          this.player.updateInterface();
        }, 50)
      }
    }
  }
};
</script>

<style lang="less" scoped>
.device {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  pointer-events: none;

  .window {
    pointer-events: visible;
    .header {
      height: 36px;
      background: #111;
      text-align: center;
      font-size: 18px;
      line-height: 36px;
      color: #fff;
      cursor:move;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .id {
        flex-grow: 1;
        text-align: left;
        /*float: left;*/
        line-height: 36px;
        padding: 0 10px;
      }
      .close {
        /*float: right;*/
        line-height: 36px;
        padding: 0 10px 0 0;
        cursor: pointer;
      }
    }

    .body {
      position: relative;
      background: #000;

      .message {
        position: absolute;
        color: #fff;
        top: 50%;
        left: 50%;
        z-index: 1;
        transform: translate(-50%, -50%);
      }
    }

    .footer {
      background: #111;
      height: 36px;
      display: flex;
      justify-content: space-around;
      align-items: center;

      & > div {
        width: 24px;
        height: 24px;
        cursor: pointer;
      }

      .return {
        background: url('../assets/i_back.png') no-repeat;
        background-size: 100% 100%;
      }

      .snapshot {
        background: url('../assets/i_jt.png') no-repeat;
        background-size: 100% 100%;
      }

      .home {
        background: url('../assets/i_home.png') no-repeat;
        background-size: 100% 100%;
      }

      .recent {
        background: url('../assets/i_drw.png') no-repeat;
        background-size: 100% 100%;
      }

      .vol-up {
        background: url('../assets/i_ya.png') no-repeat;
        background-size: 100% 100%;
      }

      .vol-down {
        background: url('../assets/i_ys.png') no-repeat;
        background-size: 100% 100%;
      }

      .toogle-orientation {
        background: url('../assets/i_hsp.png') no-repeat;
        background-size: 100% 100%;
      }
    }
  }
}

</style>
