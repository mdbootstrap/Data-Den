<script setup lang="ts">
import { DataDen, DataDenOptions } from 'data-den-core';
import { onMounted, ref } from 'vue';

let dataDen: DataDen | null = null;
const dataDenWrapper = ref<HTMLDivElement | null>(null);

const props = defineProps<{
  options: DataDenOptions;
}>();

const emit = defineEmits(['sorting-done']);

onMounted(() => {
  if (dataDenWrapper.value) {
    dataDen = new DataDen(dataDenWrapper.value, props.options);
    // @ts-ignore
    dataDenWrapper.value.addEventListener('sorting.done', (event: CustomEvent) => {
      emit('sorting-done', event);
    });
  }
});

const sort = (field: string, order: string) => {
  if (dataDen) {
    dataDen.sort(field, order);
  }
};

defineExpose({
  sort,
});
</script>

<template>
  <div ref="dataDenWrapper"></div>
</template>
