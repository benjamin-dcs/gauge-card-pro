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

// Use the existing NODE_ENV variable for both purposes
const isProd = process.env.DEPLOY === "prod";

const plugins = [
  replace({
    preventAssignment: true,
    delimiters: ["", ""],
    // Change log level in constants.ts to 0 in production
    "CURRENT_LOG_LEVEL: 1": `CURRENT_LOG_LEVEL: ${isProd ? 0 : 1}`,
    "CURRENT_LOG_LEVEL: 2": `CURRENT_LOG_LEVEL: ${isProd ? 0 : 2}`,
    "CURRENT_LOG_LEVEL: 3": `CURRENT_LOG_LEVEL: ${isProd ? 0 : 3}`,
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
    compact: true,
  }),
  terser(),
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
