<template>
  <div class="box">
    <div class="box-title">基础信息</div>
    <div class="box-content">
      <a-form :model="form" auto-label-width label-align="left">
        <a-row>
          <a-form-item
            field="code"
            :label="['总行下发ID', '支行下发ID'][roleId]"
          >
            <span class="content">{{ form.code }}</span>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item field="year" label="预算年度">
            <span class="content">{{ form.year }}</span>
          </a-form-item>
        </a-row>
        <a-row v-if="roleId == 0">
          <a-form-item field="branchBankName" label="支行名称">
            <span class="content">{{ form.branchBankName }}</span>
          </a-form-item>
        </a-row>
        <a-row v-if="roleId == 1">
          <a-form-item field="deptName" label="预算单位">
            <span class="content">{{ form.deptName }}</span>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item field="quota" label="下发额度/份">
            <span class="content">{{ form.quota }}</span>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item field="createTime" label="下发时间">
            <span class="content">{{ form.createTime }}</span>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item field="modifiedUserName" label="操作人">
            <span class="content">{{ form.modifiedUserName }}</span>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item field="comment" label="描述">
            <span class="content">{{ form.comment }}</span>
          </a-form-item>
        </a-row>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, watch } from "vue";
import { roleId } from "../common/utils";

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});

const form = ref({});

watch(
  () => props.data,
  (val) => {
    if (val) {
      form.value = val;
    }
  },
  {
    immediate: true,
  }
);
</script>

<style lang="less" scoped>
@import url(../common/style.less);
</style>
