<template>
  <div class="dev-list">
    <div class="dev-list-search">
      <div class="search-btn">
        <el-button type="text" size="small" @click="advancedShow = !advancedShow">高级搜索</el-button>
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
      <el-table ref="multipleTable" :data="info.list" @row-click="checkRow" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="appName" label="应用名称"></el-table-column>
        <el-table-column prop="packageName" label="包名"></el-table-column>
        <el-table-column prop="versionCode" label="版本号"></el-table-column>
        <el-table-column prop="appId" label="APPID"></el-table-column>
        <el-table-column min-width="120px" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="apkUp(scope.row.id)" v-if="$store.getters.checkChangeAuth()">恢复</el-button>
            <el-button type="text" size="small" @click="apkDel(scope.row.id)"  v-if="$store.getters.checkChangeAuth()">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="list-bottom">
        <div class="list-bottom-btn">
          <el-button size="small" plain :disabled="multipleSelection.length === 0" @click="apkUpBatch"  v-if="$store.getters.checkChangeAuth()">恢复</el-button>
          <el-button size="small" plain :disabled="multipleSelection.length === 0" @click="apkDelBatch"  v-if="$store.getters.checkChangeAuth()">删除</el-button>
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
    </div>
  </div>

</template>

<script>
  export default {
    name: "AppRecover",
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
        advancedShow: false,
        searchInfo: {
          appNameLike: "",
          apkNameLike: "",
          appId: "",
          apkStatus: 2
        }
      }
    },
    computed: {
    },
    methods: {
      /* 表单击行事件 */
      checkRow(r, c ,e) {
        this.$refs.multipleTable.toggleRowSelection(r)
      },
      /* 获取应用列表 */
      getAppList () {
        let that = this
        that.$post(that.$uri.apk.apkList, {...that.page, ...that.searchInfo}).then(res => {
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
      /* 上架应用 */
      async apkUp (ids) {
        let that = this
        await that.$post(that.$uri.apk.apkUp, {ids}).then(res => {
          that.$message.success("恢复成功")
          that.getAppList()
        })
      },
      /* 上架应用 */
      async apkUp2Batch (id) {
        let that = this
        await that.$post(that.$uri.apk.apkUp, {id})
      },
      /* 批量上架应用 */
      apkUpBatch () {
        let ids = []
        this.multipleSelection.forEach(v => {
          ids.push(v.id)
        })
        let that = this
        that.$post(that.$uri.apk.apkUp, {ids}).then(res => {
          this.$message.success("恢复完成")
          this.getAppList()
        })
      },
      /* 删除应用 */
      apkDel (ids) {
        this.$confirm("确定删除应用？", "提示", {
          type: "warning"
        }).then( () => {
          let that = this
          that.$post(that.$uri.apk.apkDelete, {ids}).then(res => {
            that.$message.success("删除成功")
            that.getAppList()
          })
        }).catch( () => {})
      },
      /* 删除应用 */
      async apkDel2Batch (id) {
        let that = this
        await that.$post(that.$uri.apk.apkDelete, {id})
      },
      /* 批量删除应用 */
      apkDelBatch () {
        this.$confirm("确定批量删除应用？", "提示", {
          type: "warning"
        }).then( () => {
          let ids = []
          this.multipleSelection.forEach(v => {
            ids.push(v.id)
          })
          let that = this
          that.$post(that.$uri.apk.apkDelete, {ids}).then(res => {
            this.$message.success("删除完成")
            this.getAppList()
          })
        }).catch( () => {})
      }
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
        padding: 0 5px;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
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