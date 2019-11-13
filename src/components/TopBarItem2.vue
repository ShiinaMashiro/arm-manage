<template>
  <div class="top-bar-item" @click="clickHandler">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "TopBarItem",
  props: {
    jump: {
      type: Boolean,
      default: false
    },
    path: {
      type: String,
      default: "/home"
    }
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    clickHandler() {
      if (this.jump) {
        this.$router.push(this.path)
        this.$forceUpdate()
      }
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
