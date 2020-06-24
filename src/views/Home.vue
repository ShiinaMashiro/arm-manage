<template>
  <div class="home">
    <TopBar></TopBar>
    <SideBar></SideBar>
    <HomeMainTopBar class="home-main-top-bar-fixed" v-show="$store.state.sideInfo.item.src !== 'overview'"></HomeMainTopBar>
    <MainScene></MainScene>
    <div class="home-main" :style="{left: this.$store.state.sideInfo.scene ? '380px' : '230px', top: ($store.state.sideInfo.item.src !== 'overview') ? '140px' : '50px'}">
      <div class="home-list">
        <router-view></router-view>
      </div>
    </div>
    <div :style="{display: $store.state.guide > 0 ? 'block' : 'none'}" class="mask"></div>
    <template v-for="(mode, index) in $store.state.deviceWindowMode">
      <device-window :id="mode.id"
                     :key="mode.id"
                     :index="index"
                     :device-id="mode.deviceNo"
                     :ip="mode.ip"
                     @close="deviceWindowClose(mode)"
      ></device-window>
    </template>
    <el-dialog
            :title="$store.state.isAdmin ? '请输入license激活龙境安卓云系统' : '请联系管理员激活系统'"
            :visible.sync="$store.state.needLicense || $store.state.licenseUpdate"
            :close-on-click-modal="$store.state.licenseUpdate"
            :close-on-press-escape="$store.state.licenseUpdate"
            :show-close="$store.state.licenseUpdate"
            :center="true"
            :destroy-on-close="true"
            width="550px">
      <div v-if="$store.state.isAdmin">
        <div>license:</div>
        <el-input
                type="textarea"
                :rows="5"
                placeholder="license"
                v-model="license">
        </el-input>
        <div style="width: 100%;text-align: center;padding: 15px 0">
          <el-button type="primary" style="width: 100px" @click="licenseSystem">激活</el-button>
        </div>

        <div>说明：管理后台正常使用需要输入License码进行激活解锁。</div>
        <br/>
        <div>如何激活？</div>
        <div>要激活龙境安卓云系统，请从龙境云销售商获取license码，输入正确的激活码点击激活后即可验证激活。</div>
        <br/>
        <div>销售商联系方式：</div>
        <div>QQ：157457734</div>
        <div>电话：13616513812</div>
        <div>Email：zx@longene.com.cn</div>
      </div>
      <div v-else>
        <div>系统激活已过期，无法继续使用服务，请联系管理员进行激活。</div>
      </div>
    </el-dialog>
    <el-dialog
            title="激活成功"
            :visible.sync="licenseResult"
            :close-on-click-modal="true"
            :close-on-press-escape="true"
            :show-close="true"
            :center="true"
            :destroy-on-close="true"
            width="350px">
      <div style="display: flex;flex-direction: column;justify-content: center;align-items: center">
        <svg t="1585290890129" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2250" width="128" height="128"><path d="M512 85.333333c235.648 0 426.666667 191.018667 426.666667 426.666667s-191.018667 426.666667-426.666667 426.666667S85.333333 747.648 85.333333 512 276.352 85.333333 512 85.333333z m-74.965333 550.4L346.453333 545.152a42.666667 42.666667 0 1 0-60.330666 60.330667l120.704 120.704a42.666667 42.666667 0 0 0 60.330666 0l301.653334-301.696a42.666667 42.666667 0 1 0-60.288-60.330667l-271.530667 271.488z" fill="#52C41A" p-id="2251"></path></svg>
        <div>
          <div>有效期：{{licenseTime}}</div>
          <div>设备数量：{{licenseInfo.deviceNum}}</div>
        </div>
        <div style="width: 100%;text-align: center;padding: 15px 0">
          <el-button type="primary" @click="systemPop">设置系统参数</el-button>
          <el-button type="primary" style="width: 100px" @click="startUse">开始使用</el-button>
        </div>
      </div>
    </el-dialog>

    <Drawer title="系统参数设置" :visible.sync="systemParamSetPopShow" @handClick="systemSet()">
      <div>
        <el-form ref="form" size="mini" label-width="130px" label-position="left">
          <div style="font-size: 14px;font-weight: 600">首次激活必填参数</div>
          <el-form-item v-if="systemInfo[systemKeyList[0]]" label="公网入口：" :required="true"><el-input size="mini" v-model="systemInfo[systemKeyList[0]].paramValue"></el-input>{{systemInfo[systemKeyList[0]].paramName}}</el-form-item>
          <el-form-item v-if="systemInfo[systemKeyList[1]]" label="管理中心内网IP：" :required="true"><el-input size="mini" v-model="systemInfo[systemKeyList[1]].paramValue"></el-input>{{systemInfo[systemKeyList[1]].paramName}}</el-form-item>
          <div style="margin-top: 20px;margin-bottom: 20px;border-bottom: 1px solid #ddd"></div>

          <div style="font-size: 14px;font-weight: 600">首次激活选填参数</div>
          <el-form-item v-if="systemInfo[systemKeyList[2]]" label="设备备份FTP地址："><el-input size="mini" v-model="systemInfo[systemKeyList[2]].paramValue"></el-input>{{systemInfo[systemKeyList[2]].paramName}}</el-form-item>
          <el-form-item v-if="systemInfo[systemKeyList[3]]" label="NTP服务器地址："><el-input size="mini" v-model="systemInfo[systemKeyList[3]].paramValue"></el-input>{{systemInfo[systemKeyList[3]].paramName}}</el-form-item>
          <el-form-item v-if="systemInfo[systemKeyList[4]]" label="媒体服务器内网地址："><el-input size="mini" v-model="systemInfo[systemKeyList[4]].paramValue"></el-input>{{systemInfo[systemKeyList[4]].paramName}}</el-form-item>
          <el-form-item v-if="systemInfo[systemKeyList[5]]" label="媒体服务器外网地址："><el-input size="mini" v-model="systemInfo[systemKeyList[5]].paramValue"></el-input>{{systemInfo[systemKeyList[5]].paramName}}</el-form-item>
        </el-form>
      </div>
    </Drawer>

    <div id="ssh" class="ssh" v-show="$store.state.ssh.show">
      <el-tabs v-model="ssh.activeName" type="card"
               @tab-click="handleSshClick"
               @tab-remove="removeSsh"
               style="height: 100%;display: flex;flex-direction: column">
        <el-tab-pane v-for="tab in ssh.tabs" :key="tab.name" :label="tab.title" :name="tab.name"
                     :closable="tab.closable" :disabled="tab.disabled" style="height: 100%">
          <iframe v-if="tab.closable && $store.state.ssh.start" class="ssh-console" :ref="'term-' + tab.name" :id="'term-' + tab.name" :src="'/ssh/host/127.0.0.1?name=' + tab.name"></iframe>
        </el-tab-pane>

      </el-tabs>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import TopBar from "@/components/TopBar.vue";
