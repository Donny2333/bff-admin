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
      <a-row>
        <a-col :span="24">
          <a-form-item
            field="renter"
            label="甲方（租户）名称"
            :rules="[{ required: true, message: '名称不能为空' }]"
            allow-clear
          >
            <a-input v-model="form.renter" placeholder="请输入" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item
            field="supplierId"
            label="乙方（供应商）名称/ID"
            :rules="[{ required: true, message: '名称不能为空' }]"
            allow-clear
          >
            <a-select
              v-model="form.supplierId"
              :loading="supplierLoading"
              placeholder="请选择"
              allow-search
              @search="supplierSearch"
            >
              <a-option
                v-for="supplier in supplierList"
                :key="'supplier-' + supplier.id"
                :value="supplier.id"
              >
                {{ supplier.supplierName }}
              </a-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item
            field="demandId"
            label="关联需求"
            :rules="[{ required: true, message: '需求不能为空' }]"
            allow-clear
          >
            <a-select
              v-model="form.demandId"
              :loading="demandLoading"
              placeholder="请选择"
              allow-search
              @search="demandSearch"
            >
              <a-option
                v-for="demand in demandList"
                :key="'demand-' + demand.id"
                :value="demand.id"
              >
                {{ demand.title }}
              </a-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item
            field="sign"
            label="签订日期"
            :rules="[{ required: true, message: '日期不能为空' }]"
            allow-clear
          >
            <a-date-picker v-model="form.sign" style="width: 200px" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item
            field="expiration"
            label="合同有效期"
            :rules="[{ required: true, message: '有效期不能为空' }]"
            allow-clear
          >
            <a-range-picker v-model="form.expiration" style="width: 280px" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-upload
            class="uploader"
            action="/api/dse-portal/contract/uploadFile"
            accept=".pdf"
            :default-file-list="fileList"
            :limit="1"
            :headers="headers"
            with-credentials
            @before-upload="beforeUpload"
            @change="onChange"
            tip="文件大小不超过5M"
          >
            <template #upload-button>
              <a-button class="btn-upload" type="outline">
                <template #icon>
                  <icon-upload />
                </template>
                上传合同
              </a-button>
            </template>
          </a-upload>
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
import { useStore } from "vuex";
import { demandQuery, demandGet } from "@/assets/api/demand";
import { supplierQuery, supplierQueryById } from "@/assets/api/supplier";
import { create, update } from "@/assets/api/contract";
import { Message } from "@arco-design/web-vue";
import { find } from "lodash";

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

const store = useStore();

const headers = {
  token: store.state.user.token,
};

const form = ref({
  id: "",
  contractName: "",
  contractPath: "",
  renter: "",
  supplierId: "",
  demandId: "",
  sign: "",
  expiration: null,
});

const fileList = ref([]);

const supplierLoading = ref(false);
const supplierList = ref([]);

const supplierSearch = async (name, id = 0) => {
  const param = {
    supplierName: name ?? "",
  };
  let list = [];
  supplierLoading.value = true;
  const res = await supplierQuery(param, 1, 10);
  list = res.data.content ?? [];
  if (id && !find(list, (o) => o.id == id)) {
    const r = await supplierQueryById(id);
    list.push(r.data);
  }
  supplierLoading.value = false;
  supplierList.value = list;
};

const demandLoading = ref(false);
const demandList = ref([]);

const demandSearch = async (name, id = 0) => {
  const param = {
    title: name ?? "",
    pageNumber: 1,
    pageSize: 10,
  };
  let list = [];
  demandLoading.value = true;
  const res = await demandQuery(param);
  list = res.data.content ?? [];
  if (id && !find(list, (o) => o.id == id)) {
    const r = await demandGet(id);
    list.push(r.data);
  }
  demandLoading.value = false;
  demandList.value = list;
};

watch(
  () => props.visible,
  (val) => {
    if (val) {
      supplierSearch("", props.data.supplierId);
      demandSearch("", props.data.demandId);
    }
  },
  {
    immediate: true,
  }
);

watch(
  () => props.data,
  (val) => {
    if (val) {
      form.value = {
        id: val.id ?? "",
        contractName: val.contractName ?? "",
        contractPath: val.contractPath ?? "",
        renter: val.nameA,
        supplierId: val.supplierId,
        demandId: val.demandId,
        sign: val.signingDate,
        expiration:
          val.effectiveDate && val.expiryDate
            ? [val.effectiveDate, val.expiryDate]
            : null,
      };
      if (val.contractName) {
        fileList.value = [
          {
            name: val.contractName,
            status: "done",
            contractName: val.contractName,
            contractPath: val.contractPath,
          },
        ];
      } else {
        fileList.value = [];
      }
    }
  }
);

const $emit = defineEmits(["close", "submit"]);

const formRef = ref();

const beforeOk = async () => {
  const err = await formRef.value.validate();

  if (!err) {
    if (form.value.id) {
      const payload = {
        id: form.value.id,
        nameA: form.value.renter,
        supplierId: form.value.supplierId,
        demandId: form.value.demandId,
        signingDate: form.value.sign,
        effectiveDate: form.value.expiration[0],
        expiryDate: form.value.expiration[1],
        contractName: fileList.value[0]?.contractName ?? "",
        contractPath: fileList.value[0]?.contractPath ?? "",
      };
      const res = await update(payload);

      if (res.code == 200) {
        return true;
      } else {
        Message.error(res.msg);
        return false;
      }
    } else {
      const payload = {
        nameA: form.value.renter,
        supplierId: form.value.supplierId,
        demandId: form.value.demandId,
        signingDate: form.value.sign,
        effectiveDate: form.value.expiration[0],
        expiryDate: form.value.expiration[1],
        contractName: fileList.value[0]?.contractName ?? "",
        contractPath: fileList.value[0]?.contractPath ?? "",
      };
      const res = await create(payload);

      if (res.code == 200) {
        return true;
      } else {
        Message.error(res.msg);
        return false;
      }
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

const beforeUpload = (file) => {
  if (file.type != "application/pdf") {
    Message.error("上传文件仅支持PDF");
    return false;
  }
  if (file.size > 5 * 1024 * 1024) {
    Message.error("文件大小不超过5M");
    return false;
  }
  return true;
};

const onChange = (fileItem) => {
  fileList.value = fileItem.map((o) => {
    return {
      name: o.name,
      status: o.status,
      contractName: o.response?.data.contractName ?? "",
      contractPath: o.response?.data.contractPath ?? "",
    };
  });
};
</script>

<style lang="less" scoped>
.btn-upload,
.btn-upload:hover {
  border-color: #dbdde0;
  color: #343d4e;
}

.btn-upload:hover {
  background-color: rgb(229, 230, 235);
}

.uploader {
  ::v-deep(.arco-upload-list) {
    .arco-upload-list-item {
      margin-top: 6px;
    }
  }
}
</style>
