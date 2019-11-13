<template>
  <div>
    <mavon-editor v-model="markDownData"></mavon-editor>
  </div>
</template>

<script>
  export default {
    name: "Manage",
    data() {
      return {
        markDownData: '# Nacos学习笔记\n' +
          '\n' +
          '## 介绍\n' +
          'Nacos 致力于帮助您发现、配置和管理微服务。Nacos 提供了一组简单易用的特性集，帮助您快速实现**动态服务发现**、**服务配置**、**服务元数据**及**流量管理**。\n'
      }
    }
  };
</script>

<style lang="less" scoped>

</style>