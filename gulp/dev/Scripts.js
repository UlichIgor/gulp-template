"use strict";
const { src, dest } = require("gulp");
const webpackStream = require("webpack-stream");
const config = require("../../paths.js");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");

function Scripts() {
  return src(config.scripts.src)
    .pipe(webpackStream({
      mode: "development",
      output: { filename: "main.js" },
      module: {
        rules: [{
          test: /\\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: { loader: "babel-loader", options: { presets: ["@babel/preset-env"] } }
        }]
      }
    }))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(rename({ basename: "scripts", suffix: ".min", extname: ".js" }))
    .pipe(sourcemaps.write("."))
    .pipe(dest(config.scripts.dest));
}
module.exports = { Scripts };
