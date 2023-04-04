<template>
  <div class="main-content">
    <div class="page-wrapper">
      <pageTitle
        title="空间管理"
        @onSearch="onSearch"
        @onReset="onReset"
        :option="true"
        :search="true"
      >
        <template #option>
          <a-space>
            <a-button type="primary" @click="handleAdd">
              <template #icon>
                <icon-plus />
              </template>
              新增空间
            </a-button>
          </a-space>
        </template>
        <template #search>
          <a-form :model="form" layout="inline" auto-label-width>
            <a-form-item field="code" label="空间编号">
              <a-input
                v-model="form.code"
                style="width: 280px"
                placeholder="请输入"
              />
            </a-form-item>
            <a-form-item field="name" label="空间名称">
              <a-input
                v-model="form.name"
                style="width: 280px"
                placeholder="请输入"
              />
            </a-form-item>
          </a-form>
        </template>
      </pageTitle>
      <div class="table-con">
        <a-table
          :columns="columns"
          :pagination="pagination"
          :loading="loading"
          @page-change="pageChange"
          @page-size-change="pageSizeChange"
          :data="data"
          :scroll="{ y: 600 }"
        >
          <template #optional="{ record }">
            <a-button type="text" @click="onPreview(record)">查看</a-button>
            <a-button type="text" @click="handleEdit(record)">编辑</a-button>
            <a-button type="text" @click="handleDelete(record)">删除</a-button>
          </template>
        </a-table>
      </div>
    </div>
  </div>
  <DialogWrapper
    :visible="dialog.visible"
    :title="dialog.title"
    :data="dialog.data"
    :type="dialog.type"
    @submit="onDialogSubmit"
    @close="dialog.visible = false"
  />
  <DrawerWrapper
    :visible="drawer.visible"
    :title="drawer.title"
    :data="drawer.data"
    :type="drawer.type"
    @submit="drawer.visible = false"
    @close="drawer.visible = false"
  />
</template>

<script>
export default {
  name: "budget-manage",
};
</script>

<script setup>
import pageTitle from "@/components/pageTitle";
import DialogWrapper from "./components/dialog-wrapper.vue";
import DrawerWrapper from "./components/drawer-wrapper.vue";
import { ref, onMounted } from "vue";
import { list, remove } from "@/assets/api/ns";
import {
  dialog,
  drawer,
  loading,
  pagination,
  openDialog,
} from "./common/utils";
import { Message } from "@arco-design/web-vue";

const form = ref({
  code: "",
  name: "",
});
const columns = ref([
  {
    title: "空间编号",
    dataIndex: "code",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "空间名称",
    dataIndex: "name",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "空间排序",
    dataIndex: "sort",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "启用状态",
    dataIndex: "status",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "创建人",
    dataIndex: "created_by",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "创建日期",
    dataIndex: "created_at",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "操作",
    width: 200,
    slotName: "optional",
    align: "center",
  },
]);
const data = ref([]);

const onSearch = () => {
  getData();
};

const onReset = () => {
  form.value = {
    code: "",
    name: "",
  };
  pagination.current = 1;
  pagination.pageSize = 10;
  getData();
};

const handleAdd = () => {
  openDialog({
    title: "新增命名空间",
    type: "budget-config-edit",
    data: {},
  });
};

const handleEdit = (node) => {
  openDialog({
    title: "修改命名空间",
    type: "budget-config-edit",
    data: {
      ...node,
    },
  });
};

const handleDelete = async (node) => {
  const res = await remove(node.id);
  if (res.code == 200) {
    Message.success("操作成功!");
    getData();
  } else {
    Message.error(res.msg);
    return res;
  }
};

const pageChange = (val) => {
  pagination.current = val;
  getData();
};

const pageSizeChange = (val) => {
  pagination.pageSize = val;
  getData();
};

const onPreview = (record) => {
  drawer.title = "查看命名空间信息";
  drawer.data = record;
  drawer.type = "budget-config-detail";
  drawer.visible = true;
};

const onDialogSubmit = () => {
  dialog.visible = false;
  getData();
};

const getData = async () => {
  const payload = {
    code: form.value.code,
    name: form.value.name,
    page: pagination.current,
    pageSize: pagination.pageSize,
  };
  loading.value = true;
  let res;
  try {
    res = await list(payload);
    loading.value = false;
    data.value = res.data.list ?? [];
    if (data.value.length == 0 && pagination.current > 1) {
      pagination.current = 1;
      return getData();
    }
    pagination.total = res.data.total;
  } catch (e) {
    loading.value = false;
    console.error(e);
  }
  return res;
};

onMounted(() => {
  pagination.current = 1;
  getData();
});
</script>

<style lang="less" scoped>
.main-content {
  box-sizing: border-box;
  height: 100%;
  padding: 20px;
  .page-wrapper {
    box-sizing: border-box;
    height: 100%;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 20px;
  }
  .table-con {
    display: inline-block;
    flex: 1;
  }
}
.budget {
  &.budget-status {
    position: relative;
    padding-left: 20px;
    &::before {
      content: " ";
      position: absolute;
      display: inline-block;
      height: 12px;
      width: 12px;
      border-radius: 50%;
      left: 3px;
      top: 1px;
    }
  }
  &.budget-status-1::before {
    background: #2061ff;
  }
  &.budget-status-2::before {
    background: #dbdde0;
  }
}
</style>
