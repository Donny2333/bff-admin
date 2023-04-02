<template>
  <div class="box">
    <div class="box-title">基础信息</div>
    <div class="box-content">
      <a-form ref="formRef" :model="form" layout="vertical" auto-label-width>
        <a-row>
          <a-col :span="24">
            <a-form-item
              field="title"
              label="名称"
              :rules="[{ required: true, message: '名称不能为空' }]"
              allow-clear
            >
              <a-input v-model="form.title" placeholder="请输入" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="11">
            <a-form-item
              field="category"
              label="分类"
              :rules="[{ required: true, message: '分类不能为空' }]"
            >
              <a-select
                v-model="form.category"
                style="width: 100%"
                placeholder="请选择"
              >
                <a-option
                  v-for="option in demandCategory"
                  :key="'catelog-' + option.itemId"
                  :value="option.code"
                >
                  {{ option.name }}
                </a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="11" :offset="2">
            <a-form-item
              field="classsify"
              label="分级"
              :rules="[{ required: true, message: '分级不能为空' }]"
            >
              <a-select
                v-model="form.classsify"
                style="width: 100%"
                placeholder="请选择"
              >
                <a-option
                  v-for="option in demandClasssify"
                  :key="'classsify-' + option.itemId"
                  :value="option.code"
                >
                  {{ option.name }}
                </a-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item
              field="description"
              label="描述"
              :rules="[{ required: true, message: '描述不能为空' }]"
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
    </div>
  </div>
  <div class="box">
    <div class="box-title">模型信息</div>
    <div class="box-content">
      <a-table :columns="columns" :data="data" :pagination="false">
        <template #fieldName="{ rowIndex }">
          <a-input v-model="data[rowIndex].fieldName" />
        </template>
        <template #fieldType="{ rowIndex }">
          <a-select
            v-model="data[rowIndex].fieldType"
            style="width: 100%"
            placeholder="请选择"
          >
            <a-option>分类一</a-option>
            <a-option>分类二</a-option>
            <a-option>分类三</a-option>
          </a-select>
        </template>
        <template #fieldDes="{ rowIndex }">
          <a-input v-model="data[rowIndex].fieldDes" placeholder="请输入" />
        </template>
        <template #optional="{ rowIndex }">
          <a-button type="outline" @click="onDelete(rowIndex)">
            <template #icon>
              <icon-delete />
            </template>
          </a-button>
        </template>
      </a-table>
      <div class="add-wrapper">
        <a-button class="add-btn" type="text" long @click="onAdd">
          <template #icon>
            <icon-plus />
          </template>
          <template #default>新增一行</template>
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "demand-edit",
};
</script>

<script setup>
import { demandCreate, demandUpdate } from "@/assets/api/demand";
import { defineProps, defineExpose, ref, watch, inject } from "vue";
import { IconDelete, IconPlus } from "@arco-design/web-vue/es/icon";
import { Message } from "@arco-design/web-vue";

const demandCategory = inject("demand_category") || [];
const demandClasssify = inject("demand_classsify") || [];

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
  title: "",
  category: "",
  classsify: "",
  description: "",
});

const columns = ref([
  {
    title: "字段名称",
    dataIndex: "fieldName",
    slotName: "fieldName",
    width: 160,
  },
  {
    title: "字段类型",
    dataIndex: "fieldType",
    slotName: "fieldType",
    width: 160,
  },
  {
    title: "字段描述",
    dataIndex: "fieldDes",
    slotName: "fieldDes",
    width: 160,
  },
  {
    slotName: "optional",
    align: "center",
    width: 80,
  },
]);

const data = ref([
  {
    fieldName: "发件人",
    fieldType: "string",
    fieldDes: "发件人姓名",
  },
]);

watch(
  () => props.data,
  (val) => {
    if (val) {
      const { title, category, classsify, description, modelInfo } = val;
      form.value = {
        title,
        category,
        classsify,
        description,
      };
      try {
        const list = JSON.parse(modelInfo);
        if (Array.isArray(list)) {
          data.value = list;
        }
      } catch (e) {
        data.value = [];
        console.error(e);
      }
    }
  },
  {
    immediate: true,
  }
);

const onDelete = (index) => {
  data.value.splice(index, 1);
};

const onAdd = () => {
  data.value.push({
    fieldName: "发件人",
    fieldType: "string",
    fieldDes: "发件人姓名-" + data.value.length,
  });
};

const formRef = ref();

const validate = (f) => {
  return formRef.value?.validate(async (err) => {
    if (!err) {
      const payload = {
        id: props.data.id,
        title: form.value.title,
        category: form.value.category,
        classsify: form.value.classsify,
        description: form.value.description,
        modelInfo: JSON.stringify(data.value),
      };
      if (props.type == "add") {
        await demandCreate(payload);
        Message.success("操作成功!");
      } else if (props.type == "edit") {
        await demandUpdate(payload);
        Message.success("操作成功!");
      }
    }
    return f(err);
  });
};

const resetFields = (f) => {
  return formRef.value?.resetFields(f);
};

defineExpose({
  validate: validate,
  resetFields: resetFields,
});
</script>

<style lang="less" scoped>
@import url(../common/style.less);

.add-wrapper {
  margin-top: 8px;
  height: 50px;
  width: 100%;
  .add-btn {
    height: 100%;
    border: 1px dashed #ecedef;
  }
}
</style>
