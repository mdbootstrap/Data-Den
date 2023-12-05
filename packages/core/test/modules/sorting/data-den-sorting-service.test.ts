/* eslint-disable @typescript-eslint/no-var-requires */
describe('data-den-sorting-service', () => {
  let DataDenSortingService: any;
  let exampleData: any[] = [];
  let options: any = {};
  let sortComparator: any;

  beforeEach(() => {
    exampleData = [
      { car: 'Mitsubishi', model: 'Lancer' },
      { car: 'Porsche', model: 'Boxster' },
      { car: 'Honda', model: 'Civic' },
    ];

    sortComparator = (fieldA: any, fieldB: any) => {
      if (typeof fieldA === 'string') {
        fieldA = fieldA.toLowerCase();
      }

      if (typeof fieldB === 'string') {
        fieldB = fieldB.toLowerCase();
      }

      if (fieldA === fieldB) {
        return 0;
      }

      return fieldA > fieldB ? 1 : -1;
    };

    options = {
      columns: [
        {
          field: 'car',
          headerName: 'Car',
          sort: true,
          sortOptions: {
            comparator: sortComparator,
          },
        },
        {
          field: 'model',
          headerName: 'Model',
          sort: true,
          sortOptions: {
            comparator: sortComparator,
          },
        },
      ],
    };
  });

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
    const COMMAND_FETCH_START = 'command:fetch:sort-start';

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

      new DataDenSortingService(options);
      mockFn = jest.fn();

      DataDenPubSub.subscribe(COMMAND_FETCH_START, (event: any) => {
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
      instance = new DataDenSortingService(options);
    });

    it('should sort ascending', () => {
      let sortedData = instance.sort(exampleData, 'car', 'asc', sortComparator);

      expect(sortedData[0].car).toEqual('Honda');
      expect(sortedData[1].car).toEqual('Mitsubishi');
      expect(sortedData[2].car).toEqual('Porsche');

      sortedData = instance.sort(exampleData, 'model', 'asc', sortComparator);

      expect(sortedData[0].model).toEqual('Boxster');
      expect(sortedData[1].model).toEqual('Civic');
      expect(sortedData[2].model).toEqual('Lancer');
    });

    it('should sort descending', () => {
      let sortedData = instance.sort(exampleData, 'car', 'desc', sortComparator);

      expect(sortedData[0].car).toEqual('Porsche');
      expect(sortedData[1].car).toEqual('Mitsubishi');
      expect(sortedData[2].car).toEqual('Honda');

      sortedData = instance.sort(exampleData, 'model', 'desc', sortComparator);

      expect(sortedData[0].model).toEqual('Lancer');
      expect(sortedData[1].model).toEqual('Civic');
      expect(sortedData[2].model).toEqual('Boxster');
    });

    it('should return the same data if the order is false value', () => {
      let sortedData = instance.sort(exampleData, 'car', '', sortComparator);

      expect(sortedData[0].car).toEqual('Mitsubishi');
      expect(sortedData[1].car).toEqual('Porsche');
      expect(sortedData[2].car).toEqual('Honda');

      sortedData = instance.sort(exampleData, 'model', '', sortComparator);

      expect(sortedData[0].model).toEqual('Lancer');
      expect(sortedData[1].model).toEqual('Boxster');
      expect(sortedData[2].model).toEqual('Civic');
    });
  });
});
