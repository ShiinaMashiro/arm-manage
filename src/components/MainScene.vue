<template>
  <div class="main-scene">
    <div class="nav-title">
      <div class="i-back" v-if="$route.meta.c2c" @click="$router.back()">
        <i class="el-icon-arrow-left"></i>
      </div>
      <span v-else>{{$store.getters.sceneName || "帮助中心"}}</span>
    </div>
    <nav class="nav-list">
      <div v-show="!$route.meta.c2c">
        <template v-for="(item, index) in childrenList">
          <MainSceneItem v-if="$store.getters.checkChildAuthor(item.author)" :key="index" :index="index" :item="item"></MainSceneItem>
        </template>
      </div>
      <div v-if="$route.meta.c2c">
        <template v-for="(item, index) in sceneList">
          <MainSceneItem v-if="$store.getters.checkChildAuthor(item.author)" :key="index" :index="index" :item="item" :scene="true"></MainSceneItem>
        </template>
      </div>
    </nav>
  </div>
</template>

<script>
import MainSceneItem from "@/components/MainSceneItem.vue"
export default {
  name: "MainScene",
  components: {
    MainSceneItem
  },
  computed: {
    childrenList () {
      return this.$store.state.sideItems[this.$store.state.sideCheck].children
    },
    /* 获取展示数据list */
    sceneList () {
      return this.$store.getters.sceneList
    }
  },
  mounted () {
    if (this.$route.path === "/home") {
      this.$router.push(this.childrenList[0].path)
    }
  }
};
</script>

<style lang="less" scoped>
.main-scene {
  width: 180px;
  position: fixed;
  top: 50px;
  left: 50px;
  bottom: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: #EAEDF1;
  z-index: 999!important;
  .nav-title {
    font-weight: bold;
    text-indent: 20px;
    width: 180px;
    height: 70px;
    line-height: 70px;
    background: #D9DEE4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .i-back {
      font-size: 30px;
      color: #495060;
      font-weight: 900;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      text-indent: 0;
    }
  }
  .nav-list {
    flex-grow: 1;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
}
</style>