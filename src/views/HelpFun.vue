<template>
  <div>
    <div class="help-fun">
      <template v-for="clazz in classes">
        <FunItem :clazz="clazz" :key="clazz.id"></FunItem>
      </template>
    </div>
    <div class="help-fun-pdf">
      <span class="help-fun-pdf-title">龙境安卓云系统管理软件用户手册.pdf</span>
      <el-button type="text" @click="pdfDownload">点击下载</el-button>
    </div>
  </div>
</template>

<script>
  import FunItem from "@/components/FunItem.vue"
  export default {
    name: "HelpFun",
    components: {
      FunItem
    },
    data() {
      return {
        classes: [
          /*{
            id: 0,
            name: "设备管理",
            funList: [
              {
                id: 0,
                title: "设备池",
                content: "## 我是你爹"
              },{
                id: 0,
                title: "设备池",
                content: "## 我是你爹"
              },{
                id: 0,
                title: "设备池",
                content: "## 我是你爹"
              },{
                id: 0,
                title: "设备池",
                content: "## 我是你爹"
              },{
                id: 0,
                title: "设备池",
                content: "## 我是你爹"
              },{
                id: 0,
                title: "设备池",
                content: "## 我是你爹"
              },{
                id: 0,
                title: "设备池",
                content: "## 我是你爹"
              }
            ]
          },{
            id: 0,
            name: "设备管理",
            funList: [
              {
                id: 0,
                title: "设备池",
                content: "## 我是你爹"
              },{
                id: 0,
                title: "设备池",
                content: "## 我是你爹"
              },{
                id: 0,
                title: "设备池",
                content: "## 我是你爹"
              },{
                id: 0,
                title: "设备池",
                content: "## 我是你爹"
              },{
                id: 0,
                title: "设备池",
                content: "## 我是你爹"
              },{
                id: 0,
                title: "设备池",
                content: "## 我是你爹"
              },{
                id: 0,
                title: "设备池",
                content: "## 我是你爹"
              }
            ]
          }*/
        ]
      }
    },
    methods: {
      pdfDownload() {
        this.$message({
          type: 'info',
          message: `测试`
        });
      },
      getClasses() {
        let that = this
        let classList = []
        let funList = []
        that.$post(that.$uri.help.funClassList, {}).then(res => {
          if (res.success) {
            classList = res.list
            that.$post(that.$uri.help.funList, {}).then(r => {
              if (r.success) {
                funList = r.list
                classList.sort((a, b) => {
                  return (a.sort || 0) - (b.sort || 0)
                })
                classList.forEach(c => {
                  c.funList = []
                })
                funList.forEach(f => {
                  classList.forEach(c => {
                    if (f.categoryId == c.id) {
                      c.funList.push(f)
                    }
                  })
                })
                that.classes = classList
              }
            })
          }
        })
      }
    },
    mounted() {
      this.getClasses()
    }
  };
</script>

<style lang="less" scoped>
  .help-fun {
    margin: 20px;
  }
  .help-fun-pdf {
    border-top: 1px solid #DDD;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-left: 20px;
    .help-fun-pdf-title {
      margin-right: 10px;
      font-size: 14px;
    }
  }
</style>