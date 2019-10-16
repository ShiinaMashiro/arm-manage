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
</style>
