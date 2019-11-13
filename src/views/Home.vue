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
  </div>
</template>

<script>
// @ is an alias to /src
import TopBar from "@/components/TopBar.vue";
import SideBar from "@/components/SideBar.vue";
import UserInfo from "@/components/UserInfo.vue";
import HomeMainTopBar from "@/components/HomeMainTopBar.vue";

export default {
  name: "home",
  components: {
    HomeMainTopBar,
    TopBar,
    SideBar,
    UserInfo
  },
  mounted () {
    let that = this
    that.$post(that.$uri.system.paramGet, {paramName: "extranetIp"}).then(res => {
      that.$store.commit(that.$mutation.OREKI_IP, res.data.paramValue)
    })
    that.$post(that.$uri.system.paramGet, {paramName: "webIp"}).then(res => {
      that.$store.commit(that.$mutation.WEB_IP, res.data.paramValue)
    })
    this.$store.commit(this.$mutation.SIDE_CHECK, 0)
    this.$store.commit(this.$mutation.SCENE_CHECK, {scene: false, checked: 0})

  },
  updated () {
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
