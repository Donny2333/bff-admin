<template>
  <div class="main-content">
    <div class="search-con">
      <pageTitle
        title="数据搜索"
        @onSearch="onSearch"
        @onReset="onReset"
        :search="true"
        :option="false"
      >
        <template #search>
          <a-form :model="form" layout="inline" auto-label-width>
            <a-form-item field="keyword" label="名称">
              <a-input
                v-model="form.keyword"
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
          :pagination="paginationOption"
          :loading="loading"
          @page-change="pageChange"
          @page-size-change="pageSizeChange"
          :data="data"
          :scroll="{ y: 600 }"
        >
          <template #measurementCount="{ record }">
            {{ record.measurementCount }} 次
          </template>
          <template #optional="{ record }">
            <a-button type="text" @click="handleDetail(record)"
              >查看详情</a-button
            >
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "data-search",
};
</script>

<script setup>
import pageTitle from "@/components/pageTitle";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { getDataList } from "@/assets/api/dataSearch";
const router = useRouter();

const loading = ref(false);
const paginationOption = reactive({
  showTotal: true,
  showJumper: true,
  showPageSize: true,
  total:0
});
const pageNumber = ref(1);
const pageSize = ref(10);
const form = ref({
  keyword: "",
});
const columns = ref([
  {
    title: "需求名称",
    dataIndex: "title",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "模型ID",
    dataIndex: "modelId",
    slotName: "modelId",
  },
  {
    title: "计量方式",
    dataIndex: "measurementMethod",
  },
  {
    title: "计量值",
    dataIndex: "measurementCount",
    slotName: "measurementCount",
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
  getDataListRequest();
};

const onReset = () => {
  form.value.keyword = "";
  pageNumber.value = 1;
  pageSize.value = 10;
  getDataListRequest();
};

const pageChange = (val) => {
  pageNumber.value = val;
  getDataListRequest();
};

const pageSizeChange = (val) => {
  pageNumber.value = 1;
  pageSize.value = val;
  getDataListRequest();
};

const handleDetail = (record) => {
  //查看详情
  const path = {
    path: "/data-detail",
    query:{
      dataParam:record.id
    }
  };
  // sessionStorage.setItem("DATASEARCHDETAIL",JSON.stringify(record))
  const { href } = router.resolve(path);
  window.open(href, "_blank"); //在新的tab页打开
};
getDataListRequest();
function getDataListRequest() {
  const param = {
    pageNum: pageNumber.value,
    pageSize: pageSize.value,
  };
  getDataList(Object.assign(param, form.value)).then((res) => {
    console.log("sss", res);
    data.value = res.data.list;
    paginationOption.total = res.data.total
  });
}
</script>

<style lang="less" scoped>
.main-content {
  background-color: "var(--color-fill-2)";
  .search-con {
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  }
}
</style>
