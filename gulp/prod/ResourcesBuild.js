"use strict";
const { src, dest } = require("gulp");
const config = require("../../paths.js");

function ResourcesBuild(cb) {
  return src(config.resources.src).pipe(dest(config.resources.prod)), cb();
}
module.exports = { ResourcesBuild };
