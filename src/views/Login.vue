<template>
  <div class="login" @keyup.enter="login">
    <div class="mask"></div>
    <div class="login-box">
      <span>账号登陆</span>
      <el-input v-model="info.username" placeholder="用户名"></el-input>
      <el-input v-model="info.password" type="password" placeholder="请输入密码"></el-input>
      <el-button type="primary" @click="login">登陆</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data () {
    return {
      info: {
        username: "",
        password: ""
      }
    }
  },
  methods: {
    login () {
      this.$store.dispatch(this.$action.LOGIN, this.info)
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  width: 100vw;
  height: 100vh;
  background: #1F2325 url(../assets/background.jpg);
  background-size: cover;
  .mask {
    position: fixed;
    z-index: 100;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, .25);
  }
  .login-box {
    position: fixed;
    top: 130px;
    right: 118px;
    width: 330px;
    height: 255px;
    background-color: #fff;
    z-index: 101;
    padding: 25px 25px 80px 25px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
    span {
      font-size: 18px;
      font-weight: 400;
      padding-bottom: 16px;
      text-align: left;
    }
  }
}
</style>