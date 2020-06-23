<template>
  <div class="main-scene" v-if="$store.state.sideInfo.scene">
    <nav class="nav-list">
      <div>
        <template v-for="(item, index) in sceneList">
          <MainSceneItem v-if="$store.getters.checkChildAuthor(item.author)" :key="index" :item="item"></MainSceneItem>
        </template>
        <el-popover
                v-if="$route.path.startsWith('/home/group') && groupList.length > 1"
                placement="right-start"
                trigger="click">
          <div style="display: flex;flex-direction: column">
            <el-button type="text" size="mini" v-for="group in groupList" :key="group.id" @click="switchGroup(group)">{{group.groupName}}</el-button>
          </div>
          <MainSceneItem slot="reference" :key="-2" :clickHandle="() => {}" :item="{name: '切换分组'}" :back="true"></MainSceneItem>
        </el-popover>
        <MainSceneItem :key="-1" :item="backItem" :back="true"></MainSceneItem>
      </div>
    </nav>
  </div>
</template>

<script>
import MainSceneItem from "@/components/MainSceneItem.vue"
export default {
  name: "MainScene",
  components: {
    MainSceneItem
  },
  data() {
    return {
      groupList: []
    }
  },
  computed: {
    childrenList () {
      return this.$store.state.sideItems[this.$store.state.sideCheck].children
    },
    /* 获取展示数据list */
    sceneList () {
      if (this.$route.path === '/home/app/upload') {
        return [this.$store.state.sideInfo.child.sceneList[0]]
      } else if (this.$route.path.startsWith('/home/app/')) {
        return this.$store.state.sideInfo.child.sceneList.slice(1, this.$store.state.sideInfo.child.sceneList.length)
      }
      return this.$store.state.sideInfo.child.sceneList
    },
    backItem() {
      return {
        name: '返回' + this.$store.state.sideInfo.child.name,
        path: this.$store.state.sideInfo.child.path
      }
    },
  },
  methods: {
    getGroupList() {
      let that = this
      that.$post(that.$uri.group.list).then(res => {
        console.log(res)
        if (res.success) {
          that.groupList = res.list
          console.log(this.groupList)
        }
      })
    },
    switchGroup(info) {
      this.$store.commit(this.$mutation.GROUP_DETAIL, info)
      this.$router.go(0)
    }
  },
  mounted () {
    console.log('mmmmmmmmmmmmmmmmmm')
    this.getGroupList()
  }
};
</script>

<style lang="less" scoped>
.main-scene {
  position: fixed;
  top: 140px;
  left: 230px;
  bottom: 0;
  width: 145px;
  overflow: hidden;
  display: flex;
  border-right: 1px solid #DDD;
  flex-direction: column;
  align-items: stretch;
  z-index: 1999!important;
  .nav-title {
    font-weight: bold;
    text-indent: 20px;
    width: 180px;
    height: 70px;
    line-height: 70px;
    background: #D9DEE4;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .i-back {
      font-size: 30px;
      color: #495060;
      font-weight: 900;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      text-indent: 0;
    }
  }
  .nav-list {
    flex-grow: 1;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
}
</style>