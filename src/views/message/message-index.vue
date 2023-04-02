<template>
  <section class="main-content message-manage-wrap">
    <section class="search-con message-manage-content">
      <h1 class="cm-mg-b-20">消息管理</h1>
      <a-tabs class="cm-flex" default-active-key="-1" v-model:active-key="keys">
        <a-tab-pane key="-1" title="全部消息">
          <template #title>
            <span class="cm-mg-r-48">全部消息</span>
          </template>
        </a-tab-pane>
        <a-tab-pane key="1">
          <template #title>
            <span class="cm-mg-r-48">已读消息</span>
          </template>
        </a-tab-pane>
        <a-tab-pane key="0">
          <template #title>
            <span>未读消息</span>
          </template>
        </a-tab-pane>
      </a-tabs>
      <div class="search-box-wrap page-title cm-flex">
        <div class="search-left cm-flex-1">
          <a-form :model="form" layout="inline" auto-label-width>
            <a-form-item field="keyWord" label="消息内容">
              <a-input
                allow-clear
                v-model="form.keyWord"
                style="width: 220px"
                placeholder="请输入"
              />
            </a-form-item>
            <a-form-item field="messageTypeId" label="消息类型">
              <a-select
                allow-clear
                v-model="form.messageTypeId"
                style="width: 220px"
                :bordered="true"
                placeholder="请选择"
              >
                <a-option v-for="l in typeMap" :value="l.id" :key="l.id">{{
                  l.typeName
                }}</a-option>
              </a-select>
            </a-form-item>

            <a-form-item field="time" label="时间筛选">
              <a-range-picker
                allow-clear
                showTime
                v-model="form.time"
                style="width: 390px"
              />
            </a-form-item>
          </a-form>
        </div>
        <div class="search-right">
          <a-button type="primary" @click="onSearch">
            <template #icon>
              <icon-search />
            </template>
            查询
          </a-button>
          <a-button type="outline" style="margin-left: 20px" @click="onReset">
            <template #icon>
              <IconRefresh />
            </template>
            重置
          </a-button>
        </div>
      </div>
      <section class="table-wrap">
        <a-table
          :row-selection="{ type: 'checkbox', showCheckedAll: true }"
          v-model:selectedKeys="selectedKeys"
          row-key="messageId"
          :data="tableData"
          :pagination="false"
          :bordered="false"
        >
          <template #columns>
            <a-table-column
              tooltip
              :width="460"
              title="消息内容"
              ellipsis
              data-index="messageBody"
            >
              <template #cell="{ record }">
                <span :class="!record.readFlag ? 'no-read' : 'has-read'">{{
                  record.messageBody
                }}</span>
              </template>
            </a-table-column>
            <a-table-column title="消息来源" data-index="messageSrcName">
            </a-table-column>
            <a-table-column title="消息类型" data-index="messageTypeName">
            </a-table-column>
            <a-table-column title="接收时间" data-index="sendTime">
            </a-table-column>
          </template>
        </a-table>
        <div class="pagination">
          <a-pagination
            :total="total"
            show-total
            show-jumper
            show-page-size
            @change="onPageChange"
            @page-size-change="onPageSizeChange"
          />
        </div>
      </section>
    </section>
    <section class="bb-t"></section>
    <section class="btn-b-wrap cm-row-st cm-col-c cm-flex">
      <a-button class="cm-mg-r-20" type="outline" @click="dele()"
        >删除</a-button
      >
      <a-button class="cm-mg-r-20" type="outline" @click="read()"
        >标记已读</a-button
      >
      <a-button class="cm-mg-r-20" type="outline" @click="noRead()"
        >标记未读</a-button
      >
      <a-button type="outline" @click="readAll()">全部已读</a-button>
    </section>
  </section>
</template>

<script setup>
import {
  typeList,
  messageList,
  sourceList,
  readMessage,
  readMessageAll,
  delMessage,
  noReadMessage,
} from "@/assets/api/message";
import { ref, reactive, watch } from "vue";
import { IconSearch, IconRefresh } from "@arco-design/web-vue/es/icon";
import { Message,Modal} from "@arco-design/web-vue";
const tableData = ref([]);
let form = reactive({
  keyWord: "",
  messageTypeId: "",
  time: [],
});
let typeMap = ref([]);
let sourceMap = ref([]);
let selectedKeys = ref([]);
const keys = ref("-1");
const pageNum = ref(1);
const pageSize = ref(10);
const total = ref(0);

watch(keys, () => {
  pageNum.value = 1;
  getMessageList();
});

// 查询
const onSearch = () => {
  pageNum.value = 1;
  getMessageList();
};

// 重置
const onReset = () => {
  Object.assign(form, {
    keyWord: "",
    messageTypeId: "",
    time: [],
  });
  keys.value = "-1";
  pageNum.value = 1;
  getMessageList();
};

