<template>
  <div class="nav-list-item" :style="checkStyle" @click="check">
    <span><span v-if="back">< </span>{{item.name}}</span>
    <span style="color: #888" v-if="!back">></span>
  </div>
</template>

<script>
export default {
  name: "MainSceneItem",
  props: {
    item: Object,
    back: Boolean,
    clickHandle: Function
  },
  data () {
    return {

    }
  },
  computed: {
    checkStyle () {
      return this.$store.state.sideInfo.scene.path === this.item.path ? {backgroundColor: '#F4F6F8!important'} : {}
    }
  },
  methods: {
    check () {
      this.clickHandle
      ? this.clickHandle()
      : this.$router.push(this.item.path)
    }
  }
};
</script>

<style lang="less" scoped>
.nav-list-item {
  height: 40px;
  padding: 0 10px 0 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  span {
    font-size: 12px;
    color: #333;
    text-align: left;
  }
}
.nav-list-item:hover {
  background-color: #F4F6F8;
}
</style>