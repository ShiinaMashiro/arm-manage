<template>
  <div class="home">
    <TopBar></TopBar>
    <SideBar></SideBar>
    <HomeMainTopBar class="home-main-top-bar-fixed"></HomeMainTopBar>
    <div class="home-main">
      <div class="home-list">
        <router-view></router-view>
      </div>
    </div>
    <div :style="{display: $store.state.guide > 0 ? 'block' : 'none'}" class="mask"></div>
    <template v-if="$store.state.deviceWindowMode.show">
      <device-window :id="$store.state.deviceWindowMode.id"
                     :device-id="$store.state.deviceWindowMode.deviceNo"
                     @close="deviceWindowClose"
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
            @close="licensePopClose"
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
          <el-button type="primary" style="width: 100px" @click="licenseResult = false">开始使用</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
import TopBar from "@/components/TopBar.vue";
import SideBar from "@/components/SideBar.vue";
import UserInfo from "@/components/UserInfo.vue";
import HomeMainTopBar from "@/components/HomeMainTopBar.vue";
import DeviceWindow from "@/components/DeviceWindow.vue";

export default {
  name: "home",
  components: {
    HomeMainTopBar,
    TopBar,
    SideBar,
    UserInfo,
    DeviceWindow
  },
  data() {
    return {
      license: '',
      licenseResult: false,
      licenseInfo: {
        seconds: -1,
        deviceNum: 0
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
    }
  },
  methods: {
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
    sideInit() {
      console.log("home: " + this.$route.path)
      if (this.$store.state.guide > 0) {
        return
      }
      let sideItem = this.$store.state.sideItems
      for (let i in sideItem) {
        let children = sideItem[i].children
        for (let j in children) {
          if (children[j].path === this.$route.path) {
            console.log("home i - j: " + i + " - " + j)
            this.$store.commit(this.$mutation.SIDE_CHECK, i)
            this.$store.commit(this.$mutation.SCENE_CHECK, {scene: false, checked: j})
            return
          }
          let scene = children[j].sceneList
          if (scene) {
            for (let k in scene) {
              let path = this.$route.path
              if (scene[k].path.indexOf("?") >= 0) {
                path += "?index=" + this.$route.query.index
              }
              if (scene[k].path === path) {
                console.log("home i - j: " + i + " - " + j)
                this.$store.commit(this.$mutation.SIDE_CHECK, i)
                this.$store.commit(this.$mutation.SCENE_CHECK, {scene: false, checked: j})
                this.$store.commit(this.$mutation.SCENE_CHECK, {scene: true, checked: k})
                return
              }
            }
          }
        }
      }
      this.$store.commit(this.$mutation.SIDE_CHECK, 0)
      this.$store.commit(this.$mutation.SCENE_CHECK, {scene: false, checked: 0})
    },
    deviceWindowClose () {
      this.$store.commit(this.$mutation.DEVICE_WINDOW_SHOW_MODE, {
        show: false
      })
    }
  },
  /*beforeCreate() {
    let that = this
    that.$post(that.$uri.user.infoGet, {id: that.$store.state.userInfo.id}).then(res => {
      if (res.success) {
        if (res.data.groupId === 1) {
          that.$store.commit(that.$mutation.IS_ADMIN, true)
        } else {
          that.$store.commit(that.$mutation.IS_ADMIN, false)
        }
      }
      console.log("................")
      console.log(that.$store.state.isAdmin)
    })
  },*/
  mounted () {
    this.$router.push(this.$store.getters.authorItems[0].children[0].path)
    let that = this
    that.$post(that.$uri.system.paramGet, {paramName: "extranetIp"}).then(res => {
      that.$store.commit(that.$mutation.OREKI_IP, res.data.paramValue)
    })
    that.$post(that.$uri.system.paramGet, {paramName: "webIp"}).then(res => {
      that.$store.commit(that.$mutation.WEB_IP, res.data.paramValue)
    })
    this.sideInit()
  },
  updated () {
    this.sideInit()
  }
};
</script>

<style scoped lang="less">
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
    top: 120px;
    left: 230px;
    right: 0;
    bottom: 0;
    padding: 0 15px;
    overflow-y: scroll;
    .home-list {
      margin-top: 10px;
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
</style>
