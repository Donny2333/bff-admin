<template>
  <section class="app-navbar cm-row-sp cm-col-c">
    <section class="left-menu">
      <p class="title"></p>
      <div class="menu-list">
        <span
          v-for="item in routeList"
          :key="item.id"
          :class="{ active: currentRoutePath == item.path }"
          @click="go(item.path)"
        >
          {{ item.name }}
        </span>
      </div>
    </section>
    <div class="right-menu">
      <!-- <a-button
        @click="onPushMessage"
        type="primary"
        style="margin-right: 20px"
      >
        发送消息
      </a-button> -->
      <div class="jue-se">
        当前角色 <span>{{ roleName }}</span>
      </div>
      <a-trigger
        trigger="click"
        :popup-translate="[-80, 10]"
        v-model:popup-visible="show"
        click-outside-to-close
        :unmount-on-close="false"
      >
        <a-badge :offset="[2, -2]" :count="messageCount" dot>
          <div class="notification" @click="getMessageList"></div>
        </a-badge>
        <template #content>
          <div class="mess-wrap">
            <div class="cm-flex cm-pd-t-20 cm-pd-l-20 cm-pd-r-20">
              <p class="mess-tips">消息提示</p>
              <p
                class="all-read cm-cur-ptr"
                v-if="tableData && tableData.length"
                @click="readAll"
              >
                全部已读
              </p>
            </div>
            <div class="mess-content">
              <template v-if="tableData && tableData.length">
                <div
                  v-for="t in tableData"
                  :key="t.messageId"
                  class="mess-item"
                >
                  <p class="mess-n" :class="t.readFlag ? '' : 'noread'">
                    {{ t.messageBody }}
                  </p>
                  <p class="mess-t">
                    {{ t.sendTimeStr }}
                    <span class="cm-mg-l-20">{{ t.messageSrcName }}</span>
                  </p>
                </div>
              </template>
              <div v-else class="no-message">暂无消息~</div>
            </div>
            <div class="cm-flex cm-row-c cm-col-c bt-b">
              <a-button type="text" @click="toMessage"> 消息管理 </a-button>
            </div>
          </div>
        </template>
      </a-trigger>

      <div class="first">{{ firstName }}</div>
      <a-dropdown trigger="hover" position="br">
        <a-button click="quit-bt">
          {{ userName }}
          <icon-down />
        </a-button>
        <template #content>
          <a-doption class="doption">{{ roleName }}</a-doption>
          <a-doption @click="handleLogout" class="doption">退出登录</a-doption>
        </template>
      </a-dropdown>
    </div>
  </section>
</template>

<script setup lang="jsx">
import { useStore } from "vuex";
import { computed, onMounted, ref } from "vue";
import { logout } from "@/assets/api/api";
import { IconDown } from "@arco-design/web-vue/es/icon";
// import { EventSourcePolyfill } from "event-source-polyfill";
import { useRoute, useRouter } from "vue-router";
import { Notification, Message, Button } from "@arco-design/web-vue";
import {
  createConnnectionUrl,
  closeConnnectionUrl,
  readMessage,
  sourceList,
  messageList,
  readMessageAll,
} from "@/assets/api/message.js";

let source = null;
const route = useRoute();
const router = useRouter();
const messageCount = ref(0);

let sourceMap = ref([]);
const tableData = ref([]);
const show = ref(false);
// 用时间戳模拟登录用户
const store = useStore();
const userId = computed(() => store.state.user.userId);
const loginName = computed(() => store.state.user.loginName);
const token = computed(() => store.state.user.token);
const roleId = computed(() => store.state.user.roleId);
const roleName = computed(() => store.state.user.roleName);
const userName = computed(() => store.state.user.userName);
const firstName = computed(() => store.state.user.firstName);

//技术运营 2   商务运营 3 供应商4
const routeList = [
  {
    id: 0,
    name: "字典管理",
    path: "/dict",
  },
];

const go = (path) => {
  if (path) {
    router.push(path);
  }
};

const currentRoutePath = computed(() => {
  return route.meta?.highlight;
});

