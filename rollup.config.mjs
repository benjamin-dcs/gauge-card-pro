import {
  getBabelInputPlugin,
  getBabelOutputPlugin,
} from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import serve from "rollup-plugin-serve";

// Use the existing NODE_ENV variable for both purposes
const dev = process.env.ROLLUP_WATCH;

const serveOptions = {
  contentBase: ["./dist"],
  host: "0.0.0.0",
  port: 4000,
  allowCrossOrigin: true,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
};

const plugins = [
  replace({
    preventAssignment: true,
    delimiters: ["", ""],
    // Change log level in constants.ts to 0 in production
    "CURRENT_LOG_LEVEL: 1": `CURRENT_LOG_LEVEL: ${dev ? 0 : 1}`,
    "CURRENT_LOG_LEVEL: 2": `CURRENT_LOG_LEVEL: ${dev ? 0 : 2}`,
    "CURRENT_LOG_LEVEL: 3": `CURRENT_LOG_LEVEL: ${dev ? 0 : 3}`,
  }),
  typescript({
    declaration: false,
  }),
  nodeResolve(),
  json(),
  commonjs(),
  getBabelInputPlugin({
    babelHelpers: "bundled",
  }),
  getBabelOutputPlugin({
    presets: [
      [
        "@babel/preset-env",
        {
          modules: false,
        },
      ],
    ],
    compact: !dev,
  }),
  ...(dev ? [serve(serveOptions)] : [terser()]),
];

export default [
  {
    input: "src/card/card.ts",
    output: {
      file: "dist/gauge-card-pro.js",
      format: "es",
      inlineDynamicImports: true,
    },
    plugins,
    moduleContext: (id) => {
      const thisAsWindowForModules = [
        "node_modules/@formatjs/intl-utils/lib/src/diff.js",
        "node_modules/@formatjs/intl-utils/lib/src/resolve-locale.js",
      ];
      if (thisAsWindowForModules.some((id_) => id.trimRight().endsWith(id_))) {
        return "window";
      }
    },
  },
];
