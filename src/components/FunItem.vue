<template>
  <div class="fun-item">
    <div class="fun-item-class">{{clazz.name}}</div>
    <div class="fun-item-list">
      <template v-for="(fun, index) in funList">
        <el-button type="text" @click="showFun(index)">{{fun.title}}</el-button>
      </template>
    </div>
  </div>
</template>

<script>
  export default {
    name: "FunItem",
    props: {
      clazz: Object
    },
    computed: {
      funList() {
        let funList = [...this.clazz.funList]
        funList.sort((a, b) => {
          return (a.sort || 0) - (b.sort || 0)
        })
        return funList
      }
    },
    methods: {
      showFun(index) {
        this.$store.commit(this.$mutation.FUN, this.funList)
        this.$store.commit(this.$mutation.HELP_INDEX, index)
        this.$router.push("/home/help/fun/show?index=" + index)
      }
    }
  };
</script>

<style lang="less" scoped>
.fun-item {
  display: flex;
  flex-direction: column;
  justify-content: left;
  padding: 5px 0;
  .fun-item-class {
    text-align: left;
  }
  .fun-item-list {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;

  }
}
</style>