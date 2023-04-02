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
    <component :is="layout" :data="props.data" />
  </a-drawer>
</template>

<script>
export default {
  name: "drawer-wrapper",
};
</script>

<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";
import { registryComponents } from "./async-component";

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

const layout = ref(null);

watch(
  () => props.type,
  (type) => {
    if (type) {
      layout.value = registryComponents(type);
    }
  }
);

const handleOk = () => {
  $emit("submit");
};

const handleCancel = () => {
  $emit("close");
};
</script>
