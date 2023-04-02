import { ref } from "vue";
import { typeList, levelList } from "@/assets/api/supplier";

export const type = ref([]);
export const level = ref([]);
export const status = ref([
  {
    id: 1,
    typeName: "合作中",
  },
  {
    id: 2,
    typeName: "已终止",
  },
]);

typeList().then((res) => {
  if (res.code == 200) {
    type.value = res.data;
  }
});

levelList().then((res) => {
  if (res.code == 200) {
    level.value = res.data;
  }
});

export const getTypeName = (record) => {
  const data = record;
  if (!type.value.length) {
    return "";
  }
  const title = type.value.find(
    (item) => item.id == data.supplierType
  ).typeName;
  return title;
};

export const getLevelName = (record) => {
  const data = record;
  if (!level.value.length) {
    return "";
  }
  const title = level.value.find(
    (item) => item.id == data.supplierLevel
  ).levelName;
  return title;
};

export const getStatusName = (record) => {
  const data = record;
  if (!status.value.length) {
    return "";
  }
  const title = status.value.find(
    (item) => item.id == data.supplierStatus
  ).typeName;
  return title;
};
