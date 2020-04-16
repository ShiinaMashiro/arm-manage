<template>
  <div class="main-scene" v-if="$store.state.sideInfo.scene">
    <nav class="nav-list">
      <div>
        <template v-for="(item, index) in sceneList">
          <MainSceneItem v-if="$store.getters.checkChildAuthor(item.author)" :key="index" :item="item"></MainSceneItem>
        </template>
        <MainSceneItem :key="-1" :item="backItem" :back="true"></MainSceneItem>
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
      return this.$store.state.sideInfo.child.sceneList
    },
    backItem() {
      return {
        name: this.$store.state.sideInfo.child.name,
        path: this.$store.state.sideInfo.child.path
      }

    }
  },
  mounted () {

  }
};
</script>

<style lang="less" scoped>
.main-scene {
  position: fixed;
  top: 140px;
  left: 230px;
  bottom: 0;
  width: 145px;
  overflow: hidden;
  display: flex;
  border-right: 1px solid #DDD;
  flex-direction: column;
  align-items: stretch;
  z-index: 1999!important;
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