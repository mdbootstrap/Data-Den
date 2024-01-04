<script setup lang="ts">
import { ref } from 'vue';
import {
  DataDenOptions,
  DataDenDefaultCellRenderer,
  DataDenHeaderDateFilterRenderer,
  DataDenHeaderNumberFilterRenderer,
  DataDenHeaderTextFilterRenderer,
  DataDenSortingEvent,
  DataDenPinningEvent,
} from 'data-den-core';
import DataDen from './components/DataDen.vue';

const rows = [
  { car: 'Honda', model: 'Civic', year: '01/05/2013', price: 28000, transmission: 'Manual', fuel: 'Gasoline' },
  { car: 'Mitsubishi', model: 'Lancer', year: '01/05/2013', price: 56000, transmission: 'Manual', fuel: 'Gasoline' },
  { car: 'Porsche', model: 'Boxster', year: '09/02/2020', price: 31000, transmission: 'Automatic', fuel: 'Petrol' },
  { car: 'Toyota', model: 'Celica', year: '16/12/2010', price: 18000, transmission: 'Manual', fuel: 'Gasoline' },
  { car: 'Kia', model: 'Sportage', year: '14/09/2006', price: 28000, transmission: 'Automatic', fuel: 'Gasoline' },
  { car: 'Ford', model: 'Focus', year: '04/07/2014', price: 24000, transmission: 'Manual', fuel: 'Petrol' },
  { car: 'Ford', model: 'Focus', year: '16/12/2010', price: 24000, transmission: 'Manual', fuel: 'Gasoline' },
  { car: 'Porsche', model: 'Boxster', year: '24/01/2015', price: 31000, transmission: 'Automatic', fuel: 'Gasoline' },
  { car: 'Mitsubishi', model: 'Lancer', year: '14/09/2006', price: 18000, transmission: 'Manual', fuel: 'Gasoline' },
  { car: 'Kia', model: 'Sportage', year: '01/05/2013', price: 24000, transmission: 'Manual', fuel: 'Petrol' },
  { car: 'Porsche', model: 'Boxster', year: '28/08/2004', price: 28000, transmission: 'Manual', fuel: 'Gasoline' },
  { car: 'Toyota', model: 'Celica', year: '28/08/2004', price: 12000, transmission: 'Automatic', fuel: 'Gasoline' },
  { car: 'Mitsubishi', model: 'Lancer', year: '16/12/2010', price: 34000, transmission: 'Manual', fuel: 'Gasoline' },
  { car: 'Toyota', model: 'Celica', year: '28/08/2004', price: 18000, transmission: 'Manual', fuel: 'Petrol' },
  { car: 'Ford', model: 'Explorer', year: '24/01/2015', price: 56000, transmission: 'Manual', fuel: 'Gasoline' },
  { car: 'Nissan', model: 'X-Trail', year: '01/05/2013', price: 56000, transmission: 'Automatic', fuel: 'Gasoline' },
  { car: 'Honda', model: 'Civic', year: '01/05/2013', price: 15000, transmission: 'Manual', fuel: 'Gasoline' },
  { car: 'Porsche', model: 'Boxster', year: '24/01/2015', price: 24000, transmission: 'Manual', fuel: 'Petrol' },
  { car: 'Ford', model: 'Focus', year: '14/09/2006', price: 15000, transmission: 'Manual', fuel: 'Gasoline' },
  { car: 'Ford', model: 'Explorer', year: '14/09/2006', price: 15000, transmission: 'Automatic', fuel: 'Gasoline' },
  { car: 'Ford', model: 'Focus', year: '09/02/2020', price: 12000, transmission: 'Manual', fuel: 'Gasoline' },
  { car: 'Honda', model: 'Civic', year: '24/01/2015', price: 34000, transmission: 'Manual', fuel: 'Gasoline' },
  { car: 'Mitsubishi', model: 'Lancer', year: '09/02/2020', price: 34000, transmission: 'Manual', fuel: 'Gasoline' },
  { car: 'Honda', model: 'Civic', year: '09/02/2020', price: 12000, transmission: 'Manual', fuel: 'Petrol' },
  { car: 'Mitsubishi', model: 'Lancer', year: '09/02/2020', price: 15000, transmission: 'Automatic', fuel: 'Gasoline' },
  { car: 'Ford', model: 'Focus', year: '28/08/2004', price: 24000, transmission: 'Manual', fuel: 'Gasoline' },
  { car: 'Nissan', model: 'X-Trail', year: '16/12/2010', price: 15000, transmission: 'Manual', fuel: 'Gasoline' },
  { car: 'Toyota', model: 'Celica', year: '13/11/2021', price: 15000, transmission: 'Manual', fuel: 'Petrol' },
  { car: 'Toyota', model: 'Celica', year: '09/02/2020', price: 12000, transmission: 'Manual', fuel: 'Gasoline' },
  { car: 'Mitsubishi', model: 'Lancer', year: '09/02/2020', price: 34000, transmission: 'Manual', fuel: 'Gasoline' },
];

const sortComparator = (fieldA: any, fieldB: any) => {
  if (typeof fieldA === 'string') {
    fieldA = fieldA.toLowerCase();
  }

  if (typeof fieldB === 'string') {
    fieldB = fieldB.toLowerCase();
  }

  if (fieldA === fieldB) {
    return 0;
  }

  return fieldA > fieldB ? 1 : -1;
};

