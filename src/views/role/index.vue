<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理 -->
      <div class="role-manage">
        <el-button size="mini" round type="primary " @click="showDialog = true"
          >添加角色</el-button
        >
      </div>
      <el-table :data="list">
        <el-table-column
          prop="name"
          label="角色"
          style="width: 200px"
          align="center"
        >
          <template v-slot="{ row }">
            <!-- 条件判断 -->
            <el-input
              v-model="row.editRow.name"
              v-if="row.isEdit"
              size="mini"
            ></el-input>
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          label="启用"
          style="width: 200px"
          align="center"
        >
          <!-- 自定义列结构 -->
          <template v-slot="{ row }">
            <el-switch
              v-model="row.editRow.state"
              :active-value="1"
              :inactive-value="0"
              v-if="row.isEdit"
            ></el-switch>
            <span v-else>{{
              row.state === 1 ? "已启用" : row.state === 0 ? "未启用" : 无
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" align="center">
          <template v-slot="{ row }">
            <el-input
              v-model="row.editRow.description"
              v-if="row.isEdit"
              type="textarea"
            ></el-input>
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="{ row }">
            <template v-if="row.isEdit">
              <!-- 编辑状态 -->
              <el-button size="mini" @click="btnEditOk(row)" type="primary"
                >确定</el-button
              >
              <el-button size="mini" @click="row.isEdit = false"
                >取消</el-button
              >
            </template>
            <template v-else>
              <!-- 非编辑状态 -->
              <el-button type="text" size="mini" @click="btnPermission(row.id)"
                >分配权限</el-button
              >
              <el-button type="text" size="mini" @click="btnEdit(row)"
                >编辑</el-button
              >
              <el-popconfirm
                @onConfirm="confirmDel(row.id)"
                title="您确定要删除该角色吗？"
              >
                <el-button
                  style="margin-left: 10px"
                  slot="reference"
                  type="text"
                  size="mini"
                  >删除</el-button
                >
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" style="height: 60px" align="middle" justify="end">
        <el-pagination
          layout="prev, pager, next"
          :page-size="pageParams.pagesize"
          :total="pageParams.total"
          :current-page="pageParams.page"
          @current-change="changePage"
        ></el-pagination>
      </el-row>
    </div>
    <!-- 放置弹层 -->
    <el-dialog
      @close="btnCancel"
      width="500px"
      title="新增角色"
      :visible.sync="showDialog"
    >
      <el-form label-width="120px" :model="roleForm" ref="form" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" size="mini"></el-input>
        </el-form-item>
        <!-- 重置表单表单数据 需要prop属性 -->
        <!-- 不需要校验 就不需要写prop属性 -->
        <el-form-item label="启用" prop="state">
          <el-switch
            :active-value="1"
            :inactive-value="0"
            size="mini"
            v-model="roleForm.state"
          ></el-switch>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="roleForm.description"
            type="textarea"
            :rows="3"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="btnOk">确定</el-button>
          <el-button size="mini" @click="btnCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 放置权限弹层 -->
    <el-dialog title="分配权限" :visible.sync="showPermissionDialog">
      <el-tree
        check-strictly="false"
        ref="permTree"
        node-key="id"
        show-checkbox
        default-expand-all
        :data="permissionData"
        :props="{ label: 'name' }"
        :default-checked-keys="permIds"
      >
      </el-tree>
      <el-row type="flex" justify="center" slot="footer">
        <el-col :span="6">
          <el-button size="mini" type="primary" @click="btnPermissionOk"
            >确定</el-button
          >
          <el-button size="mini" @click="showPermissionDialog = false"
            >取消</el-button
          >
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { transListToTreeData } from "@/utils";
import { getPermissionList } from "@/api/permission";
import {
  getRoleList,
  addRole,
  updateRole,
  delRole,
  getRoleDeatil,
  assignPerm,
} from "@/api/role";

export default {
  name: "Role",
  data() {
    return {
      permIds: [],
      currentRoleId: null,
      permissionData: [],
      showPermissionDialog: false,
      list: [],
      // 分页信息
      pageParams: {
        page: 1, //第几页
        pagesize: 5, //每页多少条
        total: 0,
      },
      showDialog: false, //控制弹层显示与隐藏
      roleForm: {
        name: "",
        description: "",
        state: 1, // 默认启用 1 0未启用
      },
      rules: {
        name: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
        description: [
          { required: true, message: "角色描述不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const { rows, total } = await getRoleList(this.pageParams);
      this.list = rows; //赋值数据
      this.pageParams.total = total; //赋值总数
      // 针对每一行数据添加一个编辑标记
      this.list.forEach((item) => {
        // item.isEdit = false; //添加一个属性 初始值是false
        // 数据响应式问题 数据变化 试图更新
        // 添加的动态属性 不具备响应式特点
        // this.$set(目标对象，属性名称从，初始值)
        this.$set(item, "isEdit", false); //添加响应式数据
        // 数据缓存
        this.$set(item, "editRow", {
          name: item.name,
          state: item.state,
          description: item.description,
        });
      });
    },
    // 改变页码
    // newPage: 新的页码
    // 调用getRoleList()刷新页面
    changePage(newPage) {
      this.pageParams.page = newPage;
      this.getRoleList();
    },
    btnOk() {
      this.$refs.form.validate(async (isOk) => {
        if (isOk) {
          await addRole(this.roleForm);
          this.$message.success("新增角色成功");
          this.getRoleList();
          this.btnCancel();
        }
      });
    },
    btnCancel() {
      //重置表单
      this.$refs.form.resetFields();
      this.showDialog = false;
      console.log("ssdfsdf ");
    },
    // 编辑回调
    btnEdit(row) {
      row.isEdit = true;
      // 更新缓存数据
      row.editRow.name = row.name;
      row.editRow.state = row.state;
      row.editRow.description = row.description;
    },
    // 编辑确定回调
    async btnEditOk(row) {
      if (row.editRow.name && row.editRow.description) {
        console.log("数据", { ...row.editRow, id: row.id });
        // 调用更新接口
        await updateRole({ ...row.editRow, id: row.id });
        // 更新成功
        this.$message.success("角色更新成功");
        // 更新显示数据 退出编辑状态
        Object.assign(row, {
          ...row.editRow,
          isEdit: false, //退出编辑模式
        });
      } else {
        this.$message.warning("角色和描述不能有空");
      }
    },
    //删除回调
    async confirmDel(id) {
      await delRole(id);
      this.$message.success("删除角色成功");
      // 删除的如果是最后一个
      if (this.list.length === 1) {
        // 页码-1
        this.pageParams.page--;
      }
      // 刷新页面数据
      this.getRoleList();
    },
    // 分配权限弹层
    async btnPermission(id) {
      const result = await getPermissionList();
      this.currentRoleId = id;
      const { permIds } = await getRoleDeatil(id);
      this.permIds = permIds;
      this.permissionData = transListToTreeData(result, 0);
      this.showPermissionDialog = true;
    },
    // 点击确定按钮回调
    async btnPermissionOk() {
      await assignPerm({
        id: this.currentRoleId,
        permIds: this.$refs.permTree.getCheckedKeys(),
      });
      this.$message.success("分配权限成功");
      this.showPermissionDialog = false;
    },
  },
};
</script>
<style scoped>
.role-manage {
  padding: 20px;
}
</style>
