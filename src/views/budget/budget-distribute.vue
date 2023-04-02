<template>
  <div class="main-content">
    <pageTitle
      title="预算下发"
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
            新增预算下发
          </a-button>
        </a-space>
      </template>
      <template #search>
        <a-form :model="form" layout="inline" auto-label-width>
          <a-form-item v-if="roleId == 0" field="branchBankId" label="支行名称">
            <a-select
              v-model="form.branchBankId"
              style="width: 280px"
              :bordered="true"
              allow-search
              placeholder="请选择"
            >
              <a-option
                v-for="option in branchBankList"
                :key="'year-' + option.id"
                :value="option.id"
              >
                {{ option.name }}
              </a-option>
            </a-select>
          </a-form-item>
          <a-form-item v-if="roleId == 1" field="deptId" label="预算单位">
            <a-select
              v-model="form.deptId"
              style="width: 280px"
              :bordered="true"
              allow-search
              placeholder="请选择"
            >
              <a-option
                v-for="option in deptList"
                :key="'year-' + option.id"
                :value="option.id"
              >
                {{ option.name }}
              </a-option>
            </a-select>
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
      <a-space
        v-if="form.year"
        style="margin: 26px 0"
        direction="vertical"
        fill
      >
        <a-row>
          <a-col :span="4">
            <div class="title">预算周期</div>
            <div class="content">{{ form.year }} 年度</div>
          </a-col>
          <a-col v-if="roleId == 1" :span="4">
            <div class="title">支行信息</div>
            <div class="content">
              {{ userName ?? "--" }}
            </div>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="4">
            <div class="title">预算额度</div>
            <div class="content">
              {{ yearQuota(form.year).quota ?? "--" }} 份
            </div>
          </a-col>
          <a-col :span="4">
            <div class="title">已下发额度</div>
            <div class="content">
              {{ yearQuota(form.year).issued ?? "--" }} 份
            </div>
          </a-col>
          <a-col :span="4">
            <div class="title">剩余额度</div>
            <div class="content">
              {{ yearQuota(form.year).surplus ?? "--" }} 份
            </div>
          </a-col>
        </a-row>
      </a-space>
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
    :width="dialog.width"
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
import { distributeList, distributeList2 } from "@/assets/api/budget";
import {
  userName,
  roleId,
  branchBankList,
  deptList,
  yearOptions,
  yearQuota,
  dialog,
  drawer,
  loading,
  pagination,
  openDialog,
  getQuota,
} from "./common/utils";

const form = ref({
  branchBankId: "",
  deptId: "",
  year: "",
});
const columns = ref([
  {
    title: ["总行下发ID", "支行下发ID"][roleId.value],
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
  [
    {
      title: "支行名称",
      dataIndex: "branchBankName",
      ellipsis: true,
      tooltip: true,
    },
    {
      title: "预算单位",
      dataIndex: "deptName",
      ellipsis: true,
      tooltip: true,
    },
  ][roleId.value],
  {
    title: "下发额度/份",
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
    title: "下发时间",
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
    branchBankId: "",
    deptId: "",
    year: "",
  };
  pagination.current = 1;
  pagination.pageSize = 10;
  getData();
};

const handleAdd = () => {
  openDialog({
    title: "新增预算下发",
    type: "budget-distribute-edit",
    width: 666,
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
  drawer.type = "budget-distribute-detail";
  drawer.visible = true;
};

const onDialogSubmit = () => {
  dialog.visible = false;
  getQuota();
  getData();
};

const getData = () => {
  const payload = {
    branchBankId: form.value.branchBankId,
    deptId: form.value.deptId,
    year: form.value.year,
  };
  loading.value = true;
  const fn = [distributeList, distributeList2][roleId.value];
  fn(payload, pagination.current, pagination.pageSize)
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
@import url("./common/style.less");

.title {
  display: inline-block;
  padding-right: 8px;
}
.content {
  display: inline-block;
}
</style>
