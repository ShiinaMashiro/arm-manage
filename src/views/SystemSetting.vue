<template>
  <div style="padding-bottom: 40px">
    <div v-if="sysInfo" class="info-view" @keyup.enter="saveSysInfo(changePopInfo)">
      <div class="info-view-title">系统网络设置</div>
      <div class="info-view-main">
        <span class="info-view-item" style="font-size: 14px">配置管理中心网络及远程相机服务网络</span>
        <div class="info-view-item">
          <span>管理中心网络IP：</span>
          <span v-if="!changePopShow">{{sysInfo.webIp}}</span>
          <el-input v-else size="mini" v-model="changePopInfo.webIp" style="width: 150px"></el-input>
        </div>
        <div class="info-view-item">
          <span>管理中心网络端口：</span>
          <span v-if="!changePopShow">{{sysInfo.webPort}}</span>
          <el-input v-else size="mini" v-model="changePopInfo.webPort" style="width: 150px"></el-input>
        </div>
        <div class="info-view-item">
          <span>管理中心网络子网掩码：</span>
          <span v-if="!changePopShow">{{sysInfo.webMask}}</span>
          <el-input v-else size="mini" v-model="changePopInfo.webMask" style="width: 150px"></el-input>
        </div>
        <div class="info-view-item">
          <span>公网IP：</span>
          <span v-if="!changePopShow">{{sysInfo.extranetIp}}</span>
          <el-input v-else size="mini" v-model="changePopInfo.extranetIp" style="width: 150px"></el-input>
        </div>
        <div class="info-view-item">
          <span>NTP服务器地址：</span>
          <span v-if="!changePopShow">{{sysInfo.ntpAddress}}</span>
          <el-input v-else size="mini" v-model="changePopInfo.ntpAddress" style="width: 150px"></el-input>
        </div>
        <div class="info-view-item">
          <span>媒体服务器外网地址：</span>
          <span v-if="!changePopShow">{{sysInfo.mediaServerWan}}</span>
          <el-input v-else size="mini" v-model="changePopInfo.mediaServerWan" style="width: 150px"></el-input>
        </div>
        <div class="info-view-item">
          <span>媒体服务器内网地址：</span>
          <span v-if="!changePopShow">{{sysInfo.mediaServerLan}}</span>
          <el-input v-else size="mini" v-model="changePopInfo.mediaServerLan" style="width: 150px"></el-input>
        </div>
        <div class="info-view-item-btn">
          <el-button size="small" type="info" v-if="!changePopShow" @click="changePop()">设置</el-button>
          <el-button size="small" type="info" v-if="changePopShow" @click="saveSysInfo(changePopInfo)">保存</el-button>
          <el-button size="small" type="info" v-if="changePopShow" @click="changePopShow = false">取消</el-button>
        </div>
      </div>
    </div>
    <div v-if="sysInfo" class="info-view" @keyup.enter="saveSysInfo(changePopInfo)">
      <div class="info-view-title">默认推流参数</div>
      <div class="info-view-main">
        <span class="info-view-item" style="font-size: 14px">配置应用默认推流参数</span>
        <div class="info-view-item">
          <span>推流最大码率：</span>
          <span v-if="!streamPopShow">{{sysInfo.encodeRateMax}}</span>
          <el-input v-else size="mini" v-model="changePopInfo.encodeRateMax" style="width: 150px"></el-input>
        </div>
        <div class="info-view-item">
          <span>推流帧率：</span>
          <span v-if="!streamPopShow">{{sysInfo.framerate}}</span>
          <el-input v-else size="mini" v-model="changePopInfo.framerate" style="width: 150px"></el-input>
        </div>
        <div class="info-view-item-btn">
          <el-button size="small" type="info" v-if="!streamPopShow" @click="streamPop()">设置</el-button>
          <el-button size="small" type="info" v-if="streamPopShow" @click="saveSysInfo(changePopInfo)">保存</el-button>
          <el-button size="small" type="info" v-if="streamPopShow" @click="streamPopShow = false">取消</el-button>
        </div>
      </div>
    </div>
    <div v-if="sysInfo" class="info-view">
      <div class="info-view-title">运维信息</div>
      <div class="info-view-main">
        <span class="info-view-item" style="font-size: 14px">配置运维邮箱和电话，接受预警信息</span>
        <div class="info-view-item" style="align-items: flex-start;height: auto">
          <span>运维邮箱：</span>
          <div style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start">
            <div v-for="(email, index) in emailList" :key="email" style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start;height: 30px">
              <span v-if="!emailPopShow">{{email}}</span>
              <div v-else style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
                <el-input size="mini" v-model="emailList[index]" style="width: 150px"></el-input><i class="iconfont" style="color: gray;margin-left: 3px;font-size: 18px" @click="deleteEmail(index)">&#xe630;</i>
              </div>
            </div>
            <div style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start;height: 30px">
              <div v-if="emailPopShow" style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
                <el-input size="mini" v-model="emailAddValue" style="width: 150px"></el-input><i class="iconfont" style="color: gray;margin-left: 3px;font-size: 18px" @click="emailAdd()">&#xe631;</i>
              </div>
            </div>
          </div>
        </div>
        <div class="info-view-item-btn">
          <el-button size="small" type="info" v-if="!emailPopShow" @click="emailPop()">设置</el-button>
          <el-button size="small" type="info" v-if="emailPopShow" @click="emailAddSave()">保存</el-button>
          <el-button size="small" type="info" v-if="emailPopShow" @click="emailPopShow = false">取消</el-button>
        </div>
        <div class="info-view-item" style="align-items: flex-start;height: auto">
          <span>运维电话：</span>
          <div style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start">
            <div v-for="(phone, index) in phoneList" :key="phone" style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start;height: 30px">
              <span v-if="!phonePopShow">{{phone}}</span>
              <div v-else style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
                <el-input size="mini" v-model="phoneList[index]" style="width: 150px"></el-input><i class="iconfont" style="color: gray;margin-left: 3px;font-size: 18px" @click="deletePhone(index)">&#xe630;</i>
              </div>
            </div>
            <div style="display: flex;flex-direction: column;justify-content: center;align-items: flex-start;height: 30px">
              <div v-if="phonePopShow" style="display: flex;flex-direction: row;justify-content: center;align-items: center;">
                <el-input size="mini" v-model="phoneAddValue" style="width: 150px"></el-input><i class="iconfont" style="color: gray;margin-left: 3px;font-size: 18px" @click="phoneAdd()">&#xe631;</i>
              </div>
            </div>
          </div>
        </div>
        <div class="info-view-item-btn">
          <el-button size="small" type="info" v-if="!phonePopShow" @click="phonePop()">设置</el-button>
          <el-button size="small" type="info" v-if="phonePopShow" @click="phoneAddSave()">保存</el-button>
          <el-button size="small" type="info" v-if="phonePopShow" @click="phonePopShow = false">取消</el-button>
        </div>
      </div>
    </div>
    <div v-if="licenseInfo" class="info-view">
      <div class="info-view-title">License信息</div>
      <div class="info-view-main">
        <span class="info-view-item" style="font-size: 14px">查看和管理您的license凭证</span>
        <div class="info-view-item">
          <span>license码：</span>
          <span>{{sysInfo.webIp}}</span>
        </div>
        <div class="info-view-item">
          <span>有效期：</span>
          <span>{{sysInfo.webPort}}</span>
          <el-input v-else size="mini" v-model="changePopInfo.webPort" style="width: 150px"></el-input>
        </div>
        <div class="info-view-item">
          <span>设备数量：</span>
          <span>{{sysInfo.webMask}}</span>
          <el-input v-else size="mini" v-model="changePopInfo.webMask" style="width: 150px"></el-input>
        </div>
        <div class="info-view-item-btn">
          <el-button size="small" type="info" @click="changePop()">升级</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  let that
  export default {
    name: "SystemSetting",
    data() {
      return {
        sysInfo: null,
        idInfo: null,
        changePopShow: false,
        streamPopShow: false,
        emailPopShow: false,
        emailList: [],
        emailAddValue: '',
        phonePopShow: false,
        phoneList: [],
        phoneAddValue: '',
        changePopInfo: null,
        licenseInfo: null,
      }
    },
    filters: {
      caseTypeFilter (val) {
        switch (val) {
          case "0": return "32路"
          case "1": return "80路"
        }
      }
    },
    methods: {
      getSysInfo() {
        that.$post(that.$uri.system.paramList, {}).then(res => {
          if (res.success) {
            let idInf = {}
            let paramInf = {}
            res.list.forEach(item => {
              idInf[item.paramName] = item.id
              paramInf[item.paramName] = item.paramValue
            })
            that.sysInfo = paramInf
            that.idInfo = idInf
            if (that.sysInfo.email) {
              that.emailList = that.sysInfo.email.split(',')
            }
            if (that.sysInfo.phone) {
              that.phoneList = that.sysInfo.phone.split(',')
            }
          }
        })
      },
      getLicenseInfo() {
        that.$post(that.$uri.system.licenseGet, {}).then(res => {
          if (res.success) {
            that.licenseInfo = res.data
          }
        })
      },
      changePop() {
        that.changePopInfo = JSON.parse(JSON.stringify(that.sysInfo))
        that.changePopShow = true
      },
      streamPop() {
        that.changePopInfo = JSON.parse(JSON.stringify(that.sysInfo))
        that.streamPopShow = true
      },
      saveSysInfo(info) {
        for (let key in info) {
          if (info[key] !== that.sysInfo[key]) {
            let temp = {
              id: that.idInfo[key],
              paramName: key,
              paramValue: info[key]
            }
            that.$post(that.$uri.system.paramSave, temp).then(res => {})
          }
          that.getSysInfo()
          that.changePopShow = false
          that.streamPopShow = false
        }
      },
      deleteEmail(index) {
        that.emailList.splice(index, 1)
      },
      deletePhone(index) {
        that.phoneList.splice(index, 1)
      },
      emailPop() {
        if (that.sysInfo.email) {
          that.emailList = that.sysInfo.email.split(',')
        }
        that.emailPopShow = true
      },
      emailAdd() {
        that.emailList.push(that.emailAddValue)
        that.emailAddValue = ''
      },
      emailAddSave() {
        let temp = {
          id: that.idInfo.email,
          paramName: 'email',
          paramValue: that.emailList.join(',')
        }
        that.$post(that.$uri.system.paramSave, temp).then(res => {
          if (res.success) {
            that.$message.success("修改成功")
            that.emailPopShow = false
          } else {
            that.$message.error("修改失败")
          }
        })
      },
      phonePop() {
        if (that.sysInfo.phone) {
          that.phoneList = that.sysInfo.phone.split(',')
        }
        that.phonePopShow = true
      },
      phoneAdd() {
        that.phoneList.push(that.phoneAddValue)
        that.phoneAddValue = ''
      },
      phoneAddSave() {
        let temp = {
          id: that.idInfo.phone,
          paramName: 'phone',
          paramValue: that.phoneList.join(',')
        }
        that.$post(that.$uri.system.paramSave, temp).then(res => {
          if (res.success) {
            that.$message.success("修改成功")
            that.phonePopShow = false
          } else {
            that.$message.error("修改失败")
          }
        })
      }
    },
    beforeCreate() {
      that = this
    },
    mounted() {
      that.getSysInfo()
      that.getLicenseInfo()
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