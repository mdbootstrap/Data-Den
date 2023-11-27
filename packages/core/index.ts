import './src/scss/index.scss';
import { DataDen } from './src/data-den';
import { DataDenOptions } from './src/data-den-options.interface';
import { DataDenDefaultCellRenderer } from './src/modules/rendering/cell/data-den-default-cell-renderer';
import { DataDenSortingEvent } from './src/modules/sorting';
import {
  DataDenHeaderDateFilterRenderer,
  DataDenHeaderNumberFilterRenderer,
  DataDenHeaderTextFilterRenderer,
} from './src/modules/rendering';

const rows = [
  { car: 'Honda', model: 'Civic', year: '01/05/2013', price: 28000 },
  { car: 'Mitsubishi', model: 'Lancer', year: '01/05/2013', price: 56000 },
  { car: 'Porsche', model: 'Boxster', year: '09/02/2020', price: 31000 },
  { car: 'Toyota', model: 'Celica', year: '16/12/2010', price: 18000 },
  { car: 'Kia', model: 'Sportage', year: '14/09/2006', price: 28000 },
  { car: 'Ford', model: 'Focus', year: '04/07/2014', price: 24000 },
  { car: 'Ford', model: 'Focus', year: '16/12/2010', price: 24000 },
  { car: 'Porsche', model: 'Boxster', year: '24/01/2015', price: 31000 },
  { car: 'Mitsubishi', model: 'Lancer', year: '14/09/2006', price: 18000 },
  { car: 'Kia', model: 'Sportage', year: '01/05/2013', price: 24000 },
  { car: 'Porsche', model: 'Boxster', year: '28/08/2004', price: 28000 },
  { car: 'Toyota', model: 'Celica', year: '28/08/2004', price: 12000 },
  { car: 'Mitsubishi', model: 'Lancer', year: '16/12/2010', price: 34000 },
  { car: 'Toyota', model: 'Celica', year: '28/08/2004', price: 18000 },
  { car: 'Lamborghini', model: 'Aventador', year: '24/01/2015', price: 56000 },
  { car: 'Nissan', model: 'X-Trail', year: '01/05/2013', price: 56000 },
  { car: 'Honda', model: 'Civic', year: '01/05/2013', price: 15000 },
  { car: 'Porsche', model: 'Boxster', year: '24/01/2015', price: 24000 },
  { car: 'Ford', model: 'Focus', year: '14/09/2006', price: 15000 },
  { car: 'Lamborghini', model: 'Aventador', year: '14/09/2006', price: 15000 },
  { car: 'Ford', model: 'Focus', year: '09/02/2020', price: 12000 },
  { car: 'Honda', model: 'Civic', year: '24/01/2015', price: 34000 },
  { car: 'Mitsubishi', model: 'Lancer', year: '09/02/2020', price: 34000 },
  { car: 'Honda', model: 'Civic', year: '09/02/2020', price: 12000 },
  { car: 'Mitsubishi', model: 'Lancer', year: '09/02/2020', price: 15000 },
  { car: 'Ford', model: 'Focus', year: '28/08/2004', price: 24000 },
  { car: 'Nissan', model: 'X-Trail', year: '16/12/2010', price: 15000 },
  { car: 'Toyota', model: 'Celica', year: '13/11/2021', price: 15000 },
  { car: 'Toyota', model: 'Celica', year: '09/02/2020', price: 12000 },
  { car: 'Mitsubishi', model: 'Lancer', year: '09/02/2020', price: 34000 },
];

const options: DataDenOptions = {
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
      sort: true,
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
  ],
  rows: rows,
  draggable: true,
  pagination: true,
  paginationOptions: {
    pageSize: 10,
    pageSizeOptions: [5, 10, 12, 20],
    ofText: 'z',
  },
};

const ddEl = document.getElementById('dd');
const dataDen = new DataDen(ddEl as HTMLElement, options);

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
