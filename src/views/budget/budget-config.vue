<template>
  <div class="main-content">
    <pageTitle
      title="预算配置"
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
            新增预算配置
          </a-button>
        </a-space>
      </template>
      <template #search>
        <a-form :model="form" layout="inline" auto-label-width>
          <a-form-item field="code" label="预算编号">
            <a-input
              v-model="form.code"
              style="width: 280px"
              placeholder="请输入"
            />
          </a-form-item>
          <a-form-item field="year" label="预算年度">
            <a-select
              v-model="form.year"
              style="width: 280px"
              :bordered="true"
              placeholder="请选择"
            >
              <a-option
                v-for="option in yearOptions"
                :key="'year-' + option.id"
                :value="option.id"
              >
                {{ option.label }}
              </a-option>
            </a-select>
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
import pageTitle from "@/components/pageTitle";
import DialogWrapper from "./components/dialog-wrapper.vue";
import DrawerWrapper from "./components/drawer-wrapper.vue";
import { ref, onMounted } from "vue";
import { IconPlus } from "@arco-design/web-vue/es/icon";
import { list } from "@/assets/api/budget";
import {
  yearOptions,
  dialog,
  drawer,
  loading,
  pagination,
  openDialog,
  getQuota,
} from "./common/utils";

const form = ref({
  code: "",
  year: "",
});
const columns = ref([
  {
    title: "预算编号",
    dataIndex: "code",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "预算年度",
    dataIndex: "year",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "预算金额",
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

const handleAdd = () => {
  openDialog({
    title: "新增预算配置",
    type: "budget-config-edit",
    data: {},
  });
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
  drawer.title = "查看预算信息";
  drawer.data = record;
  drawer.type = "budget-config-detail";
  drawer.visible = true;
};

const onDialogSubmit = () => {
  dialog.visible = false;
  getData();
  getQuota();
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
      data.value = res.data.content ?? [];
      if (data.value.length == 0 && pagination.current > 1) {
        pagination.current = 1;
        return getData();
      }
      pagination.total = res.data.totalElements;
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
