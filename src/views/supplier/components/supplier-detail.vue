<template>
  <div class="box">
    <div class="box-title">基础信息</div>
    <div class="box-content">
      <a-form :model="form" auto-label-width label-align="left">
        <a-row>
          <a-col :span="12">
            <a-form-item field="name" label="供应商名称">
              <span class="content">{{ form.name }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="state" label="合作状态">
              <span
                class="content"
                :class="[
                  'supplier',
                  'supplier-status',
                  'supplier-status-' + props.data.supplierStatus,
                ]"
                >{{ getStatusName(props.data) }}</span
              >
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item field="code" label="供应商ID">
              <span class="content">{{ form.code }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="level" label="供应商等级">
              <span class="content">{{ getLevelName(props.data) }}</span>
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
    <div class="box-title">合作状态变更记录</div>
    <div class="box-content">
      <a-steps class="circle-dot" type="dot" direction="vertical">
        <a-step
          v-for="step in steps"
          :key="step.id"
          :description="step.description"
        >
          {{ step.label }}
        </a-step>
      </a-steps>
    </div>
  </div>
</template>

<script>
export default {
  name: "supplier-detail",
};
</script>

<script setup>
import { defineProps, ref, watch } from "vue";
import { getLevelName, getStatusName } from "../common/utils";
import { changeList } from "@/assets/api/supplier";

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});

const form = ref({
  code: "",
  state: "",
  name: "",
  type: "",
  level: "",
  description: "",
});

const steps = ref([]);

changeList(props.data.id).then((res) => {
  if (res.code == 200) {
    steps.value = res.data.content.map((o) => {
      return {
        id: o.id,
        label: `${o.supplierChange} ${o.modifyTime}`,
        description: `操作人 ${o.modifiedUserName}`,
      };
    });
  }
});

watch(
  () => props.data,
  (val) => {
    if (val) {
      form.value = {
        code: val.supplierCode,
        name: val.supplierName,
        state: val.supplierStatus,
        type: val.supplierType,
        level: val.supplierLevel,
        description: val.supplierDescribe,
      };
    }
  },
  {
    immediate: true,
  }
);
</script>

<style lang="less" scoped>
@import url(../common/style.less);

.circle-dot {
  ::v-deep(.arco-steps-item-title) {
    font-size: 14px;
    color: #343d4e;
  }
  ::v-deep(.arco-steps-item-node) {
    border-style: solid;
    background-color: transparent;
  }
}

.supplier {
  &.supplier-status {
    position: relative;
    padding: 0 6px;
    border-radius: 2px;
    font-size: 14px;
    line-height: 22px;
  }
  &.supplier-status-1 {
    background: #1459fa;
    color: #ffffff;
  }
  &.supplier-status-2 {
    background: #f1f2f3;
    border: 1px solid #dbdde0;
    color: #9398a1;
  }
}
</style>
