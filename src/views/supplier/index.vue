<template>
  <div class="main-content">
    <div class="search-con">
      <pageTitle
        title="供应商管理"
        @onSearch="onSearch"
        @onReset="onReset"
        :search="true"
      >
        <template #option>
          <a-button type="primary" @click="handleAdd">
            <template #icon>
              <icon-plus />
            </template>
            新增供应商
          </a-button>
        </template>
        <template #search>
          <a-form :model="form" layout="inline" auto-label-width>
            <a-form-item field="title" label="名称">
              <a-input
                v-model="form.title"
                style="width: 290px"
                placeholder="请输入"
              />
            </a-form-item>
            <a-form-item field="category" label="分类">
              <a-select
                v-model="form.category"
                style="width: 290px"
                :bordered="true"
                placeholder="请选择"
              >
                <a-option
                  v-for="option in type"
                  :key="'catelog-' + option.id"
                  :value="option.id"
                >
                  {{ option.typeName }}
                </a-option>
              </a-select>
            </a-form-item>
            <a-form-item field="classsify" label="等级">
              <a-select
                v-model="form.classsify"
                style="width: 280px"
                placeholder="请选择"
              >
                <a-option
                  v-for="option in level"
                  :key="'classsify-' + option.id"
                  :value="option.id"
                >
                  {{ option.levelName }}
                </a-option>
              </a-select>
            </a-form-item>
            <a-form-item field="status" label="状态">
              <a-select
                v-model="form.status"
                style="width: 280px"
                placeholder="请选择"
              >
                <a-option
                  v-for="option in status"
                  :key="'status-' + option.id"
                  :value="option.id"
                >
                  {{ option.typeName }}
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
          <template #supplierType="{ record }">
            <span>{{ getTypeName(record) }}</span>
          </template>
          <template #supplierLevel="{ record }">
            <span>{{ getLevelName(record) }}</span>
          </template>
          <template #supplierStatus="{ record }">
            <span
              :class="[
                'supplier',
                'supplier-status',
                'supplier-status-' + record.supplierStatus,
              ]"
            >
              {{ getStatusName(record) }}
            </span>
          </template>
          <template #optional="{ record }">
            <a-button type="text" @click="onEdit(record)">编辑</a-button>
            <a-button type="text" @click="onPreview(record)">查看</a-button>
            <a-button type="text" @click="onEnable(record)">
              {{ record.supplierStatus == 1 ? "终止合作" : "重启合作" }}
            </a-button>
          </template>
        </a-table>
      </div>
    </div>
  </div>
  <Dialog
    :visible="dialog.visible"
    :title="dialog.title"
    :data="dialog.data"
    @submit="onDialogSubmit"
    @close="dialog.visible = false"
  />
  <DrawerWrapper
    :visible="drawer.visible"
    :title="drawer.title"
    :data="drawer.data"
    @submit="drawer.visible = false"
    @close="drawer.visible = false"
  />
</template>

<script>
export default {
  name: "supplier-manage",
};
</script>

<script setup>
import { IconPlus } from "@arco-design/web-vue/es/icon";
import pageTitle from "@/components/pageTitle";
import Dialog from "./components/dialog.vue";
import DrawerWrapper from "./components/drawer-wrapper.vue";
import { Message } from "@arco-design/web-vue";
import { ref, reactive } from "vue";
import { supplierQuery, change } from "@/assets/api/supplier";
import {
  type,
  level,
  status,
  getTypeName,
  getLevelName,
  getStatusName,
} from "./common/utils";

const dialog = reactive({
  visible: false,
  title: "",
  data: {},
});

const drawer = reactive({
  visible: false,
  title: "",
  data: {},
});

const loading = ref(false);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: true,
  showJumper: true,
  showPageSize: true,
});
const form = ref({
  title: "",
  category: "",
  classsify: "",
  status: "",
});
const columns = ref([
  {
    title: "供应商ID",
    dataIndex: "supplierCode",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "供应商名称",
    dataIndex: "supplierName",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "行业分类",
    slotName: "supplierType",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "供应商等级",
    slotName: "supplierLevel",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "描述",
    dataIndex: "supplierDescribe",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "合作状态",
    slotName: "supplierStatus",
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
    title: "操作时间",
    dataIndex: "modifyTime",
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
    title: "",
    category: "",
    classsify: "",
    status: "",
  };
  pagination.current = 1;
  pagination.pageSize = 10;
  getData();
};

const handleAdd = () => {
  dialog.title = "新增供应商";
  dialog.data = {};
  dialog.visible = true;
};

const pageChange = (val) => {
  pagination.current = val;
  getData();
};

const pageSizeChange = (val) => {
  pagination.pageSize = val;
  getData();
};

const onEdit = (record) => {
  dialog.title = "编辑供应商";
  dialog.data = {
    ...record,
  };
  dialog.visible = true;
};

const onPreview = (record) => {
  drawer.title = "供应商信息";
  drawer.data = record;
  drawer.visible = true;
};

const onEnable = async (record) => {
  const status = 3 - record.supplierStatus;
  const res = await change(record.id, status);
  if (res.code == 200) {
    Message.success("操作成功");
    getData();
  }
};

const onDialogSubmit = () => {
  dialog.visible = false;
  getData();
};

const getData = () => {
  const payload = {
    supplierName: form.value.title,
    supplierType: form.value.category,
    supplierLevel: form.value.classsify,
    supplierStatus: form.value.status,
  };
  loading.value = true;
  supplierQuery(payload, pagination.current, pagination.pageSize)
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

getData();
</script>

<style lang="less" scoped>
.main-content {
  background-color: "var(--color-fill-2)";
  .search-con {
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  }
}

.supplier {
  &.supplier-status {
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
  &.supplier-status-1::before {
    background: #2061ff;
  }
  &.supplier-status-2::before {
    background: #dbdde0;
  }
}
</style>
