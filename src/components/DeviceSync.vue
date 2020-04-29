<template>
  <div style="padding: 20px;display: flex;flex-direction: row;" v-if="(devList.length >= 2) && syncSuccess ">
    <div style="padding-right: 20px;">
      <DeviceWindow :id="syncData.deviceIdMain" :ip="syncData.deviceIpMain" :port="syncData.devicePortMain" @openRecent="openRecent()" :deviceId="devList[0].deviceNo"></DeviceWindow>
    </div>
    <div style="flex-grow: 1;display: flex;flex-direction: column">
      <div style="padding-top: 20px;border-bottom: 1px solid #ddd;padding-bottom: 5px">
        <el-button type="primary" size="mini" :disabled="!snapshotSuccess" style="width: 100px" @click="snapshotOne()">刷新</el-button>
      </div>
      <div style="flex-grow: 1;">
        <div class="preview-main">
          <template v-for="(item, index) in syncData.devices">
            <DeviceWindowImg style="padding: 5px 20px 20px 0" :ref="'sync' + item.deviceNo" :target="'sync' + item.deviceNo"  :id="item.deviceId" :ip="item.deviceIp" :port="item.devicePort" :key="item.deviceNo"></DeviceWindowImg>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import DeviceWindow from '@/components/DeviceWindow2'
  import DeviceWindowImg from '@/components/DeviceWindow3'
  let that
  export default {
    name: "DeviceSync",
    components: {DeviceWindow, DeviceWindowImg},
    props: {
      devList: {
        type: Array,
        default: () => {return []}
      },
      deviceStatusStr: {
        type: Object,
        default: () => {return {}}
      }
    },
    data() {
      return {
        syncSuccess: false,
        snapFail: require('../assets/snapfail.png'),
        snapNotUpdate: require('../assets/notupdate.png'),
        snapError: require('../assets/snaperror.png'),
        snapRestart: require('../assets/snaprestart.png'),
        imgList: [],
        successList: [],
        syncData: null
      }
    },
    computed: {
      syncList() {
        return this.devList.slice(1)
      },
      snapshotSuccess() {
        let success = true
        this.successList.forEach(s => {
          success = success && s
        })
        return success
      }
    },
    filters: {
      statusClassFilter (row) {
        if (row.isFlow === 1 && row.deviceStatus === 0) return {color: "green"}
        switch (row.deviceStatus) {
          case 0: return {color: "#333"};
          case 3: return {color: "red"};
          default: return {color: "#eab820"}
        }
      }
    },
    methods: {
      sync() {
        let ips = []
        that.syncList.forEach(dev => {
          ips.push(dev.deviceIp)
        })
        that.$post(that.$uri.device.sync, {
          deviceIpMain: that.devList[0].deviceIp,
          deviceIps: ips.join(',')
        }).then(res => {
          if (res.success) {
            this.syncData = res.data
            that.syncSuccess = true
            that.snapshotOne()
          } else {
            that.$message.error('请求同步失败')
            that.$emit('fail')
          }
        })
      },
      statusImg(status) {
        return status === 1 ? this.snapNotUpdate :
          (status === 3 ? this.snapError : null)
      },
      openRecent() {
        this.syncData.devices.forEach(dev => {
          that.$refs['sync' + dev.deviceNo][0].recentClick()
        })
      },
      snapshotOne() {
        for (let i = 0; i < that.syncList.length; i++) {
          that.successList.splice(i, 1, false)
          that.$post(that.$uri.device.snapshot, {deviceIp: that.syncList[i].deviceIp, isSave: 0}).then(res => {
            if (res.success) {
              that.imgList.splice(i, 1, res.data)
            }
            that.successList.splice(i, 1, true)
          })
        }
      }
    },
    beforeCreate() {
      that = this

    },
    mounted() {
      console.log('aaaaaaaaaaaaasssssssssssssssssssss')
      for (let i = 0; i < that.syncList.length; i++) {
        that.successList.push(false)
      }
      that.sync()
    }
  };
</script>

<style lang="less" scoped>
  .preview-main {
    display: flex;
    flex-direction: row;
    /*justify-content: space-between;*/
    flex-wrap: wrap;
    .snapshot-main {
      border: 1px solid #DDD;
      border-radius: 6px;
      .snapshot-main-head {
        padding: 0 5px;
        width: 100%;
      }
      .snapshot-main-img {

      }
    }
    #snapshot-main :hover {
      border: 1px solid #409eff;
      border-radius: 6px;
    }
  }
  .preview-main :after {
    content: '';
    /*width: 200px;*/
  }
</style>