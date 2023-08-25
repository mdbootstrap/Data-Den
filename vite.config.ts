import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/data-den.ts'),
      name: 'dataGrid',
      fileName: (format) => `js/mdb-data-grid.${format}.min.js`,
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
});
