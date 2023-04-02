import { ref, reactive, computed } from "vue";
import store from "@/store";
import {
  queryQuotaList,
  queryDeptList,
  queryBranchBankList,
} from "@/assets/api/budget";
import { find } from "lodash";

export const quotaList = ref([]);

export function getQuota() {
  queryQuotaList().then((res) => {
    quotaList.value = res.data;
  });
}
getQuota();

export const branchBankList = ref([]);

queryBranchBankList(
  {
    name: "",
  },
  1,
  9999
).then((res) => {
  branchBankList.value = res.data.content;
});

export const deptList = ref([]);

queryDeptList(
  {
    name: "",
  },
  1,
  9999
).then((res) => {
  deptList.value = res.data.content;
});

export const yearOptions = computed(() =>
  quotaList.value.map((o) => {
    return {
      id: o.year,
      label: o.year,
    };
  })
);

export const yearQuota = computed(() => {
  return (year) => find(quotaList.value, (o) => o?.year == year) ?? {};
});

// 用户角色
export const roleId = computed(() => {
  return {
    ["总行角色"]: 0,
    ["支行角色"]: 1,
    ["预算单位角色"]: 2,
  }[store.state.user.userAuth.role];
});

// 用户名
export const userName = computed(() => {
  return store?.state.user.userName;
});

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
