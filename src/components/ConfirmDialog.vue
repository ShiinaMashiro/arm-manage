<template>
  <div>
    <el-dialog
            title="提示" top="15vh"
            :visible.sync="show"
            :before-close="handleClose"  width="500px">
      <span>{{message}}</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="show = false">取 消</el-button>
    <el-button type="primary" @click="onSuccess">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ConfirmDialog",
  props: {
    value: Boolean,
    message: String,
    onSuccess: Function
  },
  data () {
    return {
      show: false
    }
  },
  watch: {
    show (val) {
      this.$emit("input", val)
    },
    value (val) {
      this.show = val
    }
  },
  mounted () {
    this.show = this.value
  }
};
</script>

<style lang="less" scoped>

</style>