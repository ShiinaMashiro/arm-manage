<template>
  <div class="help-faq-list">
    <template v-for="(faq, index) in faqList">
      <FAQItem :faq="faq" :key="faq.id"></FAQItem>
    </template>
  </div>
</template>

<script>
  import FAQItem from "@/components/FAQItem.vue"
  export default {
    name: "HelpFAQ",
    components: {
      FAQItem
    },
    data() {
      return {
        faqList: [
          /*{
            title: "如何再设备上运行应用？",
            content: "再设备池管理->分组管理中对设备进行分组，在应用管理上传应用并关联至相关的分组，即可在设备运行相应的应用。"
          },{
            title: "如何再设备上运行应用？",
            content: "再设备池管理->分组管理中对设备进行分组，在应用管理上传应用并关联至相关的分组，即可在设备运行相应的应用。"
          },{
            title: "如何再设备上运行应用？",
            content: "再设备池管理->分组管理中对设备进行分组，在应用管理上传应用并关联至相关的分组，即可在设备运行相应的应用。"
          },{
            title: "如何再设备上运行应用？",
            content: "再设备池管理->分组管理中对设备进行分组，在应用管理上传应用并关联至相关的分组，即可在设备运行相应的应用。"
          },{
            title: "如何再设备上运行应用？",
            content: "再设备池管理->分组管理中对设备进行分组，在应用管理上传应用并关联至相关的分组，即可在设备运行相应的应用。"
          },{
            title: "如何再设备上运行应用？",
            content: "再设备池管理->分组管理中对设备进行分组，在应用管理上传应用并关联至相关的分组，即可在设备运行相应的应用。"
          },{
            title: "如何再设备上运行应用？",
            content: "再设备池管理->分组管理中对设备进行分组，在应用管理上传应用并关联至相关的分组，即可在设备运行相应的应用。"
          },{
            title: "如何再设备上运行应用？",
            content: "再设备池管理->分组管理中对设备进行分组，在应用管理上传应用并关联至相关的分组，即可在设备运行相应的应用。"
          },{
            title: "如何再设备上运行应用？",
            content: "再设备池管理->分组管理中对设备进行分组，在应用管理上传应用并关联至相关的分组，即可在设备运行相应的应用。"
          }*/
        ]
      }
    },
    methods: {
      getFaqList() {
        let that = this
        that.$post(that.$uri.help.faqList, {}).then(res => {
          if (res.success) {
            that.faqList = res.list
          }
        })
      }
    },
    mounted() {
      this.getFaqList()
    }
  };
</script>

<style lang="less" scoped>
  .help-faq-list {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
  }
</style>