<template>
  <a-form ref="formRef" :model="form" layout="vertical" auto-label-width>
    <a-row :gutter="24">
      <a-col :span="24">
        <a-form-item
          field="code"
          label="空间编号"
          :rules="[{ required: true, message: '编号不能为空' }]"
          allow-clear
        >
          <a-input v-model="form.code" placeholder="请输入" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="24">
        <a-form-item
          field="name"
          label="空间名称"
          :rules="[{ required: true, message: '名称不能为空' }]"
          allow-clear
        >
          <a-input v-model="form.name" placeholder="请输入" />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script setup>
import { defineProps, defineExpose, ref, watch } from "vue";
import { add, update } from "@/assets/api/ns";
import { Message } from "@arco-design/web-vue";

const props = defineProps({
  type: {
    type: String,
    default: "",
  },
  data: {
    type: Object,
    default: () => {},
  },
});

const form = ref({
  code: "",
  name: "",
});

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

const formRef = ref();

const validate = async () => {
  const err = await formRef.value?.validate();

  if (!err) {
    const payload = {
      code: form.value.code,
      name: form.value.name,
    };
    if (form.value.id) {
      const res = await update(payload, form.value.id);
      if (res.code == 200) {
        Message.success("操作成功!");
      } else {
        Message.error(res.msg);
        return res;
      }
    } else {
      const res = await add(payload);
      if (res.code == 200) {
        Message.success("操作成功!");
      } else {
        Message.error(res.msg);
        return res;
      }
    }
  }
  return err;
};

defineExpose({
  validate: validate,
});
</script>
