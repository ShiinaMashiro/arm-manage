<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
#app {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body {
  margin: 0;
}
.setting-list {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  .setting-btn {
    line-height: 27px;
    padding: 0 15px;
    font-size: 13px;
    color: #606266;
    cursor: pointer;
    outline: 0;
  }
  .setting-btn:hover {
    background-color: #e6f9fc;
    color: #33cde5;
  }
}
#test {
  width: 80px;
}
.border-all {
  border: 1px solid #E1E6EB;
}
@font-face {font-family: "iconfont";
  src: url('./assets/font/iconfont.eot?t=1553661157431'); /* IE9 */
  src: url('./assets/font/iconfont.eot?t=1553661157431#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2'),
  url('./assets/font/iconfont.woff?t=1553661157431') format('woff'),
  url('./assets/font/iconfont.ttf?t=1553661157431') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
  url('./assets/font/iconfont.svg?t=1553661157431#iconfont') format('svg'); /* iOS 4.1- */
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  color: white;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-yingyong:before {
  content: "\e600";
}

.icon-yonghu:before {
  content: "\e638";
}

.icon-setting-1-copy:before {
  content: "\e610";
}

.icon-shezhi:before {
  content: "\e608";
}

.icon-slsrizhifuwu:before {
  content: "\e74d";
}

.icon-ecsyunfuwuqiECS:before {
  content: "\e8a8";
}

.icon-otsbiaogecunchu:before {
  content: "\e8b1";
}


</style>
