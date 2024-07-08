import { defineConfig } from 'tsup';

export default defineConfig({
  target: 'es2020',
  format: ['cjs', 'esm'],
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  dts: true,
});
