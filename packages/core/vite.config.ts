import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'data-den-core',
      fileName: (format) => `js/data-den.${format}.min.js`,
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'css/data-den.min.css';
          return assetInfo.name;
        },
      },
    },
    sourcemap: true,
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      outDir: 'dist/types',
    }),
  ],
});
