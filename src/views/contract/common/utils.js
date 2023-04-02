import { ref } from "vue";

export const status = ref([
  {
    id: 0,
    label: "已失效",
  },
  {
    id: 1,
    label: "生效中",
  },
]);

export const getStatusName = (record) => {
  const data = record;
  if (!status.value.length) {
    return "";
  }
  const title = status.value.find((item) => item.id == data.status).label;
  return title;
};
