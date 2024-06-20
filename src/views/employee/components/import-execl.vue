<template>
  <el-dialog
    width="500px"
    title="员工导入"
    :visible="showExcelDialog"
    @close="$emit('update:showExcelDialog', false)"
  >
    <el-row type="flex" justify="center">
      <div class="upload-excel">
        <input
          ref="excel-upload-input"
          class="excel-upload-input"
          type="file"
          accept=".xlsx, .xls"
          @change="uploadChange"
        />
        <div class="drop">
          <i class="el-icon-upload" />
          <el-button type="text" @click="getExportemplate"
            >下载导入模板</el-button
          >
          <span
            >将文件拖到此处或
            <el-button type="text" @click="handleUpload">点击上传</el-button>
          </span>
        </div>
      </div>
    </el-row>
    <el-row type="flex" justify="end">
      <!-- update:props属性名，值 直接修改 .sync修饰符的属性值 -->
      <el-button
        size="mini"
        type="primary"
        @click="$emit('update:showExcelDialog', false)"
        >取消</el-button
      >
    </el-row>
  </el-dialog>
</template>
<script>
import { getExportemplate, uploadExcel } from "@/api/employee";
//使用npm包 直接将blob文件下载到本地 file-saver
import FileSaver from "file-saver";
export default {
  props: {
    showExcelDialog: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    // 调用后台接口下载模板
    async getExportemplate() {
      const result = await getExportemplate();
      // 下载导入模板
      FileSaver.saveAs(result, "员工导入模板.xlsx");
    },
    // 弹出文件选择器-只有一种方式 通过input file
    handleUpload() {
      this.$refs["excel-upload-input"].click(); //this.refs.属性名 和this.refs[属性名]等价
    },
    async uploadChange() {
      // alert("文件上传");
      const files = event.target.files;
      if (files.length > 0) {
        // 大于0  说明有文件要上传
        const data = new FormData();
        // file:file类型
        data.append("file", files[0]); //将文件参数加入到formData中
        try {
          await uploadExcel(data); //调用接口上传excel文件
          //  成功
          this.$emit("uploadSuccess"); //通知父组件 我上传成功
          this.$emit("update:showExcelDialog", false); //关闭弹层
          this.$message.success("上传成功");
        } catch (error) {
          // 捕获失败
        } finally {
          // 不管成功还是失败 都清空input file的值
          this.$refs["excel-upload-input"].value = "";
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.upload-excel {
  display: flex;
  justify-content: center;
  margin: 20px;
  width: 360px;
  height: 180px;
  align-items: center;
  color: #697086;
  .excel-upload-input {
    display: none;
    z-index: -9999;
  }
  .btn-upload,
  .drop {
    border: 1px dashed #dcdfe6;
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 160px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .drop {
    line-height: 40px;
    color: #bbb;
    i {
      font-size: 60px;
      display: block;
      color: #c0c4cc;
    }
  }
}
</style>
