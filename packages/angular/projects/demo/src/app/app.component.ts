/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ViewChild } from '@angular/core';
import { DataDenAngularComponent } from 'projects/data-den-angular/src/public-api';
import { options } from './options';
import { DataDenOptions, DataDenSortingEvent } from 'data-den-core';

// const sortComparator = (fieldA: any, fieldB: any) => {
//   if (typeof fieldA === 'string') {
//     fieldA = fieldA.toLowerCase();
//   }

//   if (typeof fieldB === 'string') {
//     fieldB = fieldB.toLowerCase();
//   }

//   if (fieldA === fieldB) {
//     return 0;
//   }

//   return fieldA > fieldB ? 1 : -1;
// };

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @ViewChild('dataDen') ddComponent!: DataDenAngularComponent;
  options: DataDenOptions = options;

  // rows = [
  //   { car: 'Honda', model: 'Civic', year: '01/05/2013', price: 28000, transmission: 'Manual', fuel: 'Gasoline' },
  //   { car: 'Mitsubishi', model: 'Lancer', year: '01/05/2013', price: 56000, transmission: 'Manual', fuel: 'Gasoline' },
  //   { car: 'Porsche', model: 'Boxster', year: '09/02/2020', price: 31000, transmission: 'Automatic', fuel: 'Petrol' },
  //   { car: 'Toyota', model: 'Celica', year: '16/12/2010', price: 18000, transmission: 'Manual', fuel: 'Gasoline' },
  //   { car: 'Kia', model: 'Sportage', year: '14/09/2006', price: 28000, transmission: 'Automatic', fuel: 'Gasoline' },
  //   { car: 'Ford', model: 'Focus', year: '04/07/2014', price: 24000, transmission: 'Manual', fuel: 'Petrol' },
  //   { car: 'Ford', model: 'Focus', year: '16/12/2010', price: 24000, transmission: 'Manual', fuel: 'Gasoline' },
  //   { car: 'Porsche', model: 'Boxster', year: '24/01/2015', price: 31000, transmission: 'Automatic', fuel: 'Gasoline' },
  //   { car: 'Mitsubishi', model: 'Lancer', year: '14/09/2006', price: 18000, transmission: 'Manual', fuel: 'Gasoline' },
  //   { car: 'Kia', model: 'Sportage', year: '01/05/2013', price: 24000, transmission: 'Manual', fuel: 'Petrol' },
  //   { car: 'Porsche', model: 'Boxster', year: '28/08/2004', price: 28000, transmission: 'Manual', fuel: 'Gasoline' },
  //   { car: 'Toyota', model: 'Celica', year: '28/08/2004', price: 12000, transmission: 'Automatic', fuel: 'Gasoline' },
  //   { car: 'Mitsubishi', model: 'Lancer', year: '16/12/2010', price: 34000, transmission: 'Manual', fuel: 'Gasoline' },
  //   { car: 'Toyota', model: 'Celica', year: '28/08/2004', price: 18000, transmission: 'Manual', fuel: 'Petrol' },
  //   { car: 'Ford', model: 'Explorer', year: '24/01/2015', price: 56000, transmission: 'Manual', fuel: 'Gasoline' },
  //   { car: 'Nissan', model: 'X-Trail', year: '01/05/2013', price: 56000, transmission: 'Automatic', fuel: 'Gasoline' },
  //   { car: 'Honda', model: 'Civic', year: '01/05/2013', price: 15000, transmission: 'Manual', fuel: 'Gasoline' },
  //   { car: 'Porsche', model: 'Boxster', year: '24/01/2015', price: 24000, transmission: 'Manual', fuel: 'Petrol' },
  //   { car: 'Ford', model: 'Focus', year: '14/09/2006', price: 15000, transmission: 'Manual', fuel: 'Gasoline' },
  //   { car: 'Ford', model: 'Explorer', year: '14/09/2006', price: 15000, transmission: 'Automatic', fuel: 'Gasoline' },
  //   { car: 'Ford', model: 'Focus', year: '09/02/2020', price: 12000, transmission: 'Manual', fuel: 'Gasoline' },
  //   { car: 'Honda', model: 'Civic', year: '24/01/2015', price: 34000, transmission: 'Manual', fuel: 'Gasoline' },
  //   { car: 'Mitsubishi', model: 'Lancer', year: '09/02/2020', price: 34000, transmission: 'Manual', fuel: 'Gasoline' },
  //   { car: 'Honda', model: 'Civic', year: '09/02/2020', price: 12000, transmission: 'Manual', fuel: 'Petrol' },
  //   {
  //     car: 'Mitsubishi',
  //     model: 'Lancer',
  //     year: '09/02/2020',
  //     price: 15000,
  //     transmission: 'Automatic',
  //     fuel: 'Gasoline',
  //   },
  //   { car: 'Ford', model: 'Focus', year: '28/08/2004', price: 24000, transmission: 'Manual', fuel: 'Gasoline' },
  //   { car: 'Nissan', model: 'X-Trail', year: '16/12/2010', price: 15000, transmission: 'Manual', fuel: 'Gasoline' },
  //   { car: 'Toyota', model: 'Celica', year: '13/11/2021', price: 15000, transmission: 'Manual', fuel: 'Petrol' },
  //   { car: 'Toyota', model: 'Celica', year: '09/02/2020', price: 12000, transmission: 'Manual', fuel: 'Gasoline' },
  //   { car: 'Mitsubishi', model: 'Lancer', year: '09/02/2020', price: 34000, transmission: 'Manual', fuel: 'Gasoline' },
  // ];

  // options: DataDenOptions = {
  //   columns: [
  //     {
  //       field: 'car',
  //       headerName: 'Car',
  //       sort: true,
  //       sortOptions: {
  //         comparator: sortComparator,
  //       },
  //       filter: true,
  //       filterOptions: {
  //         method: 'includes',
  //         debounceTime: 500,
  //         caseSensitive: false,
  //       },
  //       resize: true,
  //       width: 180,
  //       pinned: 'left',
  //     },
  //     {
  //       field: 'model',
  //       headerName: 'Model',
  //       sort: true,
  //       sortOptions: {
  //         comparator: sortComparator,
  //       },
  //       filter: true,
  //       filterOptions: {
  //         method: 'includes',
  //         debounceTime: 500,
  //         caseSensitive: false,
  //       },
  //       resize: true,
  //       width: 200,
  //     },
  //     {
  //       field: 'year',
  //       headerName: 'Year',
  //       sort: true,
  //       sortOptions: {
  //         comparator: sortComparator,
  //       },
  //       filter: true,
  //       filterRenderer: DataDenHeaderDateFilterRenderer,
  //       filterOptions: {
  //         method: 'equals',
  //         debounceTime: 500,
  //         dateParserFn: (dateString: string) => {
  //           const dateParts = dateString.split('/').map((part) => Number(part));
  //           const [day, month, year] = dateParts;

  //           return new Date(year, month - 1, day);
  //         },
  //       },
  //       resize: true,
  //       width: 210,
  //     },
  //     {
  //       field: 'price',
  //       headerName: 'Price',
  //       sort: true,
  //       sortOptions: {
  //         comparator: sortComparator,
  //       },
  //       filter: true,
  //       filterRenderer: DataDenHeaderNumberFilterRenderer,
  //       filterOptions: {
  //         method: 'equals',
  //         debounceTime: 500,
  //       },
  //       resize: false,
  //       width: 180,
  //     },
  //     {
  //       field: 'transmission',
  //       headerName: 'Transmission',
  //       sort: true,
  //       sortOptions: {
  //         comparator: sortComparator,
  //       },
  //       filter: true,
  //       filterOptions: {
  //         method: 'includes',
  //         debounceTime: 500,
  //         caseSensitive: false,
  //       },
  //       resize: true,
  //       width: 220,
  //     },
  //     {
  //       field: 'fuel',
  //       headerName: 'Fuel',
  //       sort: true,
  //       sortOptions: {
  //         comparator: sortComparator,
  //       },
  //       filter: true,
  //       filterOptions: {
  //         method: 'includes',
  //         debounceTime: 500,
  //         caseSensitive: false,
  //       },
  //       resize: true,
  //       width: 180,
  //     },
  //   ],
  //   rows: this.rows,
  //   draggable: true,
  //   pagination: true,
  //   paginationOptions: {
  //     pageSize: 10,
  //     ofText: 'of',
  //   },
  //   rowEditMode: true
  // };

  handleQuickFilterKeyup(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    this.ddComponent.grid.quickFilter(input.value);
  }

  onSortingStart(event: DataDenSortingEvent) {
    console.log('sorting start', event);
  }
}
