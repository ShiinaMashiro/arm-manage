<template>
  <div>
    <div class="search-btn">
      <div>
        <el-button size="small" type="primary" @click="addIpPopShow = true"  v-if="$store.getters.checkChangeAuth()">新建消息</el-button>
        <el-button size="small" type="primary" @click="$router.push('/home/forwardRecord')"  v-if="$store.getters.checkChangeAuth()">转发记录</el-button>
      </div>
      <div @keyup.enter="getLogList">
        <el-input size="small" placeholder="输入ID/名称 搜索" v-model="searchInfo.queryParam" style="width: 320px">
          <el-button slot="append" icon="el-icon-search" @click="getIpList"></el-button>
        </el-input>
      </div>
    </div>

    <div v-if="info.success" class="device-case border-all">
      <el-table ref="multipleTable" :data="info.list" :header-cell-style="{backgroundColor: '#efefef'}" stripe size="mini"
                tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="创建时间" width="200">
          <template slot-scope="scope">
            {{scope.row.createTime | formatDateTime}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <!--<el-button type="text" size="small" @click="goCaseDetail(scope.row)">管理</el-button>-->
            <el-button type="text" size="small" @click.stop="edit(scope.row)" v-if="$store.getters.checkChangeAuth()">编辑</el-button>
            <el-button type="text" size="small" @click.stop="forward(scope.row)" v-if="$store.getters.checkChangeAuth()">转发</el-button>
            <el-button type="text" size="small" @click.stop="deleteIp(scope.row.id)" v-if="$store.getters.checkChangeAuth()">删除</el-button>
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
    <Drawer title="新增消息" :visible.sync="addIpPopShow" @handClick="addIp">
      <div style="font-size: 12px" v-if="addIpPopShow">
        <el-form ref="form" :model="addIpInfo" label-width="130px" label-position="left" style="display: flex;flex-direction: column;height: 100%">
          <el-form-item size="mini" label="消息内容">
            <!--<el-input
                    id="msg1"
                    type="textarea"
                    placeholder="请输入内容"
                    v-model="addIpInfo.command"
                    maxlength="3000"
                    :rows="10"
                    show-word-limit
            ></el-input>-->
            <Textarea4Row v-model="addIpInfo.command"></Textarea4Row>
          </el-form-item>
          <el-form-item size="mini" label="消息备注">
            <el-input
                    id="msg2"
                    type="textarea"
                    placeholder="请输入消息备注，最多200字"
                    v-model="addIpInfo.remark"
                    maxlength="200"
                    :rows="8"
                    show-word-limit
            ></el-input>
          </el-form-item>
          <div style="font-size: 14px;margin-bottom: 5px">当前仅支持TCP协议转发</div>
          <el-form-item size="mini" label="消息转发端口">
            <el-input-number size="mini" v-model="addIpInfo.devicePort" :min="0" :max="65000" :controls="false"></el-input-number>
          </el-form-item>

        </el-form>
      </div>
    </Drawer>
    <!-- 修改IP弹窗 -->
    <Drawer title="编辑消息" :visible.sync="changeIpPopShow" @handClick="changeIp">
      <div style="font-size: 12px" v-if="changeIpInfo && changeIpPopShow">
        <el-form ref="form" :model="addIpInfo" label-width="130px" label-position="left" style="display: flex;flex-direction: column;height: 100%">
          <el-form-item size="mini" label="消息内容">
            <!--<el-input
                    id="msg3"
                    type="textarea"
                    placeholder="请输入内容"
                    v-model="changeIpInfo.command"
                    maxlength="3000"
                    :rows="10"
                    show-word-limit
            ></el-input>-->
            <Textarea4Row v-model="changeIpInfo.command"></Textarea4Row>
          </el-form-item>
          <el-form-item size="mini" label="消息备注">
            <el-input
                    id="msg4"
                    type="textarea"
                    placeholder="请输入消息备注，最多200字"
                    v-model="changeIpInfo.remark"
                    maxlength="200"
                    :rows="8"
                    show-word-limit
            ></el-input>
          </el-form-item>
          <div style="font-size: 14px;margin-bottom: 5px">当前仅支持TCP协议转发</div>
          <el-form-item size="mini" label="消息转发端口">
            <el-input-number size="mini" v-model="changeIpInfo.devicePort" :min="0" :max="65000" :controls="false"></el-input-number>
          </el-form-item>
        </el-form>
      </div>
    </Drawer>

    <!-- 修改IP弹窗 -->
    <Drawer title="转发命令" :visible.sync="forwardPopShow" @handClick="forwardMsg">
      <div style="font-size: 12px" v-if="forwardInfo">
        <el-form ref="form" :model="forwardInfo" label-width="130px" label-position="left" style="display: flex;flex-direction: column;height: 100%">
          <div style="font-size: 16px;margin-bottom: 5px">消息内容</div>
          <el-form-item size="mini" label="消息ID">{{forwardInfo.id}}</el-form-item>
          <el-form-item size="mini" label="消息备注">{{forwardInfo.remark}}</el-form-item>
          <el-form-item size="mini" label="消息内容">
            <el-input
                    id="msg5"
                    type="textarea"
                    v-model="forwardInfo.command"
                    :rows="10"
                    :disabled="true"
            ></el-input>
          </el-form-item>
          <div style="width: 100%;border-bottom: 1px solid #ddd"></div>
          <el-form-item size="mini" label="选择云机">
            <el-tree
                    :props="props"
                    :load="loadNode"
                    style="margin-top: 10px"
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
  import Textarea4Row from '@/components/Textarea4Row'
  export default {
    name: "CmdForward",
    components: {
      Drawer,
      Textarea4Row
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
          isDel: 2,
          queryParam: ''
        },
        forwardPopShow: false,
        forwardInfo: null,
        props: {
          label: 'name',
          children: 'children',
          isLeaf: 'leaf'
        },
        groupList: [],
        forwardVo: {
          deviceIps: '',
          isSave: 0,
        }
      }
    },
    computed: {

    },
    methods: {
      getMyGroupList() {
        let that = this
        that.$post(that.$uri.group.list, {}).then(res => {
          if(res.success) {
            that.groupList = res.list
          }
        })
      },
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
        this.forwardVo.deviceIps = s.join(",")
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
      /* 获取ip列表 */
      getIpList () {
        let that = this
        that.$post(that.$uri.cmd.list, {...that.page, ...that.searchInfo}).then(res => {
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
        this.$confirm("删除仅能查看转发记录，是否继续？", "提示", {
          confirmButtonText: '确定',
          confirmButtonClass: 'confirm-btn-red',
          iconClass: 'el-icon-c-red',
          cancelButtonText: '取消'
        }).then( () => {
          let that = this
          that.$post(that.$uri.cmd.del, {id}).then(res => {
            if (res.success) {
              setTimeout(() => {that.getIpList()}, 1000)
            } else {
              that.$message.error("删除失败")
            }
          })

        }).catch( () => {})
      },
      edit(row) {
        this.changeIpInfo = {
          id: row.id,
          remark: row.remark,
          command: row.command,
          devicePort: row.devicePort,
        }
        this.changeIpPopShow = true
      },
      forward(row) {
        this.forwardInfo = row
        this.forwardVo = {...this.forwardVo, ...row}
        this.forwardPopShow = true
      },
      forwardMsg() {
        let that = this
        if(!that.forwardVo.deviceIps) {
          that.$message.warning('请选择云机')
          return
        }
        that.$post(that.$uri.cmd.forward, that.forwardVo).then(res => {
          if (res.success) {
            that.$message.success("转发成功")
            that.forwardPopShow = false
          } else {
            that.$message.error(res.msg)
          }
        })
      },
      addIp() {
        let that = this
        for (let key in that.addIpInfo) {
          if (!that.addIpInfo[key]) {
            that.$message.warning('参数不能为空')
            return
          }
        }
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
        console.log(that.changeIpInfo)
        for (let key in that.changeIpInfo) {
          if (!that.changeIpInfo[key]) {
            that.$message.warning('参数不能为空')
            return
          }
        }
        that.$post(that.$uri.cmd.save, that.changeIpInfo).then(res => {
          if (res.success) {
            that.$message.success("修改成功")
            that.changeIpPopShow = false
            that.getIpList()
          } else {
            that.$message.error(res.msg)
          }
        })
      }
    },
    mounted () {
      this.getIpList()
      this.getMyGroupList()
    }
  };
</script>

<style lang="less" scoped>
  textarea::-webkit-scrollbar {display:none}
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