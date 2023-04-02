<template>
  <a-modal
    class="page-dialog"
    :width="488"
    :visible="props.visible"
    :on-before-ok="beforeOk"
    @ok="handleOk"
    @cancel="handleCancel"
    unmount-on-close
  >
    <template #title>{{ props.title }}</template>
    <a-form ref="formRef" :model="form" layout="vertical" auto-label-width>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item
            field="name"
            label="供应商名称"
            :rules="[{ required: true, message: '名称不能为空' }]"
            allow-clear
          >
            <a-input v-model="form.name" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            field="state"
            label="合作状态"
            :rules="[{ required: true, message: '状态不能为空' }]"
            allow-clear
          >
            <a-select
              v-model="form.state"
              style="width: 100%"
              placeholder="请选择"
            >
              <a-option
                v-for="option in status"
                :key="'status-' + option.id"
                :value="option.id"
              >
                {{ option.typeName }}
              </a-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item
            field="type"
            label="行业分类"
            :rules="[{ required: true, message: '分类不能为空' }]"
            allow-clear
          >
            <a-select
              v-model="form.type"
              style="width: 100%"
              placeholder="请选择"
            >
              <a-option
                v-for="option in type"
                :key="'catelog-' + option.id"
                :value="option.id"
              >
                {{ option.typeName }}
              </a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            field="level"
            label="供应商等级"
            :rules="[{ required: true, message: '等级不能为空' }]"
            allow-clear
          >
            <a-select
              v-model="form.level"
              style="width: 100%"
              placeholder="请选择"
            >
              <a-option
                v-for="option in level"
                :key="'classsify-' + option.id"
                :value="option.id"
              >
                {{ option.levelName }}
              </a-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-item
            field="description"
            label="描述"
            :rules="[{ required: true, message: '描述不能为空' }]"
            allow-clear
          >
            <a-textarea
              v-model="form.description"
              placeholder="请输入"
              :max-length="300"
              :auto-size="{
                minRows: 3,
                maxRows: 5,
              }"
              allow-clear
              show-word-limit
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: "dialog-wrapper",
};
</script>

<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";
import { saveOrUpdate } from "@/assets/api/supplier";
import { type, level, status } from "../common/utils";
import { Message } from "@arco-design/web-vue";

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

const form = ref({
  id: 0,
  name: "",
  state: "",
  type: "",
  level: "",
  description: "",
});

watch(
  () => props.data,
  (val) => {
    if (val) {
      form.value = {
        id: val.id ?? 0,
        name: val.supplierName,
        state: val.supplierStatus,
        type: val.supplierType,
        level: val.supplierLevel,
        description: val.supplierDescribe,
      };
    }
  }
);

const $emit = defineEmits(["close", "submit"]);

const formRef = ref();

const beforeOk = async () => {
  const err = await formRef.value.validate();

  if (!err) {
    const payload = {
      id: form.value.id,
      supplierName: form.value.name,
      supplierStatus: form.value.state,
      supplierType: form.value.type,
      supplierLevel: form.value.level,
      supplierDescribe: form.value.description,
    };
    const res = await saveOrUpdate(payload);

    if (res.code == 200) {
      return true;
    } else {
      Message.error(res.msg);
      return false;
    }
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
