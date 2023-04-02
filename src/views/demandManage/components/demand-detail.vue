<template>
  <div class="box">
    <div class="box-title">基础信息</div>
    <div class="box-content">
      <a-form ref="formRef" :model="form" auto-label-width>
        <a-row>
          <a-col :span="12">
            <a-form-item field="title" label="名称">
              <span class="content">{{ form.title }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="demandCode" label="需求ID">
              <span class="content">{{ form.demandCode }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item field="category" label="分类">
              <span class="content">{{ form.categoryTitle }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
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
          <a-col :span="12">
            <a-form-item field="name" label="供应商">
              <span class="content">{{ vendors.join("，") }}</span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "demand-detail",
};
</script>

<script setup>
import { ref, watch, defineProps } from "vue";
import { getVendorsById } from "@/assets/api/demand";

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

watch(
  () => props.data,
  (val) => {
    if (val) {
      const {
        id,
        title,
        demandCode,
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
        demandCode,
        category,
        classsify,
        classsifyTitle,
        description,
        categoryTitle,
      };
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

getVendorsById(form.value.id).then((res) => {
  vendors.value = res.data.map((obj) => {
    return obj.supplierName ?? obj;
  });
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
