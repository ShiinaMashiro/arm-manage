<template>
  <div class="dev-list">
    <div class="dev-list-search">
      <div class="search-btn">
        <div style="display: flex;flex-direction: row">
          <div class="search-main-item">
            <el-button type="primary" size="small" @click="startOpsPop">发起运维</el-button>
          </div>
          <div class="search-main-item" style="margin-left: 20px">
            <el-select size="small" v-model="searchInfo.operationStatus" @change="getLogList" placeholder="运维状态">
              <el-option label="全部" value=""></el-option>
              <el-option label="未开始" :value="1"></el-option>
              <el-option label="运维中" :value="2"></el-option>
              <el-option label="已取消" :value="3"></el-option>
              <el-option label="运维结束" :value="4"></el-option>
            </el-select>
          </div>
        </div>
        <div @keyup.enter="getLogList">
          <el-input size="small" placeholder="输入问题描述 搜索" v-model="searchInfo.queryParam" style="width: 320px">
            <el-button slot="append" icon="el-icon-search" @click="getLogList"></el-button>
          </el-input>
        </div>
      </div>
    </div>
    <div class="device-case-dev border-all">
      <el-table ref="multipleTable" :data="info.list" size="mini" :header-cell-style="{backgroundColor: '#efefef'}" tooltip-effect="dark" style="width: 100%">
        <el-table-column type="index" label="ID"></el-table-column>
        <el-table-column label="运维发起时间">
          <template slot-scope="scope">
            {{scope.row.startTime | formatDateTime}}
          </template>
        </el-table-column>
        <el-table-column label="运维结束时间">
          <template slot-scope="scope">
            {{scope.row.endTime | formatDateTime}}
          </template>
        </el-table-column>
        <el-table-column prop="question" label="问题描述" min-width="80px"></el-table-column>
        <el-table-column label="运维状态">
          <template slot-scope="scope">
            <span :style="{color: scope.row.operationStatus === 2 ? 'red' : '#00C1DE'}">{{scope.row.operationStatus | statusFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="80px" label="操作">
          <template slot-scope="scope">
            <el-button v-if="[1,2].indexOf(scope.row.operationStatus) !== -1" type="text" size="small" @click="stopOps(scope.row)">取消</el-button>
            <el-button v-if="scope.row.operationStatus === 3" type="text" size="small" @click="restartOps(scope.row)">重新运维</el-button>
            <el-button v-if="scope.row.operationStatus === 4" type="text" size="small" @click="recordPop(scope.row)">运维记录</el-button>
            <el-button v-if="[3,4].indexOf(scope.row.operationStatus) !== -1" type="text" size="small" @click="delRecord(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="list-bottom">
        <div class="list-bottom-btn">
          <!--<el-button v-if="" size="small" :disabled="multipleSelection.length === 0" plain @click="deleteCaseBatch">取消运维</el-button>-->
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

    <Drawer title="发起运维" :visible.sync="startOpsPopShow" @handClick="startOps">
      <div>
        <el-form ref="form" :model="startOpsInfo" label-width="130px" label-position="left">
          <el-form-item size="mini" label="问题描述" :required="true">
            <el-input v-model="startOpsInfo.question" type="textarea" :rows="5" maxlength="100" show-word-limit></el-input>
          </el-form-item>
          <el-form-item size="mini" label="云机IP" :required="true">
            <el-input v-model="startOpsInfo.deviceIpCustomer" maxlength="100" type="textarea" :rows="3" show-word-limit></el-input>
          </el-form-item>
          <el-form-item size="mini" label="服务器状态">
            <p :style="{color: opsServerStatus ? 'green' : 'red', marginTop: '0'}">{{opsServerStatus ? '可用' : '不可用'}}</p>
          </el-form-item>
        </el-form>
      </div>
    </Drawer>

    <Drawer title="运维记录" :visible.sync="opsRecordPopShow" :opt="false">
      <div v-if="opsRecordInfo">
        <el-form ref="form" label-width="130px" label-position="left">
          <el-form-item size="mini" label="问题描述" position="left">
            <p style="margin: 0">{{opsRecordInfo.question}}</p>
          </el-form-item>
          <el-form-item size="mini" label="云机IP">
            <p style="margin: 0">{{opsRecordInfo.deviceIpCustomer}}</p>
          </el-form-item>
          <el-form-item size="mini" label="运维发起时间">
            <p style="margin: 0">{{opsRecordInfo.startTime | formatDateTime}}</p>
          </el-form-item>
          <el-form-item size="mini" label="运维处理时间">
            <p style="margin: 0">{{opsRecordInfo.dealTime | formatDateTime}}</p>
          </el-form-item>
          <el-form-item size="mini" label="运维结束时间">
            <p style="margin: 0">{{opsRecordInfo.endTime | formatDateTime}}</p>
          </el-form-item>
          <el-form-item size="mini" label="运维报告" style="font-weight: bold;border-top: thin solid #eee">
          </el-form-item>
          <el-form-item size="mini" label="运维涉及模块">
            <p style="margin: 0">{{opsRecordInfo.moduleOperation}}</p>
          </el-form-item>
          <el-form-item size="mini" label="运维涉及云机">
            <p style="margin: 0">{{opsRecordInfo.deviceIpOperation}}</p>
          </el-form-item>
          <el-form-item size="mini" label="解决方案">
            <p style="margin: 0">{{opsRecordInfo.solution}}</p>
          </el-form-item>
          <el-form-item size="mini" label="运维日志">
            <el-button type="text" size="mini" @click="downloadOp">下载运维日志</el-button>
          </el-form-item>
          <el-form-item size="mini" label="SSH日志">
            <el-button type="text" size="mini" @click="downloadSsh">下载SSH日志</el-button>
          </el-form-item>
        </el-form>
      </div>
    </Drawer>

    <a v-if="opsRecordInfo" id="opLog" style="display: none" :href="'/operationLog/' + opsRecordInfo.operationLog" download target="_blank"></a>
    <a v-if="opsRecordInfo" id="sshLog" style="display: none" :href="'/operationLog/' + opsRecordInfo.sshLog" download target="_blank"></a>

  </div>
</template>

<script>
  import Drawer from '@/components/Drawer.vue'
  export default {
    name: "LogOps",
    components: {
      Drawer
    },
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
        advancedShow: false,
        searchInfo: {
          operationStatus: '',
          queryParam: ""
        },
        opsServerStatus: true,
        startOpsPopShow: false,
        startOpsInfo: {
          question: '',
          deviceIpCustomer: ''
        },
        opsRecordPopShow: false,
        opsRecordInfo: null
        /*opsRecordInfo: {
          id: 0,
          port: 4396,
          operationStatus: 4,
          question: '飞机电视机分厘卡圣诞节发，的撒娇来得及ask，爱上角动量喀什觉得，安静的时刻了洒家打开。',
          deviceIpCustomer: '10.2.11.1,10.3.22.1',
          startTime: new Date(),
          dealTime: new Date(),
          endTime: new Date(),
          moduleOperation: '设备管理-分组列表',
          deviceIpOperation: '10.3.11.1',
          solution: '重启云机',
          operationLog: '',
          sshLog: ''
        }*/
      }
    },
    filters: {
      statusFilter(status) {
        let statusMsg = '未知'
        switch (status) {
          case 1: statusMsg = '未开始'
            break;
          case 2: statusMsg = '运维中'
            break;
          case 3: statusMsg = '已取消'
            break;
          case 4: statusMsg = '已结束'
            break;
        }
        return statusMsg
      }
    },
    methods: {
      /* 获取操作日志列表 */
      getLogList () {
        let that = this
        that.$post(that.$uri.ops.list, {...that.page, ...that.searchInfo}).then(res => {
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
      startOpsPop() {
        // this.startOpsPopShow = true
        this.$post(this.$uri.ops.checkPort).then(res => {
          this.opsServerStatus = res.success
          this.startOpsPopShow = true
        }).catch(err => {
          this.$alert('当前线上运维服务繁忙中，请联系售后人员寻求帮助。\n' +
            '联系方式：' +
            '电话（同微信）：13616513812', '运维服务器繁忙', {
            confirmButtonText: '确定',
            type: 'error'
          });
        })
      },
      startOps() {
        if (!this.opsServerStatus) {
          this.$message.warning('运维服务器通信质量不佳，请重新尝试')
          return
        }
        if (!this.startOpsInfo.question || !this.startOpsInfo.deviceIpCustomer) {
          this.$message.warning('信息不能为空')
          return
        }

        this.$post(this.$uri.ops.request, this.startOpsInfo).then(res => {
          if (res.success) {
            this.$message.success('开始运维')
          } else {

          }
          this.startOpsPopShow = false
        })
      },
      stopOps(info) {
        this.$post(this.$uri.ops.stop, {id: info.id}).then(res => {
          if (res.success) {
            this.$message.success('当前运维已取消')
            this.getLogList()
          }
        })
      },
      restartOps(info) {
        this.$post(this.$uri.ops.restart, {id: info.id}).then(res => {
          if (res.success) {
            this.$message.success('重新运维成功')
            this.getLogList()
          }
        })
      },
      delRecord(info) {
        this.$post(this.$uri.ops.del, {id: info.id}).then(res => {
          if (res.success) {
            this.$message.success('删除成功')
            this.getLogList()
          }
        })
      },
      recordPop(info) {
        this.opsRecordInfo = info
        this.opsRecordPopShow = true
      },
      downloadOp() {
        document.querySelector('#opLog').click()
      },
      downloadSsh() {
        document.querySelector('#sshLog').click()
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