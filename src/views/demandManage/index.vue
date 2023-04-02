<template>
  <div class="main-content">
    <div class="search-con">
      <pageTitle
        title="需求管理"
        @onSearch="onSearch"
        @onReset="onReset"
        :option="user.roleId == 2 ? true : false"
        :search="true"
      >
        <template #option>
          <a-space>
            <a-button type="primary" @click="handleAdd">
              <template #icon>
                <icon-plus />
              </template>
              新增外部需求
            </a-button>
            <a-button type="primary" @click="handleDownload">
              <template #icon>
                <icon-download />
              </template>
              导出需求
            </a-button>
          </a-space>
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
                  v-for="option in demandCategory"
                  :key="'catelog-' + option.itemId"
                  :value="option.code"
                >
                  {{ option.name }}
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
                  v-for="option in demandClasssify"
                  :key="'classsify-' + option.itemId"
                  :value="option.code"
                >
                  {{ option.name }}
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
                  v-for="option in demandStatus"
                  :key="'status-' + option.itemId"
                  :value="option.code"
                >
                  {{ option.name }}
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
          <template #category="{ record }">
            <span>{{ getCategoryName(record) }}</span>
          </template>
          <template #classsify="{ record }">
            <span>{{ getClasssifyName(record) }}</span>
          </template>
          <template #status="{ record }">
            <span
              :class="[
                'demand',
                'demand-status',
                'demand-status-' + record.status,
              ]"
            >
              {{ getStatusName(record) }}
            </span>
          </template>
          <template #optional="{ record }">
            <template v-if="user.roleId == 2">
              <a-button type="text" @click="onEdit(record)">编辑</a-button>
              <a-button type="text" @click="onDelete(record)">删除</a-button>
            </template>
            <template v-if="user.roleId == 3">
              <a-button type="text" @click="onDetail(record)">查看</a-button>
              <a-button type="text" @click="onPass(record)">授权</a-button>
            </template>
            <template v-if="user.roleId == 4">
              <a-button
                v-if="record.isReceive == 0"
                style="width: 70px"
                type="text"
                @click="getDemandClick(record)"
              >
                领取需求
              </a-button>
              <a-button v-else style="width: 70px" type="text" disabled>
                已领取
              </a-button>
              <a-button type="text" @click="publicData(record)">
                {{ record.isPublish == 0 ? "发布数据" : "查看详情" }}
              </a-button>
            </template>
          </template>
        </a-table>
      </div>
    </div>
    <drawer-wrapper
      :visible="drawer.visible"
      :title="drawer.title"
      :type="drawer.type"
      :data="drawer.data"
      @submit="onSubmit"
      @close="drawer.visible = false"
    />
    <getdemand-drawer
      :visible="demanddrawer.visible"
      :title="demanddrawer.title"
      :type="demanddrawer.type"
      :data="demanddrawer.data"
      @submit="onDemandSubmit"
      @close="demanddrawer.visible = false"
    >
    </getdemand-drawer>
  </div>
</template>

<script>
export default {
  name: "demand-manage",
};
</script>

<script setup>
import {
  demandGet,
  demandQuery,
  demandExport,
  demandDelete,
  getDictData,
  pushData,
  getDataInfoByDemand,
} from "@/assets/api/demand";
import { ref, reactive, computed, toRaw, watch, provide } from "vue";
import { IconPlus } from "@arco-design/web-vue/es/icon";
import DrawerWrapper from "./components/drawer-wrapper.vue";
import GetdemandDrawer from "./components/demad-get.vue";
import pageTitle from "@/components/pageTitle";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { Modal, Message } from "@arco-design/web-vue";

const store = useStore();

const user = computed(() => store.state.user.user);

const demandCategory = ref([]);
const demandClasssify = ref([]);
const demandStatus = ref([]);

provide("demand_category", demandCategory);
provide("demand_classsify", demandClasssify);
provide("demand_status", demandStatus);

getDictData().then((res) => {
  console.log("dictres", res.data.typeList);
  demandCategory.value =
    res.data.typeList.find((item) => item.code == "demand_category")
      ?.itemList || [];
  demandClasssify.value =
    res.data.typeList.find((item) => item.code == "demand_classsify")
      ?.itemList || [];
  demandStatus.value =
    res.data.typeList.find((item) => item.code == "demand_status")?.itemList ||
    [];
});

const getCategoryName = (record) => {
  const data = record;
  if (!demandCategory.value.length) {
    return "";
  }
  const categoryTitle = demandCategory.value.find(
    (item) => item.code == data.category
  ).name;
  return categoryTitle;
};

const getClasssifyName = (record) => {
  const data = record;
  if (!demandClasssify.value.length) {
    return "";
  }
  const classsifyTitle = demandClasssify.value.find(
    (item) => item.code == data.classsify
  ).name;
  return classsifyTitle;
};