function onPageChange(page) {
  pageNum.value = page;
  getMessageList();
}

function onPageSizeChange(size) {
  pageSize.value = size;
  getMessageList();
}

// 删除
function dele() {
  if (selectedKeys.value.length < 1) return Message.warning("请先勾选数据");
  Modal.warning({
    title: "提示",
    content: "删除操作不可逆，是否继续？",
    width: 280,
    hideCancel: false,
    onBeforeOk: async (done) => {
      const ids = selectedKeys.value.join(",");
      delMessage({ ids }).then(({ code, msg } = {}) => {
        if (code === 200) {
          Message.success("删除成功");
          getMessageList();
        } else {
          Message.error(msg || "删除失败");
        }
        done();
      });
    },
    onBeforeCancel: () => {
      return true;
    },
  });
}

// 批量未读
function noRead() {
  if (selectedKeys.value.length < 1) return Message.warning("请先勾选数据");
  const ids = selectedKeys.value.join(",");
  noReadMessage({ ids }).then(({ code, msg } = {}) => {
    if (code === 200) {
      getMessageList();
    } else {
      Message.error(msg || "操作失败");
    }
  });
}

// 已读批量
function read() {
  if (selectedKeys.value.length < 1) return Message.warning("请先勾选数据");
  const ids = selectedKeys.value.join(",");
  readMessage({ ids }).then(({ code, msg } = {}) => {
    if (code === 200) {
      getMessageList();
    } else {
      Message.error(msg || "操作失败");
    }
  });
}

// 全部已读
function readAll() {
  readMessageAll().then(({ code, msg } = {}) => {
    if (code === 200) {
      getMessageList();
    } else {
      Message.error(msg || "操作失败");
    }
  });
}

// 消息类型
function getTypeList() {
  typeList().then(({ code, data, msg } = {}) => {
    if (code === 200 && data) return (typeMap.value = data);
    Message.error(msg || "查询消息类型异常");
  });
}

// 消息列表
function getMessageList() {
  selectedKeys.value = [];
  const data = {
    keyWord: form.keyWord,
    messageTypeId: form.messageTypeId,
  };
  if (form.time && form.time.length > 0) {
    data.startTime = form.time[0];
    data.endTime = form.time[1];
  }
  const params = {
    status: keys.value,
    pageSize: pageSize.value,
    pageNum: pageNum.value,
  };
  messageList(data, params).then(({ code, msg, data } = {}) => {
    if (code === 200 && data) {
      const list = data.list;
      list &&
        list.forEach((item) => {
          let messageSrcItem = sourceMap.value.find(
            (i) => i.id === item.messageSrcId
          );
          let messageTypeItem = typeMap.value.find(
            (i) => i.id === item.messageTypeId
          );
          item.messageSrcName = messageSrcItem?.srcName;
          item.messageTypeName = messageTypeItem?.typeName;
        });
      tableData.value = list || [];
      total.value = data.total;
    } else {
      Message.error(msg || "查询列表异常");
    }
  });
}

// 消息来源
function getSourceList() {
  sourceList().then(({ code, data, msg } = {}) => {
    if (code === 200 && data) return (sourceMap.value = data);
    Message.error(msg || "查询消息类型异常");
  });
}
getSourceList();
getTypeList();
getMessageList();
</script>

<style lang='less' scoped>
.message-manage-wrap {
  .message-manage-content {
    font-size: 14px;
    color: #343d4e;
    line-height: 20px;
    font-weight: 400;
    h1 {
      font-size: 16px;
      line-height: 24px;
      font-weight: 600;
      margin-bottom: 12px;
    }
    .arco-tabs-nav {
      &::before {
        right: 48px;
      }
    }
    .arco-tabs-nav-type-line {
      .arco-tabs-tab-title {
        &::before {
          opacity: 0;
        }
      }
      .arco-tabs-tab {
        margin-right: 48px;
        margin-left: 0;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .search-box-wrap {
      margin: 12px 0 4px 0;
      .arco-picker {
        background-color: #ffffff;
        border: 1px solid #dbdde0;
        &:hover {
          background-color: #ffffff;
        }
      }
    }
  }

  .no-read {
    padding-left: 18px;
    position: relative;
    &::before {
      position: absolute;
      content: "";
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 8px;
      height: 8px;
      background: #1459fa;
      border-radius: 100%;
    }
  }
  .has-read {
    color: #c3c6cb;
  }
  .btn-b-wrap {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 64px;
    background: #ffffff;
    box-shadow: 0 2px 8px 0 rgba(16, 27, 47, 0.1);
    padding: 0 20px;
    .arco-btn-outline[type="button"] {
      border: 1px solid #dbdde0;
      border-radius: 2px;
      color: #343d4e;
    }
  }
  .bb-t {
    height: 64px;
  }
}
</style>
