import { Context } from './context';

export class DataDenEvent {
  public key: string;

  constructor(public name: string, public data: any, public context: Context) {
    this.key = '' + Math.random();
  }
}
