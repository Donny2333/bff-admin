<template>
  <div class="box">
    <div class="box-title">基础信息</div>
    <div class="box-content">
      <a-form :model="form" auto-label-width label-align="left">
        <a-row>
          <a-form-item field="code" label="字典code码">
            <span class="content">{{ form.code }}</span>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item field="year" label="字典label值">
            <span class="content">{{ form.label }}</span>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item field="quota" label="所属空间">
            <span class="content">{{ form.namespace ?? "--" }}</span>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item field="comment" label="字典层级">
            <span class="content">{{ form.level }}</span>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item field="comment" label="字典排序">
            <span class="content">{{ form.sort }}</span>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item field="modifiedUserName" label="创建人">
            <span class="content">{{ form.created_by ?? "--" }}</span>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item field="modifiedUserName" label="创建日期">
            <span class="content">{{ form.created_at }}</span>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item field="modifiedUserName" label="修改人">
            <span class="content">{{ form.updated_by ?? "--" }}</span>
          </a-form-item>
        </a-row>
        <a-row>
          <a-form-item field="modifiedUserName" label="修改日期">
            <span class="content">{{ form.updated_at }}</span>
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
