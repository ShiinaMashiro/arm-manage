<template>
  <div class="dev-list">
    <div class="dev-list-search">
      <div class="search-btn">
        <el-button size="small" type="primary" @click="$router.push('/home/app/upload')" v-if="$store.getters.checkChangeAuth()">新增/更新应用</el-button>
        <div @keyup.enter="getAppList">
          <el-input size="small" placeholder="输入应用名称/apk名称/APPID 搜索" v-model="searchInfo.appNameLike" style="width: 320px">
            <el-button slot="append" icon="el-icon-search" @click="getAppList"></el-button>
          </el-input>
        </div>
        <!--<el-button type="text" size="small" @click="advancedShow = !advancedShow">高级筛选</el-button>-->
      </div>
      <div class="search-advanced" v-show="advancedShow">
        <div class="search-main">
          <div class="search-main-item">
            <span>应用名称:</span>
            <div class="item-input">
              <el-input v-model="searchInfo.appNameLike" size="mini"></el-input>
            </div>
          </div>
          <div class="search-main-item">
            <span>APK名称:</span>
            <div class="item-input">
              <el-input v-model="searchInfo.apkNameLike" size="mini"></el-input>
            </div>
          </div>
          <div class="search-main-item">
            <span>APPID:</span>
            <div class="item-input">
              <el-input v-model="searchInfo.appId" size="mini"></el-input>
            </div>
          </div>
        </div>
        <div class="search-btn">
          <el-button size="mini" @click="advancedShow = false">取消</el-button>
          <el-button type="primary" size="mini" @click="getAppList">搜索</el-button>
        </div>
      </div>
    </div>
    <div class="device-case-dev border-all">
      <el-table ref="multipleTable" :data="info.list" :header-cell-style="{backgroundColor: '#efefef'}" size="mini" @row-click="goDetail" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column prop="appName" label="应用名称"></el-table-column>
        <el-table-column prop="packageName" label="包名"></el-table-column>
        <el-table-column prop="versionName" label="版本"></el-table-column>
        <el-table-column prop="appId" label="APPID"></el-table-column>
        <el-table-column min-width="120px" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.stop="goDetail(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click.stop="goGroup(scope.row)">分组</el-button>
            <el-button type="text" size="small" v-if="$store.getters.checkChangeAuth()" @click.stop="apkOffBatch(scope.row)">下架</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="list-bottom">
        <div class="list-bottom-btn">
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
      <!-- 上传应用 -->
      <el-dialog title="新增应用" ref="uploadPop" :append-to-body="true"
                 :close-on-click-modal="false" :show-close="false" top="15vh"
                 :visible.sync="addAppPopShow" width="500px">
        <div>
          <el-form ref="form" :model="addAppExtraInfo" label-width="180px" label-position="left">
            <el-form-item size="mini" label="是否授权">
              <el-switch v-model="addAppExtraInfo.isRoot"
                         active-value="1"
                         inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item size="mini" label="是否预启动">
              <el-switch v-model="addAppExtraInfo.isPrestart"
                         active-value="1"
                         inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item size="mini" label="是否上传定位信息">
              <el-switch v-model="addAppExtraInfo.isUploadLocationInfo"
                         active-value="1"
                         inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item size="mini" label="是否开启传感器">
              <el-switch v-model="addAppExtraInfo.isSensor"
                         active-value="1"
                         inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item size="mini" label="退出是否清理用户数据">
              <el-switch v-model="addAppExtraInfo.isClean"
                         active-value="1"
                         inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item size="mini" label="退出后是否重启设备">
              <el-switch v-model="addAppExtraInfo.isReboot"
                         active-value="1"
                         inactive-value="0"></el-switch>
            </el-form-item>
            <el-form-item size="mini" label="退出后是否关闭应用">
              <el-select v-model="addAppExtraInfo.isStopApp" placeholder="请选择" size="small">
                <el-option label="关闭应用" value="0"></el-option>
                <el-option label="不关闭并放入后台" value="1"></el-option>
                <el-option label="不关闭并留在前台" value="2"></el-option>
              </el-select>
            </el-form-item>

            <div class="popup-flex">
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
                      :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <div slot="tip" class="el-upload__tip">只能上传apk文件</div>
              </el-upload>
              <div style="margin-top: 20px">
                <el-button type="primary" :disabled="addAppPopCloseTip" @click="submitUpload">确定</el-button>
                <el-button @click="tipFileUpload">取消</el-button>
              </div>
            </div>
          </el-form>
        </div>
      </el-dialog>
    </div>
  </div>

