<template>
  <!-- element-ui 级联组件 -->
  <el-cascader
    :value="value"
    size="mini"
    separator="-"
    :options="treeData"
    :props="props"
    @change="changeValue"
  />
</template>

<script>
import { getDepartment } from "@/api/department";
// 转换数组结构为树形结构
import { transListToTreeData } from "@/utils";
export default {
  name: "SelectTree",
  // 从父组件接收的数据
  props: {
    value: {
      type: Number, //存储部门的id
      default: null,
    },
  },
  data() {
    return {
      treeData: [], //赋值给 级联组件的options
      props: {
        label: "name", //要展示的字段
        value: "id", //要存储的字段
      },
    };
  },
  created() {
    // 初始化调用获取数据
    this.getDepartment();
  },
  methods: {
    // 调用后台接口获取数据
    async getDepartment() {
      // 将组织架构的数据 转化树形赋值给treedata
      const result = await getDepartment();
      const data = transListToTreeData(result, 0);
      this.treeData = data;
    },
    // 获取部门id并向父组件传递
    changeValue(list) {
      if (list.length > 0) {
        // 取数组最后一位
        this.$emit("input", list.at(-1));
      } else {
        this.$emit("input", null); //如果长度为0 说明值为空
      }
    },
  },
};
</script>