import SideBar from "@/components/SideBar.vue";
import UserInfo from "@/components/UserInfo.vue";
import HomeMainTopBar from "@/components/HomeMainTopBar.vue";
import DeviceWindow from "@/components/DeviceWindow.vue";
import MainScene from "@/components/MainScene.vue";
import Drawer from "@/components/Drawer.vue";

export default {
  name: "home",
  components: {
    HomeMainTopBar,
    TopBar,
    SideBar,
    UserInfo,
    DeviceWindow,
    MainScene,
    Drawer,
  },
  data() {
    return {
      license: '',
      licenseResult: false,
      licenseInfo: {
        seconds: -1,
        deviceNum: 0
      },
      systemParamSetPopShow: false,
      systemKeyList: ['extranetIp', 'webIp', 'ftpHost', 'ntpAddress', 'mediaServerLan', 'mediaServerWan'],
      systemInfo: {
        extranetIp: {},
        webIp: {},
        ftpHost: {},
        ntpAddress: {},
        mediaServerLan: {},
        mediaServerWan: {},
      },
      ssh: {
        activeName: '1',
        tabs: [
          {
            title: '调试窗口1',
            name: '1',
            closable: true,
            disabled: false
          },{
            title: '+',
            name: '+',
            closable: false,
            disabled: false
          }
        ],
        index: 1
      }
    }
  },
  computed: {
    licenseTime() {
      let s = this.licenseInfo.seconds
      if (s === -1) {
        return '永久'
      }
      let time = ''
      let day = parseInt(s/(60 * 60 * 24))
      if (day > 0) {
        time += day + '天'
      }
      s = s - day * (60 * 60 * 24)
      let hour = parseInt(s/(60 * 60))
      if (hour > 0) {
        time += hour + '小时'
      }
      return time
    },
    isSytemPop() {
      let a = 0
      if (this.systemInfo) {
        for (let key in this.systemInfo) {
          a++
        }
      }
      return a === 6
    }
  },
  methods: {
    handleSshClick(tab, event) {
      if (tab.name === '+'){
        this.ssh.tabs.splice(this.ssh.tabs.length - 1, 0, {
          title: '调试窗口' + ++this.ssh.index,
          name: '' + this.ssh.index,
          closable: true,
          disabled: false
        })
        this.ssh.activeName = '' + this.ssh.index
      }
    },
    removeSsh(name) {
      let acName = this.ssh.activeName
      if (acName === name) {
        this.ssh.tabs.forEach((tab, index) => {
          if (tab.name === name) {
            let temp = this.ssh.tabs[index - 1] || this.ssh.tabs[index + 1]
            if (temp) {
              this.ssh.activeName = temp.name
            }
          }
        })
      }
      this.ssh.tabs = this.ssh.tabs.filter(tab => tab.name !== name)
    },
    startUse() {
      this.licenseResult = false
      this.$router.go(0)
    },
    licenseSystem() {
      let that = this
      that.$post(that.$uri.system.license, {licenseCode: that.license}).then(res => {
        if (res.success) {
          that.$store.commit(that.$mutation.IS_NEED_LICENSE, false)
          that.licenseResult = true
          that.licenseInfo = res.data
        } else {
          that.$message.error("激活失败！" + res.message)
        }
      })
    },
    sideInit(route) {
      let path = route.fullPath
      let sideInfo = {
        item: null,
        child: null,
        scene: null
      }
      let sideItems = this.$store.state.isAdmin ? this.$store.state.sideItems : this.$store.state.busSideItems
      let sign = false
      for (let item of sideItems) {
        if (sign) {
          break
        }

        if (item.path === path) {
          sign = true
          sideInfo.item = item
          break
        }

        if (item.children) {
          for (let child of item.children) {
            if (child.path === path) {
              sideInfo.item = item
              sideInfo.child = child
              break
            }

            if (child.sceneList) {
              for (let scene of child.sceneList) {
                if (scene.path === path) {
                  sideInfo.item = item
                  sideInfo.child = child
                  sideInfo.scene = scene
                  break
                }
              }
            }
          }
        } else if (item.sceneList) {
          for (let scene of item.sceneList) {
            if (scene.path === path) {
              sideInfo.item = item
              sideInfo.child = item
              sideInfo.scene = scene
              sign = true
              break
            }
          }
        }else {
          sideInfo.item = item
        }
      }
      this.$store.commit(this.$mutation.SIDE_INFO, sideInfo)
    },
    deviceWindowClose (mode) {
      this.$store.commit(this.$mutation.DEVICE_WINDOW_SHOW_MODE, {
        show: false,
        mode
      })
    },
    systemPop() {
      let that = this
      that.systemKeyList.forEach(key => {
        that.$post(that.$uri.system.paramGet, {paramName: key}).then(res => {
          if (res.success) {
            that.systemInfo[key] = res.data
          }
        })
      })
      that.systemParamSetPopShow = true
      that.licenseResult = false
    },
    systemSet() {
      let that = this
      that.systemKeyList.forEach(key => {
        that.$post(that.$uri.system.paramSave, that.systemInfo[key]).then(res => {

        })
      })
      that.$message.success("正在设置")
      that.systemParamSetPopShow = false
    }
  },
  mounted () {
    let that = this

    that.$post(that.$uri.system.paramGet, {paramName: "extranetIp"}).then(res => {
      that.$store.commit(that.$mutation.OREKI_IP, res.data.paramValue)
    })
    that.$post(that.$uri.system.paramGet, {paramName: "webIp"}).then(res => {
      that.$store.commit(that.$mutation.WEB_IP, res.data.paramValue)
    })
    this.sideInit(this.$route)

    if (this.$route.path === '/home') {
      let sideItems = this.$store.getters.authorItems
      this.$router.push(sideItems[0].path || sideItems[0].children[0].path)
    }
  },
  beforeRouteUpdate (to, from, next) {
    /*if (!from.path.startsWith('/home/group')) {
      this.$store.commit(this.$mutation.GROUP_DETAIL, {})
    }*/
    this.sideInit(to)
    console.log('home update')
    console.log(this.$store.state.busSideItems)
    console.log(this.$store.state.sideInfo)
    console.log(to.path)
    let page = this.$store.getters.isChildren(to.path)
    console.log(page)
    if (page) {
      this.$store.commit(this.$mutation.VISIT_PAGE, page)
    }
    next()
  }
};
</script>

<style scoped lang="less">
  .ssh {
    position: fixed;
    top: 50px;
    left: 220px;
    right: 0;
    bottom: 0;
    background-color: #333333;
    border: none;
    padding-bottom: 3px;
  }
.home {
  .home-main-top-bar-fixed {
    margin: 0 10px;
    position: fixed;
    top: 50px;
    right: 0;
    left: 230px;
  }
  .home-main {
    position: fixed;
    top: 140px;
    right: 0;
    bottom: 0;
    padding: 0 15px;
    overflow-y: scroll;
    display: flex;
    flex-direction: row;
    .home-list {
      margin-top: 0;
      flex-grow: 1;
    }
  }
}
  .mask {
    opacity: 0.3;
    background-color: black;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1055;
  }
  .ssh-console {
    width: 100%;
    height: 100%;
    border: none;
  }

</style>
