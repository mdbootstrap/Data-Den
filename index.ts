import { DataDen } from './src/data-den';
import { DataDenOptions } from './src/data-den-options.interface';
import { DataDenDefaultCellRenderer } from './src/modules/rendering/cell/data-den-default-cell-renderer';
import {
  DataDenClientDataLoaderStrategy,
  DataDenServerDataLoaderStrategy,
  DataDenDataLoaderStrategy,
  DataDenData,
} from './src/modules/fetch';

const data: DataDenData = {
  columns: [
    {
      field: 'car',
      headerName: 'Car',
      sort: true,
      filter: false,
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
      filter: false,
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
      filter: false,
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
      field: 'price',
      headerName: 'Price',
      sort: true,
      filter: false,
      filterOptions: {
        method: 'includes',
        debounceTime: 500,
        caseSensitive: false,
      },
      resize: false,
      width: 180,
      cellRenderer: DataDenDefaultCellRenderer
    },
  ],
  rows: [
    { car: 'Honda', model: 'Civic', year: 2013, price: 28000 },
    { car: 'Mitsubishi', model: 'Lancer', year: 2013, price: 56000 },
    { car: 'Porsche', model: 'Boxster', year: 2020, price: 31000 },
    { car: 'Toyota', model: 'Celica', year: 2010, price: 18000 },
    { car: 'Kia', model: 'Sportage', year: 2006, price: 28000 },
    { car: 'Ford', model: 'Focus', year: 2014, price: 24000 },
    { car: 'Ford', model: 'Focus', year: 2010, price: 24000 },
    { car: 'Porsche', model: 'Boxster', year: 2005, price: 31000 },
    { car: 'Mitsubishi', model: 'Lancer', year: 2006, price: 18000 },
    { car: 'Kia', model: 'Sportage', year: 2013, price: 24000 },
    { car: 'Porsche', model: 'Boxster', year: 2004, price: 28000 },
    { car: 'Toyota', model: 'Celica', year: 2004, price: 12000 },
    { car: 'Mitsubishi', model: 'Lancer', year: 2010, price: 34000 },
    { car: 'Toyota', model: 'Celica', year: 2004, price: 18000 },
    { car: 'Lamborghini', model: 'Aventador', year: 2005, price: 56000 },
    { car: 'Nissan', model: 'X-Trail', year: 2013, price: 56000 },
    { car: 'Honda', model: 'Civic', year: 2013, price: 15000 },
    { car: 'Porsche', model: 'Boxster', year: 2005, price: 24000 },
    { car: 'Ford', model: 'Focus', year: 2006, price: 15000 },
    { car: 'Lamborghini', model: 'Aventador', year: 2006, price: 15000 },
    { car: 'Ford', model: 'Focus', year: 2020, price: 12000 },
    { car: 'Honda', model: 'Civic', year: 2005, price: 34000 },
    { car: 'Mitsubishi', model: 'Lancer', year: 2020, price: 34000 },
    { car: 'Honda', model: 'Civic', year: 2020, price: 12000 },
    { car: 'Mitsubishi', model: 'Lancer', year: 2020, price: 15000 },
    { car: 'Ford', model: 'Focus', year: 2004, price: 24000 },
    { car: 'Nissan', model: 'X-Trail', year: 2010, price: 15000 },
    { car: 'Toyota', model: 'Celica', year: 2021, price: 15000 },
    { car: 'Toyota', model: 'Celica', year: 2020, price: 12000 },
    { car: 'Mitsubishi', model: 'Lancer', year: 2020, price: 34000 },
  ],
};

const createStrategy = (mode: 'client' | 'server'): DataDenDataLoaderStrategy => {
  if (mode === 'client') {
    return new DataDenClientDataLoaderStrategy(data);
  } else {
    return new DataDenServerDataLoaderStrategy();
  }
};

const mode = 'client';
const dataLoader = createStrategy(mode);

const options: DataDenOptions = {
  dataLoader,
  draggable: true,
  pagination: true,
  paginationOptions: {
    pageSize: 10,
    pageSizeOptions: [5, 10, 12, 20],
    ofText: 'z',
  },
  quickFilter: true,
  quickFilterOptions: {
    debounceTime: 500,
  },
  resizable: true,
};

const ddEl = document.getElementById('dd');
new DataDen(ddEl as HTMLElement, options);
