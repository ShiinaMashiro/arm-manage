<template>
  <div class="home-main-top-bar">
    <span>{{$route.meta.fun ? $store.state.fun.title + "功能介绍" : $route.name}}</span>
  </div>
</template>

<script>
export default {
  name: "HomeMainTopBar"
};
</script>

<style lang="less" scoped>
.home-main-top-bar {
  width: 100%;
  border-bottom: 1px solid #DDD;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  height: 70px;
  span {
    border-left: 2px solid #88B7E0;
    font-weight: 500;
    line-height: 1.1;
    color: inherit;
    font-size: 14px;
    text-indent: 8px;
  }
}
</style>