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
span {
  outline: invert none medium;
}
div::-webkit-scrollbar {display:none}
.el-input__inner {
  border-radius: 0!important;
}
.popup-flex {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.search-btn {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
}

.search-btn-pre {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.el-dialog__wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  .el-dialog {
    margin: 15vh 0;
  }
}
.el-submenu__title {
  text-align: left;
}
.el-menu-item {
  text-align: left;
}
.is-active {

}

.el-button {
  border-radius: 0!important;
}

  .confirm-btn-bule {
    color: #FFF !important;
    background-color: #409EFF !important;
    border-color: #409EFF !important;
  }
  .el-icon-c-blue:before {
    content: "\e7a3";
    color: #409EFF;
  }
.confirm-btn-yellow {
  color: #FFF !important;
  background-color: #E5A13C !important;
  border-color: #E5A13C !important;
}
.el-icon-c-yellow:before {
  content: "\e7a3";
  color: #E5A13C;
}
.confirm-btn-red {
  color: #FFF !important;
  background-color: #F46C6C !important;
  border-color: #F46C6C !important;
}
.el-icon-c-red:before {
  content: "\e7a3";
  color: #F46C6C;
}
</style>
