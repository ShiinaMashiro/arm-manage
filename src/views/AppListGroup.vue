<template>
  <div class="dev-list">
    <div class="device-case-dev border-all">
      <el-table ref="multipleTable" :data="info.list" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="groupName" label="分组名称"></el-table-column>
        <el-table-column prop="deviceNum" label="组内设备数量"></el-table-column>
        <el-table-column prop="appNum" label="组内应用数量"></el-table-column>
      </el-table>
      <div class="list-bottom">
        <div class="list-bottom-btn">
          <el-button size="small" plain @click="appGroupMerge"  v-if="$store.getters.checkChangeAuth()">关联分组</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "AppListGroup",
    data () {
      return {
        info: {
          success: false,
          list: [],
          total: 0
        },
        multipleSelection: [] // 选中的对象列表
      }
    },
    computed: {
    },
    methods: {
      /* 获取分组列表 */
      async getGroupList () {
        let that = this
        that.info = await that.$post(that.$uri.group.list, {})
      },
      /* 获取该应用关联的分组 */
      async getAppGroup (appId) {
        let that = this
        let res = await that.$post(that.$uri.group.list, {appId})
        return res.list
      },
      /* 获取选中的数据 */
      handleSelectionChange (val) {
        this.multipleSelection = val
        console.log(this.multipleSelection)
      },
      /* 初始化 */
      async init () {
        this.getGroupList()
        let list = await this.getAppGroup(this.$store.state.appInfo.appId)
        console.log(list)
        if (list) {
          list.forEach(v => {
            this.info.list.forEach(i => {
              if (v.id === i.id) {
                this.$refs.multipleTable.toggleRowSelection(i)
              }
            })
          })
        }
      },
      /* 应用关联分组 */
      appGroupMerge () {
        let list = []
        this.multipleSelection.forEach(v => {
          list.push(v.id)
        })
        let that = this
        that.$post(that.$uri.apk.apkGroupMerge, {
          appId: that.$store.state.appInfo.appId,
          groupIds: list
        }).then(res => {
          that.$message.success("关联分组成功")
          that.init()
        })
      }
    },
    mounted () {
      this.init()
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
          justify-content: space-between;
          flex-wrap: wrap;
          .search-main-item {
            width: 24%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            /*flex-grow: 1;*/
            padding: 5px 10px;
            span {
              font-size: 12px;
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