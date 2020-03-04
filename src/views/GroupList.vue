<template>
  <div class="dev-list">
    <div class="dev-list-search">
      <div class="search-btn">
        <el-button size="small" type="primary" @click="addGroupPopShow = true" v-if="$store.getters.checkChangeAuth()">新增分组</el-button>
      </div>
      <div class="search-advanced">
        <div class="search-main">
          <div class="search-main-item">
            <span>分组名称:</span>
            <div class="item-input">
              <el-input v-model="searchInfo.groupNameLike" size="mini"></el-input>
            </div>
          </div>
        </div>
        <div class="search-btn">
          <!--<el-button size="mini" @click="advancedShow = false">取消</el-button>-->
          <el-button type="primary" size="mini" @click="getGroupList">搜索</el-button>
        </div>
      </div>
    </div>
    <div class="device-case-dev border-all">
      <el-table ref="multipleTable" :data="info.list" tooltip-effect="dark" style="width: 100%" @row-click="checkRow" @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="groupName" label="分组名称"></el-table-column>
        <el-table-column label="组内设备数量">
          <template slot-scope="scope">
            {{scope.row.deviceNum || 0}}
          </template>
        </el-table-column>
        <el-table-column prop="appNum" label="组内应用数量"></el-table-column>
        <el-table-column label="操作" min-width="200px">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="manage(scope.row)">添加设备</el-button>
            <el-button type="text" size="small" @click="goGroupDev(scope.row)">组内设备</el-button>
            <el-button type="text" size="small" @click="goAppManage(scope.row)">应用管理</el-button>
            <el-button type="text" size="small" @click="confirmChangeGroupName(scope.row)" v-if="$store.getters.checkChangeAuth()">编辑</el-button>
            <el-button type="text" size="small" @click="uploadFilePop(scope.row.id)" v-if="$store.getters.checkChangeAuth()">上传文件</el-button>
            <el-button type="text" size="small" @click="changeGroupAuthPop(scope.row)" v-if="$store.getters.checkChangeAuth()">权限控制</el-button>
            <el-button type="text" size="small" @click="goLog(scope.row)" v-if="$store.getters.checkChangeAuth()">日志监控</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="list-bottom">
        <div class="list-bottom-btn">
          <el-button size="small" :disabled="multipleSelection.length === 0" plain @click="deleteBatch">删除</el-button>
        </div>
        <el-pagination
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"
                :current-page="page.startPage"
                :page-sizes="[20, 50, 100]"
                :page-size="page.limit"
                layout="total, sizes, prev, pager, next"
                :total="info.total">
        </el-pagination>
      </div>
      <!-- 新增分组弹窗 -->
      <el-dialog title="新增分组" :append-to-body="true" :visible.sync="addGroupPopShow" width="500px" top="15vh">
        <div>
          <el-form ref="form" :model="addGroupInfo" label-width="130px" label-position="left">
            <el-form-item label="分组名称">
              <el-input v-model="addGroupInfo.groupName"></el-input>
            </el-form-item>
            <!--<el-form-item label="设备自主安装应用">
              <div class="test">
                <el-switch
                        v-model="addGroupInfo.isAppAllow"
                        active-value="1"
                        inactive-value="0">
                </el-switch>
                <el-tooltip effect="dark" content="允许用户在推流设备桌面时，通过apk包的形式安装应用并且不在同步时对应用进行删除。" placement="top-start">
                  <i class="el-icon-question" style="margin-left: 5px" ></i>
                </el-tooltip>
              </div>
            </el-form-item>-->
            <el-form-item label="推流权限控制">
              <div class="test">
                <el-switch
                        v-model="addGroupAuthSelectShow"
                        active-value="1"
                        inactive-value="0">
                </el-switch>
              </div>
            </el-form-item>
            <div style="padding: 0 0 0 15px" v-show="addGroupAuthSelectShow == '1'">
              <el-form-item label="安装应用">
                <div class="test">
                  <el-switch
                          v-model="addGroupInfo.isInstallApp"
                          active-value="1"
                          inactive-value="0">
                  </el-switch>
                  <el-tooltip effect="dark" content="设备推流时是否允许安装应用不被卸载，开启后用户可在推流时安装的应用可在结束后保留，关闭时推流时安装的应用会被立即卸载。" placement="top-start">
                    <i class="el-icon-question" style="margin-left: 5px" ></i>
                  </el-tooltip>
                </div>
              </el-form-item>
              <el-form-item label="卸载应用">
                <div class="test">
                  <el-switch
                          v-model="addGroupInfo.isUninstallApp"
                          active-value="1"
                          inactive-value="0">
                  </el-switch>
                  <el-tooltip effect="dark" content="设备推流时是否允许用户卸载应用，关闭后用户无法在推流的时候进行卸载操作，开启时用户可以正常进行卸载操作。" placement="top-start">
                    <i class="el-icon-question" style="margin-left: 5px" ></i>
                  </el-tooltip>
                </div>
              </el-form-item>
              <el-form-item label="返回桌面">
                <div class="test">
                  <el-switch
                          v-model="addGroupInfo.isHome"
                          active-value="1"
                          inactive-value="0">
                  </el-switch>
                  <el-tooltip effect="dark" content="设备推流时是否允许返回到桌面，关闭后用户推流时返回桌面会立即结束推流，并且无法以APPID为0的形式进行推流。" placement="top-start">
                    <i class="el-icon-question" style="margin-left: 5px" ></i>
                  </el-tooltip>
                </div>
              </el-form-item>

            </div>
            <el-form-item>
              <el-button type="primary" @click="addGroup">确定</el-button>
              <el-button @click="addGroupPopShow = false">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
      <!-- 修改分组弹窗 -->
      <el-dialog title="修改分组名称" :append-to-body="true" :visible.sync="changeGroupPopShow" width="500px" top="15vh">
        <div>
          <el-form ref="form" :model="changeGroupInfo" label-width="130px" label-position="left">
            <el-form-item label="分组名称">
              <el-input v-model="changeGroupInfo.groupName"></el-input>
            </el-form-item>
            <!--<el-form-item label="设备自主安装应用">
              <div class="test">
                <el-switch
                        v-model="changeGroupInfo.isAppAllow"
                        active-value="1"
                        inactive-value="0">
                </el-switch>
                <el-tooltip effect="dark" content="允许用户在推流设备桌面时，通过apk包的形式安装应用并且不在同步时对应用进行删除。" placement="top-start">
                  <i class="el-icon-question" style="margin-left: 5px" ></i>
                </el-tooltip>
              </div>
            </el-form-item>-->
            <el-form-item>
              <el-button type="primary" @click="changeGroupName">确定</el-button>
              <el-button @click="changeGroupPopShow = false">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
      <!-- 权限控制弹窗 -->
      <el-dialog title="权限控制" :append-to-body="true" :visible.sync="changeGroupAuthPopShow" width="500px" top="15vh">
        <div>
          <el-form ref="form" :model="changeGroupInfo" label-width="130px" label-position="left">
            <el-form-item label="安装应用">
              <div class="test">
                <el-switch
                        v-model="changeGroupInfo.isInstallApp"
                        active-value="1"
                        inactive-value="0">
                </el-switch>
                <el-tooltip effect="dark" content="设备推流时是否允许安装应用不被卸载，开启后用户可在推流时安装的应用可在结束后保留，关闭时推流时安装的应用会被立即卸载。" placement="top-start">
                  <i class="el-icon-question" style="margin-left: 5px" ></i>
                </el-tooltip>
              </div>
            </el-form-item>
            <el-form-item label="卸载应用">
              <div class="test">
                <el-switch
                        v-model="changeGroupInfo.isUninstallApp"
                        active-value="1"
                        inactive-value="0">
                </el-switch>
                <el-tooltip effect="dark" content="设备推流时是否允许用户卸载应用，开启后用户无法在推流的时候进行卸载操作，关闭时用户可以正常进行卸载操作。" placement="top-start">
                  <i class="el-icon-question" style="margin-left: 5px" ></i>
                </el-tooltip>
              </div>
            </el-form-item>
            <el-form-item label="返回桌面">
              <div class="test">
                <el-switch
                        v-model="changeGroupInfo.isHome"
                        active-value="1"
                        inactive-value="0">
                </el-switch>
                <el-tooltip effect="dark" content="设备推流时是否允许返回到桌面，关闭后用户推流时返回桌面会立即结束推流，并且无法以APPID为0的形式进行推流。" placement="top-start">
                  <i class="el-icon-question" style="margin-left: 5px" ></i>
                </el-tooltip>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="changeGroupAuth">确定</el-button>
              <el-button @click="changeGroupAuthPopShow = false">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </div>

    <!-- 上传文件 -->
    <el-dialog title="上传文件" :append-to-body="true"
               :close-on-click-modal="false" :show-close="false" top="15vh"
               :visible.sync="uploadFilePopShow" width="500px">
      <div>
        <el-form ref="form" :model="uploadFileExtraInfo" label-width="130px" label-position="left">
          <el-form-item>
            <el-upload
                    class="upload-demo"
                    ref="upload"
                    :headers="$store.getters.getHeaders"
                    :action="$uri.group.uploadConfigureFile"
                    :data="uploadFileExtraInfo"
                    accept="apk"
                    :limit="1"
                    :multiple="false"
                    :on-success="handleSuccess"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-upload="handleUpload"
                    :on-progress="handleProgress"
                    :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <!--<div slot="tip" class="el-upload__tip">只能上传apk文件</div>-->
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :disabled="uploadPopCloseTip" @click="submitUpload">确定</el-button>
            <el-button @click="popClose">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "GroupList",
  data () {
    return {
      info: {
        success: false,
        list: [],
        total: 0
      },
      multipleSelection: [],
      page: { // 分页参数
        startPage: 1,
        limit: 20
      },
      addGroupPopShow: false, // 显示添加分组弹窗
      addGroupAuthSelectShow: false,
      addGroupInfo: {
        groupName: "",
        isAppAllow: "0",
        isInstallApp: "1",
        isUninstallApp: "1",
        isHome: "1"
      },
      delGroupPopShow: false, // 显示删除分组弹窗
      changeGroupPopShow: false, // 显示修改分组名称弹窗
      changeGroupInfo: {
        id: 0,
        groupName: '',
        isAppAllow: '',
        isInstallApp: "",
        isUninstallApp: "",
        isHome: ""
      },
      changeGroupAuthPopShow: false, // 显示修改分组名称弹窗
      uploadFilePopShow: false,
      uploadFileExtraInfo: {
        id: 0
      },
      searchInfo: {
        groupNameLike: ""
      },
      uploadPopCloseTip: false
    }
  },
  computed: {
  },
  methods: {
    /* 表单击行事件 */
    checkRow(r, c ,e) {
      this.$refs.multipleTable.toggleRowSelection(r)
    },
    /* 获取选中的数据 */
    handleSelectionChange (val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    /* 获取分组列表 */
    getGroupList () {
      let that = this
      that.$post(that.$uri.group.list, {...that.page, ...that.searchInfo}).then(res => {
        that.info = res
      })
    },
    /* 当前页改变 */
    currentChangeHandle (val) {
      this.page.startPage = val
      this.getGroupList()
    },
    /* 每页条数改变 */
    sizeChangeHandle (val) {
      this.page.limit = val
      this.getGroupList()
    },
    /* 新增分组 */
    addGroup () {
      let that = this
      that.$post(that.$uri.group.add, that.addGroupInfo).then(res => {
        that.$message.success("新建分组成功")
        that.addGroupPopShow = false
        that.getGroupList()
      })
    },
    /* 删除分组确认 */
    confirmDelGroup (row) {
      this.$confirm("确认删除分组-" + row.groupName + "?", "提示", {
        confirmButtonText: '确定',
        confirmButtonClass: 'confirm-btn-blue',
        iconClass: 'el-icon-c-blue',
        cancelButtonText: '取消'
      }).then( () => {
        this.delGroup(row.id)
      }).catch( () => {})
    },
    /* 删除分组 */
    delGroup (id) {
      let that = this
      that.$post(that.$uri.group.delete, {id}).then(res => {
        that.$message.success("删除分组成功")
        that.getGroupList()
      })
    },
    /* 确认修改分组名称 */
    confirmChangeGroupName (row) {
      this.changeGroupInfo.id = row.id
      this.changeGroupInfo.groupName = row.groupName
      this.changeGroupInfo.isAppAllow = row.isAppAllow
      this.changeGroupInfo.isInstallApp = row.isInstallApp
      this.changeGroupInfo.isUninstallApp = row.isUninstallApp
      this.changeGroupInfo.isHome = row.isHome
      this.changeGroupPopShow = true
    },
    /* 修改分组名 */
    changeGroupName () {
      let that = this
      that.$post(that.$uri.group.infoSave, that.changeGroupInfo).then(res => {
        that.$message.success("修改成功")
        that.changeGroupPopShow = false
        that.getGroupList()
      })
    },
    /* 权限控制弹窗 */
    changeGroupAuthPop (row) {
      /*this.changeGroupInfo.id = row.id
      this.changeGroupInfo.groupName = row.groupName
      this.changeGroupInfo.isAppAllow = row.isAppAllow + ''
      this.changeGroupInfo.isInstallApp = row.isInstallApp + ''
      this.changeGroupInfo.isUninstallApp = row.isUninstallApp + ''
      this.changeGroupInfo.isHome = row.isHome + ''
      this.changeGroupAuthPopShow = true*/
      this.$store.commit(this.$mutation.GROUP_DETAIL, row)
      this.$router.push("/home/group/auth")
    },
    /* 权限控制 */
    changeGroupAuth () {
      let that = this
      that.$post(that.$uri.group.infoSave, that.changeGroupInfo).then(res => {
        that.$message.success("修改成功")
        that.changeGroupAuthPopShow = false
        that.getGroupList()
      })
    },
    goLog(row) {
      this.$store.commit(this.$mutation.LOG_GROUP_ID, row.groupName)
      this.$router.push("/home/log/group")
    },
    /* 上传文件弹窗 */
    uploadFilePop (id) {
      this.uploadFileExtraInfo.id = id
      this.uploadFilePopShow = true
    },
    popClose () {
      if (this.uploadPopCloseTip) {
        this.$confirm("文件正在上传中，确定关闭弹窗？", "提示", {
          confirmButtonText: '确定',
          confirmButtonClass: 'confirm-btn-blue',
          iconClass: 'el-icon-c-blue',
          cancelButtonText: '取消'
        }).then( () => {
          this.uploadFilePopShow = false
          this.uploadPopCloseTip = false
          this.$refs.upload.clearFiles()
        }).catch( () => {})
      } else {
        this.uploadFilePopShow = false
        this.uploadPopCloseTip = false
        this.$refs.upload.clearFiles()
      }
    },
    /* 上传文件 */
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleSuccess(response, file, fileList) {
      if (response.success) {
        this.uploadFilePopShow = false
        this.uploadFilePopShow = false
        this.uploadPopCloseTip = false
        this.$refs.upload.clearFiles()
        this.$message.success("上传成功")
      } else {
        console.log(response)
        this.$message.error(response.message)
        this.$refs.upload.clearFiles()
      }
    },
    handleUpload () {
      this.uploadPopCloseTip = true
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleProgress (event, file, fileList) {
      if (!this.uploadFilePopShow) {
        this.$refs.upload.abort(file)
        this.$refs.upload.clearFiles()
      }
    },
    /* 删除设备池 */
    async asyncDelete (id) {
      let that = this
      await that.$post(that.$uri.group.delete, {id})
    },
    /* 批量删除设备池 */
    deleteBatch () {
      this.$confirm("删除分组后会导致分组内的设备恢复出厂设置，清除数据，是否继续？", "提示", {
        confirmButtonText: '确定',
        confirmButtonClass: 'confirm-btn-red',
        iconClass: 'el-icon-c-red',
        cancelButtonText: '取消'
      }).then( () => {
        this.multipleSelection.forEach(v => {
          this.asyncDelete(v.id)
        })
        this.$message.success("删除完成")
        let that = this
        setTimeout(() => {that.getGroupList()}, 1000)
      }).catch( () => {})
    },
    /* 管理 */
    manage (info) {
      this.$store.commit(this.$mutation.GROUP_DETAIL, info)
      this.$router.push("/home/group/dev/manage")
    },
    /* 跳转组内设备 */
    goGroupDev (info) {
      this.$store.commit(this.$mutation.GROUP_DETAIL, info)
      this.$router.push("/home/group/dev")
    },
    /* 跳转应用管理 */
    goAppManage (info) {
      this.$store.commit(this.$mutation.GROUP_DETAIL, info)
      this.$router.push("/home/group/app/manage")
    }
  },
  filters: {
  },
  mounted () {
    this.getGroupList()
  }
};
</script>

<style lang="less" scoped>
  .dev-list {
    .dev-list-search {
      width: 100%;
      display: flex;
      flex-direction: column;
      .search-btn {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      .search-advanced {
        display: flex;
        flex-direction: column;
        .search-main {
          margin-top: 10px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          flex-wrap: wrap;
          .search-main-item {
            width: 24%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            /*flex-grow: 1;*/
            padding: 5px 10px;
            span {
              font-size: 12px;
            }
            .item-input {
              width: 180px;
            }
          }
        }
        .search-btn {
          padding: 0 10px;
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          align-items: center;
        }
      }
    }
    .device-case-dev {
      margin-top: 10px;
      .list-bottom {
        padding: 10px 8px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .list-bottom-btn {
          display: flex;
          flex-direction: row;
        }
      }
    }
  }
</style>