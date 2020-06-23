<template>

</template>

<script>

  let that
  export default {
    name: "SSH",
    data() {
      return {

      }
    },
    methods: {

    },
    beforeCreate() {
      that = this
    },
    mounted() {
      this.$store.commit(this.$mutation.SSH_INFO, {show: true, start: true})
    },
    beforeDestroy() {
      this.$store.commit(this.$mutation.SSH_INFO, {show: false, start: true})
    }
  };
</script>

<style lang="less" scoped>

</style>