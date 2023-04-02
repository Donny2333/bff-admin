import { ref, reactive } from "vue";

export const dialog = reactive({
  visible: false,
  title: "",
  width: 488,
  type: "",
  data: {},
});

export function openDialog(payload) {
  payload = {
    visible: false,
    title: "",
    width: 488,
    type: "",
    data: {},
    ...payload,
  };
  dialog.title = payload.title;
  dialog.visible = payload.visible;
  dialog.width = payload.width;
  dialog.type = payload.type;
  dialog.data = payload.data;
  dialog.visible = true;
}

export const drawer = reactive({
  visible: false,
  title: "",
  type: "",
  data: {},
});

export const loading = ref(false);
export const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: true,
  showJumper: true,
  showPageSize: true,
});
