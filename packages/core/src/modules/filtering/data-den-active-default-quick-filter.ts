import { DataDenColDef, DataDenQuickFilterOptions } from "../../data-den-options.interface";

const defaultQuickFilterFn = (searchTerm: any, value: any, columns: DataDenColDef[]) => {
  searchTerm = searchTerm
    .toString()
    .toLowerCase()
    .split(',')
    .filter((term: string) => term !== '');

  value = value.toString().toLowerCase();

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