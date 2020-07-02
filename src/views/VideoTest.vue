<template>
  <div>
    <el-button @click="start">start</el-button>
    <el-button @click="stop">stop</el-button>
    <video id="testVideo"></video>
  </div>
</template>

<script>
  let that
  export default {
    name: "VideoTest",
    data() {
      return {
        video: null,
        stream: null,
        open: () => {
          console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
        }
      }
    },
    methods: {
      start() {
        navigator.mediaDevices.getUserMedia({audio: true, video: {width: 360, height: 640}}).then(stream => {
          this.stream = stream
          this.video.srcObject = stream
          this.video.play()
        }).catch(res => {
          console.log('fail: ')
          console.log(res)
        })
      },
      stop() {
        console.log(this.stream)
      }
    },
    beforeCreate() {
      that = this
    },
    mounted() {
      this.video = document.getElementById('testVideo')
      this.open()
    }
  };
</script>

<style lang="scss" scoped>

</style>