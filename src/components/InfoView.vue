<template>
  <div class="info-view" @keyup.enter="savePre">
    <div class="info-view-title">{{title}}</div>
    <div class="info-view-main">
      <span class="info-view-item" style="font-size: 12px" v-if="msg">{{msg}}</span>
      <template v-for="(item, index) in itemList">
        <div :key="index" class="info-view-item">
          <span style="color: red;" v-if="isEdit && item.notNull">*</span>
          <span>{{item.name}}：</span>
          <span v-if="!isEdit || !item.edit">{{item.show ? item.show(editInfo[item.key]) : editInfo[item.key]}}</span>
          <template v-else>
            <el-input v-if="!item.type" size="mini" v-model="item.value" style="width: 150px"></el-input>
            <el-switch v-else v-model="item.value"
                       :active-value="item.active"
                       :inactive-value="item.inactive"></el-switch>
          </template>
        </div>
      </template>
      <div class="info-view-item-btn">
        <el-button size="small" type="primary" v-if="!isEdit && $store.getters.checkChangeAuth()" @click="edit">{{editBtnName || '设置'}}</el-button>
        <el-button size="small" type="primary" :disabled="!canSave" v-if="isEdit" @click="savePre">保存</el-button>
        <el-button size="small" type="info" v-if="isEdit" @click="cancel">取消</el-button>
      </div>
    </div>

  </div>
</template>

<script>
  let that
  export default {
    name: "InfoView",
    props: {
      title: String,
      msg: String,
      refName: String,
      list: Array,
      info: Object,
      editBtnName: String,
      save: Function
    },
    data() {
      return {
        str: '',
        isEdit: false,
        editInfo: {},
        itemList: {}
      }
    },
    computed: {
      canSave() {
        for (let item of this.itemList) {
          if (item.notNull && !item.value) {
            return false
          }
        }
        return true
      }
    },
    methods: {
      edit () {
        this.isEdit = true
      },
      cancel () {
        this.isEdit = false
      },
      savePre() {
        this.itemList.forEach(item => {
          this.editInfo[item.key] = item.value
        })
        this.save(this.editInfo, this.refName)
      }
    },
    created() {
      this.itemList = this.list
      this.editInfo = JSON.parse(JSON.stringify(this.info))
      this.itemList.forEach(item => {
        item.value = ''
        item.value = this.editInfo[item.key]
      })
      console.log(JSON.stringify(this.info))
    }
  };
</script>

<style lang="less" scoped>
  .info-view {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 10px;
    border-bottom: 1px solid #E1E6EB;
    .info-view-title {
      text-align: left;
      font-size: 14px;
      font-weight: 600;
      padding: 5px 10px;
    }
    .info-view-main {
      padding: 10px 10px 10px 120px;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      align-items: left;
      justify-content: flex-start;
      .info-view-item {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        padding: 2px 0;
        height: 30px;
      }
      .info-view-item-btn {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        padding: 5px 0;
      }
    }
  }
</style>