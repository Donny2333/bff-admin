<template>
  <div class="main-content">
    <div class="page-wrapper">
      <div class="tree-wrapper">
        <a-input-search style="margin-bottom: 8px" v-model="searchKey" />
        <a-tree
          v-if="!loading"
          :blockNode="true"
          :data="treeData"
          :field-names="filedProps"
          showLine
          @select="handleSelect"
        >
          <template #extra="nodeData">
            <IconPlusCircle
              :style="{
                position: 'absolute',
                right: '52px',
                fontSize: '12px',
                top: '10px',
                color: '#3370ff',
              }"
              @click="() => handleAdd(nodeData)"
            />
            <IconEdit
              :style="{
                position: 'absolute',
                right: '30px',
                fontSize: '12px',
                top: '10px',
                color: '#3370ff',
              }"
              @click="() => handleEdit(nodeData)"
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
import { list, remove } from "@/assets/api/dict";
import {
  dialog,
  drawer,
  loading,
  pagination,
  openDialog,
} from "./common/utils";
import { Message } from "@arco-design/web-vue";

const searchKey = ref("");
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
    title: "字典code码",
    dataIndex: "code",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "字典label值",
    dataIndex: "label",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "所属空间",
    dataIndex: "namespace",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "字典层级",
    dataIndex: "level",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "字典排序",
    dataIndex: "sort",
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
    year: "",
  };
  pagination.current = 1;
  pagination.pageSize = 10;
  getData();
};

const handleSelect = (keys, { node }) => {
  if (node?.children.length) {
    data.value =
      node?.children.map((obj) => {
        return {
          ...obj,
          children: undefined,
        };
      }) ?? [];
  } else if (node?.children == 0) {
    data.value = [
      {
        ...node,
        children: undefined,
      },
    ];
  } else {
    console.log(node);
    data.value = treeData.value[0].children.map((obj) => {
      return {
        ...obj,
        children: undefined,
      };
    });
  }
};

const handleAdd = (node) => {
  openDialog({
    title: "新增字典",
    type: "budget-config-edit",
    data: {
      pid: node.id || null,
    },
  });
};

const handleEdit = (node) => {
  openDialog({
    title: "修改字典",
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
  drawer.title = "查看字典信息";
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
    year: form.value.year,
  };
  loading.value = true;
  const res = await list(payload, pagination.current, pagination.pageSize);

  loading.value = false;
  treeData.value = [
    {
      id: 0,
      label: "[根节点]",
      children: res.data ?? [],
    },
  ];
  return res;
};

onMounted(async () => {
  pagination.current = 1;
  const res = await getData();
  console.log(res);
  if (res.code == 200) {
    data.value = res.data.map((obj) => {
      return {
        ...obj,
        children: undefined,
      };
    });
  }
});
</script>

<style lang="less" scoped>
.main-content {
  box-sizing: border-box;
  height: 100%;
  padding: 20px;
  .page-wrapper {
    box-sizing: border-box;
    padding: 20px;
    display: flex;
    height: 100%;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    background-color: #fff;
  }
  .tree-wrapper {
    display: inline-block;
    width: 300px;
    min-width: 300px;
    padding: 16px;
    overflow: auto;
    margin-right: 16px;
    border: 1px solid var(--color-neutral-3);
    border-radius: var(--border-radius-medium) var(--border-radius-medium) 0 0;
    background-color: #f2f3f5;
  }
  .table-con {
    display: inline-block;
    width: calc(100% - 300px);
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
