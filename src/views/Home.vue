<template>
  <div class="home">
    <TopBar></TopBar>
    <SideBar></SideBar>
    <HomeMainTopBar class="home-main-top-bar-fixed"></HomeMainTopBar>
    <MainScene></MainScene>
    <div class="home-main" :style="{left: this.$store.state.sideInfo.scene ? '380px' : '230px'}">
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

export default {
  name: "home",
  components: {
    HomeMainTopBar,
    TopBar,
    SideBar,
    UserInfo,
    DeviceWindow,
    MainScene
  },
  methods: {
    sideInit(route) {
      let path = route.path
      let sideInfo = {
        item: null,
        child: null,
        scene: null
      }
      let sideItems = this.$store.state.sideItems
      for (let item of sideItems) {
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
              }
            }
          }
        }
      }
      this.$store.commit(this.$mutation.SIDE_INFO, sideInfo)
    },
    deviceWindowClose () {
      this.$store.commit(this.$mutation.DEVICE_WINDOW_SHOW_MODE, {
        show: false
      })
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
  },
  beforeRouteUpdate (to, from, next) {
    this.sideInit(to)
    next()
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
    top: 140px;
    right: 0;
    bottom: 0;
    padding: 0 15px;
    overflow-y: scroll;
    display: flex;
    flex-direction: row;
    .home-list {
      margin-top: 10px;
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
</style>
