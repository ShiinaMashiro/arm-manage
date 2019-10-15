<template>
  <div class="detail-table">
    <div class="detail-table-header">
      <span class="detail-table-header-name">{{$route.name}}</span>
      <!--<el-dropdown @command="handleCommand"  v-if="$store.getters.checkChangeAuth()">
        <span class="detail-table-setting">
          设置<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="change">修改设置</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>-->
    </div>
    <div class="detail-table-body">
      <template v-for="(item, index) in list">
        <DetailTableItem class="detail-table-body-item" :key="index" :name="item.name" :param="item.value"></DetailTableItem>
      </template>
    </div>
    <!-- 网络设置 -->
    <el-dialog title="修改设置" :append-to-body="true" :visible.sync="changePopShow" width="500px">
      <div>
        <el-form ref="form" :model="appInfo" label-width="100px">
          <el-form-item label="类名">
            <el-input v-model="appInfo.activity"></el-input>
          </el-form-item>
          <el-form-item label="推流最大码率">
            <div class="test">
              <el-input v-model="appInfo.encodeRateMax">
                <div slot="suffix">kb/s</div>
              </el-input>
              <el-tooltip effect="dark" content="推流最大码率主要用于调节推流清晰度，根据网络实时进行适配，保证良好的推流体验，设置建议值1000-6000" placement="top-start">
                <i class="el-icon-question" style="margin-left: 5px" ></i>
              </el-tooltip>
            </div>
          </el-form-item>
          <el-form-item label="是否授权">
            <el-switch v-model="appInfo.isRoot"
                       active-value="1"
                       inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="是否预启动">
            <el-switch v-model="appInfo.isPrestart"
                       active-value="1"
                       inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveAppInfo">确定</el-button>
            <el-button @click="changePopShow = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <div class="detail-setting">
      <el-button type="info" plain size="small" @click="changePop">修改设置</el-button>
    </div>
  </div>
</template>

<script>
  import DetailTableItem from "@/components/DetailTableItem"
  export default {
    name: "AppListDetail",
    components: {
      DetailTableItem
    },
    data () {
      return {
        id: -1,
        changePopShow: false,
        appInfo: {},
        list: []
      }
    },
    methods: {
      /* 修改设备池信息 */
      saveAppInfo () {
        let that = this
        that.$post(that.$uri.apk.apkInfoSave, that.appInfo).then(res => {
          that.changePopShow = false
          that.$message.success("修改成功")
          // 刷新数据
          that.getDetailList()
        })
      },
      /* 修改弹窗 */
      changePop () {
        this.changePopShow = true
      },
      /* 下拉菜单事件 */
      handleCommand (command) {
        this.changePop()
      },
      /* 获取应用详细信息并组装 */
      getDetailList () {
        let that = this
        that.$post(that.$uri.apk.apkInfo, {id: that.id}).then(res => {
          let v = res.data
          v.apkStatus += ""
          v.versionCode += ""
          v.appId += ""
          v.isRoot += ""
          v.isPrestart += ""
          that.appInfo = v
          let list = []
          list.push({
            name: "应用名称",
            value: v.appName
          })
          list.push({
            name: "文件名",
            value: v.apkName
          })
          list.push({
            name: "版本",
            value: v.versionName
          })
          list.push({
            name: "版本号",
            value: v.versionCode
          })
          list.push({
            name: "包名",
            value: v.packageName
          })
          list.push({
            name: "应用状态",
            value: v.apkStatus === "1" ? "正常" : "下架"
          })
          list.push({
            name: "APPID",
            value: v.appId
          })
          list.push({
            name: "类名",
            value: v.activity
          })
          list.push({
            name: "是否授权",
            value: v.isRoot === "1" ? "是" : "否"
          })
          list.push({
            name: "是否预启动",
            value: v.isPrestart === "1" ? "是" : "否"
          })
          if (v.encodeRateMax > 0) {
            list.push({
              name: "推流最大码率",
              value: v.encodeRateMax + ""
            })
            that.list = list
          } else {
            that.$post(that.$uri.system.paramGet, {paramName: 'encodeRateMax'}).then(res => {
              if (res.success) {
                v.encodeRateMax = res.data.paramValue
              }
              list.push({
                name: "推流最大码率",
                value: v.encodeRateMax + ""
              })
              that.list = list
            })
          }
        })
      }
    },
    created () {
      this.id = this.$store.state.appInfo.id
      this.getDetailList()
    }
  };
</script>

<style lang="less" scoped>
  .detail-table {
    .detail-table-header {
      padding-left: 12px;
      background: #f5f6fa;
      border-bottom: 1px solid #ebeef5;
      border-left: 4px solid #6d7781;
      cursor: pointer;
      height: 38px;
      -webkit-transition: border-bottom-color 0.3s;
      transition: border-bottom-color 0.3s;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .detail-table-header-name {
        line-height: 38px;
        color: #303133;
        font-size: 13px;
        font-weight: 500;
        outline: 0;
        text-align: left;
      }
      .detail-table-setting {
        font-size: 12px;
        color: #606266;
        margin-right: 10px;
      }
    }
    .detail-table-body {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      .detail-table-body-item {
        flex-grow: 1;
        width: 40%;
      }
    }
  }
  .detail-setting {
    margin-top: 20px;
    text-align: left;
  }
  .test {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
  }
</style>