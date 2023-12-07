export function inject(target: { new (...args: any[]): any }, propertyKey: string, value: any) {
  Object.defineProperty(target.prototype, propertyKey, {
    configurable: true,
    get() {
      // eslint-disable-next-line no-prototype-builtins
      if (!this.hasOwnProperty(propertyKey)) {
        Object.defineProperty(this, propertyKey, {
          value: value,
        });
      }
      return this[propertyKey];
    },
  });
}
