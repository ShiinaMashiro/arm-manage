<template>
  <div class="dev-list">
    <div class="dev-list-search">
      <div class="search-btn">
        <el-button size="small" type="primary" @click="uploadFilePop()">新增文件</el-button>
      </div>
      <!--<div class="search-advanced">
        <div class="search-main">
          <div class="search-main-item">
            <span>分组名称:</span>
            <div class="item-input">
              <el-input v-model="searchInfo.groupNameLike" size="mini"></el-input>
            </div>
          </div>
        </div>
        <div class="search-btn">
          &lt;!&ndash;<el-button size="mini" @click="advancedShow = false">取消</el-button>&ndash;&gt;
          <el-button type="primary" size="mini" @click="getGroupList">搜索</el-button>
        </div>
      </div>-->
    </div>
    <div class="device-case-dev border-all">
      <el-table ref="multipleTable" size="mini" :data="info.list" :header-cell-style="{backgroundColor: '#efefef'}" tooltip-effect="dark" style="width: 100%" @row-click="checkRow">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="fileName" label="文件名"></el-table-column>
        <el-table-column prop="downPath" label="服务器保存相对路径"></el-table-column>
        <el-table-column prop="issuePath" label="设备分发路径"></el-table-column>
        <el-table-column prop="updateTime" label="上传时间"></el-table-column>
        <el-table-column label="操作" min-width="200px">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="issueFile(scope.row)">重新分发</el-button>
            <el-button type="text" size="small" @click="delFile(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="list-bottom">
        <div class="list-bottom-btn">
          <!--<el-button size="small" :disabled="multipleSelection.length === 0" plain @click="deleteBatch">删除</el-button>-->
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

      <!-- 修改分组弹窗 -->
      <Drawer title="重新分发" :visible.sync="changeGroupPopShow" @handClick="issueFileR">
      <!--<el-dialog title="重新分发" :append-to-body="true" :visible.sync="changeGroupPopShow" width="500px" top="15vh">-->
        <div>
          <el-form ref="form" :model="addGroupInfo" label-width="130px" label-position="left">
            <el-form-item size="mini" label="文件名">
              {{changeFile.fileName}}
            </el-form-item>
            <el-form-item size="mini" label="文件存放路径">
              {{changeFile.downPath}}
            </el-form-item>
            <el-form-item size="mini" label="设备分发路径">
              {{changeFile.issuePath}}
            </el-form-item>
            <el-form-item size="mini" label="上传时间">
              {{changeFile.updateTime}}
            </el-form-item>
            <el-form-item size="mini" label="选择分组">
              <el-tree
                      :props="props"
                      :load="loadNode"
                      lazy
                      show-checkbox
                      @check-change="handleCheckChange">
              </el-tree>
            </el-form-item>
            <!--<el-form-item>
              <el-button type="primary" @click="issueFileR">确定</el-button>
              <el-button @click="changeGroupPopShow = false">取消</el-button>
            </el-form-item>-->
          </el-form>
        </div>
      </Drawer>
    </div>

    <!-- 上传文件 -->
    <Drawer title="新增文件" :visible.sync="uploadFilePopShow" @handClick="submitUpload" :before-close="popClose">
      <div>
        <el-form ref="form" :model="uploadFileExtraInfo" label-width="130px" label-position="left">
          <el-form-item size="mini" label="文件存放路径">
            <el-input v-model="uploadFileExtraInfo.issuePath"></el-input>
          </el-form-item>
          <el-form-item>
            <el-upload
                    class="upload-demo"
                    ref="upload"
                    :headers="$store.getters.getHeaders"
                    :action="$uri.file.fileAdd"
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
            </el-upload>
          </el-form-item>
          <el-form-item size="mini" label="选择分组">
            <el-tree
                    :props="props"
                    :load="loadNode"
                    lazy
                    show-checkbox
                    @check-change="handleCheckChange">
            </el-tree>
          </el-form-item>
        </el-form>
      </div>
    </Drawer>
  </div>
</template>

<script>
  import Drawer from '@/components/Drawer'
  export default {
    name: "FileList",
    components: {
      Drawer
    },
    data () {
      return {
        props: {
          label: 'name',
          children: 'children',
          isLeaf: 'leaf'
        },
        groupSelectList: [],
        groupList: [],
        addFileList:[],
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
        fileList: [],
        addGroupInfo: {
          issuePath: '/sdcard',
          deviceIps: '',
          id: 1,
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
          issuePath: '/sdcard',
          deviceIps: '',
        },
        searchInfo: {
          groupNameLike: ""
        },
        uploadPopCloseTip: false,
        changeFile: {}
      }
    },
    computed: {
    },
    methods: {
      handleCheckChange(data, checked, indeterminate) {
        data.checked = checked
        let s = []
        this.groupList.forEach(g => {
          g.children.forEach(c => {
            if (g.checked || c.checked) {
              s.push(c.deviceIp)
            }
          })
        })
        this.uploadFileExtraInfo.deviceIps = s.join(",")
      },
      loadNode(node, resolve) {
        let that = this
        if (node.level === 0) {
          this.groupList.forEach(g => {
            if (!g.children) {
              g.name = g.groupName
              g.checked = false
              that.$post(that.$uri.device.deviceList, {groupId: g.id}).then(res => {
                if (res.success) {
                  let list = res.list
                  list.forEach(d => {
                    d.name = d.deviceIp
                    d.checked = false
                    d.leaf = true
                  })
                  g.children = list
                }
              })
            }
          })
          return resolve(this.groupList);
        }
        if (node.level = 1) return resolve(node.data.children);
        if (node.level > 1) return resolve([]);
      },
      delFile(row) {
        let that = this
        that.$post(that.$uri.file.fileDel, {ids: row.id}).then(res => {
          if (res.success) {
            that.$message.success("删除成功")
            that.getGroupList()
          }
        })
      },
      issueFile(row) {
        this.changeFile = row
        this.changeGroupPopShow = true
      },
      issueFileR() {
        let that = this
        that.$post(that.$uri.file.fileIssue, {ids: that.changeFile.id, deviceIps: that.uploadFileExtraInfo.deviceIps }).then(res => {
          if (res.success) {
            that.$message.success("分发成功")
            that.changeGroupPopShow = false
          }
        })
      },
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
        that.$post(that.$uri.file.fileList, {...that.page}).then(res => {
          that.info = res
          that.info.list.forEach(f => {
            f.updateTime = that.$util.formatDate(new Date(f.updateTime))
          })
        })
      },
      getMyGroupList() {
        let that = this
        that.$post(that.$uri.group.list, {}).then(res => {
          if(res.success) {
            that.groupList = res.list
          }
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
      uploadFilePop () {
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
        this.addGroupInfo.deviceIps = this.groupSelectList
        this.$refs.upload.submit();
      },
      handleSuccess(response, file, fileList) {
        if (response.success) {
          this.uploadFilePopShow = false
          this.uploadFilePopShow = false
          this.uploadPopCloseTip = false
          this.$refs.upload.clearFiles()
          this.$message.success("上传成功")
          this.getGroupList()
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
      this.getMyGroupList()
    }
  };
</script>

<style lang="less" scoped>
  .popup-flex {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
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