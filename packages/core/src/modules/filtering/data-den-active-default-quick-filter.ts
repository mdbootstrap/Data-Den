import { DataDenActiveFilterParams, DataDenQuickFilterOptions } from '../../data-den-options.interface';

const defaultQuickFilterFn = (params: DataDenActiveFilterParams) => {
  console.log(params);

  const searchTerm = params.searchTerm
    .toString()
    .toLowerCase()
    .split(',')
    .filter((term: string) => term !== '');

  const value = params.value.toString().toLowerCase();

  let res = true;

  searchTerm.forEach((term: string) => {
    const someCellIncludeTerm = value.includes(term);
    if (!someCellIncludeTerm) res = false;
  });

  return res;
};

export const defaultQuickFilterOptions: Required<DataDenQuickFilterOptions> = {
  filterFn: defaultQuickFilterFn,
};
