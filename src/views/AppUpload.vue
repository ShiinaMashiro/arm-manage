<template>
  <div style="padding-bottom: 50px">
    <div class="info-view">
      <div class="info-view-title">上传apk文件</div>
      <div class="info-view-main">
        <div class="info-view-item" style="align-items: flex-start;padding-bottom: 50px">
          <el-upload
                  class="upload-demo"
                  ref="upload"
                  :headers="$store.getters.getHeaders"
                  :action="$uri.apk.apkAdd"
                  :data="addAppExtraInfo"
                  :file-list="addAppFileList"
                  accept="apk"
                  :limit="1"
                  :multiple="false"
                  :on-success="handleSuccess"
                  :before-upload="handleUpload"
                  :on-progress="handleProgress"
                  :auto-upload="true">
            <el-button slot="trigger" :disabled="addAppFileList.length > 0" size="small" type="primary">选取文件</el-button>
          </el-upload>
          <div slot="tip" class="el-upload__tip" style="padding-left: 10px"> (仅支持apk，上传的应用文件名不能包含空格、中文、括号、斜杠等特殊字符)</div>
        </div>
      </div>
    </div>

    <div class="info-view">
      <div class="info-view-title">功能开关</div>
      <div class="info-view-main">
        <span class="info-view-item" style="font-size: 12px">设置应用在推流时拥有的设备功能及退出后是否保留数据和应用有进程</span>
        <div class="info-view-item">
          <span class="flex-grew-1">是否授权：</span>
          <el-switch v-model="addAppExtraInfo.isRoot"
                     :active-value="1"
                     :inactive-value="0"></el-switch>
        </div>
        <div class="info-view-item">
          <span class="flex-grew-1">是否预启动：</span>
          <el-switch v-model="addAppExtraInfo.isPrestart"
                     :active-value="1"
                     :inactive-value="0"></el-switch>
        </div>
        <div class="info-view-item">
          <span class="flex-grew-1">是否上传定位信息：</span>
          <el-switch v-model="addAppExtraInfo.isUploadLocationInfo"
                     :active-value="1"
                     :inactive-value="0"></el-switch>
        </div>
        <div class="info-view-item">
          <span class="flex-grew-1">是否开启传感器：</span>
          <el-switch v-model="addAppExtraInfo.isSensor"
                     :active-value="1"
                     :inactive-value="0"></el-switch>
        </div>
        <div class="info-view-item">
          <span class="flex-grew-1">退出是否清理用户数据：</span>
          <el-switch v-model="addAppExtraInfo.isClean"
                     :active-value="1"
                     :inactive-value="0"></el-switch>
        </div>
        <div class="info-view-item">
          <span class="flex-grew-1">退出后是否重启设备：</span>
          <el-switch v-model="addAppExtraInfo.isReboot"
                     :active-value="1"
                     :inactive-value="0"></el-switch>
        </div>
        <div class="info-view-item">
          <span class="flex-grew-1">退出后是否关闭应用：</span>
          <el-select v-model="addAppExtraInfo.isStopApp" placeholder="请选择" size="mini" style="width: 150px">
            <el-option label="关闭应用" value="0"></el-option>
            <el-option label="不关闭并放入后台" value="1"></el-option>
            <el-option label="不关闭并留在前台" value="2"></el-option>
          </el-select>
        </div>
      </div>
    </div>

    <div class="info-view" v-if="uploadSuccess">
      <div class="info-view-title">关联分组</div>
      <div class="info-view-main">
        <div style="border: thin solid #ddd; min-width: 400px;width: 40%">
          <el-table ref="multipleTable" :data="list" size="mini" :header-cell-style="{backgroundColor: '#efefef'}" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="groupName" label="分组名称"></el-table-column>
            <el-table-column label="组内设备数量">
              <template slot-scope="scope">
                {{scope.row.deviceNum || 0}}
              </template>
            </el-table-column>
            <el-table-column prop="appNum" label="组内应用数量"></el-table-column>
          </el-table>
        </div>
        <div class="info-view-item-btn" style="margin-top: 20px">
          <el-button size="small" style="width: 80px" :disabled="(multipleSelection.length === 0) || mergeBtnDisabled" type="primary" @click="mergeGroup()">确定</el-button>
          <el-button size="small" style="width: 80px" type="danger" :disabled="mergeBtnDisabled" @click="$router.push('/home/app/list')">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  let that
  export default {
    name: "AppUpload",
    data() {
      return {
        addAppExtraInfo: {
          isRoot: "0",
          isPrestart: "0",
          isClean: "0",
          isReboot: "0",
          isSensor: "0",
          isUploadLocationInfo: "0",
          isStopApp: "0"
        },
        addAppFileList: [],
        uploadSuccess: false,
        uploadApp: null,
        list: [],
        multipleSelection: [],
        mergeBtnDisabled: false
      }
    },
    methods: {
      mergeGroup() {
        that.mergeBtnDisabled = true
        let ids = []
        that.multipleSelection.forEach(group => {
          ids.push(group.id)
        })
        that.$post(that.$uri.apk.apkGroupMerge, {
          appId: that.uploadApp.appId,
          groupIds: ids.join(',')
        }).then(res => {
          if (res.success) {
            that.$message.success("关联成功")
            that.$router.push('/home/app/list')
          } else {
            that.mergeBtnDisabled = false
            that.$message.error("关联失败")
          }
        })
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
        console.log(this.multipleSelection)
      },
      /* 获取分组列表 */
      getGroupList () {
        let that = this
        that.$post(that.$uri.group.list).then(res => {
          that.list = res.list
        })
      },
      /* 文件传输成功回调 */
      handleSuccess(response, file, fileList) {
        if (response.success) {
          this.uploadSuccess = true
          this.uploadApp = response.data
          this.$message.success("上传成功")
        } else {
          console.log(response)
          this.$message.error("上传失败")
          this.$refs.upload.clearFiles()
        }
      },
      handleProgress (event, file, fileList) {

      },
      handleUpload () {

      },
    },
    beforeCreate() {
      that = this
    },
    mounted() {
      this.getGroupList()
    }
  };
</script>

<style lang="less" scoped>
  .info-view {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 10px;
    border-bottom: 1px solid #E1E6EB;
    .info-view-title {
      text-align: left;
      font-size: 14px;
      font-weight: 600;
      padding: 5px 10px;
    }
    .info-view-main {
      padding: 10px 10px 10px 120px;
      font-size: 14px;
      display: flex;
      flex-direction: column;
      align-items: left;
      justify-content: flex-start;
      .info-view-item {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        padding: 2px 0;
        height: 30px;
      }
      .info-view-item-btn {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        padding: 5px 0;
      }
    }
  }
  .flex-grew-1 {
    width: 180px;
    text-align: left;
  }
</style>