<template>
  <el-dialog :title="showTitle" :visible="showDialog" @close="close">
    <el-form label-width="120px" ref="form" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="2-10个字符"
          style="width: 80%"
          size="mini"
        ></el-input>
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="formData.code"
          placeholder="2-10个字符"
          style="width: 80%"
          size="mini"
        ></el-input>
      </el-form-item>
      <el-form-item label="部门负责人" prop="managerId">
        <el-select v-model="formData.managerId" placeholder="请选择负责人">
          <!-- 下拉选项 循环 负责人数据 label表示显示的字段 value 存储字段 -->
          <el-option
            v-for="item in managerList"
            :key="item.id"
            :label="item.username"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          :rows="4"
          type="textarea"
          placeholder="1-100个字符"
          style="width: 80%"
          size="mini"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="btnOk" type="primary">确定</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import {
  getDepartment,
  getDepartmentDetail,
  getManagerList,
  addDepartment,
  updateDepartment,
} from "@/api/department";
export default {
  name: "AddDept",
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    currentNodeId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      managerList: [], //存储负责人列表
      formData: {
        code: "", //部门编码
        introduce: "", //部门介绍
        managerId: "", //部门负责人id
        name: "", //部门名称
        pid: "", //上级部门id
      },
      rules: {
        code: [
          { required: true, message: "部门编码不能为空", trigger: "blur" },
          { min: 2, max: 10, message: "部门编码2-10个字符", trigger: "blur" },
          {
            trigger: "blur",
            // 自定义校验模式
            validator: async (rule, value, callback) => {
              // value就是输入的编码
              let result = await getDepartment();
              // 判断是否是编辑模式
              if (this.formData.id) {
                // 编辑场景
                result = result.filter((item) => item.id !== this.formData.id);
              }
              // result数组中是否存在 value值
              if (result.some((item) => item.code === value)) {
                callback(new Error("部门中已经有该编码了"));
              } else {
                callback();
              }
            },
          },
        ],
        introduce: [
          { required: true, message: "部门介绍不能为空", trigger: "blur" },
          { min: 1, max: 100, message: "部门介绍1-100个字符", trigger: "blur" },
        ],
        managerId: [
          { required: true, message: "部门负责人不能为空", trigger: "blur" },
        ],
        name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
          { min: 2, max: 10, message: "部门编码2-10个字符", trigger: "blur" },
          {
            trigger: "blur",
            validator: async (rule, value, callback) => {
              // value就是输入的编码id
              let result = await getDepartment();
              // 判断是否是编辑模式
              if (this.formData.id) {
                // 编辑场景 排除自身id
                result = result.filter((item) => item.id !== this.formData.id);
              }
              // result数组中是否存在value值id
              if (result.some((item) => item.name === value)) {
                callback(new Error("部门名称已存在"));
              } else {
                callback();
              }
            },
          },
        ],
      },
    };
  },

  created() {
    this.getManagerList();
  },
  methods: {
    close() {
      //  修改父组件的值 子传父
      this.$emit("update:showDialog", false);
      // 重置表单 只能重置在模板中绑定的数据
      // this.$refs.form.resetFields();
      this.formData = {
        code: "", //部门编码
        introduce: "", //部门介绍
        managerId: "", //部门负责人id
        name: "", //部门名称
        pid: "", //上级部门id
      };
    },

    async getManagerList() {
      const result = await getManagerList();
      this.managerList = result;
    },
    // 确认按钮
    btnOk() {
      // this.pid = this.currentNodeId;
      // console.log("currentNodeId", this.currentNodeId);
      this.$refs.form.validate(async (isOk) => {
        if (isOk) {
          // let msg = "新增";
          // 通过 formData中的id判断新增还是更新
          if (this.formData.id) {
            // 更新
            await updateDepartment(this.formData);
          } else {
            // 新增
            await addDepartment({ ...this.formData, pid: this.currentNodeId });
          }

          // 通知父组件更新
          this.$emit("updateDepartment");
          // 提示消息
          this.$message.success(
            this.formData.id ? "更新部门成功" : "新增部门成功"
          );
          // 关闭弹层
          this.close();
          console.log(this.pid);
        }
      });
    },
    // 获取组织详情
    async getDepartmentDetail() {
      const result = await getDepartmentDetail(this.currentNodeId);
      // 将获取的值赋值给表单
      this.formData = result;
    },
  },
  computed: {
    showTitle() {
      return this.formData.id ? "编辑部门" : "新增部门";
    },
  },
};
</script>