const getStatusName = (record) => {
  const data = record;
  if (!demandStatus.value.length || !record.status) {
    return "";
  }
  const statusTitle = demandStatus.value.find(
    (item) => item.code == data.status
  ).name;
  return statusTitle;
};
const columns = ref([
  {
    title: "需求ID",
    dataIndex: "demandCode",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "需求名称",
    dataIndex: "title",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "描述",
    dataIndex: "description",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "分类",
    dataIndex: "category",
    width: 120,
    slotName: "category",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "等级",
    dataIndex: "classsify",
    width: 200,
    slotName: "classsify",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "状态",
    dataIndex: "status",
    width: 200,
    slotName: "status",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "当前处理人",
    dataIndex: "modifiedBy",
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

const drawer = reactive({
  visible: false,
  title: "",
  type: "",
  data: {},
});

const demanddrawer = reactive({
  visible: false,
  title: "领取需求",
  type: "getDemand",
  data: {},
});

const route = useRoute();
const router = useRouter();

watch(
  () => route.query,
  async (val) => {
    if (val.bizCode == "demand-published" && val.demandId !== undefined) {
      try {
        const res = await demandGet(val.demandId);
        router.replace({
          path: "/demandmanage",
          query: {},
        });
        onPass(res.data);
        console.log(res);
      } catch (e) {
        console.error(e);
        router.replace({
          path: "/demandmanage",
          query: {},
        });
      }
    }
    if (val.bizCode == "demand-found" && val.demandId !== undefined) {
      try {
        const res = await demandGet(val.demandId);
        router.replace({
          path: "/demandmanage",
          query: {},
        });
        getDemandClick(res.data);
      } catch (e) {
        console.error(e);
        router.replace({
          path: "/demandmanage",
          query: {},
        });
      }
    }
  },
  {
    immediate: true,
  }
);

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

const pageChange = (val) => {
  pagination.current = val;
  getData();
};

const pageSizeChange = (val) => {
  pagination.pageSize = val;
  getData();
};

const data = ref([]);

const handleAdd = () => {
  // getdata();
  drawer.title = "新增外部需求";
  drawer.type = "add";
  drawer.data = {};
  drawer.visible = true;
};

const handleDownload = () => {
  const param = {
    title: form.value.title,
    category: form.value.category,
    classsify: form.value.classsify,
    status: form.value.status,
  };
  demandExport(param);
};

const getDemandClick = (record) => {
  demanddrawer.title = "领取需求";
  demanddrawer.type = "getDemand";
  const data = toRaw(record);
  data.categoryTitle = getCategoryName(data);
  demanddrawer.data = toRaw(data);
  demanddrawer.visible = true;
};

const publicData = async (record) => {
  let res = {};
  if (record.isPublish == 0) {
    loading.value = true;
    try {
      res = await pushData({
        demandId: record.id,
      });
      loading.value = false;
      if (res.code != 200) {
        return Message.error(res.msg);
      }
      getData();
    } catch (e) {
      loading.value = false;
      return;
    }
  } else {
    res = await getDataInfoByDemand(record.id);
  }
  demanddrawer.title = "发布数据";
  demanddrawer.type = "publicData";
  const data = toRaw(record);
  data.categoryTitle = getCategoryName(data);
  demanddrawer.data = {
    ...data,
    kafka: {
      address: res.data.address,
      topic: res.data.topic,
    },
  };
  demanddrawer.visible = true;
};

const onEdit = (record) => {
  drawer.title = "编辑外部需求";
  drawer.type = "edit";
  drawer.data = toRaw(record);
  drawer.visible = true;
};

const onDelete = async (record) => {
  Modal.warning({
    title: "提示",
    content: "删除操作不可逆，是否继续？",
    width: 280,
    hideCancel: false,
    onBeforeOk: async (done) => {
      await demandDelete(record.id);
      getData();
      done();
    },
    onBeforeCancel: () => {
      return true;
    },
  });
};

const onDetail = (record) => {
  drawer.title = "查看外部需求";
  drawer.type = "detail";
  const data = toRaw(record);
  data.categoryTitle = getCategoryName(data);
  data.classsifyTitle = getClasssifyName(data);
  drawer.data = toRaw(data);
  drawer.visible = true;
};

const onPass = (record) => {
  drawer.title = "授权外部需求";
  drawer.type = "pass";
  const data = toRaw(record);
  data.categoryTitle = getCategoryName(data);
  data.classsifyTitle = getClasssifyName(data);
  drawer.data = toRaw(data);
  drawer.visible = true;
};

const onSubmit = () => {
  drawer.visible = false;
  if (drawer.type != "detail") {
    getData();
  }
};

const onDemandSubmit = () => {
  demanddrawer.visible = false;
  if (demanddrawer.type != "publicData") {
    getData();
  }
};

const getData = () => {
  const param = {
    pageNumber: pagination.current,
    pageSize: pagination.pageSize,
    title: form.value.title,
    category: form.value.category,
    classsify: form.value.classsify,
    status: form.value.status,
  };
  loading.value = true;
  demandQuery(param)
    .then((res) => {
      loading.value = false;
      data.value = res.data.content || [];
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

.demand {
  &.demand-status {
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
  &.demand-status-ongoing::before {
    background: #2061ff;
  }
  &.demand-status-completed::before {
    background: #dbdde0;
  }
}
</style>
