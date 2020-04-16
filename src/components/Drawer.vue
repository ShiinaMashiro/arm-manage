<template>
  <el-drawer
          :title="title"
          :visible.sync="drawer"
          :append-to-body="true"
          direction="rtl">
    <div style="height: 100%;display: flex;flex-direction: column;border-top: thin solid #ddd;">
      <div style="flex-grow: 1;padding: 20px;overflow: auto;height: 600px;padding-bottom: 100px">
        <slot></slot>
      </div>
      <div style="position: fixed;bottom: 0;padding: 10px 20px;border-top: thin solid #ddd;width: 100%;background-color: white;z-index: 200">
        <el-button size="mini" type="primary" @click="$emit('handClick')">确定</el-button>
        <el-button size="mini" @click="close()">取消</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
  let that
  export default {
    name: "Drawer",
    props: {
      title: {
        type: String,
        default: ''
      },
      visible: {
        type: Boolean,
        default: false
      },
      beforeClose: {
        type: Function,
        default: () => {}
      }
    },
    data() {
      return {
        drawer: false
      }
    },
    watch: {
      visible(v) {
        this.drawer = v
      },
      drawer(v) {
        if (v !== this.visible) {
          this.$emit('update:visible', v)
        }
      }
    },
    methods: {
      close() {
        this.beforeClose(this.done)
      },
      done() {
        this.drawer = false
      }
    },
    beforeCreate() {
      that = this
    },
    mounted() {
      that.drawer = that.visible
    }
  };
</script>

<style lang="scss" scoped>

</style>