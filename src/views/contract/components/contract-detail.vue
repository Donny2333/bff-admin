<template>
  <div class="box">
    <div class="box-title">基础信息</div>
    <div class="box-content">
      <a-form :model="form" auto-label-width label-align="left">
        <a-row :gutter="24">
          <a-col :span="16">
            <a-form-item field="name" label="合同名称">
              <div class="content">
                <span
                  class="text arco-btn arco-btn-text arco-btn-shape-square arco-btn-size-medium arco-btn-status-normal"
                  @click="open(props.data)"
                >
                  {{ form.name }}
                </span>
              </div>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="status" label="合同状态">
              <div class="content">
                <span
                  :class="[
                    'contract',
                    'contract-status',
                    'contract-status-' + props.data.status,
                  ]"
                >
                  {{ getStatusName(form) }}
                </span>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item field="no" label="合同ID">
              <span class="content">{{ form.no }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item field="demand" label="关联需求">
              <div class="content">
                <span>{{ form.demandName ?? "" }}(</span>
                <a-button
                  v-if="form.demandCode"
                  type="text"
                  style="padding: 0"
                  @click="onDemandDetail(props.data)"
                >
                  {{ form.demandCode }}
                </a-button>
                <span>{{ ")" }}</span>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item field="renter" label="甲方(租户)">
              <span class="content">{{ form.renter }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item field="supplier" label="乙方(供应商)">
              <div class="content">
                <span>{{ form.supplier + "(" }}</span>
                <a-button
                  v-if="form.supplierCode"
                  type="text"
                  style="padding: 0"
                  @click="onSupplierDetail(props.data)"
                >
                  {{ form.supplierCode }}
                </a-button>
                <span>{{ ")" }}</span>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item field="sign" label="签订日期">
              <span class="content">{{ form.sign }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item field="expiration" label="合同有效期">
              <span class="content">{{ form.expiration.join(" 至 ") }}</span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </div>
  <div class="box">
    <div class="box-title">合同变更记录</div>
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
  name: "supplier-detail",
};
</script>

<script setup>
import qs from "qs";
import { defineProps, ref, reactive, watch } from "vue";
import DrawerWrapper from "@/views/supplier/components/drawer-wrapper.vue";
import { getStatusName } from "../common/utils";
import { getChangeRecordById } from "@/assets/api/contract";
import { supplierQueryById } from "@/assets/api/supplier";
import { Message } from "@arco-design/web-vue";

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});

const drawer = reactive({
  visible: false,
  title: "",
  data: {},
});

const form = ref({
  no: "",
  status: "",
  name: "",
  demandName: "",
  demandCode: "",
  renter: "",
  supplier: "",
  supplierID: "",
  supplierCode: "",
  sign: "",
  expiration: [],
});

const steps = ref([]);

getChangeRecordById({
  id: props.data.id,
}).then((res) => {
  if (res.code == 200) {
    steps.value = res.data.map((o) => {
      return {
        id: o.id,
        label: ["中止", "启用"][o.status] + " " + o.modifyTime,
        description: `操作人 ${o.userName ?? "--"}`,
      };
    });
  } else {
    Message.error(res.msg);
  }
});

watch(
  () => props.data,
  (val) => {
    if (val) {
      form.value = {
        no: val.contractCode,
        name: val.contractName,
        demandName: val.demandName,
        demandCode: val.demandCode,
        status: val.status,
        renter: val.nameA,
        supplier: val.nameB,
        supplierId: val.supplierId,
        supplierCode: val.supplierCode,
        sign: val.signingDate,
        expiration: [val.effectiveDate, val.expiryDate],
      };
    }
  },
  {
    immediate: true,
  }
);

const onDemandDetail = (record) => {
  const params = {
    demand: record.demandId,
    contract: record.id,
  };
  window.open("#/contract/demand-detail?" + qs.stringify(params), "_blank");
};

const onSupplierDetail = (record) => {
  supplierQueryById(record.supplierId).then((res) => {
    if (res.code == 200) {
      drawer.title = "供应商信息";
      drawer.data = res.data;
      drawer.visible = true;
    }
  });
};

const open = (record) => {
  window.open(`/api/dse-portal/contract/downloadFileById?id=${record.id}`);
};
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

.contract {
  &.contract-status {
    position: relative;
    padding: 0 6px;
    border-radius: 2px;
    font-size: 14px;
    line-height: 22px;
  }
  &.contract-status-1 {
    background: #1459fa;
    color: #ffffff;
  }
  &.contract-status-0 {
    background: #f1f2f3;
    border: 1px solid #dbdde0;
    color: #9398a1;
  }
}
</style>
