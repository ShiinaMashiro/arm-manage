<template>
  
</template>

<script>
  let that
  export default {
    name: "Ops",
    data() {
      return {}
    },
    methods: {},
    beforeCreate() {
      that = this
    },
    mounted() {
      this.$store.dispatch(this.$action.LOGIN, {
        username: this.$route.params.username,
        password: md5(this.$route.params.password),
        save: false
      })
    }
  };
</script>

<style lang="scss" scoped>

</style>