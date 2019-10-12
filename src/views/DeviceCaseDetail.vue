<template>
  <div class="device-case-detail">
    <DetailTable></DetailTable>
  </div>
</template>

<script>
import DetailTable from "@/components/DetailTable"
export default {
  name: "DeviceCaseDetail",
  components: {
    DetailTable
  },
  data () {
    return {
      list: []
    }
  },
  mounted () {
    // this.list = this.$store.getters.detailTableList
    console.log(this.$route.path)
    console.log(this.$router.currentRoute.path)
  }
};
</script>

<style lang="less" scoped>

</style>