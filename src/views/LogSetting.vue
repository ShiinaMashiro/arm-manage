<template>
  <div>
    <div v-if="logInfo" class="info-view" @keyup.enter="saveLogInfo()">
      <div class="info-view-title">日志服务器配置</div>
      <div class="info-view-main">
        <span class="info-view-item" style="font-size: 12px">配置日志服务器，确定日志输出方式及日志级别</span>
        <div class="info-view-item">
          <span>日志输出方式：</span>
          <span v-if="!changePopShow">{{logInfo.output | logOutput}}</span>
          <el-select v-else v-model="changePopInfo.output"  style="width: 150px" placeholder="请选择" size="mini">
            <el-option label="关闭全部日志输出" :value="0"></el-option>
            <el-option label="仅输出到本地文件" :value="2"></el-option>
            <el-option label="仅输出到服务器" :value="4"></el-option>
          </el-select>
        </div>
        <div class="info-view-item">
          <span>日志文件大小：</span>
          <span v-if="!changePopShow">{{logInfo.fileSize}} M</span>
          <el-input v-else size="mini" v-model="changePopInfo.fileSize" style="width: 150px"></el-input>
        </div>
        <div class="info-view-item">
          <span>日志服务器的地址：</span>
          <span v-if="!changePopShow">{{logInfo.udpServer}}</span>
          <el-input v-else size="mini" v-model="changePopInfo.udpServer" style="width: 150px"></el-input>
        </div>
        <div class="info-view-item">
          <span>日志服务器的端口：</span>
          <span v-if="!changePopShow">{{logInfo.udpPort}}</span>
          <el-input v-else size="mini" v-model="changePopInfo.udpPort" style="width: 150px"></el-input>
        </div>
        <div class="info-view-item">
          <span>远程日志的级别：</span>
          <span v-if="!changePopShow">{{logInfo.remoteLevel | logLevel}}</span>
          <el-select v-else v-model="changePopInfo.remoteLevel"  style="width: 150px" placeholder="请选择" size="mini">
            <el-option label="EMERG" :value="0"></el-option>
            <el-option label="ALERT" :value="1"></el-option>
            <el-option label="CRIT" :value="2"></el-option>
            <el-option label="ERROR" :value="3"></el-option>
            <el-option label="WARNING" :value="4"></el-option>
            <el-option label="NOTICE" :value="5"></el-option>
            <el-option label="INFO" :value="6"></el-option>
            <el-option label="DEBUG" :value="7"></el-option>
          </el-select>
        </div>
        <div class="info-view-item">
          <span>日志级别：</span>
          <span v-if="!changePopShow">{{logInfo.logLevel | logLevel}}</span>
          <el-select v-else v-model="changePopInfo.logLevel"  style="width: 150px" placeholder="请选择" size="mini">
            <el-option label="EMERG" :value="0"></el-option>
            <el-option label="ALERT" :value="1"></el-option>
            <el-option label="CRIT" :value="2"></el-option>
            <el-option label="ERROR" :value="3"></el-option>
            <el-option label="WARNING" :value="4"></el-option>
            <el-option label="NOTICE" :value="5"></el-option>
            <el-option label="INFO" :value="6"></el-option>
            <el-option label="DEBUG" :value="7"></el-option>
          </el-select>
        </div>
        <div class="info-view-item-btn">
          <el-button size="small" type="primary" v-if="!changePopShow" @click="changePop()">设置</el-button>
          <el-button size="small" type="primary" v-if="changePopShow" @click="saveLogInfo()">保存</el-button>
          <el-button size="small" type="info" v-if="changePopShow" @click="changePopShow = false">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  let that
  export default {
    name: "LogSetting",
    data() {
      return {
        logInfo: null,
        changePopShow: false,
        changePopInfo: null,
      }
    },
    filters: {
      logOutput (val) {
        switch (val) {
          case 0: return "关闭全部日志输出"
          case 2: return "仅输出到本地文件"
          case 4: return "仅输出到服务器"
          default: return "未知"
        }
      },
      logLevel (val) {
        switch (val) {
          case 0: return "EMERG"
          case 1: return "ALERT"
          case 2: return "CRIT"
          case 3: return "ERROR"
          case 4: return "WARNING"
          case 5: return "NOTICE"
          case 6: return "INFO"
          case 7: return "DEBUG"
          default: return "未知"
        }
      }
    },
    methods: {
      getLogInfo() {
        that.$post(that.$uri.system.logGet, {}).then(res => {
          if (res.success) {
            that.logInfo = res.data
          }
        })
      },
      changePop() {
        that.changePopInfo = JSON.parse(JSON.stringify(that.logInfo))
        that.changePopShow = true
      },
      saveLogInfo() {
        if (that.changePopShow) {
          that.$post(that.$uri.system.logSave, that.changePopInfo).then(res => {
            if (res.success) {
              that.changePopShow = false
              that.$message.success("修改成功")
              that.getLogInfo()
            } else {
              that.$message.error("修改失败")
            }
          })
        }
      }
    },
    beforeCreate() {
      that = this
    },
    mounted() {
      that.getLogInfo()
    }
  };
</script>

<style lang="less" scoped>
  .info-view {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 10px;
    border-bottom: 1px solid #E1E6EB;
    .info-view-title {
      text-align: left;
      font-size: 14px;
      font-weight: 600;
      padding: 5px 10px;
    }
    .info-view-main {
      padding: 10px 10px 10px 120px;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      align-items: left;
      justify-content: flex-start;
      .info-view-item {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        padding: 2px 0;
        height: 30px;
      }
      .info-view-item-btn {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        padding: 5px 0;
      }
    }
  }
</style>