<template>
  <div class="dev-list">
    <div class="dev-list-search">
      <div class="search-btn">
        <el-button size="small" type="primary" @click="allDelete" v-if="$store.getters.checkChangeAuth()">全部删除</el-button>
        <el-button type="text" size="small" @click="advancedShow = !advancedShow">高级搜索</el-button>
      </div>
      <div class="search-advanced" v-show="advancedShow">
        <div class="search-main">
          <div class="search-main-item">
            <span>分发类别:</span>
            <div class="item-input">
              <el-select v-model="searchInfo.issuedMode" size="mini" placeholder="类别">
                <el-option
                        v-for="item in searchOptions.mode"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="search-main-item">
            <span>分发状态:</span>
            <div class="item-input">
              <el-select v-model="searchInfo.issuedStatus" size="mini" placeholder="状态">
                <el-option
                        v-for="item in searchOptions.status"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="search-main-item">
            <span>设备IP:</span>
            <div class="item-input">
              <el-input v-model="searchInfo.deviceIp" size="mini"></el-input>
            </div>
          </div>
          <div class="search-main-item">
            <span>分层处理器IP:</span>
            <div class="item-input">
              <el-input v-model="searchInfo.nodeIp" size="mini"></el-input>
            </div>
          </div>
          <div class="search-main-item">
            <span>APPID:</span>
            <div class="item-input">
              <el-input v-model="searchInfo.appId" size="mini"></el-input>
            </div>
          </div>
          <div class="search-main-item">
          </div>
        </div>
        <div class="search-btn">
          <el-button type="primary" size="mini" @click="getDeviceList">搜索</el-button>
          <el-button size="mini" @click="advancedShow = false">取消</el-button>
        </div>
      </div>
    </div>
    <div class="device-case-dev border-all">
      <el-table ref="multipleTable" :data="info.list" @row-click="checkRow" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="分发类别">
          <template slot-scope="scope">
            <span>{{scope.row | modeStr}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="appId" label="APPID"></el-table-column>
        <el-table-column prop="deviceIp" label="设备IP"></el-table-column>
        <el-table-column prop="nodeIp" label="分层处理器IP"></el-table-column>
        <el-table-column label="分发状态">
          <template slot-scope="scope">
            <span>{{scope.row | statusStr}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="时间">
            <template slot-scope="scope">
              {{scope.row.updateTime | formatDateTime}}
            </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span :style="scope.row | statusClassFilter">
            {{scope.row | statusStr}}
          </span>
          </template>
        </el-table-column>
      </el-table>
      <div class="list-bottom">
        <div class="list-bottom-btn">
          <el-button size="small" plain :disabled="multipleSelection.length === 0" @click="deleteDevBatch" v-if="$store.getters.checkChangeAuth()">删除</el-button>
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
    name: "AppMonitor",
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
        groupDevPopShow: false, // 是否显示分组弹窗
        formLabelWidth: '120px',
        groupInfo: {
          groupId: '',
          deviceIp: ''
        },
        options: [],
        caseOptions: [],
        addDevicePopShow: false, // 显示手动添加弹窗
        addDevInfo: {
          caseId: "",
          deviceIp: ""
        },
        advancedShow: false,
        searchInfo: {
          issuedMode: "",
          issuedStatus: "",
          deviceIp: "",
          nodeIp: "",
          appId: ""
        },
        searchOptions: {
          status: [
            {
              label: "卸载中",
              value: -1
            }, {
              label: "设备等待下载",
              value: 1
            }, {
              label: "分层下载中",
              value: 2
            }, {
              label: "分层下载完成",
              value: 3
            }, {
              label: "设备下载中",
              value: 4
            }
          ],
          mode: [
            {
              label: "安装",
              value: 1
            }, {
              label: "卸载",
              value: -1
            }
          ],
          version: []
        },
        timeoutId: 0
      }
    },
    computed: {
      addDevOptions () {
        return [
          {
            label: "分层处理器",
            value: 0
          }, ...this.caseOptions
        ]
      }
    },
    methods: {
      /* 表单击行事件 */
      checkRow(r, c ,e) {
        if (r.cardType === 1) this.$refs.multipleTable.toggleRowSelection(r)
      },
      /* 获取设备列表 */
      getDeviceList () {
        let that = this
        that.$post(that.$uri.apk.apkMonitor, {...that.page, ...that.searchInfo}).then(res => {
          that.info = res
        })
      },
      /* 当前页改变 */
      currentChangeHandle (val) {
        this.page.startPage = val
        this.getDeviceList()
      },
      /* 每页条数改变 */
      sizeChangeHandle (val) {
        this.page.limit = val
        this.getDeviceList()
      },
      /* 获取选中的数据 */
      handleSelectionChange (val) {
        this.multipleSelection = val
        console.log(this.multipleSelection)
      },
      /* 批量删除记录 */
      deleteDevBatch () {
        this.$confirm("确认批量删除记录？", "提示", {
          confirmButtonText: '确定',
          confirmButtonClass: 'confirm-btn-blue',
          iconClass: 'el-icon-c-blue',
          cancelButtonText: '取消'
        }).then( () => {
          let ids = []
          this.multipleSelection.forEach(v => {
            ids.push(v.id)
          })
          let that = this
          that.$post(that.$uri.apk.apkMonitorDelete, {ids}).then(res => {
            this.$message.success("删除完成")
            this.getDeviceList()
          })
        }).catch( () => {})
      },
      /* 删除全部记录 */
      allDelete() {
        this.$confirm("确认删除全部记录？", "提示", {
          confirmButtonText: '确定',
          confirmButtonClass: 'confirm-btn-blue',
          iconClass: 'el-icon-c-blue',
          cancelButtonText: '取消'
        }).then( () => {
          let that = this
          that.$post(that.$uri.apk.apkMonitorDeleteAll, {}).then(res => {
            this.$message.success("删除完成")
            this.getDeviceList()
          })
        }).catch( () => {})
      }
    },
    filters: {
      statusStr (row) {
        switch (row.issuedStatus) {
          case -1: return "卸载中";
          case 1: return "设备等待下载";
          case 2: return "分层下载中";
          case 3: return "分层下载完成";
          case 4: return "设备下载中";
          default: return "未知";
        }
      },
      modeStr (row) {
        switch (row.issuedMode) {
          case -1: return "应用卸载";
          case 1: return "应用安装";
          default: return "未知";
        }
      }
    },
    mounted () {
      this.getDeviceList()
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