<template xmlns:v-popover="http://www.w3.org/1999/xhtml">
  <el-menu-item :index="item.path" v-if="item.path">
    <i class="iconfont" v-if="item.src === 'dev'">&#xe8a8;</i>
    <i class="iconfont" v-if="item.src === 'group'">&#xe8b1;</i>
    <i class="iconfont" v-if="item.src === 'log'">&#xe74d;</i>
    <i class="iconfont" v-if="item.src === 'system'">&#xe610;</i>
    <i class="iconfont" v-if="item.src === 'user'">&#xe638;</i>
    <i class="iconfont" v-if="item.src === 'app'">&#xe600;</i>
    <i class="iconfont" v-if="item.src === 'admin'">&#xe601;</i>
    <i class="iconfont" v-if="item.src === 'overview'">&#xe615;</i>
    <span style="margin-left: 5px">{{item.name}}</span>
  </el-menu-item>
  <el-submenu :index="item.src" v-else>
    <template slot="title">
      <i class="iconfont" v-if="item.src === 'dev'">&#xe8a8;</i>
      <i class="iconfont" v-if="item.src === 'group'">&#xe8b1;</i>
      <i class="iconfont" v-if="item.src === 'log'">&#xe74d;</i>
      <i class="iconfont" v-if="item.src === 'system'">&#xe610;</i>
      <i class="iconfont" v-if="item.src === 'user'">&#xe638;</i>
      <i class="iconfont" v-if="item.src === 'app'">&#xe600;</i>
      <i class="iconfont" v-if="item.src === 'admin'">&#xe601;</i>
      <i class="iconfont" v-if="item.src === 'overview'">&#xe615;</i>
      <span style="margin-left: 5px">{{item.name}}</span>
    </template>
    <template v-for="(child, ind) in item.children">
      <el-menu-item :key="ind" :index="child.path">{{child.name}}</el-menu-item>
    </template>
  </el-submenu>
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
      return this.index == this.$store.state.sideCheck
        ? {backgroundColor: "#00c1de!important"} : {}
    },
    guideContent() {
      switch (this.item.src) {
        case "dev": return "设备管理用于管理您的设备和设备池，还能按照分组的形式管理您的设备。设备池可以对设备的网络进行设置。";
        case "app": return "应用管理用于应用的添加、更新、删除以及关联分组，提供查看应用安装与卸载状态的应用监控功能。";
        case "log": return "日志管理用于查看设备的调度日志和管理人员的操作日志。";
        case "user": return "用户管理用于添加并管理用户和用户组，从而实现登录账户的权限控制。";
        case "system": return "系统管理用于管理系统参数、设备引擎版本，同时可对系统和设备引擎进行升级。如果设备需要在公网访问，则需要设置公网IP！";
        default: return ""
      }
    }
  },
  data() {
    return {
      show: false
    }
  },
  methods: {
    clickHandler () {
      this.$router.push(this.item.children[0].path)
    },
    nextStep() {
      console.log("nextStep:" + this.index)
      this.$store.commit(this.$mutation.GUIDE, this.$store.state.guide + 1)
      this.$store.commit(this.$mutation.SIDE_CHECK, this.index + 1)
    },
    jumpStep() {
      this.$store.commit(this.$mutation.GUIDE, 0)
      this.$store.commit(this.$mutation.SIDE_CHECK, 0)
    }
  },
  mounted() {
    this.show = this.guideContent !== ""
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