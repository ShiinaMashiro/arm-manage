<template>
  <div class="login" @keyup.enter="login">
    <!--<div class="mask"></div>
    <div class="login-box">
      <span>账号登陆</span>
      <el-input v-model="info.username" placeholder="用户名"></el-input>
      <el-input v-model="info.password" type="password" placeholder="请输入密码"></el-input>
      <el-button type="primary" @click="login">登陆</el-button>
    </div>-->
    <el-image
            style="width: 432px;border-radius: 15px 0 0 15px;"
            :src="url"
            fit="fill"></el-image>
    <div style="background-color: white;width: 253px;height: 460px;padding: 20px 55px 0 60px;border-radius: 0 15px 15px 0;
    display: flex;flex-direction: column;align-items: stretch">
      <div style="color: #555;font-size: 20px;text-align: left;padding: 60px 0">龙境安卓云系统管理软件</div>
      <div class="item">
        <el-image
                style="width: 16px;height: 16px"
                :src="usernameUrl"
                fit="fill"></el-image>
        <input name="username" v-model="info.username"/>
      </div>
      <div class="item">
        <el-image
                style="width: 16px;height: 16px"
                :src="passwordUrl"
                fit="fill"></el-image>
        <input name="password" type="password" v-model="info.password"/>
      </div>
      <el-checkbox style="text-align: left;padding: 10px 0" v-model="info.save">记住用户名</el-checkbox>
      <el-button type="primary" style="width: auto;margin-top: 40px" @click="login">登录</el-button>
    </div>
    <div style="position: absolute;bottom: 20px;color: #888;font-size: 14px">版权所有©杭州龙境科技有限公司</div>
  </div>
</template>

<script>
  export default {
    name: "LoginNew",
    data () {
      return {
        url: require('../assets/login/login-bg.png'),
        usernameUrl: require('../assets/login/icon_user.png'),
        passwordUrl: require('../assets/login/icon_user-02.png'),
        info: {
          username: "",
          password: "",
          save: false
        }
      }
    },
    methods: {
      login () {
        let loginInfo = {...this.info}
        loginInfo.password = md5(loginInfo.password)
        this.$store.dispatch(this.$action.LOGIN, loginInfo)
      }
    },
    mounted() {
      console.log(this.$route)
      if (this.$route.query.from === "manage") {
        this.$store.commit(this.$mutation.MANAGE, 1)
      }
      console.log(this.$store.state.userInfo)
      if (this.$store.state.userInfo.save) {
        this.info.username = this.$store.state.userInfo.username
        this.info.save = true
      }
    }
  };
</script>

<style lang="less" scoped>
  .login {
    width: 100vw;
    height: 100vh;
    min-height: 800px;
    background: #f1f0f3;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .item {
    display: flex;
    flex-direction: row;
    padding: 10px 0;
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;
    input {
      border: none;
      width: 100%;
      padding-left: 10px;
    }
    input:focus {
      outline: none;
    }

  }
  span {
    border-color: #3d88fe !important;
  }
</style>