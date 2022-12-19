import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json' assert { type: 'json' };
import css from 'rollup-plugin-import-css';
import { visualizer } from 'rollup-plugin-visualizer';

export default [
  // browser-friendly UMD build
  {
    input: 'src/main.js',
    external: ['d3', 'jQuery'],
    output: {
      name: 'clustergrammer',
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [resolve(), commonjs(), css()]
  },
  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input: 'src/main.js',
    external: ['d3', 'jQuery'],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [resolve(), commonjs(), css(), visualizer()]
  }
];
