<template>
  <div class="user-info">
    <div class="user-info-header">
      <div class="header-top">
        <img src="../assets/user__easyico.png" />
        <span>{{$store.state.userInfo.username}}</span>
      </div>
      <div class="header-bottom" >
        <span @click="$emit('change')">修改密码</span>
      </div>
    </div>
    <div class="user-info-body"></div>
    <div class="user-info-footer" @click="$router.push('/')">
      <span>退出管理系统</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserInfo",
  data () {
    return {

    }
  },
  methods: {

  }
};
</script>

<style lang="less" scoped>
.user-info {
  position: fixed;
  top: 50px;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  font-size: 12px;
  color: #fff;
  background-color: #191d21;
  transition: opacity .15s,visibility 0s .15s;
  .user-info-header {
    padding: 10px 15px;
    border-bottom: 1px solid hsla(0,0%,100%,.1);
    width: 250px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    .header-top {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      height: 32px;
      img {
        height: 32px;
        width: 32px;
      }
      span {
        margin-left: 10px;
      }
    }
    .header-bottom {
      height: 18px;
      margin-top: 10px;
      span:hover {
        color: #00c1de;
      }
    }
  }
  .user-info-body {
    padding: 8px 0;
    display: none;
  }
  .user-info-footer {
    border-top: 1px solid hsla(0,0%,100%,.1);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    span {
      font-size: 12px;
      color: white;
    }
  }
  .user-info-footer:hover span{
    color: #00c1de;
  }
}
</style>