import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index-com.ts'),
      formats: ['es'],
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
    outDir: 'dist-com',
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      outDir: 'dist-com/types',
    }),
  ],
});
