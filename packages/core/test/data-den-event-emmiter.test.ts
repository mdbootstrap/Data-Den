import { DataDenEventEmitter } from '../src/data-den-event-emitter';

describe('data-den-event-emmiter', () => {
  it('should emit event and return data', () => {
    const testProp = 'testValue';
    const otherProp = 'otherValue';

    const fn = jest.fn();

    DataDenEventEmitter.on('testEvent', ((event: any) => {
      fn(event.testProp, event.otherProp);
    }) as EventListener);

    DataDenEventEmitter.triggerEvent('testEvent', {
      testProp,
      otherProp,
    });

    expect(fn).toHaveBeenCalledWith(testProp, otherProp);
  });
});
