<template>
  <div style="background-color: #ebeef5;position: fixed;left: 220px;top: 50px;right: 0;bottom: 0;">
    <div style="display: flex;flex-direction: row;margin: 10px;padding: 10px;">
      <div style="display: flex;flex-direction: column;align-items: stretch;flex-grow: 1">
        <div style="background-color: white;padding: 10px">
          <div class="title">设备概览</div>
          <div style="display: flex;flex-direction: row;justify-content: space-between;padding: 10px 20px 0 20px">
            <div class="device-info">
              <div class="device-info-title">设备总数</div>
              <div class="device-info-info">{{deviceNum}}</div>
            </div>
            <div class="device-info">
              <div class="device-info-title">故障设备</div>
              <div class="device-info-info">{{badNum}}</div>
            </div>
            <div class="device-info">
              <div class="device-info-title">推流中设备</div>
              <div class="device-info-info">{{streamNum}}</div>
            </div>
          </div>
        </div>
        <div style="margin-top: 15px;background-color: white;padding: 10px">
          <div class="title">常用入口</div>
          <div style="display: flex;flex-direction: row;justify-content: space-between;padding: 30px 20px 20px 20px;font-size: 14px">
            <div v-for="page in normalPages" :key="page.path + '-normal'" @click="$router.push(page.path)">{{page.name}}</div>
          </div>
        </div>
        <div style="margin-top: 15px;background-color: white;padding: 10px">
          <div class="title">最近访问</div>
          <div style="display: flex;flex-direction: row;justify-content: space-between;padding: 30px 20px 20px 20px;font-size: 14px">
            <div v-for="page in latelyPages" :key="page.path + '-lately'" @click="$router.push(page.path)">{{page.name}}</div>
          </div>
        </div>
        <div style="margin-top: 15px;background-color: white;padding: 10px">
          <div class="title">License信息</div>
          <div style="display: flex;flex-direction: column;justify-content: flex-start;align-items: left;padding: 20px 20px 10px 20px;font-size: 14px">
            <div style="text-align: left">有效时间：{{licenseTime}}</div>
            <div style="text-align: left;margin-top: 10px">设备数量：80</div>
          </div>
        </div>
      </div>
      <div style="display: flex;flex-direction: column;margin-left: 15px;">
        <div style="background-color: white;padding: 10px;height: 200px">
          <div class="title">常见问题：</div>
          <div style="display: flex;flex-direction: column;justify-content: flex-start;align-items: left;padding: 20px 20px 10px 20px;font-size: 14px">
            <div style="text-align: left" @click="$router.push('/home/help/faq')">1.如何安装应用</div>
            <div style="text-align: left;margin-top: 10px" @click="$router.push('/home/help/faq')">2.如何配置网管</div>
          </div>
        </div>
        <div style="margin-top: 15px;background-color: white;padding: 10px;height: 200px">
          <div class="title">主要功能介绍：</div>
          <div style="display: flex;flex-direction: column;justify-content: flex-start;align-items: left;padding: 20px 20px 10px 20px;font-size: 14px">
            <div style="text-align: left">
              <el-button type="text" @click="$router.push('/home/help/fun/show?index=2')">分组管理</el-button>
            </div>
            <div style="text-align: left;margin-top: 10px">
              <el-button type="text" @click="$router.push('/home/help/fun/show?index=2')">引擎升级</el-button>
            </div>
          </div>
        </div>
        <div style="margin-top: 15px;background-color: white;padding: 10px;height: 200px">
          <div class="title">联系方式：</div>
          <div style="display: flex;flex-direction: column;justify-content: flex-start;align-items: left;padding: 20px 20px 10px 20px;font-size: 14px">
            <div style="text-align: left">QQ：157457734</div>
            <div style="text-align: left;margin-top: 10px">电话：13616513812</div>
            <div style="text-align: left;margin-top: 10px">邮箱：zx@longene.com.cn</div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  let that
  export default {
    name: "Overview",
    data() {
      return {
        deviceNum: 0,
        badNum: 0,
        streamNum: 0,
        normalPages: [],
        latelyPages: [],
        licenseInfo: {
          seconds: 0,
          deviceNum: 0
        }
      }
    },
    computed: {
      licenseTime() {
        let s = this.licenseInfo.seconds
        if (s === -1) {
          return '永久'
        }
        let time = ''
        let day = parseInt(s/(60 * 60 * 24))
        if (day > 0) {
          time += day + '天'
        }
        s = s - day * (60 * 60 * 24)
        let hour = parseInt(s/(60 * 60))
        if (hour > 0) {
          time += hour + '小时'
        }
        return time
      }
    },
    methods: {
    },
    beforeCreate() {
      that = this
    },
    mounted() {
      this.latelyPages = this.$store.getters.latelyPages
      this.normalPages = this.$store.getters.normalPages
      console.log(this.normalPages)
      that.$post(that.$uri.device.deviceList, {
        startPage: 1,
        limit: 1
      }).then(res => {
        if (res.success) {
          that.deviceNum = res.total
        }
      })

      that.$post(that.$uri.device.deviceList, {
        startPage: 1,
        limit: 1,
        deviceStatus: 3
      }).then(res => {
        if (res.success) {
          that.badNum = res.total
        }
      })

      that.$post(that.$uri.device.deviceList, {
        startPage: 1,
        limit: 1,
        isFlow: 1
      }).then(res => {
        if (res.success) {
          that.streamNum = res.total
        }
      })

      that.$post(that.$uri.system.licenseGet).then(res => {
        if (res.success) {
          that.licenseInfo = res.data
        }
      })

    }
  };
</script>

<style lang="less" scoped>
.title {
  font-size: 20px;
  font-weight: 600;
  border-bottom: 1.5px solid #ddd;
  text-align: left;
  padding-bottom: 5px;
}
.device-info {
  width: 150px;
  height: 150px;
  background-color: #ebeef5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .device-info-title {
    margin-bottom: 20px;
    font-size: 12px;
    .device-info-info {

    }
  }
}
</style>