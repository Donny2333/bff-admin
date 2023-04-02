<template>
  <div class="main-content">
    <div class="search-con">
      <pageTitle
        title="登录日志"
        @onSearch="onSearch"
        @onReset="onReset"
        :search="false"
        :option="true"
        :optionOneSearch="true"
      >
        <template #option>
          <section class="cm-flex cm-col-c">
            <a-button type="primary" @click="downLoad">
              <template #icon>
                <icon-upload />
              </template>
              导出记录
            </a-button>
          </section>
        </template>
        <template #rightSearch>
          <a-form-item style="width: 462px" label="时间筛选">
            <a-range-picker
              allow-clear
              showTime
              v-model="loginTime"
              style="width: 390px"
            />
          </a-form-item>
        </template>
      </pageTitle>
      <div class="table-con">
        <a-table
          :pagination="Object.assign(paginationOption,{total:total}) "
          @page-change="pageChange"
          @page-size-change="pageSizeChange"
          :data="tableData"
          :total="total"
          :scroll="{ y: 600 }"
        >
          <template #columns>
            <a-table-column
              title="登录时间"
              :width="200"
              data-index="loginTime"
            ></a-table-column>
            <a-table-column
              title="IP地址"
              ellipsis
              :width="350"
              data-index="ip"
            ></a-table-column>
            <a-table-column
              :width="120"
              title="登录地"
              data-index="loginArea"
            ></a-table-column>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "login-log",
};
</script>

<script setup>
import pageTitle from "@/components/pageTitle";
import { getLoginLogList, exportLoginLogList } from "@/assets/api/loginLog";
import { ref, watch, computed } from "vue";
import { IconUpload } from "@arco-design/web-vue/es/icon";
import { Message } from "@arco-design/web-vue";
import { useStore } from "vuex";

const tableData = ref([]);
const loginTime = ref([]);
const pageNum = ref(1);
const pageSize = ref(10);
const total = ref(0);
const startTime = ref("");
const endTime = ref("");
const store = useStore();
const loginName = computed(() => store.state.user.user.loginName);
const paginationOption = {
  showTotal: true,
  showJumper: true,
  showPageSize: true,
};
watch(loginTime, () => {
  pageNum.value = 1;
  getLog();
});

function pageChange(page) {
  pageNum.value = page;
  getLog();
}

function pageSizeChange(size) {
  pageSize.value = size;
  getLog();
}
function getLog() {
  if (loginTime.value && loginTime.value.length > 0) {
    startTime.value = loginTime.value[0];
    endTime.value = loginTime.value[1];
  } else {
    startTime.value = "";
    endTime.value = "";
  }
  const pa = {
    loginName: loginName.value,
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    startTime: startTime.value,
    endTime: endTime.value,
  };
  getLoginLogList(pa).then(({ code, msg, data } = {}) => {
    if (code === 200 && data) {
      tableData.value = data.list || [];
      total.value = data.total;
    } else {
      Message.error(msg);
    }
  });
}
// 导出
function downLoad() {
  if (loginTime.value && loginTime.value.length > 0) {
    startTime.value = loginTime.value[0];
    endTime.value = loginTime.value[1];
  } else {
    startTime.value = "";
    endTime.value = "";
  }
  const pa = {
    loginName: loginName.value,
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    startTime: startTime.value,
    endTime: endTime.value,
  };
  exportLoginLogList(pa);
}
getLog();
</script>

<style lang="less" scoped>
.main-content {
  background-color: "var(--color-fill-2)";
  .search-con {
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  }
  /deep/.page-title .option {
    align-items: flex-start;
  }
  .table-con{
    padding-top: 0px;
  }
}
</style>
