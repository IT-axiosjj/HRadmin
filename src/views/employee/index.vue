<template>
  <div class="container">
    <div class="app-container">
      <!-- 左边 -->
      <div class="left">
        <el-input
          style="margin-bottom: 10px"
          type="text"
          perdix-icon="el-icon-search"
          placeholder="输入员工姓名全员搜索"
          v-model="queryParams.keyword"
          @input="changeValue"
        ></el-input>
        <!-- 树形组件 -->
        <el-tree
          ref="deptTree"
          node-key="id"
          :data="depts"
          :props="defaultProps"
          default-expand-all
          :expand-on-click-node="false"
          highlight-current="true"
          @current-change="selectNode"
        ></el-tree>
      </div>
      <!-- 右边 -->
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button
            v-permission="'add-employee'"
            size="mini"
            type="primary"
            @click="$router.push('/employee/detail')"
          >
            添加员工
          </el-button>
          <el-button type="mini" @click="showExcelDialog = true"
            >excel导入</el-button
          >
          <el-button type="mini" @click="exportEmployee">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <el-table :data="list">
          <el-table-column prop="staffPhoto" align="center" label="头像">
            <template v-slot="{ row }">
              <el-avatar
                v-if="row.staffPhoto"
                :src="row.staffPhoto"
                :size="30"
              ></el-avatar>
              <!-- 取第一个字 -->
              <span class="username" v-else>{{ row.username.charAt(0) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="姓名"></el-table-column>
          <el-table-column
            prop="mobile"
            label="手机号"
            sortable
          ></el-table-column>
          <el-table-column
            prop="workNumber"
            label="工号"
            sortable
          ></el-table-column>
          <el-table-column prop="formOfEmployment" label="聘用形式">
            <template v-slot="{ row }">
              <span v-if="row.formOfEmployment === 1">正式</span>
              <span v-else-if="row.formOfEmployment === 2">非正式</span>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门"></el-table-column>
          <el-table-column label="入职时间" sortable></el-table-column>
          <el-table-column prop="timeOfEntry" label="操作" width="280px">
            <template v-slot="{ row }">
              <el-button
                type="text"
                size="mini"
                @click="$router.push(`/employee/detail/${row.id}`)"
                >查看</el-button
              >
              <el-button type="text" size="mini" @click="btnRole(row.id)"
                >角色</el-button
              >
              <el-popconfirm
                title="你确定要删除吗？"
                @onConfirm="confirmDel(row.id)"
              >
                <el-button
                  slot="reference"
                  style="margin-left: 10px"
                  type="text"
                  size="mini"
                  >删除</el-button
                >
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row style="height: 60px" align="middle" type="flex" justify="end">
          <el-pagination
            layout="total,prev, pager, next"
            :total="total"
            :current-page="queryParams.page"
            :page-size="queryParams.pagesize"
            @current-change="changePage"
          ></el-pagination>
        </el-row>
      </div>
      <ImportExecl
        :show-excel-dialog.sync="showExcelDialog"
        :uploadSuccess="getEmployeeList"
      />
      <!-- 弹层内容 -->
      <el-dialog :visible.sync="showDialog" title="分配角色">
        <!-- 放置n个checkbox -->
        <el-checkbox-group v-model="roleIds">
          <el-checkbox
            v-for="item in roleList"
            :key="item.id"
            :label="item.id"
            >{{ item.name }}</el-checkbox
          >
        </el-checkbox-group>
        <!-- 确定取消按钮 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="mini" type="primary" @click="btnRoleOk"
              >确定</el-button
            >
            <el-button size="mini" @click="showDialog = false">取消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import ImportExecl from "./components/import-execl.vue";
import FileSaver from "file-saver";
import { getDepartment } from "@/api/department";
import { transListToTreeData } from "@/utils";
import {
  getEmployeeList,
  getEnableRoleList,
  delEmployee,
  exportEmployee,
  getEmployeeDetail,
  assignRole,
} from "@/api/employee";
export default {
  name: "Employee",
  components: {
    ImportExecl,
  },
  data() {
    return {
      currentRoleId: null, //记录当前角色id
      roleIds: [], //用于角色绑定
      roleList: [], //角色列表
      showDialog: false, //控制弹层
      depts: [], //组织数据
      defaultProps: {
        label: "name",
        children: "children",
      },
      // 存储查询参数
      queryParams: {
        departmentId: null,
        pagesize: 5,
        page: 1, //当前页面
        keyword: "", //根据关键字查询
      },
      list: [], //存储员工数据
      total: 0, //存储员工总数
      showExcelDialog: false, //控制导入excel弹窗显示与隐藏
    };
  },
  created() {
    this.getDepartment();

    // console.log("进入");
  },
  methods: {
    async getDepartment() {
      const result = await getDepartment();
      // 递归方法 将列表转化为树形结构
      this.depts = transListToTreeData(result, 0);
      // 存储第一个节点
      this.queryParams.departmentId = this.depts[0].id;

      // console.log(this.depts);
      // 树组件是异步的 等到更新完毕
      this.$nextTick(() => {
        // 设置选中节点的状态
        this.$refs.deptTree.setCurrentKey(this.queryParams.departmentId);
      });
      // 这个时候参数记录了id 再获取员工列表数据
      this.getEmployeeList();
    },

    // 切换节点记录节点数据
    selectNode(node) {
      this.queryParams.departmentId = node.id;
      // 切换部门后设置为第一页
      this.queryParams.page = 1;
      // 切换节点根据参数查询员工信息
      this.getEmployeeList();
    },
    //获取员工列表
    async getEmployeeList() {
      const { rows, total } = await getEmployeeList(this.queryParams);
      this.list = rows;
      this.total = total;
      // console.log(this.list);
    },
    //页码修改回调
    changePage(newPage) {
      this.queryParams.page = newPage; //赋值新页码
      this.getEmployeeList(); //查询新数据
    },
    // 监听搜索框值发生改变的事件回调
    changeValue() {
      // 防抖
      // 单位时间内只执行最后一次
      // this实例上赋值一个timer属性
      clearTimeout(this.timer); //清理上一次的定时器
      this.timer = setTimeout(() => {
        this.queryParams.page = 1;
        this.getEmployeeList();
      }, 500);
    },
    // 导出员工excel
    async exportEmployee() {
      const result = await exportEmployee(); //导出所有员工excel
      console.log(result);
      // 使用npm包 直接将blob文件下载到本地 file-saver
      // FileSaver.saveAs(blob对象，文件名称)
      FileSaver.saveAs(result, "员工信息.xlsx"); //下载文件
    },
    // 删除回调
    async confirmDel(id) {
      // alert("确定删除吗");
      // 调用删除接口
      await delEmployee(id);
      //  如果当前页是最后一页 并且 当前页的员工数量是1 则页码-1
      if (this.list.length === 1 && this.queryParams.page > 1)
        return this.queryParams.page--;
      // 重新调用获取员工列表 刷新页面
      this.getEmployeeList();
      this.$message.success("删除员工成功");
    },

    // 查看角色回调

    async btnRole(id) {
      const result = await getEnableRoleList();
      this.roleList = result;
      // 记录当前点击的id 后面确认取消要存取给对应的用户
      this.currentRoleId = id;
      // 通过id获取员工存在哪些角色 回显
      const { roleIds } = await getEmployeeDetail(id);
      this.roleIds = roleIds;
      // 显示角色弹层
      this.showDialog = true;
    },

    //点击角色确定
    async btnRoleOk() {
      await assignRole({
        id: this.currentRoleId,
        roleIds: this.roleIds,
      });
      this.$message.success("角色分配成功");
      this.showDialog = false;
    },

    // 导入员工excel
    async importExcel() {
      this.showExcelDialog = true;
    },

    // 导入excel成功回调
    async uploadSuccess() {
      this.showExcelDialog = false;
      this.$message.success("导入成功");
      this.getEmployeeList();
    },
    // 导入excel失败回调
    uploadError() {},
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  background: #fff;
  display: flex;
  .left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }
  .right {
    flex: 1;
    padding: 20px;
    .opeate-tools {
      margin: 10px;
    }
    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      border-radius: 50%;
      color: #fff;
      background: #04c9be;
      font-size: 12px;
      display: inline-block;
    }
  }
}
</style>
