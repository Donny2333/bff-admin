<template>
  <a-form ref="formRef" :model="form" layout="vertical" auto-label-width>
    <a-row :gutter="24">
      <a-col :span="24">
        <a-form-item
          field="quota"
          label="预算额度"
          :rules="[{ required: true, message: '额度不能为空' }]"
          allow-clear
        >
          <a-input v-model="form.quota" placeholder="请输入" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="24">
        <a-form-item
          field="year"
          label="预算周期"
          :rules="[{ required: true, message: '周期不能为空' }]"
          allow-clear
        >
          <a-select
            v-model="form.year"
            style="width: 100%"
            placeholder="请选择"
          >
            <a-option
              v-for="option in yearOptions"
              :key="'year-' + option.id"
              :value="option.id"
            >
              {{ option.label }}
            </a-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script setup>
import { defineProps, defineExpose, ref, watch } from "vue";
import { append } from "@/assets/api/budget";
import { Message } from "@arco-design/web-vue";
import moment from "moment";

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
  quota: "",
  year: "",
});

const yearOptions = [
  moment().format("YYYY"),
  moment().add(1, "year").format("YYYY"),
].map((o) => {
  return {
    id: o,
    label: o,
  };
});

watch(
  () => props.data,
  (val) => {
    if (val) {
      form.value = {
        quota: val.quota ?? "",
        year: val.year ?? "",
      };
    }
  }
);

const formRef = ref();

const validate = async () => {
  const err = await formRef.value?.validate();

  if (!err) {
    const payload = {
      quota: form.value.quota,
      year: form.value.year,
    };
    const res = await append(payload);
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
