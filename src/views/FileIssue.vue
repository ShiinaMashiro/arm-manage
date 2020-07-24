<template>
  <div v-if="issueFile">
    <div style="text-align: left"><el-button size="small" type="primary" @click="issueFileR" :disabled="uploadFileExtraInfo.deviceIps.length === 0">分发文件</el-button></div>
    <hr style="border: 0.5px solid #DDD"/>
    <el-form ref="form" size="mini" label-width="auto" label-position="left">
      <el-form-item size="mini" label="文件名">
        <div style="text-align: left">{{issueFile.fileName}}</div>
      </el-form-item>
      <el-form-item size="mini" label="MD5">
        <div style="text-align: left">{{issueFile.md5}}</div>
      </el-form-item>
      <el-form-item size="mini" label="设备分发路径">
        <div style="text-align: left">{{issueFile.issuePath}}</div>
      </el-form-item>
      <el-form-item size="mini" label="上传时间">
        <div style="text-align: left">{{issueFile.updateTime}}</div>
      </el-form-item>
      <hr style="border: 0.5px solid #DDD"/>
      <el-form-item size="mini" label="选择云机">
        <div>
          <div style="text-align: left">
            <el-checkbox v-model="devAllSelect" @change="allSelectChangeHandle">全选</el-checkbox>
          </div>
          <div style="text-align: left;margin-left: 60px">
            <span style="width: 100px;display: inline-block;cursor: pointer" @click="sortHandle('id')">云机IP
              <span style="color: green;font-weight: bold;cursor: pointer" v-show="sortInfo.order === 'id'">{{sortInfo.p ? '&#8595' : '&#8593'}}</span>
            </span>
            <span style="width: 120px;margin: 0 20px;display: inline-block;cursor: pointer"  @click="sortHandle('remark')">备注
              <span style="color: green;font-weight: bold" v-show="sortInfo.order === 'remark'">{{sortInfo.p ? '&#8595' : '&#8593'}}</span>
            </span>
            <span @click="sortHandle('status')" style="cursor: pointer">状态
              <span style="color: green;font-weight: bold" v-show="sortInfo.order === 'status'">{{sortInfo.p ? '&#8595' : '&#8593'}}</span>
            </span>
          </div>
          <hr style="border: 0.5px solid #DDD"/>
          <el-tree v-if="groupList.length"
                   :props="props"
                   :load="loadNode"
                   ref="tree"
                   node-key="name"
                   lazy
                   show-checkbox
                   @check-change="handleCheckChange">
          <span slot-scope="{node, data}">
              <span style="display: inline-block;width:100px;text-align: left;vertical-align: middle">{{node.label}}</span>
              <span style="width: 120px;margin: 0 20px;display: inline-block;text-align: left;overflow: hidden;vertical-align: middle">{{data.remark}}</span>
              <span v-if="data.deviceStatus != undefined" :style="{color: data.deviceStatus === 3 ? 'red' : 'green'}">{{data.deviceStatus === 3 ? '故障' : '正常'}}</span>
          </span>
          </el-tree>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  let that
  export default {
    name: "FileIssue",
    data() {
      return {
        issueFile: null,
        props: {
          label: 'name',
          children: 'children',
          isLeaf: 'leaf'
        },
        groupList: [],
        uploadFileExtraInfo: {
          deviceIps: '',
        },
        allNum: 0,
        devAllSelect: false,
        sortInfo: {
          p: true, //true esc false desc
          order: 'id'
        }
      }
    },
    watch: {

    },
    methods: {
      sortHandle(order) {
        console.log(order)
        if (this.sortInfo.order === order) {
          this.sortInfo.p = !this.sortInfo.p
        } else {
          this.sortInfo.p = true
          this.sortInfo.order = order
        }
        let tree = this.$refs.tree
        this.groupList.forEach(g => {
          g.children.sort((d1, d2) => {
            let o1, o2
            if (order === 'id') {
              o1 = d1.deviceIp
              o2 = d2.deviceIp
            } else if (order === 'remark') {
              o1 = d1.remark
              o2 = d2.remark
            } else {
              o1 = d1.deviceStatus === 3 ? 1 : -1
              o2 = d2.deviceStatus === 3 ? 1 : -1
            }

            return (this.sortInfo.p ? (o1 < o2) : (o1 > o2)) ? -1 : 1
          })
          let temp = [...g.children]
          temp.forEach(d => {
            tree.remove(d)
            tree.append(d, g)
          })
   /*       temp.forEach(d => {
            tree.append(d, g)
          })*/
        })

        console.log(this.groupList)
      },
      allSelectChangeHandle(n) {
        let tree = this.$refs.tree
        if (n) {
          tree.setCheckedKeys(this.groupList.map(g => g.name))
        } else {
          tree.setCheckedNodes([])
        }
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
        console.log(s.length)
        this.devAllSelect = s.length === this.allNum
        this.uploadFileExtraInfo.deviceIps = s.join(",")
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
                  let list = res.list.sort((d1, d2) => {
                    return d1.deviceIp < d2.deviceIp ? -1 : 1
                  })
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
      issueFileR() {
        this.$loading()
        let that = this
        that.$post(that.$uri.file.fileIssue, {ids: that.issueFile.id, deviceIps: that.uploadFileExtraInfo.deviceIps }).then(res => {
          if (res.success) {
            that.$message.success("分发成功")
          } else {
            that.$message.error('分发失败')
          }
        }).finally(() => {
          this.$loading().close()
        })
      },
      getMyGroupList() {
        console.log("mmmmmmmmmmm")
        let that = this
        that.$post(that.$uri.group.list, {}).then(res => {
          if(res.success) {
            that.groupList = res.list.filter(g => g.deviceNum)
            that.allNum = that.groupList.reduce((d1, d2) => d1.deviceNum + d2.deviceNum)
            console.log(that.allNum)
          }
        })
      },
    },
    beforeCreate() {
      that = this
    },
    mounted() {
      this.issueFile = this.$store.state.fileIssueInfo
      this.getMyGroupList()
    }
  };
</script>

<style lang="scss" scoped>

</style>