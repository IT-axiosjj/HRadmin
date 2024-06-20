<template>
  <div class="container">
    <div class="app-container">
      <!-- 展示树形结构 -->
      <el-tree default-expand-all :data="depts" :label="defaultProps">
        <!-- 节点结构 -->
        <!-- v-slot="{node，data}" 只能作用在template -->
        <template v-slot="{ data }">
          <el-row
            style="width: 100%; height: 40px"
            type="flex"
            justify="space-between"
            align="middle"
          >
            <el-col>{{ data.name }}</el-col>
            <cl-col :span="4">
              <span class="tree-manger">{{ data.managerName }}</span>
              <!-- $event 实参 表示类型 -->
              <el-dropdown
                @command="operateDept($event, data.id)"
                :expaand-on-click="false"
              >
                <!-- 显示内容区域 -->
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <!-- 下拉菜单选项 -->
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                  <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="delete">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </cl-col>
          </el-row>
        </template>
      </el-tree>
    </div>
    <!-- 放置操作弹窗 -->
    <!-- 表示会接收子组件的事件 uodate:showDialog 值=>属性 -->
    <!-- ref 可以获取dom实例对象 ref也可以获取自定义组件的实例对象 -->
    <AddDept
      ref="addDept"
      @updateDepartment="getDepartment"
      :current-node-id="currentNodeId"
      :show-dialog.sync="showDialog"
    />
  </div>
</template>
<script>
import { getDepartment, delDepaetment } from "@/api/department";
import { transListToTreeData } from "@/utils";
import AddDept from "./components/adddept.vue";
export default {
  name: "Department",
  components: { AddDept },
  data() {
    return {
      currentNodeId: null, //当前点击的id
      showDialog: false, //控制操作弹窗
      // 数据属性
      depts: [],
      defaultProps: {
        label: "name", //显示的字段的名字
        children: "children", //读取子节点的字段名
      },
    };
  },
  created() {
    this.getDepartment(); //调用获取数据的接口
  },
  methods: {
    // 获取组织信息
    async getDepartment() {
      const result = await getDepartment();
      this.depts = transListToTreeData(result, 0);
    },
    // 操作弹窗
    operateDept(type, id) {
      if (type === "add") {
        this.showDialog = true;
        this.currentNodeId = id;
        console.log("id", this.currentNodeId);
      } else if (type === "edit") {
        //编辑部门
        this.showDialog = true;
        //  记录id 用于获取数据
        this.currentNodeId = id;
        // 更新props-异步动作
        // 直接调用子组件的方法 是同步的方法

        // 调用子组件的方法
        // 父组件调用子组件的方法获取数据 this.$refs.addDept等同于子组件的this
        this.$nextTick(() => {
          this.$refs.addDept.getDepartmentDetail();
        });
      } else {
        // 删除
        this.$confirm("您确定要删除该部门吗").then(async () => {
          // 调用删除接口
          await delDepaetment(id);
          this.$message.success("删除成功");
          // 重新获取数据
          this.getDepartment();
        });
      }
    },
  },
};
</script>
<style scoped>
.app-container {
  padding: 30px 140px;
  font-size: 14px;
}
.tree-manger {
  width: 50px;
  display: inline-block;
  margin-right: 40px;
}
</style>
