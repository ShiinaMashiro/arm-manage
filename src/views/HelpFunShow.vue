<template>
  <div style="width: 100%">
    <mavon-editor
      :value="$store.state.funList[parseInt($route.query.index)].content || '# 无内容'"
      :subfield = "prop.subfield"
      :defaultOpen = "prop.defaultOpen"
      :toolbarsFlag = "prop.toolbarsFlag"
      :editable="prop.editable"
      :scrollStyle="prop.scrollStyle"
    ></mavon-editor>
  </div>
</template>

<script>
  export default {
    name: "HelpFunShow",
    computed: {
      prop () {
        return {
          subfield: false,// 单双栏模式
          defaultOpen: 'preview',//edit： 默认展示编辑区域 ， preview： 默认展示预览区域
          editable: false,
          toolbarsFlag: false,
          scrollStyle: true
        }
      }
    },
    beforeCreate() {
      document.getElementsByClassName('home-main')[0].style.zIndex = 1022
    },
    beforeDestroy() {
      document.getElementsByClassName('home-main')[0].style.zIndex = 0
    }
  };
</script>

<style lang="less" scoped>

</style>