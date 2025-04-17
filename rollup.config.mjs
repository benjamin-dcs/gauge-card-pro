import {
  getBabelInputPlugin,
  getBabelOutputPlugin,
} from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import serve from 'rollup-plugin-serve';

const dev = process.env.ROLLUP_WATCH;

const serveOptions = {
  contentBase: ['./dist'],
  host: '0.0.0.0',
  port: 4000,
  allowCrossOrigin: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
};

// ignore({
//   files: IGNORED_FILES.map((file) => require.resolve(file)),
// }),

const plugins = [
  typescript({
    declaration: false,
  }),
  nodeResolve(),
  json(),
  commonjs(),
  getBabelInputPlugin({
    babelHelpers: 'bundled',
  }),
  getBabelOutputPlugin({
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
        },
      ],
    ],
    compact: true,
  }),
  ...(dev ? [serve(serveOptions)] : [terser()]),
];

export default [
  {
    input: 'src/main.ts',
    output: {
      file: 'dist/gauge-card-pro.js',
      format: 'es',
      inlineDynamicImports: true,
    },
    plugins,
    moduleContext: (id) => {
      const thisAsWindowForModules = [
        'node_modules/@formatjs/intl-utils/lib/src/diff.js',
        'node_modules/@formatjs/intl-utils/lib/src/resolve-locale.js',
      ];
      if (thisAsWindowForModules.some((id_) => id.trimRight().endsWith(id_))) {
        return 'window';
      }
    },
  },
];
