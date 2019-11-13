<template>
  <div class="faq-item">
    <div class="faq-item-q"><span style="color: red;">Q:</span>{{faq.title}}</div>
    <div class="faq-item-a">A:{{faq.content}}</div>
  </div>
</template>

<script>
  export default {
    name: "FAQItem",
    props: {
      faq: {
        type: Object,
        default: () => {
          return {
            id: "",
            title: "",
            content: "",
            sort: ""
          }
        }
      }
    }
  };
</script>

<style lang="less" scoped>
.faq-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: 15px;
  .faq-item-q {
    text-align: left;
    padding: 5px 0;
  }
  .faq-item-a {
    text-align: left;
    padding: 5px 0;
  }
}
</style>