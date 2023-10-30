<script setup lang="ts">
import { DataDen, DataDenOptions, DataDenSortingEvent } from 'data-den-core';
import { onMounted, ref } from 'vue';

let dataDen: DataDen | null = null;
const dataDenWrapper = ref<HTMLDivElement | null>(null);

const props = defineProps<{
  options: DataDenOptions;
}>();

const emit = defineEmits(['sortingStart', 'sortingDone']);

onMounted(() => {
  if (dataDenWrapper.value) {
    dataDen = new DataDen(dataDenWrapper.value, props.options);
    dataDen.on('sortingStart', (event: DataDenSortingEvent) => {
      emit('sortingStart', event);
    });
    dataDen.on('sortingDone', (event: DataDenSortingEvent) => {
      emit('sortingDone', event);
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
