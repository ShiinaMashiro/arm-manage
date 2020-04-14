<template>
  <div class="home-main-all">
    <el-breadcrumb separator="/" class="home-main-breadcrumb">
      <el-breadcrumb-item v-if="$store.state.sideInfo.item">{{$store.state.sideInfo.item.name}}</el-breadcrumb-item>
      <el-breadcrumb-item v-if="$store.state.sideInfo.child">{{$store.state.sideInfo.child.name}}</el-breadcrumb-item>
      <el-breadcrumb-item v-if="$store.state.sideInfo.scene">{{$store.state.sideInfo.scene.name}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="home-main-top-bar">
      <span>{{$route.meta.fun ? $store.state.fun.title + "功能介绍" : $route.name}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeMainTopBar"
};
</script>

<style lang="less" scoped>
  .home-main-all {
    display: flex;
    flex-direction: column;
    align-items: left;
  }
  .home-main-breadcrumb {
    margin-top: 20px;
    font-size: 12px;
  }
.home-main-top-bar {
  width: 100%;
  border-bottom: 1px solid #DDD;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  height: 50px;
  span {
    border-left: 2px solid #88B7E0;
    font-weight: 600;
    line-height: 1.1;
    color: inherit;
    font-size: 16px;
    text-indent: 8px;
  }
}
</style>