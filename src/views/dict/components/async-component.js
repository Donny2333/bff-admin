import { ref, defineAsyncComponent } from "vue";

export const components = ref(new Map());

export const registryComponents = (e) => {
  if (!components.value.has(e)) {
    components.value.set(
      e,
      defineAsyncComponent(() => import(`./${e}.vue`))
    );
  }
  return components.value.get(e);
};
