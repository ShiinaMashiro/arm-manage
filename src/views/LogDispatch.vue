<template>
  <div class="dev-list">
    <div class="dev-list-search">
      <div class="search-btn">
        <!--<el-button type="text" size="small" @click="advancedShow = !advancedShow">高级搜索</el-button>-->
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
            <span>设备IP:</span>
            <div class="item-input">
              <el-input v-model="searchInfo.deviceIp" size="mini"></el-input>
            </div>
          </div>
        </div>
        <div class="search-btn">
          <el-button size="mini" @click="advancedShow = false">取消</el-button>
          <el-button type="primary" size="mini" @click="getLogList">搜索</el-button>
        </div>
      </div>
    </div>
    <div class="device-case-dev border-all">
      <el-table ref="multipleTable" :data="info.list" @row-click="checkRow" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="terminal" label="终端信息"></el-table-column>
        <el-table-column prop="deviceName" label="设备信息"></el-table-column>
        <el-table-column prop="deviceIp" label="设备IP"></el-table-column>
        <el-table-column prop="remark" label="操作内容" min-width="150px"></el-table-column>
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
          <el-button size="small" plain @click="deleteCaseBatch">删除</el-button>
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
    name: "LogDispatch",
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
        advancedShow: true,
        searchInfo: {
          deviceIp: "",
          updateTimeFrom: "",
          updateTimeTo: ""
        }
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
        that.$post(that.$uri.log.dispatchLog, {...that.page, ...that.searchInfo}).then(res => {
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
        await that.$post(that.$uri.log.dispatchLogDelete, {id})
      },
      /* 批量删除设备池 */
      deleteCaseBatch () {
        this.$confirm("确认批量删除日志？", "提示", {
          type: "warning"
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
          type: "warning"
        }).then( () => {
          let that = this
          that.$post(that.$uri.log.dispatchLogDelete, {id}).then(res => {
            that.$message.success("删除成功")
            that.getLogList()
          })
        }).catch( () => {})
      }
    },
    mounted () {
      this.getLogList()
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
        justify-content: flex-end;
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