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
    <Detail :data="props.data" />
  </a-drawer>
</template>

<script>
export default {
  name: "drawer-wrapper",
};
</script>

<script setup>
import { defineProps, defineEmits } from "vue";
import Detail from "./supplier-detail.vue";

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

const handleOk = () => {
  $emit("submit");
};

const handleCancel = () => {
  $emit("close");
};
</script>
