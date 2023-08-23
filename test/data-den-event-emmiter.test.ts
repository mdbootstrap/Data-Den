import { DataDenEventEmitter } from '../src/data-den-event-emitter';
import { Context } from '../src/context';

describe('data-den-event-emmiter', () => {
  it('should emit event and return data', () => {
    const element = document.body;
    const contextAction = 'testAction';
    const testProp = 'testValue';
    const otherProp = 'otherValue';
    const context = new Context('testAction');

    const fn = jest.fn();

    element.addEventListener('testEvent', ((e: CustomEvent) => {
      fn(e.detail.element, e.detail.context, e.detail.testProp, e.detail.otherProp);
    }) as EventListener);

    DataDenEventEmitter.publish('testEvent', {
      element: element,
      context,
      testProp,
      otherProp,
    });

    expect(fn).toHaveBeenCalledWith(element, { action: contextAction }, testProp, otherProp);
  });
});
