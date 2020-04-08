<template>
  <div class="dev-list">
    <div class="dev-list-search">
      <div class="search-btn">
        <el-button size="small" type="primary" @click="addUserPop" v-if="$store.getters.checkChangeAuth()">添加用户组</el-button>
        <!--<el-button type="text" size="small" @click="advancedShow = !advancedShow">高级搜索</el-button>-->
      </div>
    </div>
    <div class="device-case-dev border-all">
      <el-table ref="multipleTable" :data="info.list" @row-click="checkRow" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="ID"></el-table-column>
        <el-table-column prop="groupName" label="用户组"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="changeUserPop(scope.row)" v-if="$store.getters.checkChangeAuth() && scope.row.id !== 1">修改</el-button>
            <!--<el-button type="text" size="small" @click="delUser(scope.row.id)" v-if="$store.getters.checkChangeAuth()">删除</el-button>-->
          </template>
        </el-table-column>
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
      <!-- 添加用户 -->
      <el-dialog title="添加用户组" :append-to-body="true" :visible.sync="addUserPopShow" width="500px" top="15vh">
        <div>
          <el-form ref="form" :model="addUserInfo" label-width="130px" label-position="left">
            <el-form-item label="用户组名称">
              <el-input v-model="addUserInfo.groupName"></el-input>
            </el-form-item>
            <!--<el-card class="box-card" style="margin-bottom: 10px">
              <div slot="header" class="clearfix">
                <span>管理权限</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="checkAll">全选</el-button>
              </div>
              <template v-for="(item, index) in authority">
                <el-checkbox-group v-model="item.value" :key="index" size="mini">
                  <el-checkbox-button disabled label="">{{item.name}}</el-checkbox-button>
                  <el-checkbox-button :label="item.query">查看</el-checkbox-button>
                  <el-checkbox-button :label="item.change">修改</el-checkbox-button>
                </el-checkbox-group>
              </template>
            </el-card>-->
            <el-card class="box-card" style="margin-bottom: 10px" v-if="$store.state.isAdmin">
              <div slot="header" class="clearfix">
                <span>关联分组</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="checkAllGroup">全选</el-button>
              </div>
              <el-checkbox-group v-model="groupSelectList">
                <template v-for="(group, index) in groupList">
                  <el-checkbox :label="group.id" :key="group.id">{{group.groupName}}</el-checkbox>
                </template>
              </el-checkbox-group>
            </el-card>
            <el-form-item>
              <el-button type="primary" @click="addUser">确定</el-button>
              <el-button @click="addUserPopShow = false">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
      <!-- 修改用户 -->
      <el-dialog title="修改用户组" :append-to-body="true" :visible.sync="changeUserPopShow" width="500px" top="15vh">
        <div>
          <el-form ref="form" :model="changeUserInfo" label-width="130px" label-position="left">
            <el-form-item label="用户组名称">
              <el-input v-model="changeUserInfo.groupName"></el-input>
            </el-form-item>
            <!--<el-card class="box-card" style="margin-bottom: 10px">
              <div slot="header" class="clearfix">
                <span>管理权限</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="checkAll">全选</el-button>
              </div>
              <template v-for="(item, index) in authority">
                <el-checkbox-group v-model="item.value" :key="index" size="mini">
                  <el-checkbox-button disabled label="">{{item.name}}</el-checkbox-button>
                  <el-checkbox-button :label="item.query">查看</el-checkbox-button>
                  <el-checkbox-button :label="item.change">修改</el-checkbox-button>
                </el-checkbox-group>
              </template>
            </el-card>-->
            <el-card class="box-card" style="margin-bottom: 10px" v-if="$store.state.isAdmin">
              <div slot="header" class="clearfix">
                <span>关联分组</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="checkAllGroup">全选</el-button>
              </div>
              <el-checkbox-group v-model="groupSelectList">
                <template v-for="(group, index) in groupList">
                  <el-checkbox :label="group.id" :key="group.id">{{group.groupName}}</el-checkbox>
                </template>
              </el-checkbox-group>
            </el-card>
            <el-form-item>
              <el-button type="primary" @click="changeUser">确定</el-button>
              <el-button @click="changeUserPopShow = false">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </div>
  </div>

</template>

