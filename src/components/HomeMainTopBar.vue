<template>
  <div class="home-main-all">
    <el-breadcrumb separator="/" class="home-main-breadcrumb">
      <template v-if="$route.path.startsWith('/home/help/fun')">
        <el-breadcrumb-item>帮助中心</el-breadcrumb-item>
        <el-breadcrumb-item>功能介绍</el-breadcrumb-item>
      </template>
      <template v-else>
        <el-breadcrumb-item v-if="$store.state.sideInfo.item">{{$store.state.sideInfo.item.name || '帮助中心'}}</el-breadcrumb-item>
        <el-breadcrumb-item v-if="$store.state.sideInfo.child">{{appName || groupName || $store.state.sideInfo.child.name}}</el-breadcrumb-item>
        <el-breadcrumb-item v-if="$store.state.sideInfo.scene">{{$store.state.sideInfo.scene.name}}</el-breadcrumb-item>
      </template>
    </el-breadcrumb>
    <div class="home-main-top-bar-t">
      <div class="home-main-top-bar">
        <span class="span_">{{appName || groupName || ($route.meta.fun ? $store.state.funList[$store.state.helpIndex].title : $route.name)}}</span>
        <span style="font-size: 12px;margin-left: 20px" v-if="$route.path === '/home/system/ipproxy'">自行通过OpenVPN搭建IP代理池，<span style="color: red">管理系统内的IP代理池仅提供板卡切换和管理功能</span></span>
        <span style="font-size: 12px;margin-left: 20px;text-align: left" v-if="$route.path === '/home/app/devMaster'">备份管理可指定设备和应用进行备份，同时将本地的备份上传至设定的FTP服务器（
          <span style="color: red">需用户自建</span>），并可将FTP服务器上的备份恢复至云机。</span>
        <span v-if="this.$route.path.startsWith('/home/group') && this.$route.path.indexOf('/list') === -1" style="font-size: 12px;margin-left: 20px">{{'设备数量：' + deviceNum + '     推流设备数量：' + streamNum + '      故障设备数量：' + badNum}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeMainTopBar",
  data() {
    return {
      deviceNum: 0,
      badNum: 0,
      streamNum: 0,
    }
  },
  computed: {
    groupName() {
      if (this.$route.path.startsWith('/home/group/') && this.$route.path !== '/home/group/list') {
        return this.$store.state.groupInfo.groupName
      }
      return ''
    },
    appName() {
      if (this.$route.path === '/home/app/detail' || this.$route.path === '/home/app/group') {
        return this.$store.state.appInfo.appName
      }
      return ''
    }
  },
  methods: {

  },
  updated() {
    console.log("lllllllllllllllllll")
    if (this.$route.path.startsWith('/home/group') && this.$route.path.indexOf('/list') === -1) {
      let that = this
      that.$post(that.$uri.device.deviceList, {
        startPage: 1,
        limit: 1,
        groupId: that.$store.state.groupInfo.id
      }).then(res => {
        if (res.success) {
          that.deviceNum = res.total
        }
      })

      that.$post(that.$uri.device.deviceList, {
        startPage: 1,
        limit: 1,
        deviceStatus: 3,
        groupId: that.$store.state.groupInfo.id
      }).then(res => {
        if (res.success) {
          that.badNum = res.total
        }
      })

      that.$post(that.$uri.device.deviceList, {
        startPage: 1,
        limit: 1,
        isFlow: 1,
        groupId: that.$store.state.groupInfo.id
      }).then(res => {
        if (res.success) {
          that.streamNum = res.total
        }
      })
    }
  }
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
  height: 45px;
  .span_ {
    min-width: 80px;
    border-left: 2px solid #88B7E0;
    font-weight: 600;
    line-height: 1.1;
    color: inherit;
    font-size: 16px;
    text-indent: 8px;
  }
}
  .home-main-top-bar-t {
    width: 100%;
    padding-bottom: 5px;
  }
</style>