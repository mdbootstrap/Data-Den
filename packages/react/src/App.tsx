import { useRef } from 'react';
import './App.css';
import DataDen from './components/DataDen';
import { DataDenDefaultCellRenderer, DataDenOptions } from 'data-den-core';

function App() {
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
        filterOptions: {
          type: 'text',
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
        filterOptions: {
          type: 'text',
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
        filterOptions: {
          type: 'date',
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
        filterOptions: {
          type: 'number',
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
    quickFilter: true,
    quickFilterOptions: {
      debounceTime: 500,
    },
    resizable: true,
  };

  const dataDen = useRef(null);

  return (
    <>
      <DataDen
        options={options}
        ref={dataDen}
        onSortingDone={(event) => {
          console.log(event.detail);
        }}
      />
      <div style={{ margin: '10px', display: 'flex', gap: '5px' }}>
        <button onClick={() => dataDen.current?.sort('car', 'asc')}>Sort asc by car</button>
        <button onClick={() => dataDen.current?.sort('car', 'desc')}>Sort desc by car</button>
        <button onClick={() => dataDen.current?.sort('price', 'asc')}>Sort asc by price</button>
        <button onClick={() => dataDen.current?.sort('price', 'desc')}>Sort desc by price</button>
      </div>
    </>
  );
}

export default App;
