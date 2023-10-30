export class DataDenSortingPreviousState {
  private data: { [key: string]: any } = {};

  constructor(values: { [key: string]: any }) {
    this.data = { ...this.data, ...values };
  }

  getValue(key: string): any {
    return this.data[key];
  }
}
