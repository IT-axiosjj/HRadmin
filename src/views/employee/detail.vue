<template>
  <div class="dashboard-container">
    <div class="app-container">
      <div class="edit-form">
        <el-form
          ref="userform"
          label-width="220px"
          :model="userinfo"
          :rules="rules"
        >
          <!--姓名部门  -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名" prop="username">
                <el-input
                  v-model="userinfo.username"
                  size="mini"
                  class="inputW"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 工号 系统生成 禁用这个组件 -->
          <el-row>
            <el-col :span="12">
              <el-form-item prop="workNumber" label="工号">
                <el-input
                  v-model="userinfo.workNumber"
                  disabled
                  size="mini"
                  class="inputW"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 手机 聘用形式 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="手机" prop="mobile">
                <el-input
                  :disabled="!!this.$route.params.id"
                  v-model="userinfo.mobile"
                  size="mini"
                  class="inputW"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="部门" prop="departmentId">
                <!-- 放置部门组件 级联选择器 -->
                <!-- inputW样式会给到selectTree中 template第一层的组件 -->
                <selectTree class="inputW" v-model="userinfo.departmentId" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="聘用形式" prop="formOfEmployment">
                <el-select
                  v-model="userinfo.formOfEmployment"
                  size="mini"
                  class="inputW"
                >
                  <el-option label="正式" :value="1"></el-option>
                  <el-option label="非正式" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="入职时间" prop="timeOfEntry">
                <el-date-picker
                  size="mini"
                  type="date"
                  value-format="yyyy-MM-dd"
                  class="inputW"
                  v-model="userinfo.timeOfEntry"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="转正时间" prop="correctionTime">
                <el-date-picker
                  size="mini"
                  type="date"
                  class="inputW"
                  v-model="userinfo.correctionTime"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="员工头像">
                <!-- 放置上传图片  传给uplod 的头像地址-->
                <imageUpload v-model="userinfo.staffPhoto" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 保存个人信息 -->
          <el-row type="flex">
            <el-col :span="12" style="margin-left: 220px">
              <el-button size="mini" type="primary" @click="saveData"
                >保存更新</el-button
              >
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { addEmployee, getEmployeeDetail, updateEmployee } from "@/api/employee";
import selectTree from "./components/select-tree.vue";
import imageUpload from "./components/image-upload.vue";
export default {
  components: { selectTree, imageUpload },
  name: "Detail",

  data() {
    return {
      userinfo: {
        username: "", //用户名
        mobile: "", //手机号
        workNumber: "", //工号
        formOfEmployment: null, //聘用形式
        departmentId: null, //部门id
        timeOfEntry: "", //入职时间
        correctionTime: "", //转正时间
        // staffPhoto:
        //   "https://img0.baidu.com/it/u=454995986,3330485591&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=375",
        staffPhoto: "", //头像地址
      },
      // 表单校验规则
      rules: {
        username: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { min: 1, max: 4, message: "姓名为1-4位", trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
        formOfEmployment: [
          { required: true, message: "请选择聘用形式", trigger: "blur" },
        ],
        departmentId: [
          { required: true, message: "请选择部门", trigger: "blur" },
        ],
        timeOfEntry: [
          { required: true, message: "请选择入职时间", trigger: "blur" },
        ],
        correctionTime: [
          { required: true, message: "请选择转正时间", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (this.userinfo.timeOfEntry) {
                if (new Date(this.userinfo.timeOfEntry) > new Date(value)) {
                  callback(new Error("转正时间不能小于入职时间"));
                  return;
                }
              }
              callback();
            },
          },
        ],
      },
    };
  },
  created() {
    if (this.$route.params.id) {
      //获取角色详情
      this.getEmployeeDetail();
    }
    //简便写法
    // this.$route.params.id && this.getEmployeeDetail();
  },
  methods: {
    // 校验整个表单,保存更新按钮
    saveData() {
      this.$refs.userform.validate(async (isOk) => {
        if (isOk) {
          if (this.$route.params.id) {
            // 更新员工信息
            await updateEmployee(this.userinfo);
            this.$message.success("更新员工信息成功");
          } else {
            // 新增员工信息
            // 校验通过
            // 调用新增接口
            await addEmployee(this.userinfo);
            // 成功消息
            this.$message.success("新增员工成功");
          }

          // 跳转到员工列表页
          this.$router.push("/employee");
        }
      });
    },
    // 获取角色详情
    async getEmployeeDetail() {
      const result = await getEmployeeDetail(this.$route.params.id);
      console.log("result", result);
      // 回填数据
      this.userinfo = result;
    },
  },
};
</script>
<style scoped lang="scss">
.edit-form {
  background: #fff;
  padding: 20px;
  .inputW {
    width: 380px;
  }
}
</style>
