<template>
  <div class="dev-list">
    <div class="dev-list-search">
      <div class="search-btn">
        <el-button size="small" type="primary" @click="confirmSaveDev" v-if="$store.state.isAdmin">保存修改</el-button>
        <el-select v-model="searchInfo.engineType" size="small" placeholder="引擎版本" style="margin-left: 10px">
          <el-option
                  v-for="item in searchOptions.version"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
          </el-option>
        </el-select>
        <!--<el-button type="text" size="small" @click="advancedShow = !advancedShow">高级筛选</el-button>-->
      </div>
      <!--<div class="search-advanced">
        <div class="search-main">
          <div class="search-main-item">
            <span>选择引擎版本:</span>
            <div class="item-input">
              <el-select v-model="searchInfo.engineType" size="mini" placeholder="引擎版本">
                <el-option
                        v-for="item in searchOptions.version"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
              </el-select>
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
        <el-tab-pane label="未分配设备" name="first">
          <el-table ref="multipleTableFirst" :data="infoFirst.list" max-height="400px" :header-cell-style="{backgroundColor: '#efefef'}"
                    @row-click="checkRowFirst"
                    tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChangeFirst">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="id" label="ID" min-width="50px">
              <template slot-scope="scope">
                {{scope.row.cardType === 1 ? scope.row.id : "分层"}}
              </template>
            </el-table-column>
            <el-table-column prop="slotNo" label="槽位号"></el-table-column>
            <el-table-column prop="deviceIp" label="设备IP"></el-table-column>
            <el-table-column prop="deviceNo" label="设备编号"></el-table-column>
            <el-table-column prop="version" label="设备版本" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="softinstalled" label="应用安装数量"></el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <span :style="scope.row | statusClassFilter">
                  {{scope.row.deviceStatus | statusStr}}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="groupName" label="分组"></el-table-column>
            <el-table-column prop="disk" label="空间">
              <template slot-scope="scope">
                {{scope.row.disk}}/{{scope.row.diskSd}}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="分组内设备" name="second">
          <el-table ref="multipleTableSecond" :data="infoSecond.list" max-height="400px" :header-cell-style="{backgroundColor: '#efefef'}"
                    @row-click="checkRowSecond"
                    tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChangeSecond">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="id" label="ID" min-width="50px">
              <template slot-scope="scope">
                {{scope.row.cardType === 1 ? scope.row.id : "分层"}}
              </template>
            </el-table-column>
            <el-table-column prop="slotNo" label="槽位号"></el-table-column>
            <el-table-column prop="slotNo" label="终端标志"></el-table-column>
            <el-table-column prop="deviceIp" label="设备IP"></el-table-column>
            <el-table-column prop="deviceNo" label="设备编号"></el-table-column>
            <el-table-column prop="version" label="设备版本" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="softinstalled" label="应用安装数量"></el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                {{scope.row.deviceStatus | statusStr}}
              </template>
            </el-table-column>
            <el-table-column prop="groupName" label="分组"></el-table-column>
            <el-table-column prop="disk" label="空间">
              <template slot-scope="scope">
                {{scope.row.disk}}/{{scope.row.diskSd}}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "GroupListDevManage",
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
        engineType: ""
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
  watch: {
    ['searchInfo.engineType']() {
      this.init()
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
    /* 获取未分配设备列表 */
    getDeviceListForFirst () {
      let that = this
      that.$post(that.$uri.device.deviceList, {groupId: 0, ...that.searchInfo}).then(res => {
        let list = []
        res.list.forEach(v => {
          if (v.cardType === 1) {
            list.push(v)
          }
        })
        that.infoFirst.list = list
      })
    },
    /* 获取分组内设备列表 */
    getDeviceListForSecond () {
      let that = this
      that.$post(that.$uri.device.deviceList, {groupId: that.$store.state.groupInfo.id, ...that.searchInfo}).then(res => {
        that.infoSecond = res
        this.$refs.multipleTableSecond.toggleAllSelection()
      })
    },
    init () {
      this.getDeviceListForFirst()
      this.getDeviceListForSecond()
    },
    /* 获取选中的数据 */
    handleSelectionChangeFirst (val) {
      this.multipleSelectionFirst = val
    },
    /* 获取选中的数据 */
    handleSelectionChangeSecond (val) {
      this.multipleSelectionSecond = val
    },
    /* 获取所有引擎版本信息 */
    getEngineVersion () {
      let that = this
      that.$post(that.$uri.system.engineList, {}).then(res => {
        let list = []
        list.push({
          label: "全部",
          value: ""
        })
        res.data.forEach(v => {
          list.push({
            label: v.engineTypeName,
            value: v.engineType
          })
        })
        that.searchOptions.version = list
      })
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
        ips.push(v.deviceIp)
      })
      this.multipleSelectionSecond.forEach(v => {
        ips.push(v.deviceIp)
      })
      let params = {
        id: this.$store.state.groupInfo.id,
        deviceIps: ips
      }
      let that = this
      that.$post(that.$uri.group.deviceMerge, params).then(res => {
        that.$message.success("关联成功")
        that.init()
      })
    }
  },
  filters: {
    statusStr (deviceStatus) {
      switch (deviceStatus) {
        case 0: return "正常";
        case 1: return "未更新";
        case 2: return "应用安装中";
        case 3: return "故障";
        case 4: return "预启动";
        case 5: return "清理中";
        case 6: return "升级中";
        case 7: return "应用结束中";
      }
    },statusClassFilter (row) {
      if (row.isFlow === 1) return {color: "green"}
      switch (row.deviceStatus) {
        case 0: return {color: "#333"};
        case 3: return {color: "red"};
        default: return {color: "#eab820"}
      }
    }
  },
  mounted () {
    this.init()
    this.getEngineVersion()
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
        justify-content: flex-start;
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