import { defineConfig } from "rolldown";
import serve from "rollup-plugin-serve";

const dev = process.env.ROLLDOWN_WATCH ?? process.env.ROLLUP_WATCH;

const serveOptions = {
  contentBase: ["./dist"],
  host: "0.0.0.0",
  port: 4000,
  allowCrossOrigin: true,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
};

export default defineConfig({
  input: "src/card/card.ts",
  output: {
    file: "dist/gauge-card-pro.js",
    format: "es",
    codeSplitting: false,
    minify: !dev,
  },
  plugins: [...(dev ? [serve(serveOptions)] : [])],
});
