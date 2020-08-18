<template>
  <div class="device">
    <vue-draggable-resizable :parent="true" :resizable="false" drag-handle=".header" :x="left" :y="top">
      <div class="window">
        <div class="header" :style="{ width: deviceWidth + 'px' }">
          <span class="id">{{ id }}</span>
          <div v-show="camera || video" style="color: #409EFF;font-size: 12px;padding-right: 5px">{{camera ? '摄像头同步中' :
            '视频同步中'}}
          </div>
          <el-button style="margin-right: 5px"
                     v-show="(camera && !$store.getters.getCameraShow(videoDeviceId)) || (video && !$store.getters.videoDisplay(localId))"
                     type="primary" size="mini" @click="showLocal(true)">打开预览
          </el-button>
          <el-button style="margin-left: 0!important;margin-right: 5px"
                     v-show="(camera && $store.getters.getCameraShow(videoDeviceId)) || (video && $store.getters.videoDisplay(localId))"
                     type="primary" size="mini" @click="showLocal(false)">关闭预览
          </el-button>
          <div v-show="!camera && !video" style="float: right;display: flex;flex-direction: row;align-items: center"
               v-if="$isEnable($enableKey.remoteCamera)">
            <el-button :disabled="video || !status" size="mini" type="primary" @click="getCameraList">摄像头</el-button>
            <!--<el-button v-if="camera" size="mini" type="primary" @click="closeLocalCamera">关闭本地摄像头</el-button>-->
            <el-tooltip placement="top" style="padding: 0 5px">
              <div slot="content" style="max-width: 400px">
                将本地PC摄像头与云机摄像头同步，延迟约在200ms以内，可查看本地画面进行实时对比。当前最多支持10台云机进行同步。目前仅支持最新版chrome浏览器。
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip>
            <el-button :disabled="camera || !status" size="mini" type="primary" @click="openLocalVideo">视频导入</el-button>
            <!--<el-button v-if="video" size="mini" type="primary" @click="closeLocalVideo">关闭视频导入</el-button>-->
            <el-tooltip placement="top" style="padding: 0 5px">
              <div slot="content" style="max-width: 400px">
                上传本地视频文件至云机并作为云机摄像头获取画面进行播放。当前最多支持10台云机进行同步。目前仅支持最新版chrome浏览器。
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
          <i v-if="!video && !camera" class="close el-icon-close" @click="closeClick"></i>
          <div v-else style="display: flex;justify-content: center;align-items: center;">
            <el-tooltip placement="top" style="padding: 0 5px;height: 28px">
              <div slot="content" style="max-width: 400px">
                摄像头上传画面旋转，可选择将画面置为旋转0°、90°、180°、270°。
              </div>
              <el-dropdown @command="setCameraRotation" trigger="click">
              <span class="el-dropdown-link">
                <!--<i class="close el-icon-refresh-right"></i>-->
                <img src="../assets/rotate.png" style="width: 18px;"/>
              </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="0">不旋转</el-dropdown-item>
                  <el-dropdown-item :command="90">90°</el-dropdown-item>
                  <el-dropdown-item :command="180">180°</el-dropdown-item>
                  <el-dropdown-item :command="270">270°</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-tooltip>

            <el-tooltip placement="top" style="padding: 0 5px">
              <div slot="content" style="max-width: 400px">
                关闭本地摄像头同步模式
              </div>
              <i class="close el-icon-switch-button" style="color: red" @click="closeLocal()"></i>
            </el-tooltip>
          </div>

        </div>
        <div class="body" :style="{ width: deviceWidth + 'px', height: deviceHeight + 'px' }">
          <div v-if="deviceMessage && !error" class="message"> {{ deviceMessage }}</div>
          <div v-if="error" class="message" style="display: flex;flex-direction: column;align-items: center;width: 100%" @click="openPlayer">
            <div style="padding-bottom: 40px">{{ deviceMessage }}</div>
            <i class="el-icon-refresh" style="font-size: 40px"></i>
            <div>点击刷新推流</div>
          </div>
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
          <div style="font-size: 13px;color: white;line-height: 24px" @click="scaleModeChange">{{scaleMode === 0 ? '1.5x' : '1.0x'}}</div>
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
      <div>解决方法如下：</div>
      <br/>
      <div style="padding-left: 20px">1.浏览器进入地址：chrome://flags/#unsafely-treat-insecure-origin-as-secure
        <el-button type="text" @click="copyLink">复制</el-button>
        ，设置
        为enable，并将当前页面域名（http://<span>{{$store.state.orekiIp || $store.state.webIp}}<el-button type="text"
                                                                                               @click="copyIp">复制</el-button></span>）添加至文本框后重启浏览器。
      </div>
      <br/>
      <div style="padding-left: 20px">2.点击浏览器地址栏连接左方感叹号按钮，设置摄像头权限为允许。</div>
      <br/>
      <div>如有问题，可查看
        <el-button type="text" @click="goFun">帮助文档-chrome浏览器打开摄像头权限</el-button>
        。
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cameraErrorVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
            title="选择摄像头"
            :visible.sync="cameraSelectVisible"
            :append-to-body="true"
            width="300px">
      <div v-if="cameraSelectVisible" style="display: flex;flex-direction: column;align-items: center">
        <el-select v-model="videoDeviceId" placeholder="请选择">
          <el-option
                  v-for="item in cameraOption"
                  :key="item.deviceId"
                  :label="item.label"
                  :value="item.deviceId">
          </el-option>
        </el-select>
        <el-button type="primary" style="margin-top: 30px" @click="openLocalCamera(videoDeviceId)">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

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
    data() {
      return {
        appkey: 'ffffccec3c124642967fe476cef558c4',
        requestUrl: '/mosico/player/bootstrap',
        reportUrl: '/mosico/player/terminate',

        scaleMode: 0, //0=1x, 1=1.5x

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
        cameraSelectVisible: false,
        cameraOption: [],
        videoDeviceId: null,
        left: 0,
        top: 0,
        codeRate: 0,
        frameRate: 0,
        error: false
      }
    },
    beforeMount() {
      // window.addEventListener('resize', this.computeDeviceSize);
      // this.computeDeviceSize();
    },
    mounted() {
      let that = this
      that.$post(that.$uri.system.paramGet, {paramName: 'cameraUpFrameRate'}).then(res => {
        if (res.success) {
          this.frameRate = res.data.paramValue
        }
      })

      that.$post(that.$uri.system.paramGet, {paramName: 'cameraUpCodeRate'}).then(res => {
        if (res.success) {
          this.codeRate = res.data.paramValue
        }
      })

      this.left = this.windowLeft
      this.top = this.windowTop

      LongeneClient.LoggingControl.setLogLevel('info');


      this.player = LongeneClient.createAppPlayer('target' + this.id, {
        keyboard: true,
        orientation: 'portrait',
        // enableRemoteCamera: true
      });

      this.player.on('error', (error) => {
        if (error && error.message && error.code) {
          this.error = true
          this.deviceMessage = error.message + '(' + error.code + ')';
        }
      })
      this.deviceMessage = '正在连接中...';
      this.player.on('statechange', () => {
        if (this.player.state == 'playing') {
          this.deviceMessage = '';
          this.status = true
          if (this.openVideo) {
            this.player.openLocalVideo(this.openVideo)
          }
        }
      })
      this.player.on('networkinfo', network => {
        // console.log(network)
      })
      this.openPlayer()
    },
    beforeDestroy() {
      this.player.close();
    },
    computed: {
      windowLeft() {

        let clientWidth = document.documentElement.clientWidth;
        let windowLeft = Math.floor((clientWidth - this.deviceWidth) / 2) + 20 * this.index;
        if (this.$isEnable(this.$enableKey.flowSync)) {
          if (this.$store.state.displayMode) {
            windowLeft = windowLeft + this.index * 30
          } else {
            let index = this.index + this.$store.state.videoInfo.length + this.$store.state.cameraInfo.length
            windowLeft = this.deviceWidth * (index % Math.floor(clientWidth / this.deviceWidth));
          }
        }
        return windowLeft > 0 ? windowLeft : 0;
      },
      windowTop() {
        let clientHeight = document.documentElement.clientHeight;
        let windowTop = Math.floor((clientHeight - this.deviceHeight - 36 * 2) / 2);
        if (this.$isEnable(this.$enableKey.flowSync)) {
          if (this.$store.state.displayMode) {
            windowTop += this.index * 40
          } else {
            let index = this.index + this.$store.state.videoInfo.length + this.$store.state.cameraInfo.length
            windowTop = 80 * Math.floor(index / Math.floor(document.documentElement.clientWidth / this.deviceWidth))
          }
        }
        return windowTop > 0 ? windowTop : 0;
      }
    },
    methods: {
      openPlayer() {
        this.deviceMessage = '连接中。。。'
        this.error = false
        let shinoIp = this.$store.getters.shinoIp();
        this.player.open({
          appkey: this.appkey,
          appid: this.appid,
          ljyip: shinoIp,
          deviceId: this.deviceId,
          requestUrl: window.location.host + '/' + this.requestUrl,
          reportUrl: window.location.host + '/' + this.reportUrl
        });
      },
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
      computeDeviceSize() {
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

      closeClick() {
        if (this.player) {
          this.player.close();
        }
        this.$emit('close')
      },
      getCameraList() {
        if(!navigator.mediaDevices.getUserMedia) {
          this.cameraErrorVisible = true
          return
        }
        navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
          stream.getTracks()[0].stop()
          navigator.mediaDevices.enumerateDevices().then(devs => {
            console.log(devs)
            let cameras = devs.filter(dev => dev.kind === 'videoinput' && dev.label)
            this.cameraOption = cameras
            if (cameras.length === 1) {
              this.openLocalCamera(cameras[0].deviceId)
            } else if (cameras.length === 0) {
              this.$message.error('没有可用摄像头')
            } else {
              this.cameraSelectVisible = true
              this.videoDeviceId = cameras[0].deviceId
            }
          }).catch(err => {
            console.log(err)
            this.cameraErrorVisible = true
          })
        }).catch(res => {
          console.log('fail: ')
          console.log(res)
          this.cameraErrorVisible = true
        })
      },
      openLocalCamera(videoDeviceId) {
        this.cameraSelectVisible = false
        let arr = this.cameraOption.filter(ca => ca.deviceId === videoDeviceId)
        let label = arr[0].label

        this.$store.commit(this.$mutation.CAMERA_SHOW_MODE, {
          show: true,
          left: this.left + this.deviceWidth,
          top: this.top,
          videoDeviceId,
          label
        })
        this.$parent.$nextTick().then(() => {
          this.camera = true
          let promise

          let param = {
            videoDeviceId
          }
          if (this.codeRate && this.frameRate) {
            param.frameRate = this.frameRate
            param.bandwidth = this.codeRate
          }
          if (this.$store.getters.getCameraWeight(videoDeviceId) > 1) {
            promise = this.player.openLocalCamera(null, param)
          } else {
            let cameraMedia = document.getElementById('localCamera-' + videoDeviceId)
            promise = this.player.openLocalCamera(cameraMedia, param)
          }
          promise.then(() => {
            console.log('camera success!')
          }).catch(err => {
            this.cameraErrorVisible = true
            console.log(err)
          })
        })

      },
      setCameraRotation(rotation) {
        console.log(rotation)
        this.player.setCameraRotation(rotation)
      },
      closeLocal() {
        this.camera ? this.closeLocalCamera() : this.closeLocalVideo()
      },
      closeLocalCamera() {
        this.$store.commit(this.$mutation.CAMERA_SHOW_MODE, {show: false, videoDeviceId: this.videoDeviceId})
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
        this.$store.commit(this.$mutation.VIDEO_SHOW_MODE, {
          show: false,
          player: this.player,
          ref: this.many ? 'ref' + this.id : null
        })
        this.player.closeLocalVideo()
      },
      showLocal(show) {
        if (this.camera) {
          this.$store.commit(this.$mutation.CAMERA_SHOW_MODE, {display: true, show, videoDeviceId: this.videoDeviceId})
        } else {
          this.$store.commit(this.$mutation.VIDEO_SHOW_MODE, {display: true, show, id: this.localId})
        }
      },
      returnClick() {
        if (this.player) {
          this.player.emitBack();
        }
      },

      homeClick() {
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

      recentClick() {
        if (this.player) {
          this.player.openRecent();
        }
      },

      volUpClick() {
        if (this.player) {
          this.player.emitVolumeUp();
        }
      },

      volDownClick() {
        if (this.player) {
          this.player.emitVolumeDown();
        }
      },

      scaleModeChange() {
        console.log('ddddddddddddddddd')
        if (this.scaleMode) {
          this.scaleMode = 0
          this.deviceWidth = 288
          this.deviceHeight = 512
        } else {
          this.scaleMode = 1
          this.deviceWidth = 384
          this.deviceHeight = 684
        }
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

      toogleOrientationClick() {
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
        cursor: move;
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
