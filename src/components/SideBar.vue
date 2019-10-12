<template>
  <div>
    <div class="side-bar">
      <template v-for="(item, index) in authorItems">
        <SideBarItem :key="index" :index="index" :item="item" v-model="checked"></SideBarItem>
      </template>
    </div>
    <template v-if="mainSceneItem && show">
      <MainScene :info="mainSceneItem"></MainScene>
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
  data () {
    return {
      checked: 0,
      sideRecover: false,
      show: false
    }
  },
  watch: {
    checked (val) {
      this.$store.commit(this.$mutation.SIDE_CHECK, val)
    }
  },
  computed: {
    mainSceneItem () {
      return this.authorItems[this.checked]
    },
    authorItems () {
      return this.$store.getters.authorItems
    }
  },
  mounted () {
    let num = parseInt(this.$store.state.sideCheck)
    this.sideRecover = num !== -1
    this.checked = num === -1 ? 0 : num
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