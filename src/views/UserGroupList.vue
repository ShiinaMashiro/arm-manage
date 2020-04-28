<template>
  <div class="dev-list">
    <div class="dev-list-search">
      <div class="search-btn">
        <el-button size="small" type="primary" @click="addUserPop" v-if="$store.getters.checkChangeAuth()">添加用户组
        </el-button>
        <!--<el-button type="text" size="small" @click="advancedShow = !advancedShow">高级筛选</el-button>-->
      </div>
    </div>
    <div class="device-case-dev border-all">
      <el-table ref="multipleTable" :data="info.list" :header-cell-style="{backgroundColor: '#efefef'}" size="mini" @row-click="checkRow" tooltip-effect="dark"
                style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="ID"></el-table-column>
        <el-table-column prop="groupName" label="用户组"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="changeUserPop(scope.row)"
                       v-if="$store.getters.checkChangeAuth() && scope.row.id !== 1">修改
            </el-button>
            <!--<el-button type="text" size="small" @click="delUser(scope.row.id)" v-if="$store.getters.checkChangeAuth()">删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <div class="list-bottom">
        <div class="list-bottom-btn">
          <el-button size="small" :disabled="multipleSelection.length === 0" plain @click="deleteCaseBatch">删除
          </el-button>
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
      <Drawer title="添加用户组" :visible.sync="addUserPopShow" @handClick="addUser">
        <!--<el-dialog title="添加用户组" :append-to-body="true" :visible.sync="addUserPopShow" width="500px" top="15vh">-->
        <div>
          <el-form ref="form" :model="addUserInfo" label-width="130px" label-position="left">
            <el-form-item label="用户组名称">
              <el-input size="mini" v-model="addUserInfo.groupName"></el-input>
            </el-form-item>
            <el-form-item label="用户组类型">
              <span style="font-size: 14px">管理用户权限为管理设备池、设备和系统，业务用户权限仅为对分组内的设备进行操作</span>
              <el-radio-group v-model="addUserInfo.groupType" style="display: block">
                <el-radio-button label="1">管理员</el-radio-button>
                <el-radio-button label="2">业务用户</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="操作权限" v-if="addUserInfo.groupType == 1">
              <span style="font-size: 14px">可对模块进行操作，勾选后自动享有查看权限</span>
              <el-tree
                      ref="optTree"
                      :data="optData"
                      show-checkbox
                      node-key="id"
                      @check-change="optCheckChange"
                      :props="defaultProps">
              </el-tree>
            </el-form-item>
            <el-form-item label="查看权限"  v-if="addUserInfo.groupType == 1">
              <span style="font-size: 14px">可对模块进行操作，勾选后自动享有查看权限</span>
              <el-tree
                      ref="viewTree"
                      :data="viewData"
                      show-checkbox
                      node-key="id"
                      :props="defaultProps">
              </el-tree>
            </el-form-item>

            <el-card class="box-card" style="margin-bottom: 10px" v-if="$store.state.isAdmin && addUserInfo.groupType == 2">
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
          </el-form>
        </div>
      </Drawer>

      <!-- 修改用户 -->
      <Drawer title="修改用户组" :visible.sync="changeUserPopShow" @handClick="changeUser">
        <div>
          <el-form ref="form" :model="changeUserInfo" label-width="130px" label-position="left">
            <el-form-item label="用户组名称">
              <el-input size="mini" v-model="changeUserInfo.groupName"></el-input>
            </el-form-item>
            <el-form-item label="用户组类型">
              <span style="font-size: 14px">管理用户权限为管理设备池、设备和系统，业务用户权限仅为对分组内的设备进行操作</span>
              <el-radio-group v-model="changeUserInfo.groupType">
                <el-radio-button label="1">管理员</el-radio-button>
                <el-radio-button label="2">业务用户</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="操作权限" v-if="changeUserInfo.groupType == 1">
              <span style="font-size: 14px">可对模块进行操作，勾选后自动享有查看权限</span>
              <el-tree
                      ref="optChangeTree"
                      :data="optData"
                      show-checkbox
                      node-key="id"
                      @check-change="optChangeCheckChange"
                      :props="defaultProps">
              </el-tree>
            </el-form-item>
            <el-form-item label="查看权限"  v-if="changeUserInfo.groupType == 1">
              <span style="font-size: 14px">可对模块进行操作，勾选后自动享有查看权限</span>
              <el-tree
                      ref="viewChangeTree"
                      :data="viewData"
                      show-checkbox
                      node-key="id"
                      :props="defaultProps">
              </el-tree>
            </el-form-item>

            <el-card class="box-card" style="margin-bottom: 10px" v-if="$store.state.isAdmin && changeUserInfo.groupType == 2">
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
          </el-form>
        </div>
      </Drawer>
    </div>
  </div>

