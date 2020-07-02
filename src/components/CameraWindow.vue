<template>
  <div class="device">
    <vue-draggable-resizable :parent="true" :resizable="false" drag-handle=".header" :x="$store.state.cameraLeft" :y="$store.state.cameraTop">
      <div class="window">
        <div class="header" :style="{ width: deviceWidth + 'px' }">
          <span class="id">本地摄像头画面</span>
          <!--<i class="close el-icon-close" @click="closeClick"></i>-->
        </div>
        <div class="body" :style="{ width: deviceWidth + 'px', height: deviceHeight + 'px' }">
          <video id="localCamera" autoplay playsinline :style="{ width: deviceWidth + 'px', height: deviceHeight + 'px' }"></video>
        </div>
        <div class="footer" :style="{ width: deviceWidth + 'px' }">

        </div>
      </div>
    </vue-draggable-resizable>
  </div>
</template>

<script>
  import VueDraggableResizable from 'vue-draggable-resizable'

  export default {
    name: "CameraWindow",
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
        url: ''
      }
    },
    beforeMount () {
      // window.addEventListener('resize', this.computeDeviceSize);
      // this.computeDeviceSize();
    },
    mounted () {

    },
    beforeDestroy () {

    },
    computed: {
      windowLeft () {
        let clientWidth = document.documentElement.clientWidth;
        let windowLeft = Math.floor((clientWidth - this.deviceWidth) / 2) + 20 * this.index;
        if (this.$isEnable(this.$enableKey.flowSync)) {
          windowLeft = document.documentElement.clientWidth * 0.25 * (this.index % 4);
        }
        return windowLeft > 0 ? windowLeft : 0;
      },
      windowTop () {
        let clientHeight = document.documentElement.clientHeight;
        let windowTop = Math.floor((clientHeight - this.deviceHeight - 36 * 2) / 2) ;
        if (this.$isEnable(this.$enableKey.flowSync)) {
          windowTop = 80 * Math.floor(this.index / 4) ;
        }
        return windowTop > 0 ? windowTop : 0;
      }
    },
    methods: {
      closeClick () {
        this.$emit('close')
      },
      computeDeviceSize () {
        let clientWidth = document.documentElement.clientWidth;
        this.deviceWidth = Math.floor(clientWidth * 0.25);
        this.deviceHeight = Math.floor(this.deviceWidth * 16 / 9);
      },
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
        .id {
          float: left;
          line-height: 36px;
          padding: 0 10px;
        }
        .close {
          float: right;
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
