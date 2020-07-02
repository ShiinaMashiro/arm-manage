<template>
  <div class="device">
    <vue-draggable-resizable :parent="true" :resizable="false" drag-handle=".header" :x="left" :y="top">
      <div class="window">
        <div class="header" :style="{ width: deviceWidth + 'px' }">
          <span class="id">本地视频画面</span>
          <!--<i class="close el-icon-close" @click="closeClick"></i>-->
        </div>
        <div class="body" :style="{ width: deviceWidth + 'px', height: deviceHeight + 'px' }">
          <video :id="'localVideo' + id" autoplay playsinline loop controls :style="{ width: deviceWidth + 'px', height: deviceHeight + 'px' }"></video>
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
    name: "VideoWindow",
    props: {
      id: Number,
      video: File,
      players: Array,
      left: Number,
      top: Number,
      many: Boolean
    },
    data () {
      return {
        appkey: 'ffffccec3c124642967fe476cef558c4',
        requestUrl: '/mosico/player/bootstrap',
        reportUrl: '/mosico/player/terminate',

        deviceWidth: 288,
        deviceHeight: 512,
        deviceMessage: "",
        dialogVisible: false,
        url: '',
        localVideo: null,
      }
    },
    beforeMount () {
      // window.addEventListener('resize', this.computeDeviceSize);
      // this.computeDeviceSize();
    },
    mounted () {
      this.fileClick()
    },
    beforeDestroy () {

    },
    computed: {

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
      fileClick() {
        this.localVideo = document.getElementById('localVideo' + this.id)
        this.localVideo.src = URL.createObjectURL(this.video)
        console.log(URL.createObjectURL(this.video))
        if (this.players.length === 0) {
          return
        }



        if ((typeof this.players[0]) === 'string') {
          console.log('3333333333333333333')
          console.log(this.players)
          this.players.forEach(ref => {
            let vw = this.$parent.$refs[ref][0]
            console.log(vw)
            vw.video = true
            vw.many = this.many
            // vw.localId = this.id
            if (vw.status) {
              console.log('5555555555555555555')
              vw.player.openLocalVideo(this.localVideo)
            } else {
              vw.openVideo = this.localVideo
            }
          })
        } else {
          this.players[0].openLocalVideo(this.localVideo)
        }

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
