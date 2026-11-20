"use strict";
const { src, dest } = require("gulp");
const config = require("../../paths.js");
const autoprefixer = require("autoprefixer");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const postcss = require("gulp-postcss");
const sass = require("gulp-sass")(require("sass"));

function Styles() {
  return src(config.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(postcss([autoprefixer()]))
    .pipe(rename({ basename: "styles", suffix: ".min", extname: ".css" }))
    .pipe(sourcemaps.write("."))
    .pipe(dest(config.styles.dest));
}
module.exports = { Styles };