const options: DataDenOptions = {
  columns: [
    {
      field: 'car',
      headerName: 'Car',
      sort: true,
      sortOptions: {
        comparator: sortComparator,
      },
      filter: true,
      filterRenderer: DataDenHeaderTextFilterRenderer,
      filterOptions: {
        method: 'includes',
        debounceTime: 500,
        caseSensitive: false,
      },
      resize: true,
      width: 180,
      pinned: 'left',
      cellRenderer: DataDenDefaultCellRenderer,
    },
    {
      field: 'model',
      headerName: 'Model',
      sort: true,
      sortOptions: {
        comparator: sortComparator,
      },
      filter: true,
      filterRenderer: DataDenHeaderTextFilterRenderer,
      filterOptions: {
        method: 'includes',
        debounceTime: 500,
        caseSensitive: false,
      },
      resize: true,
      width: 200,
      cellRenderer: DataDenDefaultCellRenderer,
    },
    {
      field: 'year',
      headerName: 'Year',
      sort: true,
      sortOptions: {
        comparator: sortComparator,
      },
      filter: true,
      filterRenderer: DataDenHeaderDateFilterRenderer,
      filterOptions: {
        method: 'equals',
        debounceTime: 500,
        dateParserFn: (dateString: string) => {
          const dateParts = dateString.split('/').map((part) => Number(part));
          const [day, month, year] = dateParts;

          return new Date(year, month - 1, day);
        },
      },
      resize: true,
      width: 210,
      cellRenderer: DataDenDefaultCellRenderer,
    },
    {
      field: 'price',
      headerName: 'Price',
      sort: true,
      sortOptions: {
        comparator: sortComparator,
      },
      filter: true,
      filterRenderer: DataDenHeaderNumberFilterRenderer,
      filterOptions: {
        method: 'equals',
        debounceTime: 500,
      },
      resize: false,
      width: 180,
      cellRenderer: DataDenDefaultCellRenderer,
    },
    {
      field: 'transmission',
      headerName: 'Transmission',
      sort: true,
      sortOptions: {
        comparator: sortComparator,
      },
      filter: true,
      filterRenderer: DataDenHeaderTextFilterRenderer,
      filterOptions: {
        method: 'includes',
        debounceTime: 500,
        caseSensitive: false,
      },
      resize: true,
      width: 220,
      cellRenderer: DataDenDefaultCellRenderer,
    },
    {
      field: 'fuel',
      headerName: 'Fuel',
      sort: true,
      sortOptions: {
        comparator: sortComparator,
      },
      filter: true,
      filterRenderer: DataDenHeaderTextFilterRenderer,
      filterOptions: {
        method: 'includes',
        debounceTime: 500,
        caseSensitive: false,
      },
      resize: true,
      width: 180,
      cellRenderer: DataDenDefaultCellRenderer,
    },
  ],
  rows: rows,
  draggable: true,
  pagination: true,
  paginationOptions: {
    pageSize: 10,
    ofText: 'of',
  },
};

const dataDen = ref<typeof DataDen | null>(null);

const quickFilterInputValue = ref('');
const handleQuickFilterKeyup = () => {
  dataDen?.value.quickFilter(quickFilterInputValue.value);
};
</script>

<template>
  <div class="data-den-quick-filter">
    <input
      type="text"
      class="data-den-quick-filter-input"
      v-model="quickFilterInputValue"
      @keyup="handleQuickFilterKeyup"
    />
  </div>
  <div id="dd">
    <DataDen
      :options="options"
      ref="dataDen"
      @sorting-start="(event: DataDenSortingEvent) => {
        if (event.field === 'model') {
          event.preventDefault();
        }
        console.log(event);
      }"
      @sorting-done="(event: DataDenSortingEvent) =>console.log(event)"
      @pinning-start="(event: DataDenPinningEvent) => {
        if (event.colIndex === 2) {
          event.preventDefault();
        }
        console.log(event)
      }"
      @pinning-done="(event: DataDenPinningEvent) =>console.log(event)"
    />
  </div>
  <div style="margin: 10px; display: flex; gap: 5px">
    <button @click="dataDen?.sort('car', 'asc')">Sort asc by car</button>
    <button @click="dataDen?.sort('car', 'desc')">Sort desc by car</button>
    <button @click="dataDen?.sort('price', 'asc')">Sort asc by price</button>
    <button @click="dataDen?.sort('price', 'desc')">Sort desc by price</button>
  </div>
  <div style="margin: 10px; display: flex; gap: 5px">
    <button @click="dataDen?.pinColumn('right', 0)">Pin Car right</button>
    <button @click="dataDen?.pinColumn('left', 0)">Pin Car left</button>
    <button @click="dataDen?.pinColumn('right', 4)">Pin Transmission right</button>
    <button @click="dataDen?.pinColumn('left', 4)">Pin Transmission left</button>
    <button @click="dataDen?.pinColumn(false, 0)">Unpin Car</button>
    <button @click="dataDen?.pinColumn(false, 4)">Unpin Transmission</button>
  </div>
</template>