</template>

<script>
  import Drawer from '@/components/Drawer'

  export default {
    name: "UserGroupList",
    components: {Drawer},
    data() {
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
          authority: "",
          groupType: "1"
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
        groupSelectList: [],
        optData: [{
          id: '_0200_',
          query: '_0201_',
          label: '设备管理',
          children: [{
            id: '_0200_,1-0',
            query: '_0201_,1-1',
            label: '设备池',
          }, {
            id: '_0200_,2-0',
            query: '_0201_,2-1',
            label: '设备列表',
          }, {
            id: '_0200_,_0400_,3-0',
            query: '_0201_,_0401_,3-1',
            label: '分组列表',
          }, {
            id: '_0200_,4-0',
            query: '_0201_,4-1',
            label: '文件分发',
          }]
        }, {
          id: '_0300_',
          query: '_0301_',
          label: '应用管理',
          children: [{
            id: '_0300_,5-0',
            query: '_0301_,5-1',
            label: '应用列表'
          }, {
            id: '_0300_,6-0',
            query: '_0301_,6-1',
            label: '应用恢复'
          }, {
            id: '_0300_,7-0',
            query: '_0301_,7-1',
            label: '应用监控'
          }]
        }, {
          id: '_0500_',
          query: '_0501_',
          label: '日志管理',
          children: [{
            id: '_0500_,8-0',
            query: '_0501_,8-1',
            label: '操作日志'
          }, {
            id: '_0500_,9-0',
            query: '_0501_,9-1',
            label: '调度日志'
          }, {
            id: '_0500_,10-0',
            query: '_0501_,10-1',
            label: '分组日志'
          }]
        }, {
          id: '_0100_',
          query: '_0101_',
          label: '用户管理',
          children: [{
            id: '_0100_,11-0',
            query: '_0101_,11-1',
            label: '用户列表'
          }, {
            id: '_0100_,12-0',
            query: '_0101_,12-1',
            label: '用户组列表'
          }]
        }, {
          id: '_0000_',
          query: '_0001_',
          label: '系统管理',
          children: [{
            id: '_0000_,13-0',
            query: '_0001_,13-1',
            label: '系统信息'
          }, {
            id: '_0000_,14-0',
            query: '_0001_,14-1',
            label: '日志服务器配置'
          }]
        }],
        viewData: [{
          id: '_0901_',
          label: '预览',
        },{
          id: '_0201_',
          label: '设备管理',
          children: [{
            id: '_0201_,1-1',
            label: '设备池',
          }, {
            id: '_0201_,2-1',
            label: '设备列表',
          }, {
            id: '_0201_,_0401_,3-1',
            label: '分组列表',
          }, {
            id: '_0201_,4-1',
            label: '文件分发',
          }]
        }, {
          id: '_0301_',
          label: '应用管理',
          children: [{
            id: '_0301_,5-1',
            label: '应用列表'
          }, {
            id: '_0301_,6-1',
            label: '应用恢复'
          }, {
            id: '_0301_,7-1',
            label: '应用监控'
          }]
        }, {
          id: '_0501_',
          label: '日志管理',
          children: [{
            id: '_0501_,8-1',
            label: '操作日志'
          }, {
            id: '_0501_,9-1',
            label: '调度日志'
          }, {
            id: '_0501_,10-1',
            label: '分组日志'
          }]
        }, {
          id: '_0101_',
          label: '用户管理',
          children: [{
            id: '_0101_,11-1',
            label: '用户列表'
          }, {
            id: '_0101_,12-1',
            label: '用户组列表'
          }]
        }, {
          id: '_0001_',
          label: '系统管理',
          children: [{
            id: '_0001_,13-1',
            label: '系统信息'
          }, {
            id: '_0001_,14-1',
            label: '日志服务器配置'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    methods: {
      test() {
        let res = this.$refs.optTree.getCheckedNodes(false, true)
        console.log(res)
      },
      optCheckChange(node, check, third) {
        let opt = this.$refs.optTree.getCheckedNodes(false, false)
        let view = this.$refs.viewTree.getCheckedKeys(false)
        opt.forEach(node => {
          view.push(node.query)
        })
        let a = Array.from(new Set(view))
        this.$refs.viewTree.setCheckedKeys(a)
      },
      optChangeCheckChange(node, check, third) {
        let opt = this.$refs.optChangeTree.getCheckedNodes(false, false)
        let view = this.$refs.viewChangeTree.getCheckedKeys(false)
        opt.forEach(node => {
          view.push(node.query)
        })
        let a = Array.from(new Set(view))
        this.$refs.viewChangeTree.setCheckedKeys(a)
      },
      viewCheckChange(node, check, third) {
        let opt = this.$refs.optTree.getCheckedNodes(false, false)
        let view = this.$refs.viewTree.getCheckedKeys(false)
        opt.forEach(node => {
          view.push(node.query)
        })
        let a = Array.from(new Set(view))
        console.log(a)
        this.$refs.viewTree.setCheckedKeys(a)
      },
      /* 表单击行事件 */
      checkRow(r, c, e) {
        this.$refs.multipleTable.toggleRowSelection(r)
      },
      /* 删除设备池 */
      async deleteCase(id) {
        let that = this
        await that.$post(that.$uri.user.groupDelete, {id})
      },
      /* 批量删除设备池 */
      deleteCaseBatch() {
        this.$confirm("删除后组内所有用户将无法登录系统，是否继续？", "提示", {
          confirmButtonText: '确定',
          confirmButtonClass: 'confirm-btn-red',
          iconClass: 'el-icon-c-red',
          cancelButtonText: '取消'
        }).then(() => {
          this.multipleSelection.forEach(v => {
            this.deleteCase(v.id)
          })
          this.$message.success("删除完成")
          let that = this
          setTimeout(() => {
            that.getUserList()
          }, 1000)
        }).catch(() => {
        })
      },
      /* 获取选中的数据 */
      handleSelectionChange(val) {
        this.multipleSelection = val
        console.log(this.multipleSelection)
      },
      /* 全选 */
      checkAll() {
        let i = 0;
        this.authority.forEach(v => {
          i += v.value.length
        })
        this.authority.forEach(v => {
          v.value = i === 12 ? [] : [v.query, v.change]
        })
      },
      checkAllGroup() {
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
      getUserList() {
        let that = this
        that.$post(that.$uri.user.groupList, {...that.page}).then(res => {
          that.info = res
        })
      },
      /* 当前页改变 */
      currentChangeHandle(val) {
        this.page.startPage = val
        this.getUserList()
      },
      /* 每页条数改变 */
      sizeChangeHandle(val) {
        this.page.limit = val
        this.getUserList()
      },
      /* 添加用户组 */
      addUserPop() {
        this.authority.forEach(v => {
          v.value = []
        })
        this.groupSelectList = []
        this.addUserPopShow = true
      },
      /* 添加用户 */
      addUser() {
        if (!this.addUserInfo.groupName) {
          this.$message.error("用户组名称不能为空")
          return
        }
        if (this.addUserInfo.groupType == 1) {
          let optList = this.$refs.optTree.getCheckedKeys(false)
          let viewList = this.$refs.viewTree.getCheckedKeys(false)
          let list = [...optList, ...viewList]
          let str = list.join(',')
          list = str.split(',')
          list = Array.from(new Set(list))
          this.addUserInfo.authority = list.join(',')
        } else {
          this.addUserInfo.authority = '_0200_,_0201_,_0300_,_0301_,_0400_,_0401_,2-0,2-1,3-0,3-1,5-0,5-1,6-0,6-1'
        }
        console.log(this.addUserInfo.authority)
        let that = this
        that.$post(that.$uri.user.groupAdd, that.addUserInfo).then(res => {

          if (that.$store.state.isAdmin && that.groupSelectList.length > 0) {
            that.$post(that.$uri.user.groupMerge, {
              userGroupId: res.data.id,
              groupIds: that.groupSelectList.join(",")
            }).then(res => {
              that.groupSelectList = []
            })
          }
          that.$message.success("添加成功")
          that.addUserPopShow = false
          that.getUserList()
        })
      },
      /* 修改用户弹窗 */
      changeUserPop(row) {
        this.changeUserInfo.id = row.id
        this.changeUserInfo.groupName = row.groupName
        this.changeUserInfo.groupType = row.groupType + ''
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
      changeUser() {
        if (!this.changeUserInfo.groupName) {
          this.$message.error("用户组名称不能为空")
          return
        }
        if (this.changeUserInfo.groupType == 1) {
          let optList = this.$refs.optChangeTree.getCheckedKeys(false)
          let viewList = this.$refs.viewChangeTree.getCheckedKeys(false)
          let list = [...optList, ...viewList]
          let str = list.join(',')
          list = str.split(',')
          list = Array.from(new Set(list))
          this.changeUserInfo.authority = list.join(',')
        } else {
          this.changeUserInfo.authority = '_0200_,_0201_,_0300_,_0301_,_0400_,_0401_,2-0,2-1,3-0,3-1,5-0,5-1,6-0,6-1'
        }
        let that = this
        that.$post(that.$uri.user.groupInfoSave, that.changeUserInfo).then(res => {
          if (that.$store.state.isAdmin && (this.changeUserInfo.groupType == 2)) {
            that.$post(that.$uri.user.groupMerge, {
              userGroupId: that.changeUserInfo.id,
              groupIds: that.groupSelectList.join(",")
            }).then(res => {
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
    mounted() {
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