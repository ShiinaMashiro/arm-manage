<template>
  <div>
    <el-form ref="form" :rules="rules" :inline="true" :model="info" class="demo-form-inline">
      <el-form-item size="mini" label="标题" prop="title">
        <el-input v-model="info.title"></el-input>
      </el-form-item>
      <el-form-item size="mini" label="排序" prop="sort">
        <el-input v-model="info.sort"></el-input>
      </el-form-item>
      <el-form-item size="mini" label="大类">
        <el-select v-model="info.categoryId" placeholder="大类">
          <template v-for="clazz in classList">
            <el-option :key="clazz.id" :label="clazz.name" :value="clazz.id"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="running" @click="addFun">保存</el-button>
      </el-form-item>
    </el-form>
    <mavon-editor v-model="info.content" @imgAdd="imgAdd" @imgDel="imgDel"></mavon-editor>
  </div>
</template>

<script>
  import axios from "axios"
  export default {
    name: "FunChange",
    data() {
      return {
        loading: null,
        running: false,
        classList: [],
        fileList: [],
        fileData: {folder: "img"},
        imgList: [],
        info: {
          id: 0,
          title: "",
          content: "",
          sort: 0,
          categoryId: 0
        },
        rules: {
          title: [
            {required: true, message: "标题不能为空", trigger: "blur"},
            {max: 10, message: "标题长度不超过10个字符", trigger: "blur"}
          ],
          sort: [
            {validator: (rule, value, callback) => {
                value = parseInt(value)
                if (!value) {
                  return callback(new Error('排序不能为空'));
                }
                setTimeout(() => {
                  if (!Number.isInteger(value)) {
                    callback(new Error('请输入整数'));
                  } else {
                    if (value < 0 || value > 300) {
                      callback(new Error('0-300'));
                    } else {
                      callback();
                    }
                  }
                }, 1000);
              }, trigger: "blur"},
          ],
        }
      }
    },
    methods: {
      /* 获取class列表 */
      getClassList () {
        let that = this
        that.$post(that.$uri.help.funClassList, {}).then(res => {
          that.classList = res.list
          this.info.categoryId = that.classList[0].id
        })
      },
      async imgUpload(img) {
        console.log("hhhhhhhhhhhhhhhhhhhhhh")
        console.log(img)
        let that = this
        let formData = new FormData()
        formData.append("file", img.imgfile)
        formData.append("folder", "img")
        await axios.post(that.$uri.help.funImgAdd, formData, {
          headers: {
            "Content-Type": "multiple/form-data",
            ...this.$store.state.userInfo,
            userId: this.$store.state.userInfo.id
          }
        })
      },
      addFun() {
        let that = this
        this.$refs.form.validate(valid => {
          if (valid) {
            this.running = true
            this.loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            this.imgList.forEach(img => {
              let str = "[" + img.imgfile.name + "](" + img.filename + ")"
              let reStr = "[" + img.imgfile.name + "](/upload/img/" + img.imgfile.name + ")"
              this.info.content = this.info.content.replace(str, reStr)
            })
            that.$post(that.$uri.help.funModify, that.info).then(res => {
              if (res.success) {
                that.imgList.forEach(img => {
                  this.imgUpload(img)
                })
                that.$message.success("修改成功")
                that.loading.close()
                that.$router.push("/home/fun")
              } else {
                that.$message.error(res.message)
                that.running = false
                that.loading.close()
              }
            })
          }
        })
      },
      imgAdd(filename, imgfile) {
        console.log(filename)
        console.log(imgfile)
        this.imgList.push({filename, imgfile})
      },
      imgDel(filename, imgfile) {
        let index = -1;
        for (let k in this.imgList) {
          if (this.imgList[k].filename === filename) {
            index = k
            break
          }
        }
        if (index >= 0) {
          this.imgList.splice(index, 1)
        }
      }
    },
    mounted() {
      this.getClassList()
      this.info = this.$store.state.changeFun
    }
  };
</script>

<style lang="less" scoped>

</style>