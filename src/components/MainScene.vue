<template>
  <div class="main-scene">
    <div class="nav-title">
      <div class="i-back" v-if="$route.meta.c2c" @click="$router.back()">
        <i class="el-icon-arrow-left"></i>
      </div>
      <span v-else>{{info.name}}</span>
    </div>
    <nav class="nav-list">
      <div v-show="!$route.meta.c2c">
        <template v-for="(item, index) in info.children">
          <MainSceneItem v-if="$store.getters.checkChildAuthor(item.author)" :key="index" :index="index" v-model="checked" :item="item"></MainSceneItem>
        </template>
      </div>
      <div v-if="$route.meta.c2c">
        <template v-for="(item, index) in sceneList">
          <MainSceneItem v-if="$store.getters.checkChildAuthor(item.author)" :key="index" :index="index" v-model="sceneChecked" :item="item"></MainSceneItem>
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
  props: {
    info: Object,
    sideRecover: Boolean
  },
  data () {
    return {
      checked: 0,
      sceneChecked: 0
    }
  },
  computed: {
    /* 获取展示数据list */
    sceneList () {
      return this.info.children[this.checked].sceneList
    }
  },
  watch: {
    info (newVal) {
        this.checked = 0
        this.sceneChecked = 0
    },
    checked (val) {
      this.$store.commit(this.$mutation.SCENE_CHECK, val)
    }
  },
  methods: {
    recoverChecked () {
      let path = this.$route.path
      let info = this.info.children
      for (let i = 0; i<info.length; i++) {
        if (path === info[i].path) {
          this.checked = i
          break
        }
        let sceneList = info[i].sceneList
        if (sceneList) {
          for (let j = 0; j<sceneList.length; j++) {
            if (path === sceneList[j].path) {
              this.sceneChecked = j
              break
            }
          }
        }
      }
    }
  },
  mounted () {
    // this.checked = parseInt(this.$store.state.sceneCheck)
    this.recoverChecked()
    if (this.$route.path === "/home") {
      this.$router.push(this.info.children[this.checked].path)
    }
  },
  updated () {
    let list = this.sceneList
    for (let i in list) {
      if (list[i].path === this.$route.path) {
        this.sceneChecked = parseInt(i)
      }
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