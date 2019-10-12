<template>
  <div class="top-bar-item">
    <slot></slot>
  </div>
</template>

<script>
import UserInfo from "@/components/UserInfo.vue";
export default {
  name: "TopBarItem",
  components: {UserInfo},
  data () {
    return {
      show: false
    }
  },
  methods: {
    mouseMoveHandler() {
      this.show = true
    },
    mouseOutHandler() {
      this.show = false
    }
      }
};
</script>

<style lang="less" scoped>
  .top-bar-item {
    /*width: 100%;*/
    /*height: 100%;*/
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .top-bar-item:hover {
    background: rgba(0, 0, 0, 0.65);
  }
</style>
