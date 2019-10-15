<template>
  <div class="home-head">
    <div class="arm-logo">
      <div class="arm-logo-wrapper">
        <TopBarItem2 class="arm-icon">
          <img class="img" src="../assets/lj.png" />
        </TopBarItem2>
        <TopBarItem2 class="sys-link">
          <span>龙境安卓云系统管理软件</span>
        </TopBarItem2>
      </div>
    </div>
    <div class="arm-info">
      <TopBarItem class="head-icon" v-model="userShow">
        <img class="img" src="../assets/user__easyico.png" />
      </TopBarItem>
    </div>
  </div>
</template>

<script>
import TopBarItem from "@/components/TopBarItem.vue";
import TopBarItem2 from "@/components/TopBarItem2.vue";
import UserInfo from "@/components/UserInfo.vue";
export default {
  name: "TopBar",
  components: {
    TopBarItem, UserInfo, TopBarItem2
  },
  data () {
    return {
      userShow: false
    }
  }
};
</script>

<style lang="less" scoped>
.home-head {
  background-color: #252a2f;
  height: 50px;
  width: 100%;
  left: 0;
  top: 0;
  position: fixed;
  z-index: 1030 !important;
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  .arm-logo {
    height: 50px;
    /*float: left !important;*/
    .arm-logo-wrapper {
      min-width: 148px !important;
      float: left !important;
      height: 100%;
      display: flex;
      flex-direction: row;
      .arm-icon {
        margin-right: 1px;
        text-align: center;
        width: 50px !important;
        font-size: 24px;
        color: #fff;
        line-height: 50px;
        height: 100%;
        text-decoration: none;
        .img {
          height: 24px;
          width: 24px;
        }
      }
      .sys-link {
        color: #fff;
        font-size: 14px;
        line-height: 50px;
        margin-right: 1px;
        /*padding: 0 12px;*/
        text-align: center;
        text-decoration: none;
        span {
          padding: 0 12px;
        }
      }
    }
  }
  .arm-info {
    /*position: absolute;*/
    /*z-index: 3;*/
    /*top: 0;*/
    /*right: 0;*/
    /*float: right !important;*/
    .head-icon {
      /*padding: 0 12px;*/
      height: 50px;
      width: 56px;
      .img {
        height: 32px;
        width: 32px;
        border-radius: 16px;
      }
    }
  }
}
</style>
