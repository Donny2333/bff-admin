<template>
  <a-form ref="formRef" :model="form" layout="vertical" auto-label-width>
    <a-row :gutter="24">
      <a-col :span="24">
        <a-form-item
          field="year"
          label="预算年度"
          :rules="[{ required: true, message: '年度不能为空' }]"
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
    <a-form-item field="year" label="额度库存" allow-clear>
      <a-space style="width: 100%; padding-left: 6px" direction="vertical" fill>
        <a-row>
          <a-col :span="8">
            <span class="title">预算周期</span>
            <span class="content">{{ form.year }} 年度</span>
          </a-col>
          <a-col v-if="roleId == 1" :span="8">
            <span class="title">支行信息</span>
            <span class="content">
              {{ userName ?? "--" }}
            </span>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <span class="title">预算额度</span>
            <span class="content">
              {{ yearQuota(form.year).quota ?? "--" }} 份
            </span>
          </a-col>
          <a-col :span="8">
            <span class="title">已下发</span>
            <span class="content">
              {{ yearQuota(form.year).issued ?? "--" }} 份
            </span>
          </a-col>
          <a-col :span="8">
            <span class="title">剩余</span>
            <span class="content">
              {{ yearQuota(form.year).surplus ?? "--" }} 份
            </span>
          </a-col>
        </a-row>
      </a-space>
    </a-form-item>
    <a-row :gutter="24">
      <a-col :span="24">
        <a-form-item
          field="quota"
          label="额度下发"
          :rules="[{ required: true, message: '额度下发不能为空' }]"
          allow-clear
        >
          <div style="width: 100%">
            <a-table :columns="columns" :data="data" :pagination="false">
              <template #branchBankId="{ rowIndex }">
                <a-select
                  v-model="data[rowIndex].branchBankId"
                  :bordered="true"
                  allow-search
                  placeholder="请选择"
                >
                  <a-option
                    v-for="option in branchBankList"
                    :key="'year-' + option.id"
                    :value="option.id"
                  >
                    {{ option.name }}
                  </a-option>
                </a-select>
              </template>
              <template #deptId="{ rowIndex }">
                <a-select
                  v-model="data[rowIndex].deptId"
                  :bordered="true"
                  allow-search
                  placeholder="请选择"
                >
                  <a-option
                    v-for="option in deptList"
                    :key="'year-' + option.id"
                    :value="option.id"
                  >
                    {{ option.name }}
                  </a-option>
                </a-select>
              </template>
              <template #quota="{ rowIndex }">
                <a-input-number
                  v-model="data[rowIndex].quota"
                  :min="1"
                  :step="1"
                />
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
        </a-form-item>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="24">
        <a-form-item
          field="comment"
          label="描述"
          :rules="[{ required: true, message: '描述不能为空' }]"
          allow-clear
        >
          <a-textarea
            v-model="form.comment"
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
</template>

<script setup>
import { defineProps, defineExpose, ref, watch } from "vue";
import { distributeAppend, distributeAppend2 } from "@/assets/api/budget";
import { Message } from "@arco-design/web-vue";
import {
  userName,
  roleId,
  branchBankList,
  deptList,
  yearOptions,
  yearQuota,
} from "../common/utils";
import { IconDelete, IconPlus } from "@arco-design/web-vue/es/icon";
import moment from "moment";

const year1 = parseInt(moment().format("YYYY"));

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
  year: year1,
  comment: "",
});
const columns = ref([
  [
    {
      title: "下发支行",
      slotName: "branchBankId",
      width: 160,
    },
    {
      title: "下发预算单位",
      slotName: "deptId",
      width: 160,
    },
  ][roleId.value],
  {
    title: "下发额度",
    slotName: "quota",
    width: 160,
  },
  {
    slotName: "optional",
    align: "center",
    width: 80,
  },
]);
const data = ref([]);

const formRef = ref();

watch(
  () => props.data,
  (val) => {
    if (val) {
      form.value = {
        quota: val.quota ?? "",
        year: val.year ?? year1,
        comment: val.comment ?? "",
      };
    }
  }
);

const onDelete = (index) => {
  data.value.splice(index, 1);
  if (data.value.length == 0) {
    form.value.quota = "";
  } else {
    form.value.quota = data.value;
  }
  formRef.value?.validateField("quota");
};

const onAdd = () => {
  data.value.push({
    branchBankId: branchBankList.value[0]?.id ?? "",
    deptId: deptList.value[0]?.id ?? "",
    quota: 10,
  });
  form.value.quota = data.value;
  formRef.value?.validateField("quota");
};

const validate = async () => {
  const err = await formRef.value?.validate();

  if (!err) {
    const payload = {
      quota: form.value.quota,
      year: form.value.year,
      comment: form.value.comment,
    };
    const fn = [distributeAppend, distributeAppend2][roleId.value];
    const res = await fn(payload);
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

<style lang="less" scoped>
.title {
  display: inline-block;
  padding-right: 8px;
}
.content {
  display: inline-block;
}
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
