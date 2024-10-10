// vite.config.ts

/// <reference types="vitest" />
// Configure Vitest (https://vitest.dev/config/)

import { resolve } from 'path';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import dts from 'vite-plugin-dts';
import { copy } from 'fs-extra';
// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@nmi/fdm',
      fileName: 'fdm',
    },
    rollupOptions: {
      external: [
        "node:util",
        "node:buffer",
        "node:stream",
        "node:net",
        "node:url",
        "node:fs",
        "node:path",
        "perf_hooks",
      ],
      output: {
        globals: {
          "node:stream": "stream",
          "node:buffer": "buffer",
          "node:util": "util",
          "node:net": "net",
          "node:url": "url",
          perf_hooks: "perf_hooks",
        },
        inlineDynamicImports: true,
      },
    },
  },
  plugins: [dts(), nodePolyfills(),
    // Add a custom plugin to copy migration folder
    {
      name: 'copy-migrations-folder',
      closeBundle: () => {
        copy('src/db/migrations', 'dist/db/migrations')
          .then(() => {
            console.log('Copied migrations folder to dist/db/migrations');
          })
          .catch(err => {
            console.error('Error copying migrations folder:', err);
          });
      }
    }
  ],
  test: {
    // ...
  },
});