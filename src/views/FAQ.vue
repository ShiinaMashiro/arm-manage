<template>
  <div>
    <div class="search-btn">
      <el-button size="small" type="primary" @click="addPopShow = true"  v-if="$store.getters.checkChangeAuth()">添加FAQ</el-button>
    </div>

    <div v-if="info.success" class="device-case border-all">
      <el-table ref="multipleTable" :data="info.list" @row-click="checkRow" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="title" label="提问"></el-table-column>
        <el-table-column prop="content" label="回答"></el-table-column>
        <el-table-column prop="sort" label="排序"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="changeFaqPop(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="list-bottom">
        <div class="list-bottom-btn">
          <el-button size="small" plain :disabled="multipleSelection.length === 0" @click="deleteFAQBatch"  v-if="$store.getters.checkChangeAuth()">删除</el-button>
        </div>
        <!--<el-pagination
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"
                :current-page="page.startPage"
                :page-sizes="[20, 50, 100]"
                :page-size="page.limit"
                layout="total, sizes, prev, pager, next"
                :total="info.total">
        </el-pagination>-->
      </div>
    </div>
    <!-- 添加faq -->
    <el-dialog title="添加FAQ" :append-to-body="true"
               :close-on-click-modal="false" :show-close="false" top="15vh"
               :visible.sync="addPopShow" width="500px">
      <div>
        <el-form ref="form" :model="addInfo" :rules="rules" label-width="130px" label-position="left">
          <el-form-item label="提问" prop="title">
            <el-input v-model="addInfo.title"></el-input>
          </el-form-item>
          <el-form-item label="回答" prop="content">
            <el-input v-model="addInfo.content"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model="addInfo.sort"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addFaq">确定</el-button>
            <el-button @click="addPopShow = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 修改faq -->
    <el-dialog title="修改FAQ" :append-to-body="true" top="15vh"
               :close-on-click-modal="false" :show-close="false"
               :visible.sync="changePopShow" width="500px">
      <div>
        <el-form ref="changeForm" :model="changeInfo" :rules="rules" label-width="130px" label-position="left">
          <el-form-item label="提问" prop="title">
            <el-input v-model="changeInfo.title"></el-input>
          </el-form-item>
          <el-form-item label="回答" prop="content">
            <el-input v-model="changeInfo.content"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model="changeInfo.sort"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="changeFaq">确定</el-button>
            <el-button @click="changePopShow = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "FAQ",
    data () {
      return {
        info: {
          success: false,
          list: [],
          total: 0
        },
        page: {
          startPage: 1,
          limit: 20
        },
        multipleSelection: [],
        addPopShow: false,
        addInfo: {
          title: "",
          content: "",
          sort: 0
        },
        changePopShow: false,
        changeInfo: {
          id: "",
          title: "",
          content: "",
          sort: 0
        },
        rules: {
          title: [
            {required: true, message: "提问不能为空", trigger: "blur"},
            {max: 100, message: "提问长度不超过100个字符", trigger: "blur"}
          ],
          content: [
            {required: true, message: "回答不能为空", trigger: "blur"},
            {max: 300, message: "回答长度不超过300个字符", trigger: "blur"}
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
    computed: {
      selectIds () {
        let list = []
        this.multipleSelection.forEach(v => {
          list.push(v.id)
        })
        return list
      }
    },
    methods: {
      /* 表单击行事件 */
      checkRow(r, c ,e) {
        this.$refs.multipleTable.toggleRowSelection(r)
      },
      /* 获取FAQ列表 */
      getFAQList () {
        let that = this
        that.$post(that.$uri.help.faqList, {}).then(res => {
          that.info = res
        })
      },
      /* 当前页改变 */
      currentChangeHandle (val) {
        this.page.startPage = val
        this.getDeviceCaseList()
      },
      /* 每页条数改变 */
      sizeChangeHandle (val) {
        this.page.limit = val
        this.getDeviceCaseList()
      },
      /* 获取选中的数据 */
      handleSelectionChange (val) {
        this.multipleSelection = val
        console.log(this.multipleSelection)
      },
      /* 删除FAQ */
      async deleteFAQ (id) {
        let that = this
        await that.$post(that.$uri.help.faqDelete, {id})
      },
      /* 批量删除FAQ */
      deleteFAQBatch () {
        this.$confirm("确认批量删除FAQ？", "提示", {
          type: "warning"
        }).then( () => {
          this.multipleSelection.forEach(v => {
            this.deleteFAQ(v.id)
          })
          this.$message.success("删除完成")
          let that = this
          setTimeout(() => {that.getFAQList()}, 1000)
        }).catch( () => {})
      },
      /* 添加faq */
      addFaq() {
        let that = this
        that.$refs.form.validate(valid => {
          if (valid) {
            that.$post(that.$uri.help.faqAdd, that.addInfo).then(res => {
              if (res.success) {
                that.addPopShow = false
                that.$message.success("添加成功")
                that.getFAQList()
              } else {
                that.$message.success(res.message)
              }
            })
          }
        })
      },
      /* 修改faq弹窗 */
      changeFaqPop(row) {
        this.changeInfo = row
        this.changePopShow = true
      },
      /* 修改faq */
      changeFaq() {
        let that = this
        that.$refs.changeForm.validate(valid => {
          if (valid) {
            that.$post(that.$uri.help.faqModify, that.changeInfo).then(res => {
              if (res.success) {
                that.changePopShow = false
                that.$message.success("修改成功")
                that.getFAQList()
              } else {
                that.$message.success(res.message)
              }
            })
          }
        })
      }
    },
    mounted () {
      this.getFAQList()
    }
  };
</script>

<style lang="less" scoped>
  .device-case {
    .list-bottom {
      padding: 10px 8px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      .list-bottom-btn {
        display: flex;
        flex-direction: row;
      }
    }
  }
  .search-btn {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10px;
  }
</style>