// const onPushMessage = () => {
//   const message = {
//     messageTypeId: 1,
//     messageTitle: "标题",
//     messageBody: "内容",
//     messageImage: "image",
//     feedbackType: 0,
//     feedbackContent: JSON.stringify({
//       bizCode: "demand-published", //demand-found   demand-drawn
//       data: {
//         demand: 1,
//       },
//     }),
//     importance: 0,
//   };
//   pushMessage(message).then((res) => {
//     console.log("message", res);
//   });
// };
const toMessage = () => {
  show.value = false;
  router.push("/message");
};

// 消息来源
function getSourceList() {
  sourceList().then(({ code, data, msg } = {}) => {
    if (code === 200 && data) return (sourceMap.value = data);
    Message.error(msg || "查询消息类型异常");
  });
}
// 消息列表
function getMessageList() {
  const params = {
    status: -1,
    pageSize: 5,
    pageNum: 1,
  };
  messageList({}, params).then(({ code, msg, data } = {}) => {
    if (code === 200 && data) {
      const list = data.list;
      list &&
        list.forEach((item) => {
          let messageSrcItem = sourceMap.value.find(
            (i) => i.id === item.messageSrcId
          );
          item.messageSrcName = messageSrcItem?.srcName;
        });
      tableData.value = list || [];
    } else {
      Message.error(msg || "查询列表异常");
    }
  });
}
function readAll() {
  readMessageAll().then(({ code, msg } = {}) => {
    if (code === 200) {
      getMessageList();
      show.value = false;
    } else {
      Message.error(msg || "操作失败");
    }
  });
}
// getSourceList();
const toLoginLog = () => {
  router.push("/loginLog");
};

const handleLogout = () => {
  let data = {
    loginName: loginName.value,
  };
  logout(data).then(() => {
    console.log("退出登录");
    store.commit("LoginOut");
    router.push("/login");
  });
};

const handleNotification = (message) => {
  // Notification.info({
  //   id:message.messageId,
  //   // title: message.messageTitle,
  //   title: "标题",
  //   content:"内容",
  //   duration: 0,
  //   footer: (
  //     <Space>
  //       <Button type="primary" size="small" onClick={closeNoti(message)}>
  //         确定
  //       </Button>
  //     </Space>
  //   ),
  // });

  Notification.info({
    id: message.messageId,
    title: message.messageTitle,
    duration: 0,
    onClose: () => {},
    content: message.messageBody,
    footer: (
      <Button type="primary" onClick={() => closeNoti(message)}>
        {" "}
        确定
      </Button>
    ),
  });
};
const closeNoti = (message) => {
  Notification.remove(message.messageId);
  readMessage(message.messageId)
    .then(() => {})
    .catch(() => {});
  const feedbackContent = JSON.parse(message.feedbackContent);
  router.push({
    path: "/demandmanage",
    query: {
      bizCode: feedbackContent.bizCode,
      demandId: feedbackContent.data.demandId,
    },
  });
};
const connectSSE = (useToken) => {
  if (window.EventSource) {
    // 建立连接
    console.log("aaadsd", userId.value);
    const id = `${userId.value}|${useToken}`;
    source = new EventSource(createConnnectionUrl(id));

    /**
     * 连接一旦建立，就会触发open事件
     * 另一种写法：source.onopen = function (event) {}
     */
    source.addEventListener("open", function () {
      console.log("open successfully");
    });

    /**
     * 客户端收到服务器发来的数据
     * 另一种写法：source.onmessage = function (event) {}
     */
    source.addEventListener("message", function (e) {
      // setMessageInnerHTML(e.data);
      const data = JSON.parse(e.data);
      console.log("接收消息", data);
      if (typeof data == "number") {
        //字符串类型 说明是数量
        messageCount.value = data;
      } else {
        //消息
        handleNotification(data);
      }
    });

    /**
     * 如果发生通信错误（比如连接中断），就会触发error事件
     * 或者：
     * 另一种写法：source.onerror = function (event) {}
     */
    source.addEventListener(
      "error",
      function (e) {
        if (e.readyState === EventSource.CLOSED) {
          console.log("链接关闭");
        } else {
          console.log(e);
        }
      },
      false
    );
  } else {
    console.log("浏览器不支持");
  }
};
onMounted(() => {
  if (token.value) {
    const tokenArray = token.value.split(".");
    console.log("tokenArray", tokenArray[tokenArray.length - 1]);
    // connectSSE(tokenArray[tokenArray.length - 1]);
  }
});

