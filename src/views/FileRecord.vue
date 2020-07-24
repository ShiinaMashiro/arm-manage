<template>
  <div>
    <div class="search-btn">
      <div>
      </div>
      <div @keyup.enter="getIpList">
        <el-input size="small" placeholder="输入云机ID 搜索" v-model="searchInfo.queryParam" style="width: 320px">
          <el-button slot="append" icon="el-icon-search" @click="getIpList"></el-button>
        </el-input>
      </div>
    </div>

    <div v-if="info.success" class="device-case border-all">
      <el-table ref="multipleTable" :data="info.list" :header-cell-style="{backgroundColor: '#efefef'}" stripe size="mini"
                tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="md5" label="md5"></el-table-column>
        <el-table-column prop="issuePath" label="分发路径" width="180"></el-table-column>
        <el-table-column prop="createTime" label="分发时间" width="200">
          <template slot-scope="scope">
            {{scope.row.createTime | formatDateTime}}
          </template>
        </el-table-column>
        <el-table-column prop="deviceIps" label="分发云机" width="160px">
          <template slot-scope="scope">
            <div style="display: flex;flex-direction: column;padding: 0 10px">
              <div v-for="detail in scope.row.details.slice(0, 5)">
                <span>{{detail.deviceIp}}</span>
                <span :style="{color: detail.isSuccess ? 'green' : 'red', marginLeft: '20px'}">{{detail.isSuccess ? '成功' : '失败'}}</span>
              </div>
              <el-button v-if="scope.row.details.length > 5" type="text" size="mini" @click.stop="forwardRecord(scope.row)">查看更多</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.stop="deleteIp(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="list-bottom">
        <div></div>
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


    <Drawer title="分发详情" :visible.sync="forwardPopShow" :opt="false">
      <div style="font-size: 12px" v-if="forwardInfo">
        <el-form ref="form" :model="forwardInfo" label-width="130px" label-position="left" style="display: flex;flex-direction: column;height: 100%">
          <el-form-item size="mini" label="分发路径">{{forwardInfo.issuePath}}</el-form-item>
          <el-form-item size="mini" label="转发时间">{{forwardInfo.createTime | formatDateTime}}</el-form-item>
          <el-form-item size="mini" label="MD5">{{forwardInfo.md5}}</el-form-item>
          <div style="width: 100%;border-bottom: 1px solid #ddd"></div>
          <div style="font-size: 16px;margin-bottom: 5px;margin-top: 10px">分发状态</div>
          <template v-for="r in details">
            <el-form-item :label="r.deviceIp" size="mini">
              <span v-if="r.isSuccess" style="color: green;">成功</span>
              <span v-if="!r.isSuccess" style="color: red;">失败</span></el-form-item>
          </template>
        </el-form>
      </div>
    </Drawer>
  </div>
</template>

<script>
  import Drawer from '@/components/Drawer'
  export default {
    name: "FileRecord",
    components: {
      Drawer
    },
    data () {
      return {
        info: {
          success: false,
          caseList: [],
          total: 0
        },
        page: {
          startPage: 1,
          limit: 20
        },
        addIpPopShow: false,
        addIpInfo: {
          remark: '',
          command: '',
          devicePort: 0
        },
        changeIpPopShow: false,
        changeIpInfo: null,
        searchInfo: {
          queryParam: '',
          fileIssueId: 0
        },
        forwardPopShow: false,
        forwardInfo: null,
        details: []
      }
    },
    computed: {

    },
    methods: {
      /* 获取ip列表 */
      getIpList () {
        let that = this
        that.$post(that.$uri.file.record, {...that.page, ...that.searchInfo}).then(res => {
          if (res.success) {
            res.list.forEach(ip => {
              ip.details = []
            })
            that.info = res

            that.info.list.forEach(ip => {
              that.$post(that.$uri.file.recordDetail, {recordId: ip.id}).then(res => {
                if (res.success) {
                  ip.details = res.list
                }
              })
            })
          }
        })
      },
      /* 当前页改变 */
      currentChangeHandle (val) {
        this.page.startPage = val
        this.getIpList()
      },
      /* 每页条数改变 */
      sizeChangeHandle (val) {
        this.page.limit = val
        this.getIpList()
      },
      /* 删除IP */
      deleteIp (id) {
        this.$confirm("删除分发记录，是否继续？", "提示", {
          confirmButtonText: '确定',
          confirmButtonClass: 'confirm-btn-red',
          iconClass: 'el-icon-c-red',
          cancelButtonText: '取消'
        }).then( () => {
          let that = this
          that.$post(that.$uri.file.recordDel, {ids: [id]}).then(res => {
            if (res.success) {
              setTimeout(() => {that.getIpList()}, 1000)
            } else {
              that.$message.error("删除失败")
            }
          })

        }).catch( () => {})
      },
      edit(row) {
        this.changeIpInfo = row
        this.changeIpPopShow = true
      },
      forwardRecord(row) {
        this.forwardInfo = row
        this.forwardPopShow = true
        let that = this
        that.$post(that.$uri.file.recordDetail, {recordId: row.id}).then(res => {
          if (res.success) {
            that.details = res.list
          }
        })
      },
    },
    mounted () {
      this.searchInfo.fileIssueId = this.$store.state.fileIssueInfo.id
      this.getIpList()
    }
  };
</script>

<style lang="less" scoped>
  .search-btn {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .device-case {
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
</style>