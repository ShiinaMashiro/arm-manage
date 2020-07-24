<template>
  <div>
    <el-button @click="start">start</el-button>
    <el-button @click="stop">stop</el-button>
    <video id="testVideo"></video>
  </div>
</template>

<script>

  var lengthOfLongestSubstring = function(s) {
    if (!s.length) {
      return 0
    }
    let left = 0
    let right = 0
    let res = 1
    let i = 0

    while(right < s.length - 1) {
      let temp = s.slice(left, right + 1)

      if (temp.indexOf(s[right + 1]) !== -1) {
        if (left === right) {
          right++
        }
        left++
      } else {
        res = max(res, temp.length)
        right++
      }
      i++
      console.log('i: ' + i)
      console.log('left: ' + left)
      console.log('right: ' + right)
      console.log('temp: ' + temp)
      console.log('res: ' + res)
    }
    return res + 1
  };

  function max(num1, num2) {
    return num1 > num2 ? num1 : num2
  };
  lengthOfLongestSubstring('pwwkew');

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
        navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
          console.log(stream.getTracks())
          stream.getTracks()[0].stop()
          navigator.mediaDevices.enumerateDevices().then(devs => {
            console.log(devs)

          }).catch(err => {
            console.log(err)
          })
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