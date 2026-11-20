"use strict";
const { src, dest } = require("gulp");
const webpackStream = require("webpack-stream");
const config = require("../../paths.js");
const rename = require("gulp-rename");

function ScriptsBuild() {
  return src(config.scripts.src)
    .pipe(webpackStream({
      mode: "production",
      output: { filename: "main.js" },
      module: {
        rules: [{
          test: /\\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: { loader: "babel-loader", options: { presets: ["@babel/preset-env"] } }
        }]
      }
    }))
    .pipe(rename({ basename: "scripts", suffix: ".min", extname: ".js" }))
    .pipe(dest(config.scripts.dist));
}
module.exports = { ScriptsBuild };
