<template>
  <div class="dev-list">
    <div class="dev-list-search">
      <div class="search-btn">
        <el-button size="small" type="primary" @click="confirmSaveDev" v-if="$store.getters.checkChangeAuth()">保存修改</el-button>
        <div @keyup.enter="init">
          <el-input size="small" placeholder="输入应用名称/APPID 搜索" v-model="searchInfo.queryParam" style="width: 320px">
            <el-button slot="append" icon="el-icon-search" @click="init"></el-button>
          </el-input>
        </div>
        <!--<el-button type="text" size="small" @click="advancedShow = !advancedShow">高级筛选</el-button>-->
      </div>
      <!--<div class="search-advanced">
        <div class="search-main">
          <div class="search-main-item">
            <span>应用名称:</span>
            <div class="item-input">
              <el-input v-model="searchInfo.appNameLike" size="mini"></el-input>
            </div>
          </div>
          <div class="search-main-item">
            <span>APPID:</span>
            <div class="item-input">
              <el-input v-model="searchInfo.appId" size="mini"></el-input>
            </div>
          </div>
        </div>
        <div class="search-btn">
          <el-button type="primary" size="mini" @click="init">搜索</el-button>
          &lt;!&ndash;<el-button size="mini" @click="advancedShow = false">取消</el-button>&ndash;&gt;
        </div>
      </div>-->
    </div>
    <div class="device-case-dev border-all">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="未分配应用" name="first">
          <el-table ref="multipleTableFirst" :data="infoFirst.list" :header-cell-style="{backgroundColor: '#efefef'}"
                    @row-click="checkRowFirst" max-height="400px" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChangeFirst">
            <el-table-column type="selection" align="center" header-align="center"></el-table-column>
            <el-table-column prop="appName" label="应用名称"></el-table-column>
            <el-table-column prop="packageName" label="包名"></el-table-column>
            <el-table-column prop="versionName" label="版本"></el-table-column>
            <el-table-column prop="appId" label="APPID"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="分组内应用" name="second">
          <el-table ref="multipleTableSecond" :data="infoSecond.list" :header-cell-style="{backgroundColor: '#efefef'}"
                    @row-click="checkRowSecond" max-height="400px" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChangeSecond">
            <el-table-column type="selection" align="center" header-align="center"></el-table-column>
            <el-table-column prop="appName" label="应用名称"></el-table-column>
            <el-table-column prop="packageName" label="包名"></el-table-column>
            <el-table-column prop="versionName" label="版本"></el-table-column>
            <el-table-column prop="appId" label="APPID"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  export default {
    name: "GroupListAppManage",
    data () {
      return {
        activeName: "first",
        infoFirst: {
          success: false,
          list: [],
          total: 0
        },
        infoSecond: {
          success: false,
          list: [],
          total: 0
        },
        multipleSelectionFirst: [], // 选中的对象列表
        multipleSelectionSecond: [], // 选中的对象列表
        searchInfo: {
          // appNameLike: "",
          // appId: "",
          apkStatus: 1,
          queryParam: ""
        },
        searchOptions: {
          version: []
        }
      }
    },
    computed: {
      addDevOptions () {
        return [
          {
            label: "分层处理器",
            value: 0
          }, ...this.options
        ]
      }
    },
    methods: {
      /* 未分配设备表单击行事件 */
      checkRowFirst(r, c ,e) {
        this.$refs.multipleTableFirst.toggleRowSelection(r)
      },
      /* 组内设备表单击行事件 */
      checkRowSecond(r, c ,e) {
        this.$refs.multipleTableSecond.toggleRowSelection(r)
      },
      /* 获取所有应用列表 */
      async getDeviceListForFirst () {
        let that = this
        return await that.$post(that.$uri.apk.apkList, {...that.searchInfo})
      },
      /* 获取分组内应用列表 */
      async getDeviceListForSecond () {
        let that = this
        that.infoSecond = await that.$post(that.$uri.apk.apkList, {groupId: that.$store.state.groupInfo.id, ...that.searchInfo})
        that.$refs.multipleTableSecond.toggleAllSelection()
      },
      /* 初始化 */
      async init () {
        let res = await this.getDeviceListForFirst()
        await this.getDeviceListForSecond()

        // 去掉分组内的应用
        let listFirst = []
        res.list.forEach(v => {
          let mark = true
          for (let i in this.infoSecond.list) {
            if (v.id === this.infoSecond.list[i].id) {
              mark = false
              break
            }
          }
          if (mark) {
            listFirst.push(v)
          }
        })
        this.infoFirst.list = listFirst
      },
      /* 获取选中的数据 */
      handleSelectionChangeFirst (val) {
        this.multipleSelectionFirst = val
      },
      /* 获取选中的数据 */
      handleSelectionChangeSecond (val) {
        this.multipleSelectionSecond = val
      },
      /* 确认保存修改 */
      confirmSaveDev () {
        this.$confirm("确认保存修改？", "提示", {
          confirmButtonText: '确定',
          confirmButtonClass: 'confirm-btn-blue',
          iconClass: 'el-icon-c-blue',
          cancelButtonText: '取消'
        }).then( () => {
          this.saveDev()
        }).catch( () => {})
      },
      /* 保存修改 */
      saveDev () {
        let ips = []
        this.multipleSelectionFirst.forEach(v => {
          ips.push(v.appId)
        })
        this.multipleSelectionSecond.forEach(v => {
          ips.push(v.appId)
        })
        let params = {
          id: this.$store.state.groupInfo.id,
          appIds: ips
        }
        let that = this
        that.$post(that.$uri.group.apkMerge, params).then(res => {
          that.$message.success("关联成功")
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
          justify-content: flex-start;
          flex-wrap: wrap;
          .search-main-item {
            /*width: 24%;*/
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
        justify-content: flex-start;
        align-items: center;
        .list-bottom-btn {
          display: flex;
          flex-direction: row;
        }
      }
    }
  }
</style>