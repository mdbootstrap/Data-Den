import { useRef, forwardRef, useEffect, useImperativeHandle } from 'react';
import { DataDen as DataDenCore, DataDenOptions, DataDenSortingEvent } from 'data-den-core';

const DataDen = forwardRef(function DataDen(
  {
    options,
    onSortingStart,
    onSortingDone,
  }: {
    options: DataDenOptions;
    onSortingStart?: (event: DataDenSortingEvent) => void;
    onSortingDone?: (event: DataDenSortingEvent) => void;
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
    }
  }, [dataDenWrapper]);

  useImperativeHandle(ref, () => ({
    sort(field: string, order: string) {
      if (dataDen) {
        dataDen.sort(field, order);
      }
    },
  }));

  return <div ref={dataDenWrapper}></div>;
});

export default DataDen;
