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
    <div class="box">
      <div class="box-title">基础信息</div>
      <div class="box-content">
        <a-form ref="formRef" :model="form" auto-label-width>
          <a-row>
            <a-col :span="11">
              <a-form-item field="name" label="名称">
                <span class="content">{{ props.data.title }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="11">
              <a-form-item field="type" label="分类">
                <span class="content">{{ props.data.categoryTitle }}</span>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <a-form-item field="level" label="描述">
                <span class="content">{{ props.data.description }}</span>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </div>
    <div class="box" v-if="props.type == 'getDemand'">
      <div class="box-title">模型信息</div>
      <div class="box-content">
        <a-table :columns="columns" :data="data" :pagination="false"> </a-table>
      </div>
    </div>
    <div class="box" v-if="props.type == 'publicData'">
      <div class="box-title">授权供应商</div>
      <div class="box-content">
        <a-form :model="form" auto-label-width :style="{ width: '400px' }">
          <a-form-item field="kafka" label="消息队列">
            <div>
              <div>address: {{ props.data.kafka.address }}</div>
              <div>topic: {{ props.data.kafka.topic }}</div>
            </div>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </a-drawer>
</template>

<script>
export default {
  name: "drawer-wrapper",
};
</script>

<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";
import { receiveDemand } from "@/assets/api/demand";
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
const data = ref([]);

watch(
  () => props.data,
  (val) => {
    if (val && val.modelInfo) {
      try {
        const list = JSON.parse(val.modelInfo);
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
const $emit = defineEmits(["close", "submit"]);

const columns = ref([
  {
    title: "字段名称",
    dataIndex: "fieldName",
    width: 160,
  },
  {
    title: "字段类型",
    dataIndex: "fieldType",
    width: 160,
  },
  {
    title: "字段描述",
    dataIndex: "fieldDes",
    width: 160,
  },
  {
    slotName: "optional",
    align: "center",
    width: 80,
  },
]);

const form = ref({});
const formRef = ref();

const handleOk = () => {
  if (props.type == "getDemand") {
    //领取需求
    const demandId = props.data.id;
    receiveDemand(demandId).then((res) => {
      Message.success("领取成功");
      $emit("submit");
    });
  } else {
    $emit("submit");
  }
};

const handleCancel = () => {
  $emit("close");
};
</script>

<style lang="less" scoped>
.title {
  font-size: 16px;
  color: #343d4e;
  line-height: 24px;
  font-weight: bold;
}
.box-title {
  margin-top: 6px;
  font-size: 14px;
  color: #343d4e;
  line-height: 20px;
  font-weight: bold;
}

.box-content {
  margin-top: 20px;
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
/deep/.arco-form-item-label-col {
  padding-right: 20px;
  .arco-form-item-label {
    color: #9398a1;
  }
}
</style>
