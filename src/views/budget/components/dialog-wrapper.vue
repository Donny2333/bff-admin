<template>
  <a-modal
    class="page-dialog"
    :width="props.width"
    :visible="props.visible"
    :on-before-ok="beforeOk"
    @ok="handleOk"
    @cancel="handleCancel"
    unmount-on-close
  >
    <template #title>{{ props.title }}</template>
    <component
      ref="formRef"
      :is="layout"
      :type="props.type"
      :data="props.data"
    />
  </a-modal>
</template>

<script>
export default {
  name: "dialog-wrapper",
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
  width: {
    type: Number,
    default: 488,
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

const formRef = ref();

const beforeOk = async () => {
  const err = await formRef.value?.validate();
  if (!err) {
    return true;
  } else {
    return false;
  }
};

const handleOk = () => {
  $emit("submit");
};

const handleCancel = () => {
  $emit("close");
};
</script>