<script>
  export default {
    name: "UserGroupList",
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
        multipleSelection: [],
        addUserPopShow: false, // 显示手动添加弹窗
        addUserInfo: {
          groupName: "",
          authority: ""
        },
        changeUserPopShow: false, // 显示修改用户弹窗
        changeUserInfo: {
          id: "",
          groupName: "",
          authority: ""
        },
        authority: [
          {
            name: "系统管理",
            query: "_0001_",
            change: "_0000_",
            value: []
          },
          {
            name: "用户管理",
            query: "_0101_",
            change: "_0100_",
            value: []
          },
          {
            name: "设备管理",
            query: "_0201_",
            change: "_0200_",
            value: []
          },
          {
            name: "应用管理",
            query: "_0301_",
            change: "_0300_",
            value: ""
          },
          /*{
            name: "分组管理",
            query: "_0401_",
            change: "_0400_",
            value: []
          },*/
          {
            name: "日志管理",
            query: "_0501_",
            change: "_0500_",
            value: []
          }
        ],
        groupList: [],
        groupSelectList: []
      }
    },
    methods: {
      /* 表单击行事件 */
      checkRow(r, c ,e) {
        this.$refs.multipleTable.toggleRowSelection(r)
      },
      /* 删除设备池 */
      async deleteCase (id) {
        let that = this
        await that.$post(that.$uri.user.groupDelete, {id})
      },
      /* 批量删除设备池 */
      deleteCaseBatch () {
        this.$confirm("删除后组内所有用户将无法登录系统，是否继续？", "提示", {
          confirmButtonText: '确定',
          confirmButtonClass: 'confirm-btn-red',
          iconClass: 'el-icon-c-red',
          cancelButtonText: '取消'
        }).then( () => {
          this.multipleSelection.forEach(v => {
            this.deleteCase(v.id)
          })
          this.$message.success("删除完成")
          let that = this
          setTimeout(() => {that.getUserList()}, 1000)
        }).catch( () => {})
      },
      /* 获取选中的数据 */
      handleSelectionChange (val) {
        this.multipleSelection = val
        console.log(this.multipleSelection)
      },
      /* 全选 */
      checkAll () {
        let i = 0;
        this.authority.forEach(v => {
          i += v.value.length
        })
        this.authority.forEach(v => {
          v.value = i === 12 ? [] : [v.query, v.change]
        })
      },
      checkAllGroup () {
        let all = []
        if (this.groupSelectList.length < this.groupList.length) {
          this.groupList.forEach(g => {
            all.push(g.id)
          })
        }
        console.log(all)
        console.log(this.groupSelectList)
        this.$set(this, 'groupSelectList', all)
      },
      /* 获取用户组列表 */
      getUserList () {
        let that = this
        that.$post(that.$uri.user.groupList, {...that.page}).then(res => {
          that.info = res
        })
      },
      /* 当前页改变 */
      currentChangeHandle (val) {
        this.page.startPage = val
        this.getUserList()
      },
      /* 每页条数改变 */
      sizeChangeHandle (val) {
        this.page.limit = val
        this.getUserList()
      },
      /* 添加用户组 */
      addUserPop () {
        this.authority.forEach(v => {
          v.value = []
        })
        this.groupSelectList = []
        this.addUserPopShow = true
      },
      /* 添加用户 */
      addUser () {
        if (!this.addUserInfo.groupName) {
          this.$message.error("用户组名称不能为空")
          return
        }
        let list = []
        this.authority.forEach(v => {
            list = [...list, ...v.value]
        })
        // this.addUserInfo.authority = list.join()
        this.addUserInfo.authority = '_0200_,_0201_,_0300_,_0301_,_0400_,_0401_'
        let that = this
        that.$post(that.$uri.user.groupAdd, that.addUserInfo).then(res => {

          if (that.$store.state.isAdmin && that.groupSelectList.length > 0) {
            that.$post(that.$uri.user.groupMerge, {userGroupId: res.data.id, groupIds: that.groupSelectList.join(",")}).then(res => {
              that.groupSelectList = []
            })
          }
          that.$message.success("添加成功")
          that.addUserPopShow = false
          that.getUserList()
        })
      },
      /* 修改用户弹窗 */
      changeUserPop (row) {
        this.changeUserInfo.id = row.id
        this.changeUserInfo.groupName = row.groupName
        let a = row.authority
        this.authority.forEach(v => {
          let list = []
          if (a.indexOf(v.query) !== -1) {
            list.push(v.query)
          }
          if (a.indexOf(v.change) !== -1) {
            list.push(v.change)
          }
          v.value = list
        })
        let that = this
        that.$post(that.$uri.group.list, {userGroupId: row.id}).then(res => {
          if (res.success) {
            let s = []
            res.list.forEach(g => {
              s.push(g.id)
            })
            that.groupSelectList = s
          }
        })
        this.changeUserPopShow = true
      },
      /* 修改用户 */
      changeUser () {
        if (!this.changeUserInfo.groupName) {
          this.$message.error("用户组名称不能为空")
          return
        }
        let list = []
        this.authority.forEach(v => {
          list = [...list, ...v.value]
        })
        // this.changeUserInfo.authority = list.join()
        this.changeUserInfo.authority = '_0200_,_0201_,_0300_,_0301_,_0400_,_0401_'
        let that = this
        that.$post(that.$uri.user.groupInfoSave, that.changeUserInfo).then(res => {
          if (that.$store.state.isAdmin) {
            that.$post(that.$uri.user.groupMerge, {userGroupId: that.changeUserInfo.id, groupIds: that.groupSelectList.join(",")}).then(res => {
              that.groupSelectList = []
            })
          }
          that.$message.success("修改成功")
          that.changeUserPopShow = false
          that.getUserList()
        })
      },
      getGroupList() {
        let that = this
        that.$post(that.$uri.group.list, {}).then(res => {
          if (res.success) {
            that.groupList = [...res.list]
          }
        })
      }
    },
    mounted () {
      this.getUserList()
      if (this.$store.state.isAdmin) {
        this.getGroupList()
      }
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
            /*width: 24%;*/
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
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