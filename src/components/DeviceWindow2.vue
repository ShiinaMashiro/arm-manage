<template>
  <div class="device">
      <div class="window">
        <div class="header" :style="{ width: deviceWidth + 'px' }">
          <span class="id">{{ id }}</span>
          <i class="close el-icon-close" @click="closeClick"></i>
        </div>
        <div class="body" :style="{ width: deviceWidth + 'px', height: deviceHeight + 'px' }">
          <div v-if="deviceMessage" class="message"> {{ deviceMessage }} </div>
          <div id="target" :style="{ width: deviceWidth + 'px', height: deviceHeight + 'px' }"></div>
        </div>
        <div class="footer" :style="{ width: deviceWidth + 'px' }">
          <el-tooltip class="tooltip" effect="dark" content="返回键" placement="top-start">
            <div class="return" @click="returnClick"></div>
          </el-tooltip>
          <el-tooltip class="tooltip" effect="dark" content="主页键" placement="top">
            <div class="home" @click="homeClick"></div>
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
  </div>
</template>

<script>
import VueDraggableResizable from 'vue-draggable-resizable'

export default {
  name: "DeviceWindow",
  props: {
    id: Number,
    deviceId: Number,
    appid: {
      type: String,
      default: "0"
    },
    isVideo: {
      type: Boolean,
      default: true
    },
    ip: String,
    port: Number,
  },
  data () {
    return {
      appkey: 'ffffccec3c124642967fe476cef558c4',
      requestUrl: '/mosico/player/bootstrap',
      reportUrl: '/mosico/player/terminate',

      player: null,
      deviceWidth: 720,
      deviceHeight: 1280,
      deviceMessage: ""
    }
  },
  beforeMount () {
    window.addEventListener('resize', this.computeDeviceSize);
    this.computeDeviceSize();
  },
  mounted () {
    LongeneClient.LoggingControl.setLogLevel('info');

    let shinoIp = this.$store.getters.shinoIp();
    this.player = LongeneClient.createAppPlayer('target', {
      keyboard: true,
      mediaType: 'image',
      orientation: 'portrait'
    });
    this.player.open({
      // appkey: this.appkey,
      // appid: this.appid,
      ip: this.port === 0 ? this.ip : shinoIp,
      port: this.port === 0 ? 20000 : this.port,
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
      }
    })
  },
  beforeDestroy () {
    this.player.close();
  },
  computed: {
    windowLeft () {
      let clientWidth = document.documentElement.clientWidth;
      let windowLeft = Math.floor((clientWidth - this.deviceWidth) / 2);
      return windowLeft > 0 ? windowLeft : 0;
    },
    windowTop () {
      let clientHeight = document.documentElement.clientHeight;
      let windowTop = Math.floor((clientHeight - this.deviceHeight - 36 * 2) / 2);
      return windowTop > 0 ? windowTop : 0;
    }
  },
  methods: {
    computeDeviceSize () {
      let clientWidth = document.documentElement.clientWidth;

      this.deviceWidth = Math.floor(clientWidth * 0.2);
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

    recentClick () {
      if (this.player) {
        this.player.openRecent();
        this.$emit('openRecent')
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
  /*position: fixed;*/
  /*top: 0;*/
  /*left: 0;*/
  /*right: 0;*/
  /*bottom: 0;*/
  z-index: 2000;
  pointer-events: none;

  .window {
    pointer-events: visible;
    .header {
      height: 36px;
      background: #252a2f;
      text-align: center;
      font-size: 18px;
      line-height: 36px;
      color: #fff;
      cursor:move;
      .id {
        float: left;
        line-height: 36px;
        padding: 0 10px;
      }
      .close {
        float: right;
        line-height: 36px;
        padding: 0 10px;
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
      background: #252a2f;
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
