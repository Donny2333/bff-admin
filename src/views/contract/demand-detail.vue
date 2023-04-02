<template>
  <div class="main-content">
    <div class="search-con">
      <div class="page-title">需求详情</div>
      <div class="box" style="margin-top: 20px">
        <div class="box-title">需求信息</div>
        <div class="box-content">
          <a-form :model="form" auto-label-width>
            <a-row>
              <a-col :span="4">
                <a-form-item field="name" label="名称">
                  <span class="content">{{ form.name }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item field="title" label="ID">
                  <span class="content">{{ form.id }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item field="category" label="分类">
                  <span class="content">{{ getCategoryName(form) }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item field="classsify" label="分级">
                  <span class="content">{{ getClasssifyName(form) }}</span>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="16">
                <a-form-item field="description" label="描述">
                  <span class="content">{{ form.description }}</span>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </div>
      <div class="box">
        <div class="box-title">模型信息</div>
        <div class="box-content">
          <a-row>
            <a-col :span="16">
              <a-table :columns="columns" :data="data" :pagination="false" />
            </a-col>
          </a-row>
        </div>
      </div>
      <div class="box" style="margin-top: 20px">
        <div class="box-title">合同信息</div>
        <div class="box-content">
          <a-form :model="contract" auto-label-width label-align="left">
            <a-row>
              <a-form-item field="id" label="合同ID">
                <span class="content">{{ contract.id }}</span>
              </a-form-item>
            </a-row>
            <a-row>
              <a-form-item field="name" label="合同名称">
                <span class="content">{{ contract.name }}</span>
              </a-form-item>
            </a-row>
            <a-row>
              <a-form-item field="renter" label="甲方信息">
                <span class="content">{{ contract.renter }}</span>
              </a-form-item>
            </a-row>
            <a-row>
              <a-form-item field="supplier" label="乙方信息">
                <span class="content">{{ contract.supplier }}</span>
              </a-form-item>
            </a-row>
            <a-row>
              <a-form-item field="time" label="有效期">
                <span class="content">{{ contract.time.join(" 至 ") }}</span>
              </a-form-item>
            </a-row>
          </a-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "supplier-detail",
};
</script>

<script setup>
import { ref } from "vue";
import { demandGet, getDictData } from "@/assets/api/demand";
import { detail } from "@/assets/api/contract";
import { useRoute } from "vue-router";

const demandCategory = ref([]);
const demandClasssify = ref([]);

getDictData().then((res) => {
  demandCategory.value =
    res.data.typeList.find((item) => item.code == "demand_category")
      ?.itemList || [];
  demandClasssify.value =
    res.data.typeList.find((item) => item.code == "demand_classsify")
      ?.itemList || [];
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

const route = useRoute();

const form = ref({
  name: "",
  id: "",
  category: "",
  classsify: "",
  description: "",
});

const columns = ref([
  {
    title: "字段名称",
    dataIndex: "fieldName",
    slotName: "fieldName",
    width: 160,
  },
  {
    title: "字段类型",
    dataIndex: "fieldType",
    slotName: "fieldType",
    width: 160,
  },
  {
    title: "字段描述",
    dataIndex: "fieldDes",
    slotName: "fieldDes",
    width: 160,
  },
]);

const data = ref([]);

const contract = ref({
  id: "",
  name: "",
  renter: "",
  supplier: "",
  time: [],
});

if (route.query.demand) {
  demandGet(route.query.demand).then((res) => {
    form.value = {
      name: res.data.title,
      id: res.data.demandCode,
      category: res.data.category,
      classsify: res.data.classsify,
      description: res.data.description,
    };
    try {
      const list = JSON.parse(res.data.modelInfo);
      if (Array.isArray(list)) {
        data.value = list;
      }
    } catch (e) {
      data.value = [];
      console.error(e);
    }
  });
}

if (route.query.contract) {
  detail({
    id: route.query.contract,
  }).then((res) => {
    if (res.code == 200) {
      contract.value = {
        id: res.data.contractCode,
        name: res.data.contractName,
        renter: res.data.nameA,
        supplier: res.data.nameB,
        time: [res.data.effectiveDate, res.data.expiryDate],
      };
    }
  });
}
</script>

<style lang="less" scoped>
@import url(./common/style.less);

.main-content {
  background-color: "var(--color-fill-2)";
  .search-con {
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  }
  .page-title {
    font-size: 16px;
    color: #343d4e;
    line-height: 20px;
    font-weight: 600;
  }
}
</style>
