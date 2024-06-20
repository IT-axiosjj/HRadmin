<template>
  <div class="login-container">
    <div class="logo"></div>
    <div class="form">
      <h1>登录</h1>
      <el-card shadow="never" class="login-card">
        <!-- 登录表单 -->
        <el-form ref="form" :rules="rules" :model="loginForm">
          <el-form-item prop="mobile">
            <el-input
              v-model="loginForm.mobile"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              show-password
              placeholder="请输入密码"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="isAgree">
            <el-checkbox v-model="loginForm.isAgree">
              我已阅读并同意用户条例
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button @click="login" type="primary" style="width: 350px"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      // 判断是否是开发环境 如果是开发环境有默认值 不是开发环境为空
      loginForm: {
        mobile: process.env.NODE_ENV === "development" ? "13800000002" : "",
        password: process.env.NODE_ENV === "development" ? "hm#qd@23!" : "",
        isAgree: process.env.NODE_ENV === "development",
      },
      rules: {
        mobile: [
          { required: true, message: "手机号不能为空", trrigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入正确的手机号",
            trrigger: "blur",
          },
        ],
        password: [
          { required: true, message: "密码不能为空", trrigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "密码长度在6到18个字符",
            trrigger: "blur",
          },
        ],
        isAgree: [
          {
            // required只能检查 null or undefined ''不能校验布尔值
            validator: (rule, value, callback) => {
              // rule检验规则
              // value检验的值
              // callback() callback(new Error('错误信息'))
              value ? callback() : callback(new Error("请同意用户条例"));
            },
          },
        ],
      },
    };
  },
  methods: {
    // 整体表单校验
    login() {
      this.$refs.form.validate(async (isOk) => {
        if (isOk) {
          // 调用仓库的登录
          await this.$store.dispatch("user/login", this.loginForm);
          // 登录成功跳转到首页
          this.$router.push("/");
        }
      });
    },
  },
};
</script>
<style lang="scss">
.login-container {
  display: flex;
  align-items: stretch;
  height: 100vh;

  .logo {
    flex: 3;
    background: rgba(38, 72, 176) url(../../assets/common/login_back.png)
      no-repeat center / cover;
    border-top-right-radius: 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding: 0px 100px;
  }
  .icon {
    background: url(../../assets/common/logo.png) no-repeat 70px center contain;
    width: 300px;
    height: 50px;
    margin-bottom: 50px;
  }
  p {
    color: #fff;
    font-size: 18px;
    margin-top: 20px;
    text-align: center;
  }
  .form {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 176px;

    .el-card {
      border: none;
      padding: 0;
    }
    h1 {
      padding-left: 20px;
      font-size: 24px;
    }
    .el-input {
      width: 350px;
      height: 44px;

      .el-input__inner {
        background: #f4f5fb;
      }
    }
    .el-checkbox {
      color: #606266;
    }
  }
}
</style>
