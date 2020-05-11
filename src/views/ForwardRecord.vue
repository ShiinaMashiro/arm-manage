<template>
  <div>
    <div class="search-btn">
      <div>
      </div>
      <div @keyup.enter="getLogList">
        <el-input size="small" placeholder="输入消息ID/消息备注/云机ID 搜索" v-model="searchInfo.queryParam" style="width: 320px">
          <el-button slot="append" icon="el-icon-search" @click="getIpList"></el-button>
        </el-input>
      </div>
    </div>

    <div v-if="info.success" class="device-case border-all">
      <el-table ref="multipleTable" :data="info.list" :header-cell-style="{backgroundColor: '#efefef'}" stripe size="mini"
                tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="commandId" label="消息ID"></el-table-column>
        <el-table-column prop="remark" label="消息备注"></el-table-column>
        <el-table-column prop="createTime" label="转发时间"></el-table-column>
        <el-table-column prop="deviceIps" label="转发云机"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--<el-button type="text" size="small" @click="goCaseDetail(scope.row)">管理</el-button>-->
            <el-button type="text" size="small" @click.stop="forwardRecord(scope.row)">查看</el-button>
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

    <!-- 录入IP弹窗 -->
    <Drawer title="录入IP" :visible.sync="addIpPopShow" @handClick="addIp">
      <div style="font-size: 12px">
        <el-form ref="form" :model="addIpInfo" label-width="130px" label-position="left" style="display: flex;flex-direction: column;height: 100%">
          <el-form-item label="消息内容">
            <el-input
                    type="textarea"
                    placeholder="请输入内容"
                    v-model="addIpInfo.command"
                    maxlength="3000"
                    :rows="10"
                    show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="消息备注">
            <el-input
                    type="textarea"
                    placeholder="请输入消息备注，最多200字"
                    v-model="addIpInfo.remark"
                    maxlength="200"
                    :rows="4"
                    show-word-limit
            ></el-input>
          </el-form-item>
          <div style="font-size: 14px;margin-bottom: 5px">当前仅支持TCP协议转发</div>
          <el-form-item label="消息转发端口">
            <el-input-number size="mini" v-model="addIpInfo.devicePort" :min="0" :max="65000" :controls="false"></el-input-number>
          </el-form-item>

        </el-form>
      </div>
    </Drawer>
    <!-- 修改IP弹窗 -->
    <Drawer title="录入IP" :visible.sync="changeIpPopShow" @handClick="changeIp">
      <div style="font-size: 12px" v-if="changeIpInfo">
        <el-form ref="form" :model="addIpInfo" label-width="130px" label-position="left" style="display: flex;flex-direction: column;height: 100%">
          <el-form-item label="消息内容">
            <el-input
                    type="textarea"
                    placeholder="请输入内容"
                    v-model="changeIpInfo.command"
                    maxlength="3000"
                    :rows="10"
                    show-word-limit
            ></el-input>
          </el-form-item>
          <el-form-item label="消息备注">
            <el-input
                    type="textarea"
                    placeholder="请输入消息备注，最多200字"
                    v-model="changeIpInfo.remark"
                    maxlength="200"
                    :rows="4"
                    show-word-limit
            ></el-input>
          </el-form-item>
          <div style="font-size: 14px;margin-bottom: 5px">当前仅支持TCP协议转发</div>
          <el-form-item label="消息转发端口">
            <el-input-number size="mini" v-model="changeIpInfo.devicePort" :min="0" :max="65000" :controls="false"></el-input-number>
          </el-form-item>
        </el-form>
      </div>
    </Drawer>

    <Drawer title="转发详情" :visible.sync="forwardPopShow">
      <div style="font-size: 12px" v-if="forwardInfo">
        <el-form ref="form" :model="forwardInfo" label-width="130px" label-position="left" style="display: flex;flex-direction: column;height: 100%">
          <el-form-item label="转发ID">{{forwardInfo.id}}</el-form-item>
          <el-form-item label="转发时间">{{forwardInfo.createTime | formatDateTime}}</el-form-item>
          <div style="width: 100%;border-bottom: 1px solid #ddd"></div>
          <div style="font-size: 16px;margin-bottom: 5px;margin-top: 10px">消息信息</div>
          <el-form-item label="消息ID">{{forwardInfo.commandId}}</el-form-item>
          <el-form-item label="消息备注">{{forwardInfo.remark}}</el-form-item>
          <el-form-item label="消息内容">
            <el-input
                    type="textarea"
                    v-model="forwardInfo.command"
                    :rows="10"
                    :disabled="true"
            ></el-input>
          </el-form-item>
          <div style="width: 100%;border-bottom: 1px solid #ddd"></div>
          <div style="font-size: 16px;margin-bottom: 5px;margin-top: 10px">转发状态</div>
          <template v-for="r in details">
            <el-form-item :label="r.deviceIp">{{r.isSuccess ? '成功' : r.message}}</el-form-item>
          </template>
        </el-form>
      </div>
    </Drawer>
  </div>
</template>

<script>
  import Drawer from '@/components/Drawer'
  export default {
    name: "ForwardRecord",
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
          // queryParam: ''
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
        that.$post(that.$uri.cmd.record, {...that.page, ...that.searchInfo}).then(res => {
          that.info = res
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
        this.$confirm("删除转发记录，是否继续？", "提示", {
          confirmButtonText: '确定',
          confirmButtonClass: 'confirm-btn-red',
          iconClass: 'el-icon-c-red',
          cancelButtonText: '取消'
        }).then( () => {
          let that = this
          that.$post(that.$uri.cmd.recordDel, {id}).then(res => {
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
      addIp() {
        let that = this
        that.$post(that.$uri.cmd.add, that.addIpInfo).then(res => {
          if (res.success) {
            that.$message.success("新增成功")
            that.addIpPopShow = false
            that.getIpList()
          } else {
            that.$message.error(res.msg)
          }
        })
      },
      changeIp() {
        let that = this
        that.$post(that.$uri.cmd.save, that.changeIpInfo).then(res => {
          if (res.success) {
            that.$message.success("修改成功")
            that.changeIpPopShow = false
            that.getIpList()
          } else {
            that.$message.error(res.msg)
          }
        })
      },
      forwardRecord(row) {
        this.forwardInfo = row
        this.forwardPopShow = true
        let that = this
        that.$post(that.$uri.cmd.recordDetail, {recordId: row.id}).then(res => {
          if (res.success) {
            that.details = res.list
          }
        })
      },
    },
    mounted () {
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