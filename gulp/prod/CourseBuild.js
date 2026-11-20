"use strict";
const { src, dest, parallel } = require("gulp");

function copyCourseToRoot() {
  return src("./course/**/*", { allowEmpty: false }).pipe(dest("./dist"));
}

function copyCourseToSubdirectory() {
  return src("./course/**/*", { allowEmpty: false }).pipe(dest("./dist/course"));
}

// The course is the public homepage and is also available at /course/.
function CourseBuild() {
  return parallel(copyCourseToRoot, copyCourseToSubdirectory)();
}

module.exports = { CourseBuild };
