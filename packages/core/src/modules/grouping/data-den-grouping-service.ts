import { DataDenEvent } from '../../data-den-event';
import { DataDenInternalOptions } from '../../data-den-options.interface';
import { DataDenPubSub } from '../../data-den-pub-sub';

export class DataDenGroupingService {
  options: DataDenInternalOptions;
  #container: HTMLElement;

  constructor(container: HTMLElement, options: DataDenInternalOptions, private PubSub: DataDenPubSub) {
    this.options = options;
    this.#container = container;
  }

  // createGroups(groupedColumns: string[]) {
  //   const rowsContainer = this.#container.querySelector(`.${this.options.cssPrefix}grid-rows`);

  //   groupedColumns.forEach((column) => {
  //     const groups = this.groupBy(column);


  //   });
  // }

  // groupBy(key: any) {
  //   return this.options.rows.reduce(function (rv: any, x: any) {
  //     (rv[x[key]] = rv[x[key]] || []).push(x);
  //     return rv;
  //   }, {});
  // }

  // getDistinctGroups(column: string) {
  //   return [...new Set(this.options.rows.map((item: any) => item[column]))];
  // }
}
