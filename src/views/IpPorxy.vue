<template>
  <div>
    <div class="search-btn">
      <el-button size="small" type="primary" @click="addIpPopShow = true"  v-if="$store.getters.checkChangeAuth()">录入IP</el-button>
    </div>

    <div v-if="info.success" class="device-case border-all">
      <el-table ref="multipleTable" :data="info.list" :header-cell-style="{backgroundColor: '#efefef'}" stripe size="mini"
                tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="ip" label="IP"></el-table-column>
        <el-table-column prop="dns" label="DNS"></el-table-column>
        <el-table-column prop="gateway" label="网关"></el-table-column>
        <el-table-column prop="port" label="端口"></el-table-column>
        <el-table-column prop="connectionMax" label="最大连接数"></el-table-column>
        <el-table-column prop="connectionLast" label="剩余连接数"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--<el-button type="text" size="small" @click="goCaseDetail(scope.row)">管理</el-button>-->
            <el-button type="text" size="small" @click.stop="edit(scope.row)">编辑</el-button>
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
          <el-form-item label="IP名称">
            <el-input size="mini" v-model="addIpInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="IP地址">
              <el-input size="mini" v-model="addIpInfo.ip"></el-input>
          </el-form-item>
          <el-form-item label="DNS">
              <el-input size="mini" v-model="addIpInfo.dns"></el-input>
          </el-form-item>
          <el-form-item label="网关">
            <el-input size="mini" v-model="addIpInfo.gateway"></el-input>
          </el-form-item>
          <el-form-item label="端口">
            <el-input-number size="mini" v-model="addIpInfo.port" :min="0" :max="65000" :controls="false"></el-input-number>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input size="mini" v-model="addIpInfo.username"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input size="mini" v-model="addIpInfo.password"></el-input>
          </el-form-item>
          <el-form-item label="最大连接数">
            <el-input-number size="mini" v-model="addIpInfo.connectionMax" :min="0" :max="100"></el-input-number>
          </el-form-item>
        </el-form>
      </div>
    </Drawer>
    <!-- 修改IP弹窗 -->
    <Drawer title="修改IP" :visible.sync="changeIpPopShow" @handClick="changeIp">
      <div style="font-size: 12px" v-if="changeIpInfo">
        <el-form ref="form" :model="addIpInfo" label-width="130px" label-position="left" style="display: flex;flex-direction: column;height: 100%">
          <el-form-item label="IP名称">
            <el-input size="mini" v-model="changeIpInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="IP地址">
            <el-input size="mini" v-model="changeIpInfo.ip"></el-input>
          </el-form-item>
          <el-form-item label="DNS">
            <el-input size="mini" v-model="changeIpInfo.dns"></el-input>
          </el-form-item>
          <el-form-item label="网关">
            <el-input size="mini" v-model="changeIpInfo.gateway"></el-input>
          </el-form-item>
          <el-form-item label="端口">
            <el-input-number size="mini" v-model="changeIpInfo.port" :min="0" :max="65000" :controls="false"></el-input-number>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input size="mini" v-model="changeIpInfo.username"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input size="mini" v-model="changeIpInfo.password"></el-input>
          </el-form-item>
          <el-form-item label="最大连接数">
            <el-input-number size="mini" v-model="changeIpInfo.connectionMax" :min="0" :max="100" label="描述文字"></el-input-number>
          </el-form-item>
        </el-form>
      </div>
    </Drawer>
  </div>
</template>

<script>
  import Drawer from '@/components/Drawer'
  export default {
    name: "IpProxy",
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
          name: '',
          ip: '',
          dns: '',
          gateway: '',
          port: 0,
          username: '',
          password: '',
          connectionMax: 0
        },
        changeIpPopShow: false,
        changeIpInfo: null
      }
    },
    computed: {

    },
    methods: {
      /* 获取ip列表 */
      getIpList () {
        let that = this
        that.$post(that.$uri.ipProxy.list, that.page).then(res => {
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
        this.$confirm("删除IP后已连接至该IP的设备会关闭IP代理并连接至公网IP，是否继续？", "提示", {
          confirmButtonText: '确定',
          confirmButtonClass: 'confirm-btn-red',
          iconClass: 'el-icon-c-red',
          cancelButtonText: '取消'
        }).then( () => {
          let that = this
          that.$post(that.$uri.ipProxy.del, {id}).then(res => {
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
        that.$post(that.$uri.ipProxy.add, that.addIpInfo).then(res => {
          if (res.success) {
            that.$message.success("录入成功")
            that.addIpPopShow = false
            that.getIpList()
          } else {
            that.$message.error(res.msg)
          }
        })
      },
      changeIp() {
        let that = this
        that.$post(that.$uri.ipProxy.save, that.changeIpInfo).then(res => {
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
    }
  };
</script>

<style lang="less" scoped>
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