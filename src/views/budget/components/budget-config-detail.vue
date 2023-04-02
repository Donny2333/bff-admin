<template>
  <div class="box">
    <div class="box-title">基础信息</div>
    <div class="box-content">
      <a-form :model="form" auto-label-width label-align="left">
        <a-row>
          <a-form-item field="code" label="预算编号">
            <span class="content">{{ form.code }}</span>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item field="year" label="预算年度">
            <span class="content">{{ form.year }}</span>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item field="quota" label="预算金额">
            <span class="content">{{ form.quota }}</span>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item field="comment" label="描述">
            <span class="content">{{ form.comment }}</span>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item field="createTime" label="发行日期">
            <span class="content">{{ form.createTime }}</span>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item field="modifiedUserName" label="操作人">
            <span class="content">{{ form.modifiedUserName }}</span>
          </a-form-item>
        </a-row>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, watch } from "vue";

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
