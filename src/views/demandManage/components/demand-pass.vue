<template>
  <div class="box">
    <div class="box-title">基础信息</div>
    <div class="box-content">
      <a-form ref="formRef" :model="form" auto-label-width>
        <a-row>
          <a-col :span="8">
            <a-form-item field="title" label="名称">
              <span class="content">{{ form.title }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="category" label="分类">
              <span class="content">{{ form.categoryTitle }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="classsify" label="分级">
              <span class="content">{{ form.classsifyTitle }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
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
      <a-table :columns="columns" :data="data" :pagination="false" />
    </div>
  </div>
  <div class="box" style="margin-top: 30px">
    <div class="box-title">授权供应商</div>
    <div class="box-content">
      <a-form ref="formRef" :model="form" auto-label-width>
        <a-row>
          <a-col :span="24">
            <a-form-item field="vendor" label="供应商">
              <a-select
                :style="{ width: '320px' }"
                :max-tag-count="3"
                v-model="vendors"
                :loading="supplierLoading"
                placeholder="请选择"
                allow-search
                multiple
                @search="supplierSearch"
              >
                <a-option
                  v-for="supplier in supplierList"
                  :key="'supplier-' + supplier.id"
                  :value="supplier.id"
                >
                  {{ supplier.supplierName }}
                </a-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "demand-pass",
};
</script>

<script setup>
import { ref, defineProps, defineExpose, watch } from "vue";
import { authVendors } from "@/assets/api/demand";
import { Message } from "@arco-design/web-vue";
import { supplierQuery, supplierQueryById } from "@/assets/api/supplier";
import { getVendorsById } from "@/assets/api/demand";
import { find } from "lodash";

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});

const form = ref({});

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
  {
    slotName: "optional",
    align: "center",
    width: 80,
  },
]);

const data = ref([]);

const vendors = ref([]);
const supplierLoading = ref(false);
const supplierList = ref([]);
const supplierSearch = async (name, ids = []) => {
  const param = {
    supplierName: name ?? "",
  };
  let list = [];
  supplierLoading.value = true;
  const res = await supplierQuery(param, 1, 10);
  list = res.data.content ?? [];
  await ids.map(async (id) => {
    if (id && !find(list, (o) => o.id == id)) {
      const r = await supplierQueryById(id);
      if (r.data) {
        list.push(r.data);
      }
    }
    return Promise.resolve();
  });
  supplierLoading.value = false;
  supplierList.value = list;
};

watch(
  () => props.data,
  async (val) => {
    if (val) {
      const {
        id,
        title,
        category,
        classsify,
        classsifyTitle,
        description,
        modelInfo,
        categoryTitle,
      } = val;
      form.value = {
        id,
        title,
        category,
        classsify,
        classsifyTitle,
        description,
        categoryTitle,
      };
      const res = await getVendorsById(id);
      vendors.value = res.data
        .map((obj) => {
          return obj.id ?? obj;
        })
        .filter((o) => o);
      supplierSearch("", vendors.value);
      try {
        const list = JSON.parse(modelInfo);
        if (Array.isArray(list)) {
          data.value = list;
        }
      } catch (e) {
        data.value = [];
        console.error(e);
      }
    }
  },
  {
    immediate: true,
  }
);

const validate = async (f) => {
  const payload = {
    demandId: props.data.id,
    vendorIds: vendors.value.join(","),
  };
  await authVendors(payload);
  Message.success("操作成功!");
  f();
};

defineExpose({
  validate: validate,
});
</script>

<style lang="less" scoped>
@import url(../common/style.less);

::v-deep(.arco-form-item-label-col) {
  padding-right: 20px;
  .arco-form-item-label {
    color: #9398a1;
  }
}
.content {
  color: #343d4e;
  line-height: 20px;
}
</style>
