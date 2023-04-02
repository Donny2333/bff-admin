<template>
  <a-form ref="formRef" :model="form" layout="vertical" auto-label-width>
    <a-row :gutter="24">
      <a-col :span="24">
        <a-form-item
          field="code"
          label="字典code码"
          :rules="[{ required: true, message: 'code码不能为空' }]"
          allow-clear
        >
          <a-input v-model="form.code" placeholder="请输入" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="24">
        <a-form-item
          field="label"
          label="字典label值"
          :rules="[{ required: true, message: 'label值不能为空' }]"
          allow-clear
        >
          <a-input v-model="form.label" placeholder="请输入" />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script setup>
import { defineProps, defineExpose, ref, watch } from "vue";
import { add } from "@/assets/api/dict";
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
  pid: "",
  code: "",
  label: "",
});

watch(
  () => props.data,
  (val) => {
    if (val) {
      form.value = {
        pid: val.pid ?? "",
        code: val.code ?? "",
        label: val.label ?? "",
      };
    }
  }
);

const formRef = ref();

const validate = async () => {
  const err = await formRef.value?.validate();

  if (!err) {
    const payload = {
      pid: form.value.pid,
      code: form.value.code,
      label: form.value.label,
    };
    const res = await add(payload);
    if (res.code == 200) {
      Message.success("操作成功!");
    } else {
      Message.error(res.msg);
      return res;
    }
  }
  return err;
};

defineExpose({
  validate: validate,
});
</script>
