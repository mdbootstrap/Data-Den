import './src/scss/index.scss';
import { DataDen } from './src/data-den';
import { DataDenOptions } from './src/data-den-options.interface';
import { DataDenDefaultCellRenderer } from './src/modules/rendering/cell/data-den-default-cell-renderer';
import {
  DataDenHeaderDateFilterRenderer,
  DataDenHeaderNumberFilterRenderer,
  DataDenHeaderTextFilterRenderer,
} from './src/modules/rendering';
import { DataDenSortingEvent } from './src/modules/sorting';
import { DataDenPinningEvent } from './src/modules/pinning';

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
      defaultSort: 'asc',
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
  sortOptions: [null, 'asc', 'desc'],
  draggable: true,
  pagination: true,
  paginationOptions: {
    pageSize: 10,
    ofText: 'of',
  },
};
const options2: DataDenOptions = {
  columns: [
    {
      field: 'car',
      headerName: 'Car',
      sort: true,
      filter: true,
      filterRenderer: DataDenHeaderTextFilterRenderer,
      filterOptions: {
        method: 'includes',
        debounceTime: 500,
        caseSensitive: false,
      },
      resize: true,
      width: 260,
      cellRenderer: DataDenDefaultCellRenderer,
    },
    {
      field: 'model',
      headerName: 'Model',
      sort: true,
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

const ddEl = document.getElementById('dd');
const dataDen = new DataDen(ddEl as HTMLElement, options);

const ddEl2 = document.getElementById('dd2');
const dataDen2 = new DataDen(ddEl2 as HTMLElement, options2);

const quickFilterInput: HTMLInputElement = document.querySelector('.data-den-quick-filter-input')!;
quickFilterInput.addEventListener('keyup', () => {
  dataDen.quickFilter(quickFilterInput.value);
});

dataDen.on('sortingStart', (event: DataDenSortingEvent) => {
  if (event.field === 'model') {
    event.preventDefault();
  }

  console.log(event);
});

dataDen.on('sortingDone', (event: DataDenSortingEvent) => {
  console.log(event);
});

dataDen.on('pinningStart', (event: DataDenPinningEvent) => {
  if (event.colIndex === 2) {
    event.preventDefault();
  }
  console.log(event);
});

dataDen.on('pinningDone', (event: DataDenPinningEvent) => {
  console.log(event);
});
