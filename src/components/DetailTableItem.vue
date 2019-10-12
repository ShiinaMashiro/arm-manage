<template>
  <div class="detail-table-item">
    <span class="name">{{name}}:</span>
    <span class="param">{{param}}</span>
  </div>
</template>

<script>
export default {
  name: "DetailTableItem",
  props: {
    name: String,
    param: String
  }
};
</script>

<style lang="less" scoped>
.detail-table-item {
  border: .5px solid #ebeef5;
  /*margin-bottom: -1px;*/
  /*margin-right: -1px;*/
  padding: 10px 8px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  .name {
    color: #999 !important;
    font-size: 12px;
  }
  .param {
    padding-left: 6px;
    font-size: 12px;
    color: #303133;
  }
}
</style>