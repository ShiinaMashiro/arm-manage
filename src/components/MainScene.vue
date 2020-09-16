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

    <div class="collect" @click="collect">
      <el-tooltip effect="dark" content="收起菜单" placement="left">
        <svg t="1600248127083" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3775" width="200" height="200"><path d="M341.333333 1024a113.777778 113.777778 0 0 1-113.777777-113.777778V113.777778a113.777778 113.777778 0 0 1 113.777777-113.777778h455.111111v1024H341.333333z m277.959111-265.443556a41.130667 41.130667 0 0 0 41.642667 5.688889 33.792 33.792 0 0 0 21.617778-32.426666 32.768 32.768 0 0 0-12.288-23.608889L435.370667 497.379556l234.894222-210.830223a32.824889 32.824889 0 0 0 12.344889-23.552 32.085333 32.085333 0 0 0-9.841778-24.519111 39.537778 39.537778 0 0 0-26.168889-11.093333 40.277333 40.277333 0 0 0-27.306667 8.817778l-265.671111 236.145777a32.654222 32.654222 0 0 0-12.174222 23.438223 31.914667 31.914667 0 0 0 9.841778 24.462222l1.137778 1.137778 0.170666 0.170666 1.024 0.853334v0.113777l0.284445 0.113778 0.113778 0.170667z" fill="#ADB9C8" p-id="3776"></path></svg>
      </el-tooltip>
    </div>
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
    },
    collect() {
      this.$store.commit(this.$mutation.DISPLAY_SIDE, false)
    }
  },
  mounted () {
    console.log('mmmmmmmmmmmmmmmmmm')
    this.getGroupList()
  }
};
</script>

<style lang="less" scoped>
  .collect {
    width: 20px;
    height: 30px;
    position: absolute;
    right: 0;
    top: calc(50% - 15px);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
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