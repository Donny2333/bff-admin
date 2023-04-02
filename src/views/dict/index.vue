<template>
  <div class="main-content">
    <div class="tree-wrapper">
      <a-input-search style="margin-bottom: 8px" v-model="searchKey" />
      <a-tree
        :blockNode="true"
        :data="treeData"
        :field-names="filedProps"
        showLine
      >
        <template #extra="nodeData">
          <IconPlus
            :style="{
              position: 'absolute',
              right: '30px',
              fontSize: '12px',
              top: '10px',
              color: '#3370ff',
            }"
            @click="() => handleAdd(nodeData)"
          />
          <IconDelete
            :style="{
              position: 'absolute',
              right: '8px',
              fontSize: '12px',
              top: '10px',
              color: '#3370ff',
            }"
            @click="() => handleDelete(nodeData)"
          />
        </template>
      </a-tree>
    </div>
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
        </template>
      </a-table>
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
import DialogWrapper from "./components/dialog-wrapper.vue";
import DrawerWrapper from "./components/drawer-wrapper.vue";
import { ref, onMounted } from "vue";
import { IconPlus } from "@arco-design/web-vue/es/icon";
import { list } from "@/assets/api/dict";
import {
  dialog,
  drawer,
  loading,
  pagination,
  openDialog,
} from "./common/utils";

const treeData = ref([]);
const filedProps = {
  key: "id",
  title: "label",
  children: "children",
};

const form = ref({
  code: "",
  year: "",
});
const columns = ref([
  {
    title: "字典编号",
    dataIndex: "code",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "字典年度",
    dataIndex: "year",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "字典金额",
    dataIndex: "quota",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "描述",
    dataIndex: "comment",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "发行日期",
    dataIndex: "createTime",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "最近操作人",
    dataIndex: "modifiedUserName",
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
    year: "",
  };
  pagination.current = 1;
  pagination.pageSize = 10;
  getData();
};

const handleAdd = (node) => {
  openDialog({
    title: "新增字典",
    type: "budget-config-edit",
    data: {},
  });
};

const handleDelete = (node) => {};

const pageChange = (val) => {
  pagination.current = val;
  getData();
};

const pageSizeChange = (val) => {
  pagination.pageSize = val;
  getData();
};

const onPreview = (record) => {
  drawer.title = "查看字典信息";
  drawer.data = record;
  drawer.type = "budget-config-detail";
  drawer.visible = true;
};

const onDialogSubmit = () => {
  dialog.visible = false;
  getData();
};

const getData = () => {
  const payload = {
    code: form.value.code,
    year: form.value.year,
  };
  loading.value = true;
  list(payload, pagination.current, pagination.pageSize)
    .then((res) => {
      loading.value = false;
      treeData.value = [
        {
          id: 0,
          label: "[根节点]",
          children: res.data ?? [],
        },
      ];
    })
    .catch((error) => {
      loading.value = false;
    });
};

onMounted(() => {
  pagination.current = 1;
  getData();
});
</script>

<style lang="less" scoped>
.main-content {
  box-sizing: border-box;
  display: flex;
  height: 100%;
  padding: 20px;
  .tree-wrapper {
    display: inline-block;
    width: 300px;
    min-width: 300px;
    padding: 16px;
    overflow: auto;
    margin-right: 16px;
    border: 1px solid var(--color-neutral-3);
    border-radius: var(--border-radius-medium) var(--border-radius-medium) 0 0;
  }
  .table-con {
    display: inline-block;
    width: calc(100% - 300px);
    padding: 2px;
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
