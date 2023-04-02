<template>
  <div class="page-title">
    <div class="title" :style="!search ? 'margin-bottom:20px' : ''">
      {{ title }}
    </div>
    <div class="option" v-if="option">
      <div class="left">
        <slot name="option"></slot>
      </div>
      <div class="right">
        <div v-if="optionOneSearch">
          <slot name="rightSearch"></slot>
        </div>
        <div
          v-else
          :class="{ 'filter-button': true, expand: isExpand }"
          @click="expandSearch"
        >
          <svg-icon name="filter"></svg-icon>
          <div></div>
        </div>
      </div>
    </div>
    <div
      :class="{ 'search-optoion-box': true, nooption: !option }"
      v-show="isExpand && search"
    >
      <div class="search-left">
        <slot name="search"></slot>
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
  </div>
</template>

<script>
export default {
  name: "page-index",
};
</script>
<script setup>
import { IconSearch, IconRefresh } from "@arco-design/web-vue/es/icon";
import { toRefs, defineProps, ref, defineEmits } from "vue";
const $emit = defineEmits(["onSearch", "onReset"]);
const onSearch = () => {
  $emit("onSearch");
};
const onReset = () => {
  $emit("onReset");
};
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  option: {
    type: Boolean,
    default: true,
  },
  optionOneSearch: {
    type: Boolean,
    default: false,
  },
  search: {
    type: Boolean,
    default: true,
  },
});
const { title } = toRefs(props);
const isExpand = ref(true);
const expandSearch = () => {
  isExpand.value = !isExpand.value;
};
</script>


<style lang='less' scoped>
.page-title {
  .title {
    font-size: 16px;
    color: #343d4e;
    line-height: 24px;
    font-weight: 600;
  }
  .option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 12px 0;
    .filter-button {
      background: #ffffff;
      border: 1px solid #dbdde0;
      border-radius: 2px;
      padding: 7px;
      cursor: pointer;
      &.expand {
        background: rgba(32, 97, 255, 0.06);
        border: 1px solid #2061ff;
        border-radius: 2px;
        color: #2061ff;
      }
    }
  }
  .search-optoion-box {
    background: #f6f6f7;
    padding: 10px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    &.nooption {
      background: #fff;
      margin-top: 12px;
      padding: 10px 0;
    }
    .search-left {
      flex: 1;
    }
    .search-right {
      margin-top: 10px;
    }
  }
}
</style>