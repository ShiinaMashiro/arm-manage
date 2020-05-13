<template xmlns:v-popover="">
  <div class="home-head">
    <div class="arm-logo">
      <div class="arm-logo-wrapper">
        <TopBarItem2 class="arm-icon" :jump="false">
          <img class="img" src="../assets/lj.png" />
        </TopBarItem2>
        <TopBarItem2 class="sys-link" :jump="false">
          <span>龙境安卓云系统管理软件</span>
        </TopBarItem2>
      </div>
    </div>
    <el-popover
            ref="guide3"
            placement="bottom"
            title=""
            width="250"
            :value="$store.getters.isGuideShow(lastGuide) && show"
            trigger="manual">
      <p>如果还有其他问题，可以进入帮助中心查看并下载用户手册。</p>
      <div style="text-align: right; margin: 0">
        <el-button type="primary" size="mini" @click="$store.commit($mutation.GUIDE, 0);$store.commit($mutation.SIDE_CHECK, 0)">结束</el-button>
      </div>
    </el-popover>
    <div class="arm-info">
      <TopBarItem2 class="sys-link" :jump="true" path="/home/help/faq" v-popover:guide3>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link" style="color: white">
            帮助中心<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="faq">FAQ</el-dropdown-item>
            <el-dropdown-item command="fun">功能介绍</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </TopBarItem2>
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
      userShow: false,
      show: false
    }
  },
  computed: {
    lastGuide() {
      let list = this.$store.getters.authorItems
      let guide = 2
      list.forEach(i => {
        if (i.guide) {
          guide++
        }
      })
      return guide
    }
  },
  methods: {
    handleCommand(c) {
        this.$router.push('/home/help/' + c)
    }
  },
  mounted() {
    this.show = true
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
  z-index: 1000 !important;
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
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
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
