<template>
  <div class="faq-item">
    <div class="faq-item-q"><span style="color: red;">Q：</span>{{faq.title}}</div>
    <div class="faq-item-a">
      <div>A：</div>
      <div>
        <template v-for="(mes, index) in mesList">
          <div :key="index">{{mes}}</div>
        </template>
      </div>
    </div>
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
    },
    computed: {
      mesList() {
        console.log(this.faq.content)
        let temp = this.faq.content.split("\n");
        console.log(temp.length)
        return temp
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
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
  }
}
</style>