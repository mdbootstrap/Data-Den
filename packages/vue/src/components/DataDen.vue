<script setup lang="ts">
import { DataDen, DataDenOptions, DataDenSortingEvent, DataDenPinningEvent } from 'data-den-core';
import { onMounted, ref } from 'vue';

let dataDen: DataDen | null = null;
const dataDenWrapper = ref<HTMLDivElement | null>(null);

const props = defineProps<{
  options: DataDenOptions;
}>();

const emit = defineEmits(['sortingStart', 'sortingDone', 'pinningStart', 'pinningDone']);

onMounted(() => {
  if (dataDenWrapper.value) {
    dataDen = new DataDen(dataDenWrapper.value, props.options);
    dataDen.on('sortingStart', (event: DataDenSortingEvent) => {
      emit('sortingStart', event);
    });
    dataDen.on('sortingDone', (event: DataDenSortingEvent) => {
      emit('sortingDone', event);
    });
    dataDen.on('pinningStart', (event: DataDenPinningEvent) => {
      emit('pinningStart', event);
    });
    dataDen.on('pinningDone', (event: DataDenPinningEvent) => {
      emit('pinningDone', event);
    });
  }
});

const sort = (field: string, order: string) => {
  if (dataDen) {
    dataDen.sort(field, order);
  }
};

const quickFilter = (searchTerm: string) => {
  if (dataDen) {
    dataDen.quickFilter(searchTerm);
  }
};

const pinColumn = (pin: string | boolean, colIndex: number) => {
  if (dataDen) {
    dataDen.pinColumn(pin, colIndex);
  }
};

defineExpose({
  sort,
  quickFilter,
  pinColumn,
});
</script>

<template>
  <div ref="dataDenWrapper"></div>
</template>
