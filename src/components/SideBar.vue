<template xmlns:v-popover="http://www.w3.org/1999/xhtml">
  <div>
    <el-popover
            ref="guide1"
            placement="right"
            title=""
            width="250"
            :value="$store.getters.isGuideShow(1) && show"
            trigger="manual">
      <p>感谢您使用龙境安卓云管理软件，下面为您介绍后台的使用方法：左边栏为后台的菜单栏，可以进入各个功能入口。</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="$store.commit($mutation.GUIDE, 0)">跳过</el-button>
        <el-button type="primary" size="mini" @click="$store.commit($mutation.GUIDE, $store.state.guide + 1)">下一步</el-button>
      </div>
    </el-popover>

    <div :style="sideStyle" class="side-bar" v-popover:guide1>
      <template v-for="(item, index) in authorItems">
        <SideBarItem v-if="item.name" :key="index" :index="index" :item="item"></SideBarItem>
      </template>
    </div>
    <template v-if="mainSceneItem">
      <MainScene></MainScene>
    </template>
  </div>
</template>

<script>
import SideBarItem from "@/components/SideBarItem.vue"
import MainScene from "@/components/MainScene.vue";
export default {
  name: "SideBar",
  components: {
    SideBarItem,
    MainScene
  },
  data() {
    return {
      show: false
    }
  },
  computed: {
    mainSceneItem () {
      return this.authorItems[this.$store.state.sideCheck]
    },
    authorItems () {
      return this.$store.getters.authorItems
    },
    sideStyle() {
      return this.$store.state.guide > 0 ? {width: "230px"} : {}
    }
  },
  mounted() {
    this.show = true
  }
};
</script>

<style lang="less" scoped>
.side-bar {
  position: fixed;
  top: 50px;
  bottom: 0;
  left: 0;
  width: 50px;
  overflow: hidden;
  z-index: 1020!important;
  background-color: #252a2f;
  border-top: 1px solid hsla(0,0%,100%,.1);
  transition: all .3s cubic-bezier(0,0,.2,1);
}
.side-bar:hover {
  cursor: pointer;
  width: 230px;
  transition-delay: .3s;
}
</style>