<template>
  <el-container>
    <el-header>
      <div class="template_div">
        <span>请下载港口信息上传模板，按格式修改后导入</span>
        <el-button type="primary" @click.native="getDemo()">下载<i class="el-icon-download el-icon--right" /></el-button>
      </div>
    </el-header>
    <el-main>
      <div class="upload_div">
        <div class="upload_container">
          <el-upload
            v-loading="listLoading"
            class="upload-demo"
            drag
            element-loading-text="导入中请稍候"
            action="https://jsonplaceholder.typicode.com/posts/"
            :http-request="uploadFile"
            :limit="1"
            :on-exceed="fileExceed"

          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">将文件拖拽至此处，或<em>点击上传</em><p>请按照规范上传excel文件</p></div>
          </el-upload>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { edownload } from '../../utils/request'
import { fileUpload } from '../../utils/request' //  封装好的axios:get post请求（含headers和拦截器等【代码略】）
export default {
  name: 'Upload',
  data() {
    return {
      values: '',
      fileList: [],
      type: 'type',
      name: 'Demo',
      listLoading: false,
    }
  },
  methods: {
    submitbtn01() {
      alert('上传成功')
    },
    getDemo() {
      edownload()
    },
    uploadError() {
      this.$message.error('上传失败')
    },
    fileExceed() {
      this.$message.error('别贪心！一次只能上传一个哦~')
    },
    // 请求成功
    importSuccess(res) {
      // 后端的返回码--上传成功
      if (res.status === '200') {
        // 显示√图标
        const e = document.getElementsByClassName('el-upload-list__item-status-label')
        e[0].setAttribute('style', 'display:block !important')
        // 成功提示
        this.$message.success(res.msg)
        // 重新调用列表请求（代码略）
      } else {
        // 隐藏√图标
        const e = document.getElementsByClassName('el-upload-list__item-status-label')
        e[0].setAttribute('style', 'display:none !important')
        // 失败提示--及后端返回的失败详情
        this.$message.error({
          dangerouslyUseHTMLString: true,
          duration: 4500,
          message: res.msg
        })
      }
    },
    // 自定义上传
    uploadFile(item) {
      this.listLoading = true
      const form = new FormData()
      form.append('file', item.file)
      fileUpload('/api/file/upload', form).then(res => {
        this.listLoading = false
        const r = res.data.header
        this.importSuccess(r)
      })
    }
  }
}
</script>

<style scoped>
  .cotainer{
    height: 400px;
  }
  .upload_container{
    /*position: relative;*/
    display: flex;
    justify-content: center;
  }
  .upload-demo{
    /*position: absolute;*/
  }
  .span_div{
    font-size: 15px;
    text-align: center;
  }
  .upload_div{
    position: absolute;
    padding: 1.4cm;
    margin-left: 27.5%;
    margin-top: 50px;
    border: 1px solid #DDE1E4;
  }
  .template_div{
    padding: 0.4cm 0.7cm;
    background-color: #FFEFD5;
    margin-top: 40px;
    margin-left: 27.5%;
    text-align: center;
    position: absolute;
    border: 1px solid #FFD100;
  }
</style>
