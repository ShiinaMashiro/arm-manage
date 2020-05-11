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
        <div style="display: flex;flex-direction: column;align-items: flex-start;max-height: 300px;overflow-y: scroll">
          <template v-for="dev in devList">
            <el-radio v-model="backupInfo.deviceIp" :label="dev.deviceIp">{{dev.deviceIp}}</el-radio>
          </template>
        </div>

      </el-card>
      <el-card class="box-card" style="width: 300px;margin-left: 20%">
        <div slot="header" class="clearfix">
          <span>选择应用</span>
        </div>
        <el-checkbox-group v-model="checkList" style="display: flex;flex-direction: column;align-items: flex-start;max-height: 300px;overflow-y: scroll">
          <template v-for="app in appList">
            <el-checkbox :label="app.appId">{{app.appName}}</el-checkbox>
          </template>
        </el-checkbox-group>
      </el-card>
    </div>
    <el-button type="primary" size="small" style="width: 100px;margin-top: 30px" @click="backup">备份</el-button>
  </div>
</template>

<script>
  let that
  export default {
    name: "DevMasterNew",
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
        checkList: []
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
      backup() {
        let that = this
        if (!that.backupInfo.deviceIp || !that.checkList.length) {
          that.$message.warning('请选择云机或应用')
          return
        }
        that.backupInfo.appIds = that.checkList.join(',')
        that.$post(that.$uri.devMaster.backup, that.backupInfo).then(res => {
          if (res.success) {
            that.$message.success("备份成功")
            that.$router.push('/home/app/devMaster')
          }
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