"use strict";
const { src, dest } = require("gulp");
const config = require("../../paths.js");
const autoprefixer = require("autoprefixer");
const rename = require("gulp-rename");
const postcss = require("gulp-postcss");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");

function StylesBuild() {
  return src(config.styles.src)
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS())
    .pipe(rename({ basename: "styles", suffix: ".min", extname: ".css" }))
    .pipe(dest(config.styles.dist));
}
module.exports = { StylesBuild };
