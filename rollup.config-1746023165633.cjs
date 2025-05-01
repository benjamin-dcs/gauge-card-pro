'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var pluginBabel = require('@rollup/plugin-babel');
var commonjs = require('@rollup/plugin-commonjs');
var json = require('@rollup/plugin-json');
var nodeResolve = require('@rollup/plugin-node-resolve');
var terser = require('@rollup/plugin-terser');
var typescript = require('@rollup/plugin-typescript');

const plugins = [
  typescript({
    declaration: false,
  }),
  nodeResolve(),
  json(),
  commonjs(),
  pluginBabel.getBabelInputPlugin({
    babelHelpers: 'bundled',
  }),
  pluginBabel.getBabelOutputPlugin({
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
  terser(),
];

var rollup_config = [
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

exports.default = rollup_config;
