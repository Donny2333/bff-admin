<template>
  <template v-if="route.path == '/contract'">
    <div class="main-content">
      <div class="search-con">
        <pageTitle
          title="合同管理"
          @onSearch="onSearch"
          @onReset="onReset"
          :search="true"
        >
          <template #option>
            <a-button type="primary" @click="handleAdd">
              <template #icon>
                <icon-plus />
              </template>
              新增合同
            </a-button>
          </template>
          <template #search>
            <a-form :model="form" layout="inline" auto-label-width>
              <a-form-item field="no" label="合同编号">
                <a-input
                  v-model="form.no"
                  style="width: 290px"
                  placeholder="请输入"
                />
              </a-form-item>
              <a-form-item field="title" label="合同名称">
                <a-input
                  v-model="form.title"
                  style="width: 290px"
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
            <template #name="{ record }">
              <span
                style="display: inline"
                class="arco-btn arco-btn-text arco-btn-shape-square arco-btn-size-medium arco-btn-status-normal"
                @click="open(record)"
              >
                {{ record.contractName }}
              </span>
            </template>
            <template #demand="{ record }">
              <span>{{ record.demandName ?? "" }}(</span>
              <a-button
                type="text"
                style="padding: 0"
                @click="onDemandDetail(record)"
              >
                {{ record.demandCode }}
              </a-button>
              <span>{{ ")" }}</span>
            </template>
            <template #status="{ record }">
              <span
                :class="[
                  'contract',
                  'contract-status',
                  'contract-status-' + record.status,
                ]"
              >
                {{ getStatusName(record) }}
              </span>
            </template>
            <template #optional="{ record }">
              <a-button type="text" @click="onEdit(record)">编辑</a-button>
              <a-button type="text" @click="onPreview(record)">查看</a-button>
              <a-button type="text" @click="onEnable(record)">
                {{ record.status == 0 ? "启用" : "中止" }}
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
  <template v-if="route.path == '/contract/demand-detail'">
    <DemandDetail />
  </template>
</template>

<script>
export default {
  name: "supplier-manage",
};
</script>

<script setup>
import qs from "qs";
import { IconPlus } from "@arco-design/web-vue/es/icon";
import pageTitle from "@/components/pageTitle";
import Dialog from "./components/dialog.vue";
import DrawerWrapper from "./components/drawer-wrapper.vue";
import DemandDetail from "./demand-detail.vue";
import { Message } from "@arco-design/web-vue";
import { ref, reactive } from "vue";
import { useRoute } from "vue-router";
import { list, updateContractStatus } from "@/assets/api/contract";
import { getStatusName } from "./common/utils";

const route = useRoute();

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
  no: "",
  title: "",
});
const columns = ref([
  {
    title: "合同编号",
    dataIndex: "contractCode",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "合同名称",
    slotName: "name",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "关联需求",
    slotName: "demand",
  },
  {
    title: "甲方（租户）",
    dataIndex: "nameA",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "乙方（供应商）",
    dataIndex: "nameB",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "合同状态",
    slotName: "status",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "最近操作人",
    dataIndex: "modifiedUser",
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
    no: "",
    title: "",
  };
  pagination.current = 1;
  pagination.pageSize = 10;
  getData();
};

const handleAdd = () => {
  dialog.title = "新增合同";
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

const open = (record) => {
  window.open(`/api/dse-portal/contract/downloadFileById?id=${record.id}`);
};

const onDemandDetail = (record) => {
  const params = {
    demand: record.demandId,
    contract: record.id,
  };
  window.open("#/contract/demand-detail?" + qs.stringify(params), "_blank");
};

const onEdit = (record) => {
  dialog.title = "编辑合同";
  dialog.data = {
    ...record,
  };
  dialog.visible = true;
};

const onPreview = (record) => {
  drawer.title = "合同信息";
  drawer.data = record;
  drawer.visible = true;
};

const onEnable = (record) => {
  updateContractStatus({
    id: record.id,
  }).then((res) => {
    if (res.code == 200) {
      Message.success("操作成功");
      getData();
    }
  });
};

const onDialogSubmit = () => {
  dialog.visible = false;
  getData();
};

const getData = () => {
  const payload = {
    contractCode: form.value.no,
    contractName: form.value.title,
    pageSize: pagination.pageSize,
    pageNumber: pagination.current,
  };
  loading.value = true;
  list(payload)
    .then((res) => {
      if (res.code == 200) {
        loading.value = false;
        data.value = res.data.content ?? [];
        if (data.value.length == 0 && pagination.current > 1) {
          pagination.current = 1;
          return getData();
        }
        pagination.total = res.data.totalElements;
      }
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

.contract {
  &.contract-status {
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
  &.contract-status-1::before {
    background: #2061ff;
  }
  &.contract-status-0::before {
    background: #dbdde0;
  }
}
</style>
