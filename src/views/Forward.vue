<template>
  <div>
    <div id="mian">
      <div id="leftBox"><textarea wrap="off" cols="2" id="leftNum" disabled></textarea></div>
      <textarea id="test" name="content" @keydown="keyUp()" @scroll="left.scrollTop = test.scrollTop;">
    </textarea>
    </div>
  </div>
</template>

<script>




  export default {
    name: "Forward",
    data() {
      return {
       num : "",
      btn : null,
      test : null,
      left: null,
    }
    },
    methods: {
      keyUp() {
        var str = this.test.value;
        str = str.replace(/\r/gi, "");
        str = str.split("\n");
        let n = str.length;
        this.line(n);
      },
      line(n) {
        var lineobj = this.getId("leftNum");
        for (var i = 1; i <= n; i++) {
          if (document.all) {
            this.num += i + "\r\n";//判断浏览器是否是IE
          } else {
            this.num += i + "\n";
          }
        }
        lineobj.value = this.num;
        this.num = "";
      },
      getId(obj) {
        return document.getElementById(obj);
      }
    },
    mounted() {
      this.num = "";
      this.btn = this.getId('btn');
      this.test = this.getId('test');
      this.left = this.getId('leftNum');
        this.keyUp();
    }
  };
</script>

<style scoped>
  * {
    margin: 0;
    padding: 0;
  }

  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    font: 12px/1.5 tahoma, arial, 'hiragino sans gb', 'microsoft yahei', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  #mian {
    width: 640px;
    height: 100%;
  }

  #leftBox {
    background: #ecf0f5;
    width: 35px;
    height: 100%;
    text-align: left;
    float: left;
  }

  #test {
    border: 1px solid #eaeaea;
    outline: none;
    width: 600px;
    height: 100%;
    resize: none;
    background: rgb(250, 250, 250);
    line-height: 24px;
    font-size: 14px;
    float: left;
    padding: 10px 8px;
    color: black;
    font-family: inherit;
    box-sizing: border-box;
  }

  #leftNum {
    height: 100%;
    width: 100%;
    resize: none;
    outline: none;
    overflow-y: hidden;
    overflow-x: hidden;
    border: 0;
    background: rgb(247, 247, 247);
    color: #999;
    line-height: 24px;
    font-size: 14px;
    padding: 10px 4px;
    text-align: right;
    font-weight: bold;
    box-sizing: border-box;
  }
</style>