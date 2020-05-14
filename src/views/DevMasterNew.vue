<template>
  <div style="text-align: left">
    <div>选择分组：<el-select size="small" v-model="group" @change="handleSelectChange" placeholder="选择分组">
      <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
      </el-option>
    </el-select></div>
    <div style="display: flex;flex-direction: row;margin-top: 30px">
      <el-card class="box-card" style="width: 300px">
        <div slot="header" class="clearfix">
          <span>选择云机</span>
        </div>
        <el-checkbox-group v-model="checkDevList" style="display: flex;flex-direction: column;align-items: flex-start;min-height: 50vh;max-height: 50vh;overflow-y: auto">
          <template v-for="dev in devList">
            <el-checkbox :label="dev">{{dev.deviceIp}}</el-checkbox>
          </template>
        </el-checkbox-group>
      </el-card>
      <el-card class="box-card" style="width: 300px;margin-left: 5%">
        <div slot="header" class="clearfix">
          <span>选择应用</span>
        </div>
        <el-checkbox-group v-model="checkList" style="display: flex;flex-direction: column;align-items: flex-start;min-height: 50vh;max-height: 50vh;overflow-y: auto">
          <template v-for="app in appList">
            <el-checkbox :label="app">{{app.appName}}</el-checkbox>
          </template>
        </el-checkbox-group>
      </el-card>
    </div>
    <el-button type="primary" size="small" style="width: 100px;margin-top: 30px" @click="backupPop" v-if="$store.getters.checkChangeAuth()">备份</el-button>

    <Drawer title="备份确认" :visible.sync="backupPopShow" @handClick="backup">
      <div style="font-size: 12px" v-if="remark">
        <el-form ref="form" label-width="130px" label-position="left" style="display: flex;flex-direction: column;height: 100%">
          <div style="font-size: 16px;margin-bottom: 5px">备份应用</div>
          <div style="font-size: 14px;color: #606266">{{backupApps}}</div>
          <div style="font-size: 16px;margin-bottom: 5px;margin-top: 20px">备份云机</div>
          <el-form-item v-for="(dev, index) in checkDevList" :key="index" size="mini" :label="dev.deviceIp"><el-input size="mini" placeholder="请输入备注" v-model="remark[dev.deviceIp]"></el-input></el-form-item>

        </el-form>
      </div>
    </Drawer>
  </div>
</template>

<script>
  import Drawer from '@/components/Drawer'
  let that
  export default {
    name: "DevMasterNew",
    components: {
      Drawer
    },
    data() {
      return {
        options: [],
        group: null,
        devList: [],
        appList: [],
        props: {
          label: 'name',
          children: 'children',
          isLeaf: 'leaf'
        },
        backupInfo: {
          deviceIp: '',
          appIds: '',
          remark: ''
        },
        checkList: [],
        checkDevList: [],
        backupPopShow: false,
        remark: null,
        backupApps: ''
      }
    },
    watch: {
      backupPopShow(v) {
        if (!v) {
          this.remark = null
        }
      }
    },
    methods: {
      loadNode(node, resolve) {
        let that = this
        if (node.level === 0) {
          return resolve(this.groupList);
        }
      },
      getGroupList () {
        let that = this
        that.$post(that.$uri.group.list, {}).then(res => {
          let options = []
          res.list.forEach(v => {
            options.push({
              value: v.id,
              label: v.groupName
            })
          })
          this.options = options
          if (options.length) {
            that.group = options[0].value
            that.getDevList()
            that.getAppList()
          }
        })
      },
      handleSelectChange() {
        this.getDevList()
        this.getAppList()
      },
      getDevList() {
        let that = this
        that.backupInfo.deviceIp = ''
        that.$post(that.$uri.device.deviceList, {groupId: that.group}).then(res => {
          if (res.success) {
            that.devList = res.list
            if (res.list.length) {
              that.backupInfo.deviceIp = res.list[0].deviceIp
            }
          }
        })
      },
      getAppList() {
        let that = this
        that.checkList = []
        that.$post(that.$uri.apk.apkList, {groupId: that.group}).then(res => {
          if (res.success) {
            that.appList = res.list
          }
        })
      },
      backupPop() {
        if (!this.checkDevList.length || !this.checkList.length) {
          this.$message.warning('请选择云机或应用')
          return
        }
        let r = {}
        this.checkDevList.forEach(dev => {
          r[dev.deviceIp] = ''
        })
        this.remark = r

        let appNameList = []
        let appIdList = []
        this.checkList.forEach(app => {
          appNameList.push(app.appName)
          appIdList.push(app.appId)
        })
        this.backupApps = appNameList.join('，')
        this.backupInfo.appIds = appIdList.join(',')
        this.backupPopShow = true
      },
      backup() {
        let that = this
        this.checkDevList.forEach(dev => {
          let info = {}
          info.deviceIp = dev.deviceIp
          info.appIds = that.backupInfo.appIds
          info.remark = that.remark[dev.deviceIp]
          that.$post(that.$uri.devMaster.backup, info).then(res => {
            if (res.success) {

            }
          })
          that.$message.success("开始备份")
          that.$router.push('/home/app/devMaster')
        })
      }
    },
    beforeCreate() {
      that = this
    },
    mounted() {
      this.getGroupList()
    }
  };
</script>

<style lang="scss" scoped>

</style>