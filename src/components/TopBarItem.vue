<template>
  <div class="top-bar-item" @mouseenter="mouseMoveHandler" @mouseleave="mouseOutHandler">
    <slot></slot>
    <template v-if="show">
      <UserInfo @change="changePasswordPop"></UserInfo>
    </template>
    <!-- 修改密码 -->
    <Drawer title="重新分发" :visible.sync="changePasswordPopShow" @handClick="changePassword">
    <!--<Drawer title="修改密码" :append-to-body="true" :visible.sync="changePasswordPopShow" width="500px" top="15vh">-->
      <div>
        <el-form ref="form" :model="changeInfo" label-width="130px" label-position="left">
          <el-form-item size="mini" label="原密码">
            <el-input v-model="changeInfo.oldPassword" type="password"></el-input>
          </el-form-item>
          <el-form-item size="mini" label="新密码">
            <el-input v-model="changeInfo.newPassword" type="password"></el-input>
          </el-form-item>
          <el-form-item size="mini" label="重复新密码">
            <el-input v-model="changeInfo.newPassword2" type="password"></el-input>
          </el-form-item>
          <!--<el-form-item>
            <el-button type="primary" @click="changePassword">确定</el-button>
            <el-button @click="changePasswordPopShow = false">取消</el-button>
          </el-form-item>-->
        </el-form>
      </div>
    </Drawer>
  </div>
</template>

<script>
import UserInfo from "@/components/UserInfo.vue";
import Drawer from "@/components/Drawer.vue";
export default {
  name: "TopBarItem",
  components: {UserInfo, Drawer},
  data () {
    return {
      show: false,
      changePasswordPopShow: false,
      changeInfo: {
        id: 0,
        oldPassword: "",
        newPassword: "",
        newPassword2: ""
      }
    }
  },
  methods: {
    mouseMoveHandler() {
      this.show = true
    },
    mouseOutHandler() {
      this.show = false
    },
    changePasswordPop () {
      console.log("ssssssssssss")
      this.changeInfo.id = this.$store.state.userInfo.id
      this.changePasswordPopShow = true
    },
    changePassword () {
      let info = this.changeInfo
      if (!info.oldPassword || !info.newPassword) {
        this.$message.error("输入不能为空")
        return
      }
      if (info.newPassword !== info.newPassword2) {
        this.$message.error("两次密码不一致")
        return
      }
      let that = this
      that.$post(that.$uri.login.changePassword, info).then(res => {
        that.$message.success("修改成功")
        setTimeout( () => {
          that.$router.push("/")
        }, 1000)
      })
    }
  }
};
</script>

<style lang="less" scoped>
  .top-bar-item {
    /*width: 100%;*/
    /*height: 100%;*/
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .top-bar-item:hover {
    background: rgba(0, 0, 0, 0.65);
  }
</style>
