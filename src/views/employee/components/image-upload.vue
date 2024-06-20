<template>
  <el-upload
    class="avatar-uploader"
    action=""
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
    :http-request="uploadImage"
  >
    <!-- （自动上传）action 上传地址 -->
    <!-- show-file-list展示列表 -->
    <img v-if="value" :src="value" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>

<script>
// 上传腾讯云的包
import COS from "cos-js-sdk-v5";
export default {
  name: "ImageUpload",
  props: {
    // 接收父组件传递过来的头像地址
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },

  mounted() {},

  methods: {
    // 检查文件类型 大小 return true（继续上传）/false(停止上传)
    beforeAvatarUpload(file) {
      const isJPG = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/bmp",
      ].includes(file.type);
      // 图片大小
      const isLt2M = file.size / 1024 / 1024 < 5;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是PNG GIF BMP JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 5MB!");
      }
      return isJPG && isLt2M;
    },
    // 选择图片上传
    uploadImage(params) {
      console.log(params.file);
      const cos = new COS({
        // 应用标识
        SecretId: "AKIDOf1HKHJCDGLWlInBiBaqzIfGlaSG6rii",
        // 应用秘钥
        SecretKey: "HONQPNHEHMNJ6nXEwhO7wlVI62vqjU6e",
      }); //完成cos对象的初始化
      cos.putObject(
        {
          Bucket: "beer-1325656503", //存储桶名称
          Region: "ap-nanjing", //地域名称
          Key: params.file.name, //文件名称
          StorageClass: "STANDARD", //固定值
          Body: params.file, //文件对象
        },
        (err, data) => {
          if (data.statusCode === 200 && data.Location) {
            // 拿到腾讯云返回的地址
            // 通过input自定义事件将地址传出去
            // 将地址返回了
            this.$emit("input", "http://" + data.Location);
          } else {
            // 上传失败提示信息
            this.$message.error(err.message);
          }
        }
      );
    },
  },
};
</script >
<style >
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
