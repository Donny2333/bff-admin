<template>
  <div class="main-content">
    <div class="search-con">
      <h4 class="sub-title">线索列表</h4>
      <!-- <div class="search-result">
        <a-input-search
          :style="{ width: '320px' }"
          placeholder="请输入"
          button-text="查询"
          v-model="inputValue"
          search-button
          allow-clear
          @search="searchClick"
        />
      </div> -->
      <div class="search-result">
        <a-form :model="form" layout="horizontal" auto-label-width>
          <a-form-item field="name" label="提交状态">
            <a-select v-model="form.isSubmit" style="width:290px" @change="statusChange" placeholder="请选择">
              <a-option value="ALL">全部</a-option>
              <a-option value="SUBMIT">已提交</a-option>
              <a-option value="NOTSUBMIT">未提交</a-option>
            </a-select>
          </a-form-item>
        </a-form>
        <a-button type="primary" @click="handleAdd">
          <template #icon>
            <icon-plus />
          </template>
          新增线索
        </a-button>
      </div>
      <div class="table-con">
        <a-table
          :columns="columns"
          :pagination="false"
          @page-change="pageChange"
          @page-size-change="pageSizeChange"
          :data="data"
          :scroll="{ y: 600 }"
        >
          <template #optional="{ record }">
            <a-button type="primary" @click="xscfClick(record)"
              >线索拆分</a-button
            >
            <a-button style="margin-left: 20px" @click="view(record)"
              >查看</a-button
            >
          </template>
          <template #xsgk="{ record }">
            <span v-if="record.xsgk == 0">私密</span>
            <span v-if="record.xsgk == 1">公开</span>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getAllAj } from "@/assets/api/api";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { IconPlus } from "@arco-design/web-vue/es/icon";
const router = useRouter();
// import { Message } from "@arco-design/web-vue";
const columns = ref([
  {
    title: "线索编码",
    dataIndex: "ywzm",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "线索标题",
    dataIndex: "xsbt",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "线索类型",
    dataIndex: "xslx",
    ellipsis: true,
    width: 150,
    tooltip: true,
  },
  {
    title: "线索公开",
    dataIndex: "xsgk",
    ellipsis: true,
    tooltip: true,
    width: 100,
    slotName: "xsgk",
  },
  {
    title: "线索级别",
    dataIndex: "xsjb",
    ellipsis: true,
    width: 150,
    tooltip: true,
  },
   {
    title: "线索来源",
    dataIndex: "typeTitle",
    ellipsis: true,
    width: 150,
    tooltip: true,
  },
  
  {
    title: "父线索编码",
    dataIndex: "fywzm",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "操作",
    width: 220,
    slotName: "optional",
  },
]);
const pageNum = ref(1);
const pageSize = ref(10);
const form = ref(
  {
    isSubmit:'SUBMIT'
  }
)
const statusChange = ()=>{
  getData()
}
const pageChange = (val) => {
  pageNum.value = val;
  getData;
};
const view = (item) => {
  router.push({
    path: "/main-add",
    query: { fid: item.ywzm, view: "1", ywzm: item.ywzm },
  });
};
const xscfClick = (item) => {
  router.push({ path: "/main-add", query: { fid: item.ywzm } });
};
const pageSizeChange = (val) => {
  pageSize.value = val;
  getData();
};
const data = ref([]);

const handleAdd = () => {
  // getdata();
  router.push({ path: "/main-add" });
};
const total = ref(0);
const getData = () => {
  const param = {
    pageNum: 1,
    pageSize: 1000,
    isSubmit: form.value.isSubmit,
  };
  getAllAj(param)
    .then((res) => {
      console.log("aaa", res);
      data.value = res.data.records;
      total.value = res.data.total;
    })
    .catch((error) => {
      console.log("aaa", error);
    });
};
getData();
</script>

<style lang='less' scoped>
.main-content {
  background-color: "var(--color-fill-2)";
  .search-con {
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    .search-result {
      // margin-top: 15px;
    }
  }
  .table-con {
    margin-top: 20px;
  }
}
</style>