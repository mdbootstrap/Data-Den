export class DataDenEventEmitter {
  static #callbacks: { [key: string]: any[] } = {};

  static on(name: string, callback: any): void {
    if (!this.#callbacks[name]) {
      this.#callbacks[name] = [];
    }
    this.#callbacks[name].push(callback);
  }

  static triggerEvent(name: string, args: any): any {
    const event = {
      preventDefault: () => {
        event.defaultPrevented = true;
      },
      defaultPrevented: false,
      ...args,
    };

    this.#callbacks[name]?.forEach((callback) => {
      callback(event);
    });

    return event;
  }
}
