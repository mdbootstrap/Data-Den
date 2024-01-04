import { useRef, forwardRef, useEffect, useImperativeHandle } from 'react';
import { DataDen as DataDenCore, DataDenOptions, DataDenSortingEvent, DataDenPinningEvent } from 'data-den-core';

const DataDen = forwardRef(function DataDen(
  {
    options,
    onSortingStart,
    onSortingDone,
    onPinningStart,
    onPinningDone,
  }: {
    options: DataDenOptions;
    onSortingStart?: (event: DataDenSortingEvent) => void;
    onSortingDone?: (event: DataDenSortingEvent) => void;
    onPinningStart?: (event: DataDenPinningEvent) => void;
    onPinningDone?: (event: DataDenPinningEvent) => void;
  },
  ref
) {
  let dataDen: DataDenCore | null = null;
  const dataDenWrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dataDen && dataDenWrapper.current) {
      // @eslint-ignore
      dataDen = new DataDenCore(dataDenWrapper.current, options);

      dataDen.on('sortingStart', (event: DataDenSortingEvent) => {
        onSortingStart(event);
      });
      dataDen.on('sortingDone', (event: DataDenSortingEvent) => {
        onSortingDone(event);
      });
      dataDen.on('pinningStart', (event: DataDenPinningEvent) => {
        onPinningStart(event);
      });
      dataDen.on('pinningDone', (event: DataDenPinningEvent) => {
        onPinningDone(event);
      });
    }
  }, [dataDenWrapper]);

  useImperativeHandle(ref, () => ({
    sort(field: string, order: string) {
      if (dataDen) {
        dataDen.sort(field, order);
      }
    },
    quickFilter(searchTerm: string) {
      if (dataDen) {
        dataDen.quickFilter(searchTerm);
      }
    },
    pinColumn(pin: string | boolean, colIndex: number) {
      if (dataDen) {
        dataDen.pinColumn(pin, colIndex);
      }
    },
  }));

  return <div ref={dataDenWrapper}></div>;
});

export default DataDen;
