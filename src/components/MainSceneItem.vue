<template>
  <div class="nav-list-item" :style="checkStyle" @click="check">
    <span>{{item.name}}</span>
  </div>
</template>

<script>
export default {
  name: "MainSceneItem",
  props: {
    value: Number,
    index: Number,
    item: Object
  },
  data () {
    return {

    }
  },
  computed: {
    checkStyle () {
      return this.index === this.value ? {backgroundColor: '#fff!important'} : {}
    }
  },
  methods: {
    check () {
      this.$emit('input', this.index)
      this.$router.replace(this.item.path)
    }
  }
};
</script>

<style lang="less" scoped>
.nav-list-item {
  height: 40px;
  padding: 0 0 0 30px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
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