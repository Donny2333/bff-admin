<template>
  <a-drawer
    class="page-drawer"
    :width="640"
    :visible="props.visible"
    @ok="handleOk"
    @cancel="handleCancel"
    unmountOnClose
  >
    <template #title>
      <div class="title">{{ props.title }}</div>
    </template>
    <DemandEdit
      ref="formRef"
      v-if="['edit', 'add'].includes(props.type)"
      :data="props.data"
      :type="props.type"
    />
    <DemandDetail
      ref="formRef"
      v-if="props.type == 'detail'"
      :data="props.data"
    />
    <DemandPass ref="formRef" v-if="props.type == 'pass'" :data="props.data" />
  </a-drawer>
</template>

<script>
export default {
  name: "drawer-wrapper",
};
</script>

<script setup>
import { defineProps, defineEmits, ref } from "vue";
import DemandEdit from "./demand-edit.vue";
import DemandDetail from "./demand-detail.vue";
import DemandPass from "./demand-pass.vue";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  visible: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "",
  },
  data: {
    type: Object,
    default: () => {},
  },
});

const $emit = defineEmits(["close", "submit"]);

const formRef = ref();

const handleOk = () => {
  try {
    formRef.value?.validate((err) => {
      if (!err) {
        $emit("submit");
      }
    });
  } catch (e) {
    console.error(e);
    $emit("submit");
  }
};

const handleCancel = () => {
  try {
    formRef.value?.resetFields();
    $emit("close");
  } catch (e) {
    console.error(e);
    $emit("close");
  }
};
</script>

<style lang="less" scoped>
@import url(../common/style.less);
</style>
