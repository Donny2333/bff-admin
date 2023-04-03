<template>
  <a-layout>
    <a-layout-header v-if="currentPath != '/login'">
      <layout></layout>
    </a-layout-header>
    <a-layout-content>
      <router-view></router-view>
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import layout from "./navBar.vue";
import { useRouter } from "vue-router";
import { watch, ref } from "vue";
const router = useRouter();
const currentPath = ref("");
watch(
  () => router.currentRoute.value.path,
  (toPath) => {
    //要执行的方法

    console.log("aaa", toPath);
    currentPath.value = toPath;
  },
  { immediate: true, deep: true }
);
</script>

<style lang="less">
.arco-layout {
  height: 100%;
  .arco-layout-content {
    height: 100%;
    overflow: hidden;
  }
}
</style>
