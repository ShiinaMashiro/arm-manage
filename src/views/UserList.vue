<template>
  <div class="dev-list">
    <div class="dev-list-search">
      <div class="search-btn">
        <div style="display: flex;flex-direction: row;">
          <el-button size="small" type="primary" @click="addUserPopShow = true" v-if="$store.getters.checkChangeAuth()">添加用户</el-button>
          <div class="search-main-item" style="margin-left: 10px">
            <div class="item-input">
              <el-select v-model="searchInfo.groupId" size="small" placeholder="用户组">
                <el-option
                        v-for="item in searchOptions.userGroupOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div @keyup.enter="getUserList">
          <el-input size="small" placeholder="输入用户名 搜索" v-model="searchInfo.username" style="width: 320px">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </div>
        <!--<el-button type="text" size="small" @click="advancedShow = !advancedShow">高级筛选</el-button>-->
      </div>
      <!--<div class="search-advanced">
        <div class="search-main">
          <div class="search-main-item">
            <span>用户名:</span>
            <div class="item-input">
              <el-input v-model="searchInfo.username" size="mini"></el-input>
            </div>
          </div>
          <div class="search-main-item">
            <span>用户组:</span>
            <div class="item-input">
              <el-select v-model="searchInfo.groupId" size="mini" placeholder="用户组">
                <el-option
                        v-for="item in searchOptions.userGroupOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="search-btn">
          <el-button type="primary" size="mini" @click="getUserList">搜索</el-button>
        </div>
      </div>-->
    </div>
    <div class="device-case-dev border-all">
      <el-table ref="multipleTable" :data="info.list" :header-cell-style="{backgroundColor: '#efefef'}" size="mini" @row-click="checkRow" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="ID"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column label="用户组">
          <template slot-scope="scope">
            {{scope.row.groupName}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="changeUserPop(scope.row)" v-if="$store.getters.checkChangeAuth()">修改</el-button>
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
      <Drawer title="添加用户" :visible.sync="addUserPopShow" @handClick="addUser">
      <!--<el-dialog title="添加用户" :append-to-body="true" :visible.sync="addUserPopShow" width="500px" top="15vh">-->
        <div>
          <el-form ref="form" :model="addUserInfo" label-width="130px" label-position="left">
            <el-form-item label="用户名">
              <el-input v-model="addUserInfo.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="addUserInfo.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码">
              <el-input v-model="addUserInfo.password2" type="password"></el-input>
            </el-form-item>
            <el-form-item label="用户组">
              <el-select v-model="addUserInfo.groupId" placeholder="请选择">
                <el-option
                        v-for="item in searchOptions.userGroupOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <!--<el-form-item>
              <el-button type="primary" @click="addUser">确定</el-button>
              <el-button @click="addUserPopShow = false">取消</el-button>
            </el-form-item>-->
          </el-form>
        </div>
      </Drawer>
      <!-- 修改用户 -->
      <Drawer title="修改用户" :visible.sync="changeUserPopShow" @handClick="changeUser">
      <!--<el-dialog title="修改用户" :append-to-body="true" :visible.sync="changeUserPopShow" width="500px" top="15vh">-->
        <div>
          <el-form ref="form" :model="addUserInfo" label-width="130px" label-position="left">
            <el-form-item label="用户名">
              <span>{{changeUserInfo.username}}</span>
            </el-form-item>
            <el-form-item label="用户组">
              <el-select v-model="changeUserInfo.groupId" placeholder="请选择">
                <el-option
                        v-for="item in searchOptions.userGroupOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <!--<el-form-item>
              <el-button type="primary" @click="changeUser">确定</el-button>
              <el-button @click="changeUserPopShow = false">取消</el-button>
            </el-form-item>-->
          </el-form>
        </div>
      </Drawer>
    </div>
  </div>

</template>

<script>
  import Drawer from '@/components/Drawer'
  export default {
    name: "UserList",
    components: {Drawer},
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
          username: "",
          password: "",
          password2: "",
          groupId: ""
        },
        changeUserPopShow: false, // 显示修改用户弹窗
        changeUserInfo: {
          id: "",
          username: "",
          groupId: ""
        },
        searchInfo: {
          username: "",
          groupId: ""
        },
        searchOptions: {
          userGroupOption: []
        },
        groupClass: {}
      }
    },
    computed: {
      groupName (val) {
        return this.groupClass["id" + val]
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
        await that.$post(that.$uri.user.delete, {id})
      },
      /* 批量删除设备池 */
      deleteCaseBatch () {
        this.$confirm("删除后用户将无法登录系统？", "提示", {
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
          setTimeout(() => {that.getUserList()}, 1000)
        }).catch( () => {})
      },
      /* 获取选中的数据 */
      handleSelectionChange (val) {
        this.multipleSelection = val
        console.log(this.multipleSelection)
      },
      /* 获取设备列表 */
      getUserList () {
        let that = this
        that.$post(that.$uri.user.list, {...that.page, ...that.searchInfo}).then(res => {
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
      /* 获得用户组组信息 */
      getGroupList () {
        let that = this
        that.$post(that.$uri.user.groupList, {}).then(res => {
          let options = []
          let a = {}
          res.list.forEach(v => {
            options.push({
              value: v.id,
              label: v.groupName
            })
            a["id" + v.id] = v. groupName
          })
          this.searchOptions.userGroupOption = options
          this.groupClass = a
        })
      },
      /* 添加用户 */
      addUser () {
        if (!this.addUserInfo.username || !this.addUserInfo.password
          || !this.addUserInfo.password2 || !this.addUserInfo.groupId
          || this.addUserInfo.password !== this.addUserInfo.password2) {
          this.$message.error("信息为空或者两次密码不一致")
          return
        }
        let that = this
        that.$post(that.$uri.user.add, that.addUserInfo).then(res => {
          that.$message.success("添加成功")
          that.addUserPopShow = false
          that.getUserList()
        })
      },
      /* 修改用户弹窗 */
      changeUserPop (row) {
        this.changeUserInfo.id = row.id
        this.changeUserInfo.username = row.username
        this.changeUserInfo.groupId = row.groupId
        this.changeUserPopShow = true
      },
      /* 修改用户 */
      changeUser () {
        let that = this
        that.$post(that.$uri.user.infoSave, that.changeUserInfo).then(res => {
          that.$message.success("修改成功")
          that.changeUserPopShow = false
          that.getUserList()
        })
      }
    },
    mounted () {
      this.getUserList()
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