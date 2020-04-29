<template>
  <div class="dev-list">
    <div class="dev-list-search">
      <div class="search-btn">
        <div style="display: flex;flex-direction: row">
          <div class="search-main-item">
            <!--<span>选择日期:</span>-->
            <el-date-picker
                    v-model="dateValue"
                    type="datetimerange"
                    size="small"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right">
            </el-date-picker>
          </div>
          <div class="search-main-item" style="margin-left: 20px">
            <!--<span>分组名称:</span>-->
            <el-select size="small" v-model="searchInfo.groupNameLike" @change="getLogList" placeholder="选择分组">
              <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.label">
              </el-option>
            </el-select>
          </div>
        </div>
        <div @keyup.enter="getLogList">
          <el-input size="small" placeholder="输入设备IP/操作内容 搜索" v-model="searchInfo.queryParam" style="width: 320px">
            <el-button slot="append" icon="el-icon-search" @click="getLogList"></el-button>
          </el-input>
        </div>
      </div>
      <div class="search-advanced" v-show="advancedShow">
        <div class="search-main">
          <div class="search-main-item">
            <span>选择日期:</span>
            <el-date-picker
                    v-model="dateValue"
                    type="datetimerange"
                    size="mini"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right">
            </el-date-picker>
          </div>
          <div class="search-main-item">
            <span>分组名称:</span>
            <el-select size="mini" v-model="searchInfo.groupNameLike" placeholder="请选择">
              <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.label">
              </el-option>
            </el-select>
          </div>
          <div class="search-main-item">
            <span>设备IP:</span>
            <div class="item-input">
              <el-input v-model="searchInfo.deviceIpLike" size="mini"></el-input>
            </div>
          </div>
          <div class="search-main-item">
            <span>操作内容:</span>
            <div class="item-input">
              <el-input v-model="searchInfo.operationLike" size="mini"></el-input>
            </div>
          </div>
        </div>
        <div class="search-btn">
          <!--<el-button size="mini" @click="advancedShow = false">取消</el-button>-->
          <el-button type="primary" size="mini" @click="getLogList">搜索</el-button>
        </div>
      </div>
    </div>
    <div class="device-case-dev border-all">
      <el-table ref="multipleTable" :data="info.list" size="mini" :header-cell-style="{backgroundColor: '#efefef'}" @row-click="checkRow" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" header-align="center"></el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="terminal" label="终端信息" min-width="80px"></el-table-column>
        <!--<el-table-column prop="caseNo" label="设备池编号" min-width="80px"></el-table-column>-->
        <!--<el-table-column prop="slotNo" label="槽位号" min-width="80px"></el-table-column>-->
        <el-table-column prop="deviceIp" label="设备IP" min-width="80px"></el-table-column>
        <el-table-column prop="groupName" label="分组名称" min-width="80px"></el-table-column>
        <el-table-column prop="operation" label="操作内容" min-width="150px"></el-table-column>
        <el-table-column label="操作时间">
          <template slot-scope="scope">
            {{scope.row.updateTime | formatDateTime}}
          </template>
        </el-table-column>
        <!--<el-table-column min-width="80px" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="logDelete(scope.row.id)" v-if="$store.getters.checkChangeAuth()">删除</el-button>
          </template>
        </el-table-column>-->
      </el-table>
      <div class="list-bottom">
        <div class="list-bottom-btn">
          <el-button size="small" :disabled="multipleSelection.length === 0" plain @click="deleteCaseBatch">删除</el-button>
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
    name: "LogGroup",
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
        pickerOptions: {
          shortcuts: [{
            text: '最近一天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        dateValue: [new Date(new Date() - 3600 * 1000 * 24), new Date()],
        advancedShow: false,
        searchInfo: {
          groupNameLike: "",
          deviceIpLike: "",
          operationLike: "",
          updateTimeFrom: "",
          updateTimeTo: "",
          queryParam: ""
        },
        options: []
      }
    },
    methods: {
      /* 表单击行事件 */
      checkRow(r, c ,e) {
        this.$refs.multipleTable.toggleRowSelection(r)
      },
      /* 获取操作日志列表 */
      getLogList () {
        let that = this
        that.searchInfo.updateTimeFrom = that.$util.formatDate(that.dateValue[0])
        that.searchInfo.updateTimeTo = that.$util.formatDate(that.dateValue[1])
        that.$post(that.$uri.log.groupLog, {...that.page, ...that.searchInfo}).then(res => {
          that.info = res
        })
      },
      /* 当前页改变 */
      currentChangeHandle (val) {
        this.page.startPage = val
        this.getLogList()
      },
      /* 每页条数改变 */
      sizeChangeHandle (val) {
        this.page.limit = val
        this.getLogList()
      },
      /* 获取选中的数据 */
      handleSelectionChange (val) {
        this.multipleSelection = val
        console.log(this.multipleSelection)
      },
      /* 删除设备池 */
      async deleteCase (id) {
        let that = this
        await that.$post(that.$uri.log.groupLogDelete, {id})
      },
      /* 批量删除设备池 */
      deleteCaseBatch () {
        this.$confirm("日志删除后无法恢复，是否继续？", "提示", {
          confirmButtonText: '确定',
          confirmButtonClass: 'confirm-btn-yellow',
          iconClass: 'el-icon-c-yellow',
          cancelButtonText: '取消'
        }).then( () => {
          this.multipleSelection.forEach(v => {
            this.deleteCase(v.id)
          })
          this.$message.success("删除完成")
          let that = this
          setTimeout(() => {that.getLogList()}, 1000)
        }).catch( () => {})
      },
      /* 删除日志 */
      logDelete (id) {
        this.$confirm("确认删除？", "提示", {
          confirmButtonText: '确定',
          confirmButtonClass: 'confirm-btn-blue',
          iconClass: 'el-icon-c-blue',
          cancelButtonText: '取消'
        }).then( () => {
          let that = this
          that.$post(that.$uri.log.groupLogDelete, {id}).then(res => {
            that.$message.success("删除成功")
            that.getLogList()
          })
        }).catch( () => {})
      },
      /* 获得分组信息 */
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
        })
      }
    },
    mounted () {
      if (this.$store.state.logGroupId != '') {
        this.searchInfo.groupNameLike = this.$store.state.logGroupId
        this.$store.commit(this.$mutation.LOG_GROUP_ID, '')
      }
      this.getLogList()
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
          justify-content: flex-start;
          flex-wrap: wrap;
          .search-main-item {
            /*width: 31%;*/
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            /*flex-grow: 1;*/
            padding: 5px 10px;
            span {
              font-size: 12px;
              margin-right: 6px;
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