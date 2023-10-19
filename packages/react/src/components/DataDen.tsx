import { useRef, forwardRef, useEffect, useImperativeHandle } from 'react';
import { DataDen as DataDenCore, DataDenOptions } from 'data-den-core';

const DataDen = forwardRef(function DataDen(
  {
    options,
    onSortingDone,
  }: {
    options: DataDenOptions;
    onSortingDone: (event: CustomEvent) => void;
  },
  ref
) {
  let dataDen: DataDenCore | null = null;
  const dataDenWrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dataDen && dataDenWrapper.current) {
      dataDen = new DataDenCore(dataDenWrapper.current, options);

      dataDenWrapper.current.addEventListener('sorting.done', (event: CustomEvent) => {
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
