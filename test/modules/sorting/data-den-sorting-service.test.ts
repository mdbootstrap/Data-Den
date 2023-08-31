/* eslint-disable @typescript-eslint/no-var-requires */
describe('data-den-sorting-service', () => {
  let DataDenSortingService: any;
  const exampleData = [
    { car: 'Mitsubishi', model: 'Lancer' },
    { car: 'Porsche', model: 'Boxster' },
    { car: 'Honda', model: 'Civic' },
  ];

  describe('PubSub communications', () => {
    let Context: any;
    let DataDenPubSub: any;

    let context: any;
    let caller: string;
    let field: string;

    let mockFn: jest.Mock;

    const ASC = 'asc';
    const DESC = 'desc';
    const COMMAND_SORTING_START = 'command:sorting:start';
    const COMMAND_SORTING_DONE = 'info:sorting:done';

    const expectSortingObjectContaining = (order: string) => {
      return expect.objectContaining({
        data: expect.objectContaining({
          order,
        }),
      });
    };

    beforeEach(() => {
      jest.resetModules();
      Context = require('../../../src/context').Context;
      DataDenPubSub = require('../../../src/data-den-pub-sub').DataDenPubSub;
      DataDenSortingService = require('../../../src/modules/sorting/data-den-sorting-service').DataDenSortingService;

      context = new Context(COMMAND_SORTING_START);
      caller = 'test caller';
      field = 'car';

      new DataDenSortingService();
      mockFn = jest.fn();

      DataDenPubSub.subscribe(COMMAND_SORTING_DONE, (event: any) => {
        mockFn(event);
      });
    });

    it('should publish done after publish start', () => {
      DataDenPubSub.publish(COMMAND_SORTING_START, {
        caller,
        context,
        field,
        rows: exampleData,
      });

      expect(mockFn).toHaveBeenCalled();
    });

    it('should set order to asc, then desc, and finally empty value', () => {
      DataDenPubSub.publish(COMMAND_SORTING_START, {
        caller,
        context,
        field,
        rows: exampleData,
      });

      expect(mockFn).toHaveBeenCalledWith(expectSortingObjectContaining(ASC));

      DataDenPubSub.publish(COMMAND_SORTING_START, {
        caller,
        context,
        field,
        rows: exampleData,
      });

      expect(mockFn).toHaveBeenCalledWith(expectSortingObjectContaining(DESC));

      DataDenPubSub.publish(COMMAND_SORTING_START, {
        caller,
        context,
        field,
        rows: exampleData,
      });

      expect(mockFn).toHaveBeenCalledWith(expectSortingObjectContaining(''));

      DataDenPubSub.publish(COMMAND_SORTING_START, {
        caller,
        context,
        field,
        rows: exampleData,
      });

      expect(mockFn).toHaveBeenCalledWith(expectSortingObjectContaining(ASC));
    });

    it('should set order to asc even if other column is sorted descending', () => {
      DataDenPubSub.publish(COMMAND_SORTING_START, {
        caller,
        context,
        field,
        rows: exampleData,
      });

      DataDenPubSub.publish(COMMAND_SORTING_START, {
        caller,
        context,
        field,
        rows: exampleData,
      });

      expect(mockFn).toHaveBeenCalledWith(expectSortingObjectContaining(DESC));

      const newFieldName = 'model';

      DataDenPubSub.publish(COMMAND_SORTING_START, {
        caller,
        context,
        field: newFieldName,
        rows: exampleData,
      });

      expect(mockFn).toHaveBeenCalledWith(expectSortingObjectContaining(ASC));
    });
  });
  describe('Sorting', () => {
    let instance: any;

    beforeEach(() => {
      jest.resetModules();
      DataDenSortingService = require('../../../src/modules/sorting/data-den-sorting-service').DataDenSortingService;
      instance = new DataDenSortingService();
    });

    it('should sort ascending', () => {
      let sortedData = instance.sort(exampleData, 'car', 'asc');

      expect(sortedData[0].car).toEqual('Honda');
      expect(sortedData[1].car).toEqual('Mitsubishi');
      expect(sortedData[2].car).toEqual('Porsche');

      sortedData = instance.sort(exampleData, 'model', 'asc');

      expect(sortedData[0].model).toEqual('Boxster');
      expect(sortedData[1].model).toEqual('Civic');
      expect(sortedData[2].model).toEqual('Lancer');
    });

    it('should sort descending', () => {
      let sortedData = instance.sort(exampleData, 'car', 'desc');

      expect(sortedData[0].car).toEqual('Porsche');
      expect(sortedData[1].car).toEqual('Mitsubishi');
      expect(sortedData[2].car).toEqual('Honda');

      sortedData = instance.sort(exampleData, 'model', 'desc');

      expect(sortedData[0].model).toEqual('Lancer');
      expect(sortedData[1].model).toEqual('Civic');
      expect(sortedData[2].model).toEqual('Boxster');
    });

    it('should return the same data if the order is false value', () => {
      let sortedData = instance.sort(exampleData, 'car', '');

      expect(sortedData[0].car).toEqual('Mitsubishi');
      expect(sortedData[1].car).toEqual('Porsche');
      expect(sortedData[2].car).toEqual('Honda');

      sortedData = instance.sort(exampleData, 'model', '');

      expect(sortedData[0].model).toEqual('Lancer');
      expect(sortedData[1].model).toEqual('Boxster');
      expect(sortedData[2].model).toEqual('Civic');
    });
  });
});
