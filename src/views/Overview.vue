<template>
  <div style="background-color: #EFEFEF;position: fixed;left: 220px;top: 50px;right: 0;bottom: 0;">
    <div style="display: flex;flex-direction: row;margin: 10px;padding: 10px;">
      <div style="display: flex;flex-direction: column;align-items: stretch;flex-grow: 1">

        <div style="display: flex;flex-direction: row;align-items: stretch;width: 100%;max-height: 220px">
          <div style="background-color: white;padding: 10px;width: 100%" class="shadow">
            <div class="title">设备概览</div>
            <div style="display: flex;flex-direction: row;justify-content: space-between;padding: 10px 20px 0 20px;flex-grow: 1">
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
          <div style="background-color: white;padding: 10px;margin-left: 15px;width: 280px" class="shadow">
            <div class="title">故障设备列表</div>
            <div style="width: 100%;display: flex;flex-direction: row;margin-bottom: 5px;padding: 5px 20px">
              <div style="text-align: left;font-size: 14px;width: 80px">机箱号</div>
              <div style="text-align: left;font-size: 14px;width: 80px">槽位号</div>
              <div style="text-align: left;font-size: 14px;width: 80px">IP</div>
            </div>
            <div id="gz" style="display: flex;flex-direction: column;justify-content: flex-start;padding: 0 20px 0 20px;max-height: 130px;overflow-y: auto;">
              <template v-for="dev in devList">
                <div style="width: 100%;display: flex;flex-direction: row;margin-bottom: 5px" :key="dev.id">
                  <div style="text-align: left;font-size: 14px;width: 80px">{{dev.caseNo}}</div>
                  <div style="text-align: left;font-size: 14px;width: 80px">{{dev.slotNo}}</div>
                  <div style="text-align: left;font-size: 14px;width: 80px">{{dev.deviceIp}}</div>
                </div>
              </template>
            </div>
          </div>
        </div>

        <div style="margin-top: 15px;background-color: white;padding: 10px"  class="shadow">
          <div class="title">常用入口</div>
          <div style="display: flex;flex-direction: row;justify-content: space-between;padding: 30px 20px 20px 20px;font-size: 14px">
            <div v-for="page in normalPages" :key="page.path + '-normal'" @click="$router.push(page.path)" class="node">{{page.name}}</div>
          </div>
        </div>
        <div style="margin-top: 15px;background-color: white;padding: 10px"  class="shadow">
          <div class="title">最近访问</div>
          <div style="display: flex;flex-direction: row;justify-content: space-between;padding: 30px 20px 20px 20px;font-size: 14px">
            <div v-for="page in latelyPages" :key="page.path + '-lately'" @click="$router.push(page.path)" class="node">{{page.name}}</div>
          </div>
        </div>

        <div style="display: flex;flex-direction: row;align-items: stretch;width: 100%;max-height: 220px;margin-top: 15px">
          <div style="background-color: white;padding: 10px;height: 250px;flex-grow: 1" class="shadow">
            <div class="title">License信息</div>
            <div style="display: flex;flex-direction: column;justify-content: flex-start;align-items: left;padding: 20px 20px 10px 20px;font-size: 14px">
              <div style="text-align: left">有效时间：{{licenseTime}}</div>
              <div style="text-align: left;margin-top: 10px">设备数量：{{licenseInfo.deviceNum}}</div>
              <div class="show-item" style="text-align: left;margin-top: 10px">配套服务：</div>
              <div v-if="licenseInfo.service" style="display: flex;flex-direction: row;flex-wrap: wrap;width: 430px">
                <div class="show-item-child" v-for="(item,index) in serviceList">{{item}}<i :class="[licenseInfo.service.indexOf(index) === -1 ? 'el-icon-error' : 'el-icon-success']" :style="{color: licenseInfo.service.indexOf(index) === -1 ? 'red' : 'green'}"></i></div>
              </div>
            </div>
          </div>
          <div style="background-color: white;padding: 10px;margin-left: 15px;width: 380px;height: 250px" class="shadow">
            <div class="title">服务器存储空间</div>
            <div id="diskSpace" style="width: 100%;height: 100%"></div>
          </div>
        </div>

      </div>
      <div style="display: flex;flex-direction: column;margin-left: 15px;">
        <div style="background-color: white;padding: 10px;height: 200px" class="shadow">
          <div class="title">常见问题：</div>
          <div style="display: flex;flex-direction: column;justify-content: flex-start;align-items: left;padding: 20px 20px 10px 20px;font-size: 14px">
            <el-button type="text" style="text-align: left" @click="$router.push('/home/help/faq')">1.如何安装应用</el-button>
            <el-button type="text" style="text-align: left;margin-left: 0" @click="$router.push('/home/help/faq')">2.如何配置网管</el-button>
          </div>
        </div>
        <div style="margin-top: 15px;background-color: white;padding: 10px;height: 200px"  class="shadow">
          <div class="title">主要功能介绍：</div>
          <div style="display: flex;flex-direction: column;justify-content: flex-start;align-items: left;padding: 20px 20px 10px 20px;font-size: 14px">
            <div style="text-align: left">
              <el-button type="text" @click="getFunList('分组管理')">分组管理</el-button>
            </div>
            <div style="text-align: left;margin-top: 10px">
              <el-button type="text" @click="getFunList('引擎升级')">引擎升级</el-button>
            </div>
          </div>
        </div>
        <div style="margin-top: 15px;background-color: white;padding: 10px;height: 200px"  class="shadow">
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
        serviceList: ['命令转发','IP代理池搭建','设备大师','虚拟定位','ADB调试','远程虚拟相机','多开远程控制窗口','电商多路直播','音视频导入云机','安全手机服务'],
        deviceNum: 0,
        badNum: 0,
        streamNum: 0,
        normalPages: [],
        latelyPages: [],
        licenseInfo: {
          seconds: 0,
          deviceNum: 0
        },
        devList: []
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
      getFunList(title) {
        this.$store.dispatch(this.$action.GO_FUN, title)
      },
      getDiskSpace() {
        this.$post(this.$uri.system.diskSpace).then(res => {
          if (res.success) {
            console.log('echarts')
            const myChart = this.$echarts.init(document.querySelector('#diskSpace'))

            let all = res.data.usedSpace/1024/1024/1024 + ''
            all = all.substring(0, all.indexOf('.') + 2)
            all = parseFloat(all)
            let last = res.data.freeSpace/1024/1024/1024 + ''
            last = last.substring(0, last.indexOf('.') + 2)
            last = parseFloat(last)

            myChart.setOption({
              /*title: {
                text: '某站点用户访问来源',
                subtext: '纯属虚构',
                left: 'center'
              },*/
              tooltip: {
                trigger: 'item',
                formatter: '{b} : {c}GB ({d}%)'
              },
              legend: {
                orient: 'vertical',
                left: 'right',
                data: ['已占用空间', '未占用空间']
              },
              series: [
                {
                  name: '访问来源',
                  type: 'pie',
                  radius: '55%',
                  center: ['50%', '55%'],
                  data: [
                    {value: all, name: '已占用空间'},
                    {value: last, name: '未占用空间'},
                  ],
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
                }
              ]
            })
          }
        })
      }
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

      that.$post(that.$uri.device.deviceList, {deviceStatus: 3}).then(res => {
        if (res.success) {
          that.devList = res.list
        }
      })

      this.getDiskSpace()
    }
  };
</script>

<style lang="less" scoped>
  #gz::-webkit-scrollbar {display:none}
.title {
  font-size: 14px;
  font-weight: 600;
  border-bottom: 1px solid #ddd;
  text-align: left;
  padding-bottom: 5px;
}
.device-info {
  width: 150px;
  height: 150px;
  background-color: #EFEFEF;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .device-info-title {
    margin-bottom: 20px;
    font-size: 12px;
  }
  .device-info-info {

  }
}
.node{
  width: 100px;
  text-align: left;
}
.node:hover {
  text-decoration: underline;
  cursor: pointer;
  color: #409eff;
}
  .shadow {
    box-shadow: 2px 2px 2px 2px rgba(0,0,0,0.2);
  }
  .show-item-child {
    font-size: 12px;
    width: 140px;
    padding: 3px 30px 3px 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    i {
      font-size: 16px;
    }
  }
</style>