</template>

<script>
  export default {
    name: "AppList",
    data () {
      return {
        info: {
          success: false,
          list: [],
          total: 0
        },
        page: { // 分页参数
          startPage: 1,
          limit: 20
        },
        multipleSelection: [], // 选中的对象列表
        addAppPopShow: false, // 显示添加应用弹窗
        addAppPopCloseTip: false,
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
        advancedShow: false,
        searchInfo: {
          appNameLike: "",
          apkNameLike: "",
          appId: "",
          apkStatus: 1
        }
      }
    },
    methods: {
      /* 表单击行事件 */
      checkRow(r, c ,e) {
        this.$refs.multipleTable.toggleRowSelection(r)
      },
      /* 获取应用列表 */
      getAppList () {
        let that = this
        that.searchInfo.apkNameLike = that.searchInfo.appNameLike
        that.searchInfo.appid = that.searchInfo.appNameLike
        that.$post(that.$uri.apk.apkList, {...that.page, apkStatus: 1, queryParam: that.searchInfo.appNameLike}).then(res => {
          that.info = res
        })
      },
      /* 当前页改变 */
      currentChangeHandle (val) {
        this.page.startPage = val
        this.getAppList()
      },
      /* 每页条数改变 */
      sizeChangeHandle (val) {
        this.page.limit = val
        this.getAppList()
      },
      /* 获取选中的数据 */
      handleSelectionChange (val) {
        this.multipleSelection = val
        console.log(this.multipleSelection)
      },
      /* 下架应用 */
      async apkOff (id) {
        let that = this
        await that.$post(that.$uri.apk.apkOff, {id})
      },
      /* 批量下架应用 */
      apkOffBatch (row) {
        let that = this
        this.$confirm('下架后安装应用的云机会对应用进行卸载， 是否继续?', '提示', {
          confirmButtonText: '确定',
          confirmButtonClass: 'confirm-btn-yellow',
          iconClass: 'el-icon-c-yellow',
          cancelButtonText: '取消'
        }).then(() => {
          that.$post(that.$uri.apk.apkOff, {ids: [row.id]}).then(res => {
            this.$message.success("下架完成")
            this.getAppList()
          })
        }).catch(() => {});
      },
      /* 关闭弹窗并暂停文件传输 */
      closeUploadPop () {
        this.addAppPopShow = false
        this.addAppPopCloseTip = false
        this.$refs.upload.clearFiles()
      },
      /* 上传文件 */
      submitUpload() {
        this.$refs.upload.submit()
      },
      /* 文件传输成功回调 */
      handleSuccess(response, file, fileList) {
        if (response.success) {
          this.addAppPopShow = false
          this.$message.success("上传成功")
          this.closeUploadPop()
          this.getAppList()
        } else {
          console.log(response)
          this.$message.error("上传失败")
          this.$refs.upload.clearFiles()
        }
      },
      handleProgress (event, file, fileList) {
        if (!this.addAppPopShow) {
          this.$refs.upload.abort(file)
          this.$refs.upload.clearFiles()
        }
      },
      handleUpload () {
        this.addAppPopCloseTip = true
      },
      /* 上传文件中关闭弹窗提醒 */
      tipFileUpload () {
        if (this.addAppPopCloseTip) {
          this.$confirm("文件正在上传中，确定关闭弹窗？", "提示", {
            confirmButtonText: '确定',
            confirmButtonClass: 'confirm-btn-blue',
            iconClass: 'el-icon-c-blue',
            cancelButtonText: '取消'
          }).then( () => {
            this.closeUploadPop()
          }).catch( () => {})
        } else {
          this.closeUploadPop()
        }
      },
      /* 前往详情页 */
      goDetail (info) {
        this.$store.commit(this.$mutation.APP_DETAIL, info)
        this.$router.push("/home/app/detail")
      },
      /* 前往分组页 */
      goGroup (info) {
        this.$store.commit(this.$mutation.APP_DETAIL, info)
        this.$router.push("/home/app/group")
      }
    },
    filters: {
    },
    mounted () {
      this.getAppList()
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