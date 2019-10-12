<template>
  <div class="side-bar-item" :style="checkStyle" @click="clickHandler">
    <div class="item-icon center-container">
      <!--<img :src="item.src">-->
      <i class="iconfont" v-if="item.src === 'dev'">&#xe8a8;</i>
      <i class="iconfont" v-if="item.src === 'group'">&#xe8b1;</i>
      <i class="iconfont" v-if="item.src === 'log'">&#xe74d;</i>
      <i class="iconfont" v-if="item.src === 'system'">&#xe610;</i>
      <i class="iconfont" v-if="item.src === 'user'">&#xe638;</i>
      <i class="iconfont" v-if="item.src === 'app'">&#xe600;</i>
    </div>
    <div class="item-name ">
      <span>{{item.name}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "SideBarItem",
  props: {
    item: Object,
    index: Number,
    value: Number
  },
  computed: {
    checkStyle () {
      return this.index === this.value
        ? {backgroundColor: "#00c1de!important"} : {}
    }
  },
  methods: {
    clickHandler () {
      this.$emit('input', this.index)
      this.$router.push(this.item.children[0].path)
    }
  }
};
</script>

<style lang="less" scoped>
.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.side-bar-item {
  width: 230px;
  height: 40px;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  .item-icon {
    width: 50px;
    img {
      height: 16px;
      width: 16px;
    }
  }
  .item-name {
    width: 180px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    span {
      font-size: 12px;
      color: white;
    }
  }
}
.side-bar-item:hover {
  background: rgba(0, 0, 0, 0.65);
}
</style>