// 监听窗口关闭事件，主动去关闭sse连接，如果服务端设置永不过期，浏览器关闭后手动清理服务端数据
window.onbeforeunload = function () {
  // closeSse();
};

// 关闭Sse连接
function closeSse() {
  const tokenArray = token.value.split(".");
  const id = userId.value + "|" + tokenArray[tokenArray.length - 1];
  source.close();
  const httpRequest = new XMLHttpRequest();
  httpRequest.open("GET", closeConnnectionUrl(id), true);
  httpRequest.send();
  console.log("close");
}
</script>

<style lang="less" scoped>
.app-navbar {
  height: 68px;
  overflow: hidden;
  position: relative;
  background-color: #fff;
  color: #343d4e;
  box-shadow: 0 2px 8px 0 rgba(37, 40, 64, 0.1);
  padding: 0 24px;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  align-items: center;
  font-weight: 400;
  font-family: PingFangSC-Regular;
  .arco-btn-secondary[type="button"] {
    background-color: #fff;
    padding: 0;
    &:hover {
      background-color: #fff;
    }
  }

  .left-menu {
    display: flex;
    align-items: center;
    .title {
      width: 110px;
      height: 28px;
      background: url("../assets/images/logo.svg") no-repeat center;
      cursor: pointer;
      margin-right: 40px;
    }
    .menu-list {
      span {
        display: inline-block;
        padding: 4px 8px;
        line-height: 32px;
        border-radius: 4px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #343d4e;
        line-height: 24px;
        font-weight: 400;
        margin-right: 32px;
        cursor: pointer;
        &:hover,
        &.active {
          background: #eef3ff;
          color: #2061ff;
        }
      }
    }
  }
  .right-menu {
    display: flex;
    align-items: center;
    .doption {
      font-size: 14px;
      &:hover {
        background-color: #ebf1ff;
        color: #1459fa;
      }
    }
    .notification {
      width: 16px;
      height: 16px;
      background: url("../assets/images/message.svg") no-repeat center;
      cursor: pointer;
      position: relative;
      .red-ico {
        position: absolute;
        right: -1px;
        top: -1px;
        width: 8px;
        height: 8px;
        border-radius: 100%;
        background: #ff514d;
      }
    }
    .jue-se {
      line-height: 20px;
      color: #9398a1;
      line-height: 20px;
      margin-right: 20px;
      span {
        color: #343d4e;
      }
    }
    .first {
      background: #ebf1ff;
      width: 24px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      border-radius: 100%;
      color: #1459fa;
      margin: 0 4px 0 20px;
    }
    .quit-bt {
      background-color: #fff;
    }
  }

  .arco-dropdown-open .arco-icon-down {
    transform: rotate(180deg);
  }
  /deep/.arco-badge-number,
  .arco-badge-text {
    min-width: 12px;
    line-height: 12px;
    /* padding: 2px; */
    height: 14px;
    padding: 0 2px;
  }
}
.mess-wrap {
  background-color: #fff;
  width: 302px;
  box-shadow: 0 2px 8px 0 rgba(16, 27, 47, 0.1);
  .no-message {
    color: #9398a1;
    padding-top: 20px;
    text-align: center;
    font-size: 16px;
  }
  .mess-tips {
    color: #343d4e;
    font-weight: 600;
    // margin-bottom: 12px;
  }
  .all-read {
    font-size: 12px;
    color: #1459fa;
    line-height: 18px;
  }
  .mess-content {
    padding: 0 20px 20px 20px;
    font-size: 12px;
    line-height: 18px;
    .mess-item {
      margin-top: 12px;
      .mess-n {
        padding-left: 12px;
        color: #9398a1;
        &.noread {
          position: relative;
          color: #343d4e;
          &::before {
            position: absolute;
            content: "";
            width: 8px;
            height: 8px;
            background: #1459fa;
            border-radius: 100%;
            left: 0;
            top: 5px;
          }
        }
      }
      .mess-t {
        padding-left: 12px;
        color: #9398a1;
      }
    }
  }
  .bt-b {
    border-top: 1px solid #ecedef;
    padding: 2px 0;
    .arco-btn-text {
      &:hover {
        background-color: #fff;
      }
    }
  }
}
</style>
