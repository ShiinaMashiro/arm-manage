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
@import "assets/font/iconfont.css";
.iconfont {
  color: white;
}
.popup-flex {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.el-dialog__wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  .el-dialog {
    margin: 15vh 0;
  }
}
</style>
