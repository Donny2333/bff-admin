<template>
  <div class="main-content">
    <div class="search-con" v-if="form">
      <div class="page-title">数据详情</div>
      <div class="box" style="margin-top: 20px">
        <div class="box-title">基础信息</div>
        <div class="box-content">
          <a-form :model="form" auto-label-width>
            <a-row>
              <a-col :span="4">
                <a-form-item field="name" label="需求名称">
                  <span class="content">{{ form.title }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item field="title" label="模型ID">
                  <span class="content">{{ form.modelId }}</span>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </div>
      <div class="box">
        <div class="box-title">模型信息</div>
        <div class="box-content">
          <a-row>
            <a-col :span="16">
              <a-table
                :columns="columns"
                :data="modelInfo"
                :pagination="false"
              />
            </a-col>
          </a-row>
        </div>
      </div>
      <!-- <div class="box" style="margin-top: 20px">
        <div class="box-title">API信息</div>
        <div class="box-content">
          <a-form :model="contract" auto-label-width label-align="left">
            <a-row>
              <a-col :span="4">
                <a-form-item field="id" label="接口地址">
                  <span class="content"
                    >jdbc:mysql://10.32.226.7:3306/data_space</span
                  >
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </div> -->
      <div class="box" style="margin-top: 20px">
        <div class="box-title">计量信息</div>
        <div class="box-content">
          <a-form :model="api" auto-label-width label-align="left">
            <a-row>
              <a-col :span="4">
                <a-form-item field="id" label="计量方式">
                  <span class="content">{{ form.measurementMethod }}</span>
                </a-form-item>
              </a-col>
              <a-col :span="4">
                <a-form-item field="user" label="计量值">
                  <span class="content">{{ form.measurementCount }}</span>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "data-detail",
};
</script>

<script setup>
import { ref } from "vue";
import { getDataInfo } from "@/assets/api/dataSearch";
import { useRoute } from "vue-router";
const route = useRoute();
const form = ref();
const modelInfo = ref([]);
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
]);
if (route.query.dataParam) {
  getDataInfo(route.query.dataParam).then((res) => {
    form.value = res.data;
    if (form.value) {
      modelInfo.value = JSON.parse(form.value.modelInfo);
    }
  });
}
</script>

<style lang="less" scoped>
// @import url(./common/style.less);
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
  .content {
    color: #343d4e;
  }
}
.main-content {
  background-color: "var(--color-fill-2)";
  .search-con {
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  }
  .page-title {
    font-size: 16px;
    color: #343d4e;
    line-height: 20px;
    font-weight: 600;
  }
}
</style>
